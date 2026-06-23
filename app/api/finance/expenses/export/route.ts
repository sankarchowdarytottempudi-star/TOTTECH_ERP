import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { resolvePlatformContext } from "@/lib/api/context";
import { renderExecutiveExpensePdf } from "@/lib/finance/executive-pdf";
import { requireSchoolModule } from "@/lib/module-governance";

type Row = Record<string, any>;

const text = (value: unknown, fallback = "-") => {
  const output = String(value ?? "").trim();
  return output || fallback;
};

function visibleColumns(rows: Row[]) {
  const columns = [
    ["expense_date", "Expense Date"],
    ["category", "Category"],
    ["vendor_name", "Vendor"],
    ["school_name", "School/College"],
    ["academic_year", "Academic Year"],
    ["class_name", "Class"],
    ["section_name", "Section"],
    ["amount", "Amount"],
    ["payment_method", "Payment Mode"],
    ["reference_number", "Reference"],
    ["status", "Status"],
    ["created_by_name", "Created By"],
  ] as const;
  const keys = new Set(rows.flatMap((row) => Object.keys(row)));
  const selected = columns.filter(([key]) => keys.has(key));
  return selected.length ? selected : columns.slice(0, 8);
}

export async function GET(request: Request) {
  const guard = await requireSchoolModule("FINANCE");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expenseUrl = new URL(request.url);
  expenseUrl.pathname = expenseUrl.pathname.replace(/\/export$/, "");
  expenseUrl.searchParams.delete("format");
  expenseUrl.searchParams.delete("type");

  const response = await fetch(expenseUrl.toString(), {
    headers: request.headers,
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    context?: {
      selectedSchool?: Row | null;
      selectedAcademicYear?: Row | null;
      filters?: Row;
    };
    expenses?: Row[];
    summary?: Row;
    analytics?: Row;
  };

  const rows = payload.expenses || [];
  const summary = payload.summary || {};
  const selectedSchool = payload.context?.selectedSchool;
  const selectedAcademicYear = payload.context?.selectedAcademicYear;
  const filters = payload.context?.filters || {};
  const cols = visibleColumns(rows).slice(0, 8);

  const format = new URL(request.url).searchParams?.get("format") === "xlsx" ? "xlsx" : "pdf";
  if (format === "xlsx") {
    const workbook = XLSX.utils.book_new();
    const detailRows = rows.map((row) => {
      const output: Record<string, unknown> = {};
      for (const [key, label] of cols) {
        output[label] = row[key] ?? "";
      }
      return output;
    });
    const summarySheet = XLSX.utils.json_to_sheet([
      {
        "School/College": selectedSchool?.school_name || "All Schools/Colleges",
        "Academic Year": selectedAcademicYear?.academic_year || "All Years",
        "Expense Count": summary.expenseCount || 0,
        "Total Expense": summary.totalExpense || 0,
        "Approved Expense": summary.approvedExpense || 0,
        "Pending Approval": summary.pendingApproval || 0,
        "Rejected Expense": summary.rejectedExpense || 0,
        "Paid Expense": summary.paidExpense || 0,
      },
    ]);
    const detailSheet = XLSX.utils.json_to_sheet(detailRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Expenses");
    const workbookBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return new NextResponse(new Uint8Array(workbookBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="school-expenses.xlsx"`,
      },
    });
  }

  const pdf = await renderExecutiveExpensePdf({
    schoolName: selectedSchool?.school_name || "TOTTECH ONE",
    academicYear: selectedAcademicYear?.academic_year || "All Years",
    generatedAt: new Date(),
    logoUrl: selectedSchool?.logo_url || null,
    filters,
    summary,
    analytics: payload.analytics || {
      expenseByMonth: rows.map((row, index) => ({
        label: text(row.month || row.expense_date || `Item ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
      expenseByCategory: rows.map((row, index) => ({
        label: text(row.category_name || row.category || `Category ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
      expenseBySchool: rows.reduce<Array<Record<string, unknown>>>((acc, row) => {
        acc.push({
          label: text(row.school_name || selectedSchool?.school_name || "School/College"),
          value: Number(row.amount || row.total_amount || 0),
          budget: text(row.budget || row.budget_utilization || row.amount_budget),
        });
        return acc;
      }, []),
      expenseByAcademicYear: rows.map((row, index) => ({
        label: text(row.academic_year || selectedAcademicYear?.academic_year || `Year ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
      expenseByClass: rows.map((row, index) => ({
        label: text(row.class_name || row.class || `Class ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
      expenseBySection: rows.map((row, index) => ({
        label: text(row.section_name || row.section || `Section ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
      topCategories: rows.map((row, index) => ({
        label: text(row.category_name || row.category || `Category ${index + 1}`),
        value: Number(row.amount || row.total_amount || 0),
      })),
    },
    expenses: rows,
    theme: (new URL(request.url).searchParams?.get("theme") === "mono" ? "mono" : "color"),
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="school-expenses.pdf"`,
    },
  });
}
