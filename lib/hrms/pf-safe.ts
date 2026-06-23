import { prisma } from "@/lib/prisma";

const tableColumnsCache = new Map<string, Set<string>>();

export async function getTableColumns(table: string) {
  const cached = tableColumnsCache.get(table);
  if (cached) {
    return cached;
  }

  const rows = await prisma.$queryRawUnsafe<
    Array<{ column_name: string }>
  >(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
    `,
    table
  );

  const columns = new Set(rows.map((row) => String(row.column_name)));
  tableColumnsCache.set(table, columns);
  return columns;
}

export function hasAnyPfColumn(columns: Set<string>) {
  return ["pf_number", "uan_number", "pf_status"].some((column) =>
    columns.has(column)
  );
}

export function buildPfStaffSelect(columns: Set<string>) {
  const select: Record<string, boolean> = {
    id: true,
    employee_id: true,
    first_name: true,
    last_name: true,
    department: true,
    designation: true,
    mobile: true,
    pf_joining_date: true,
    pf_applicable: true,
    eps_applicable: true,
    pf_exit_date: true,
    basic_salary: true,
    da: true,
    pf_wage: true,
    voluntary_pf_percent: true,
    employer_pf_percent: true,
  };

  if (columns.has("pf_number")) {
    select.pf_number = true;
  }

  if (columns.has("uan_number")) {
    select.uan_number = true;
  }

  if (columns.has("pf_status")) {
    select.pf_status = true;
  }

  return select;
}

