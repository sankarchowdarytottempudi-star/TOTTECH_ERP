import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import * as XLSX from "xlsx";

import { resolvePlatformContext, resolveMutationContext } from "@/lib/api/context";
import { apiError, validationError } from "@/lib/api/errors";
import { formatMoney, pfRegisterRow, pfContributionBreakdown, type PfProfileInput } from "@/lib/hrms/pf";
import { buildPfStaffSelect, getTableColumns, hasAnyPfColumn } from "@/lib/hrms/pf-safe";
import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";

type PfRow = ReturnType<typeof pfRegisterRow> & {
  id: number;
  employee_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

type PfStaffProfile = PfProfileInput & {
  id: number;
  uan_number?: string | null;
  pf_number?: string | null;
  pf_applicable?: boolean | null;
  eps_applicable?: boolean | null;
  basic_salary?: unknown;
  da?: unknown;
};

function parsePositive(value: string | null) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.trunc(number) : null;
}

function pickSchoolScope(
  context: Awaited<ReturnType<typeof resolvePlatformContext>>,
  request: Request
) {
  const url = new URL(request.url);
  const querySchool = parsePositive(url.searchParams?.get("school_id"));
  const schoolId = querySchool ?? context?.schoolId ?? null;
  const academicYearId =
    parsePositive(url.searchParams?.get("academic_year_id")) ??
    context?.academicYearId ??
    null;
  const allSchools = Boolean(context?.allSchools && !schoolId);
  return { schoolId, academicYearId, allSchools };
}

function monthYearLabel(month?: number | null, year?: number | null) {
  if (!month || !year) return "";
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

async function loadWorkspace(request: Request) {
  const context = await resolvePlatformContext(request);
  if (!context) {
    throw new Error("Unauthorized");
  }

  const { schoolId, academicYearId, allSchools } = pickSchoolScope(context, request);
  const url = new URL(request.url);
  const month = parsePositive(url.searchParams?.get("month"));
  const payrollYear = parsePositive(url.searchParams?.get("payroll_year"));
  const payrollBatch = url.searchParams?.get("payroll_batch")?.trim() || null;

  const schoolWhere = allSchools ? {} : schoolId ? { school_id: schoolId } : {};
  const yearWhere = academicYearId ? { academic_year_id: academicYearId } : {};
  const monthWhere = month ? { payroll_month: month } : {};
  const yearFilter = payrollYear ? { payroll_year: payrollYear } : {};
  const batchWhere = payrollBatch ? { payroll_batch: payrollBatch } : {};
  const columns = await getTableColumns("hr_staff_master");
  const pfColumnFilter = hasAnyPfColumn(columns);

  const [selectedSchool, selectedAcademicYear, profiles, ledgers, schools, years] = await Promise.all([
    schoolId
      ? prisma.schools.findUnique({
          where: { id: schoolId },
          select: {
            id: true,
            school_name: true,
            school_code: true,
            logo_url: true,
            subscription_plan: true,
          },
        })
      : Promise.resolve(null),
    academicYearId
      ? prisma.academic_years.findUnique({
          where: { id: academicYearId },
          select: { id: true, academic_year: true },
        })
      : Promise.resolve(null),
    prisma.hr_staff_master.findMany({
      where: {
        ...schoolWhere,
        ...yearWhere,
        is_active: true,
        ...(pfColumnFilter
          ? {
              OR: [
                ...(columns.has("pf_number") ? [{ pf_number: { not: null } }] : []),
                ...(columns.has("uan_number") ? [{ uan_number: { not: null } }] : []),
                ...(columns.has("pf_status") ? [{ pf_status: { not: null } }] : []),
                { pf_applicable: true },
              ],
            }
          : {}),
      },
      orderBy: [{ first_name: "asc" }, { last_name: "asc" }],
      take: 200,
      select: buildPfStaffSelect(columns),
    }),
    prisma.hr_pf_ledgers.findMany({
      where: {
        ...schoolWhere,
        ...yearWhere,
        ...monthWhere,
        ...yearFilter,
        ...batchWhere,
      },
      orderBy: [{ payroll_year: "desc" }, { payroll_month: "desc" }, { created_at: "desc" }],
      take: 300,
    }),
    context.allSchools
      ? prisma.schools.findMany({
          where: { is_active: true },
          select: { id: true, school_name: true },
          orderBy: { school_name: "asc" },
        })
      : Promise.resolve([]),
    context.allYears
      ? prisma.academic_years.findMany({
          where: schoolId ? { school_id: schoolId } : {},
          select: { id: true, academic_year: true },
          orderBy: [{ school_id: "asc" }, { id: "desc" }],
        })
      : Promise.resolve([]),
  ]);

  const registerRows = profiles.map((row) => ({
    ...row,
    ...pfRegisterRow(row),
  }));
  const profileById = new Map<number, PfRow>(
    (profiles as unknown as PfRow[]).map((profile) => [
      Number(profile.id),
      profile,
    ])
  );
  const ledgerRows = ledgers.map((ledger) => ({
    id: ledger.id,
    staff_id: ledger.staff_id,
    employee_id: profileById.get(Number(ledger.staff_id))?.employee_id || null,
    employee_name: [
      profileById.get(Number(ledger.staff_id))?.first_name,
      profileById.get(Number(ledger.staff_id))?.last_name,
    ]
      .filter(Boolean)
      .join(" "),
    payroll_batch: ledger.payroll_batch,
    payroll_month: ledger.payroll_month,
    payroll_year: ledger.payroll_year,
    period_label: monthYearLabel(ledger.payroll_month, ledger.payroll_year),
    uan_number: ledger.uan_number,
    pf_member_id: ledger.pf_member_id,
    pf_wage: Number(ledger.pf_wage || 0),
    employee_pf: Number(ledger.employee_pf || 0),
    employer_pf: Number(ledger.employer_pf || 0),
    eps: Number(ledger.eps || 0),
    edli: Number(ledger.edli || 0),
    filed_status: ledger.filed_status,
    filed_at: ledger.filed_at,
  }));

  const activePfRows = registerRows.filter((row) => row.uan_number || row.pf_member_id || row.pf_status);
  const summary = {
    totalPfEmployees: activePfRows.length,
    pfWages: ledgerRows.reduce((sum, row) => sum + row.pf_wage, 0) || activePfRows.reduce((sum, row) => sum + Number(row.pf_wage || 0), 0),
    employeeContribution: ledgerRows.reduce((sum, row) => sum + row.employee_pf, 0) || activePfRows.reduce((sum, row) => sum + Number(row.employee_pf || 0), 0),
    employerContribution: ledgerRows.reduce((sum, row) => sum + row.employer_pf, 0) || activePfRows.reduce((sum, row) => sum + Number(row.employer_pf || 0), 0),
    pendingFiling: ledgerRows.filter((row) => String(row.filed_status || "").toUpperCase() !== "FILED").length,
    filedMonths: new Set(
      ledgerRows
        .filter((row) => String(row.filed_status || "").toUpperCase() === "FILED")
        .map((row) => `${row.payroll_year}-${String(row.payroll_month).padStart(2, "0")}`)
    ).size,
    eps: ledgerRows.reduce((sum, row) => sum + row.eps, 0) || activePfRows.reduce((sum, row) => sum + Number(row.eps || 0), 0),
    edli: ledgerRows.reduce((sum, row) => sum + row.edli, 0) || activePfRows.reduce((sum, row) => sum + Number(row.edli || 0), 0),
  };

  return {
    context: {
      selectedSchool,
      selectedAcademicYear,
      schools,
      years,
      allSchools: context.allSchools,
      allYears: context.allYears,
    },
    summary: {
      ...summary,
      pfWagesText: formatMoney(summary.pfWages),
      employeeContributionText: formatMoney(summary.employeeContribution),
      employerContributionText: formatMoney(summary.employerContribution),
      epsText: formatMoney(summary.eps),
      edliText: formatMoney(summary.edli),
    },
    pfProfiles: registerRows,
    pfLedgers: ledgerRows,
  };
}

function textLines(row: Record<string, any>) {
  return [
    `Employee: ${row.employee_name || row.employee_id || "-"}`,
    `UAN: ${row.uan_number || "-"}`,
    `PF Member ID: ${row.pf_member_id || "-"}`,
    `PF Wage: ₹${Number(row.pf_wage || 0).toFixed(2)}`,
    `Employee PF: ₹${Number(row.employee_pf || 0).toFixed(2)}`,
    `Employer PF: ₹${Number(row.employer_pf || 0).toFixed(2)}`,
    `EPS: ₹${Number(row.eps || 0).toFixed(2)}`,
    `EDLI: ₹${Number(row.edli || 0).toFixed(2)}`,
    `Filed Status: ${String(row.filed_status || "PENDING")}`,
  ];
}

function makePdf(rows: Array<Record<string, any>>, summary: Record<string, any>, title: string) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 28, bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(18).text(title);
    doc.moveDown(0.4);
    doc.fillColor("#334155").font("Helvetica").fontSize(10).text(`Total Employees: ${summary.totalPfEmployees || 0}`);
    doc.text(`PF Wages: ₹${Number(summary.pfWages || 0).toFixed(2)}   Employee Contribution: ₹${Number(summary.employeeContribution || 0).toFixed(2)}   Employer Contribution: ₹${Number(summary.employerContribution || 0).toFixed(2)}`);
    doc.text(`Pending Filing: ${summary.pendingFiling || 0}   Filed Months: ${summary.filedMonths || 0}`);
    doc.moveDown(0.8);

    rows.slice(0, 20).forEach((row, index) => {
      if (index > 0 && index % 3 === 0) {
        doc.addPage();
      }
      const y = 120 + (index % 3) * 220;
      doc.roundedRect(28, y, 539, 200, 8).lineWidth(1).strokeColor("#CBD5E1").stroke();
      doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(12).text(`${row.employee_name || row.employee_id || "-"}`, 42, y + 12);
      doc.fillColor("#64748B").font("Helvetica").fontSize(9).text(`UAN: ${row.uan_number || "-"}`, 42, y + 32);
      doc.text(`PF Member ID: ${row.pf_member_id || "-"}`, 42, y + 46);
      textLines(row).slice(3).forEach((line, idx) => {
        doc.text(line, 42, y + 70 + idx * 16);
      });
    });

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i += 1) {
      doc.switchToPage(i);
      doc.fillColor("#64748B").fontSize(8).text(`Generated by TOTTECH ONE • Page ${i + 1} of ${range.count}`, 28, 800, { align: "center", width: 539 });
    }
    doc.end();
  });
}

function makeTxt(rows: Array<Record<string, any>>, summary: Record<string, any>) {
  const header = [
    `PF ECR Summary`,
    `Total Employees: ${summary.totalPfEmployees || 0}`,
    `PF Wages: ${Number(summary.pfWages || 0).toFixed(2)}`,
    `Employee Contribution: ${Number(summary.employeeContribution || 0).toFixed(2)}`,
    `Employer Contribution: ${Number(summary.employerContribution || 0).toFixed(2)}`,
    `EPS: ${Number(summary.eps || 0).toFixed(2)}`,
    `EDLI: ${Number(summary.edli || 0).toFixed(2)}`,
    `Pending Filing: ${summary.pendingFiling || 0}`,
    "",
    [
      "Employee Name",
      "UAN",
      "PF Member ID",
      "PF Wage",
      "Employee PF",
      "Employer PF",
      "EPS",
      "EDLI",
      "Status",
    ].join("\t"),
  ].join("\n");

  const body = rows.map((row) => [
    row.employee_name || row.employee_id || "-",
    row.uan_number || "-",
    row.pf_member_id || "-",
    Number(row.pf_wage || 0).toFixed(2),
    Number(row.employee_pf || 0).toFixed(2),
    Number(row.employer_pf || 0).toFixed(2),
    Number(row.eps || 0).toFixed(2),
    Number(row.edli || 0).toFixed(2),
    row.filed_status || "PENDING",
  ].join("\t")).join("\n");

  return `${header}\n${body}\n`;
}

export async function GET(request: Request) {
  try {
    const workspace = await loadWorkspace(request);
    const url = new URL(request.url);
    const format = String(url.searchParams?.get("format") || "").toLowerCase();
    const rows = workspace.pfLedgers || [];
    const summary = workspace.summary || {};
    const selectedSchool = workspace.context?.selectedSchool;
    const selectedAcademicYear = workspace.context?.selectedAcademicYear;
    const month = parsePositive(url.searchParams?.get("month"));
    const year = parsePositive(url.searchParams?.get("payroll_year"));
    const title = `PF ECR Summary${month && year ? ` • ${monthYearLabel(month, year)}` : ""}`;

    if (!format) {
      return NextResponse.json({
        ok: true,
        title,
        rows,
        summary,
        context: {
          selectedSchool,
          selectedAcademicYear,
        },
      });
    }

    const suffix = month && year ? `-${String(year)}-${String(month).padStart(2, "0")}` : "";

    if (format === "txt") {
      const txt = makeTxt(rows, summary);
      return new NextResponse(txt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="pf-ecr${suffix}.txt"`,
        },
      });
    }

    if (format === "xlsx" || format === "excel") {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet([
          {
            "Total Employees": summary.totalPfEmployees || 0,
            "PF Wages": Number(summary.pfWages || 0).toFixed(2),
            "Employee Contribution": Number(summary.employeeContribution || 0).toFixed(2),
            "Employer Contribution": Number(summary.employerContribution || 0).toFixed(2),
            EPS: Number(summary.eps || 0).toFixed(2),
            EDLI: Number(summary.edli || 0).toFixed(2),
            "Pending Filing": summary.pendingFiling || 0,
            "Filed Months": summary.filedMonths || 0,
          },
        ]),
        "Summary"
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(rows.map((row) => ({
          "Employee Name": row.employee_name || row.employee_id || "-",
          "UAN": row.uan_number || "-",
          "PF Member ID": row.pf_member_id || "-",
          "PF Wage": Number(row.pf_wage || 0).toFixed(2),
          "Employee PF": Number(row.employee_pf || 0).toFixed(2),
          "Employer PF": Number(row.employer_pf || 0).toFixed(2),
          EPS: Number(row.eps || 0).toFixed(2),
          EDLI: Number(row.edli || 0).toFixed(2),
          Status: row.filed_status || "PENDING",
        }))),
        "ECR"
      );
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="pf-ecr${suffix}.xlsx"`,
        },
      });
    }

    const pdf = await makePdf(rows, summary, title);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="pf-ecr${suffix}.pdf"`,
      },
    });
  } catch (error) {
    return apiError(error, "Failed to generate PF ECR");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const mutation = await resolveMutationContext(request, body);
    if (!mutation.context) {
      return validationError(mutation.error);
    }

    const schoolId = mutation.context.requiredSchoolId;
    const academicYearId = mutation.context.requiredAcademicYearId;
    const payrollMonth = parsePositive(String(body.payroll_month || body.month || ""));
    const payrollYear = parsePositive(String(body.payroll_year || ""));
    if (!payrollMonth || !payrollYear) {
      return validationError("Select a payroll month and year for ECR generation.");
    }

    const payrollBatch = String(body.payroll_batch || "").trim() || `PF-${payrollYear}-${String(payrollMonth).padStart(2, "0")}`;
    const columns = await getTableColumns("hr_staff_master");
    const pfColumnFilter = hasAnyPfColumn(columns);

    const profiles = await prisma.hr_staff_master.findMany({
      where: {
        school_id: schoolId,
        academic_year_id: academicYearId,
        is_active: true,
        ...(pfColumnFilter
          ? {
              OR: [
                ...(columns.has("pf_number") ? [{ pf_number: { not: null } }] : []),
                ...(columns.has("uan_number") ? [{ uan_number: { not: null } }] : []),
                ...(columns.has("pf_status") ? [{ pf_status: { not: null } }] : []),
                { pf_applicable: true },
              ],
            }
          : {}),
      },
      select: buildPfStaffSelect(columns),
    });

    await prisma.hr_pf_ledgers.deleteMany({
      where: {
        school_id: schoolId,
        academic_year_id: academicYearId,
        payroll_month: payrollMonth,
        payroll_year: payrollYear,
        payroll_batch: payrollBatch,
      },
    });

    const pfProfiles = profiles as unknown as PfStaffProfile[];

    const created = await prisma.$transaction(
      pfProfiles.map((profile) => {
        const breakdown = pfContributionBreakdown(profile);
        return prisma.hr_pf_ledgers.create({
          data: {
            school_id: schoolId,
            academic_year_id: academicYearId,
            staff_id: profile.id,
            payroll_month: payrollMonth,
            payroll_year: payrollYear,
            payroll_batch: payrollBatch,
            uan_number: profile.uan_number || null,
            pf_member_id: profile.pf_number || null,
            pf_applicable: profile.pf_applicable !== false,
            eps_applicable: profile.eps_applicable !== false,
            basic_salary: Number(profile.basic_salary || 0),
            da: Number(profile.da || 0),
            pf_wage: breakdown.pfWage,
            employee_pf: breakdown.employeePf,
            employer_pf: breakdown.employerPf,
            eps: breakdown.eps,
            edli: breakdown.edli,
            filed_status: "PENDING",
            created_by: mutation.context.user.id || null,
            updated_by: mutation.context.user.id || null,
          },
        });
      })
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id: academicYearId,
      user_id: mutation.context.user.id || null,
      created_by: mutation.context.user.id || null,
      actor_role: mutation.context.user.role || null,
      module_name: "HRMS",
      event_type: "PF_LEDGER_CREATED",
      action: "create",
      entity_type: "hr_pf_ledgers",
      summary: `PF ledger generated for ${monthYearLabel(payrollMonth, payrollYear)}`,
      payload: {
        payroll_batch: payrollBatch,
        payroll_month: payrollMonth,
        payroll_year: payrollYear,
        employees_processed: created.length,
      },
    });

    return NextResponse.json({
      ok: true,
      payroll_batch: payrollBatch,
      payroll_month: payrollMonth,
      payroll_year: payrollYear,
      employees_processed: created.length,
      summary: {
        totalPfEmployees: created.length,
        pfWages: created.reduce((sum, row) => sum + Number(row.pf_wage || 0), 0),
        employeeContribution: created.reduce((sum, row) => sum + Number(row.employee_pf || 0), 0),
        employerContribution: created.reduce((sum, row) => sum + Number(row.employer_pf || 0), 0),
        eps: created.reduce((sum, row) => sum + Number(row.eps || 0), 0),
        edli: created.reduce((sum, row) => sum + Number(row.edli || 0), 0),
      },
    });
  } catch (error) {
    return apiError(error, "Failed to generate PF ECR");
  }
}
