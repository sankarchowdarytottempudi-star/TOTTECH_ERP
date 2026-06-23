import { NextResponse } from "next/server";

import { resolveMutationContext, resolvePlatformContext } from "@/lib/api/context";
import { apiError, validationError } from "@/lib/api/errors";
import { decimal } from "@/lib/hrms";
import { formatMoney, isValidUan, normalizeUan, pfRegisterRow } from "@/lib/hrms/pf";
import { buildPfStaffSelect, getTableColumns, hasAnyPfColumn } from "@/lib/hrms/pf-safe";
import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";

type PfStaffSummary = {
  id: number;
  employee_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

const parsePositive = (value: string | null) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.trunc(number) : null;
};

function pickSchoolScope(context: Awaited<ReturnType<typeof resolvePlatformContext>>, request: Request) {
  const url = new URL(request.url);
  const querySchool = parsePositive(url.searchParams?.get("school_id"));
  const schoolId = querySchool ?? context?.schoolId ?? null;
  const academicYearId = parsePositive(url.searchParams?.get("academic_year_id")) ?? context?.academicYearId ?? null;
  const allSchools = Boolean(context?.allSchools && !schoolId);
  return { schoolId, academicYearId, allSchools };
}

function monthYearLabel(month?: number | null, year?: number | null) {
  if (!month || !year) return "";
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export async function GET(request: Request) {
  try {
    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        ? prisma.schools.findUnique({ where: { id: schoolId }, select: { id: true, school_name: true, school_code: true, logo_url: true, subscription_plan: true } })
        : Promise.resolve(null),
      academicYearId
        ? prisma.academic_years.findUnique({ where: { id: academicYearId }, select: { id: true, academic_year: true } })
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
    const profileById = new Map(
      (profiles as unknown as PfStaffSummary[]).map((profile) => [
        profile.id,
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

    return NextResponse.json({
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
    });
  } catch (error) {
    return apiError(error, "Failed to load Provident Fund workspace");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const action = String(body.action || "save-profile").toLowerCase();
    const mutation = await resolveMutationContext(request, body);
    if (!mutation.context) {
      return validationError(mutation.error);
    }

    const context = mutation.context;
    const schoolId = context.requiredSchoolId;
    const academicYearId = context.requiredAcademicYearId;

    if (action === "save-profile") {
      const staffId = Number(body.staff_id || 0);
      if (!staffId) {
        return validationError("Select a staff record to update PF details.");
      }

      const existing = await prisma.hr_staff_master.findFirst({
        where: {
          id: staffId,
          school_id: schoolId,
        },
      });

      if (!existing) {
        return validationError("Selected staff record was not found.");
      }

      const uan = normalizeUan(body.uan_number);
      if (uan && !isValidUan(uan)) {
        return validationError("UAN must contain exactly 12 digits.");
      }

      if (uan) {
        const duplicate = await prisma.hr_staff_master.findFirst({
          where: {
            school_id: schoolId,
            uan_number: uan,
            NOT: { id: staffId },
          },
          select: { id: true },
        });
        if (duplicate) {
          return validationError("Duplicate UAN number already exists for this school.");
        }
      }

      const updated = await prisma.hr_staff_master.update({
        where: { id: staffId },
        data: {
          pf_number: String(body.pf_member_id || body.pf_number || "").trim() || null,
          uan_number: uan || null,
          pf_applicable: body.pf_applicable === undefined ? true : Boolean(body.pf_applicable),
          eps_applicable: body.eps_applicable === undefined ? true : Boolean(body.eps_applicable),
          pf_joining_date: body.date_of_joining_pf ? new Date(String(body.date_of_joining_pf)) : body.pf_joining_date ? new Date(String(body.pf_joining_date)) : null,
          pf_exit_date: body.date_of_exit_pf ? new Date(String(body.date_of_exit_pf)) : body.pf_exit_date ? new Date(String(body.pf_exit_date)) : null,
          basic_salary: decimal(body.basic_salary),
          da: decimal(body.da),
          pf_wage: decimal(body.pf_wage),
          voluntary_pf_percent: decimal(body.voluntary_pf_percent),
          employer_pf_percent: decimal(body.employer_pf_percent),
          pf_status: String(body.pf_status || existing.pf_status || "ACTIVE"),
          updated_by: mutation.context.user.id,
          updated_at: new Date(),
        },
      });

      await recordEvent({
        school_id: schoolId,
        academic_year_id: academicYearId,
        user_id: mutation.context.user.id || null,
        created_by: mutation.context.user.id || null,
        actor_role: mutation.context.user.role || null,
        module_name: "HRMS",
        event_type: "PF_PROFILE_UPDATED",
        action: "update",
        entity_type: "hr_staff_master",
        entity_id: updated.id,
        summary: "PF profile updated",
        payload: {
          pf_number: updated.pf_number,
          uan_number: updated.uan_number,
          pf_applicable: updated.pf_applicable,
          eps_applicable: updated.eps_applicable,
          pf_joining_date: updated.pf_joining_date,
          pf_exit_date: updated.pf_exit_date,
          basic_salary: updated.basic_salary,
          da: updated.da,
          pf_wage: updated.pf_wage,
          voluntary_pf_percent: updated.voluntary_pf_percent,
          employer_pf_percent: updated.employer_pf_percent,
        },
      });

      return NextResponse.json({
        ok: true,
        staff: updated,
      });
    }

    return validationError("Unsupported action.");
  } catch (error) {
    return apiError(error, "Failed to save Provident Fund details");
  }
}
