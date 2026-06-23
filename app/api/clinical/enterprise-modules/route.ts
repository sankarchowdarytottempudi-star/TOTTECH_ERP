import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { enterpriseModuleDefinitions } from "@/lib/clinical/enterprise-modules-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function rows(
  sql: string,
  ...params: unknown[]
) {
  try {
    return await prisma.$queryRawUnsafe<Row[]>(
      sql,
      ...params
    );
  } catch (error) {
    console.error(
      "[clinical-enterprise-modules] query failed",
      error
    );
    return [];
  }
}

async function countKnownTableRecords(
  tableNames: string[],
  tenantId: number,
  hospitalId: number,
  branchId: number
) {
  const counts: Record<string, number> = {};

  for (const tableName of tableNames) {
    const exists = await rows(
      `
      SELECT COUNT(*)::int AS value
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = $1
      `,
      tableName
    );

    if (!num(exists[0]?.value)) {
      counts[tableName] = 0;
      continue;
    }

    const columns = await rows(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      `,
      tableName
    );
    const columnSet = new Set(
      columns.map((row) =>
        String(row.column_name)
      )
    );
    const filters: string[] = [];
    const params: unknown[] = [];

    if (columnSet.has("tenant_id")) {
      params?.push(tenantId);
      filters.push(
        `tenant_id = $${params?.length}`
      );
    }

    if (columnSet.has("hospital_id")) {
      params?.push(hospitalId);
      filters.push(
        `hospital_id = $${params?.length}`
      );
    }

    if (columnSet.has("branch_id")) {
      params?.push(branchId);
      filters.push(
        `branch_id = $${params?.length}`
      );
    }

    if (columnSet.has("is_deleted")) {
      filters.push(
        "COALESCE(is_deleted,false) = false"
      );
    }

    const result = await rows(
      `
      SELECT COUNT(*)::int AS value
      FROM ${tableName}
      ${
        filters.length
          ? `WHERE ${filters.join(" AND ")}`
          : ""
      }
      `,
      ...params
    );

    counts[tableName] = num(
      result[0]?.value
    );
  }

  return counts;
}

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const tablePatternRows =
    await rows(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
      `
    );
  const tableNames = tablePatternRows.map(
    (row) => String(row.table_name)
  );

  const modules = [];

  for (const definition of enterpriseModuleDefinitions) {
    const matchingTables = tableNames.filter(
      (tableName) =>
        definition.tablePatterns.some(
          (pattern) => {
            const expression =
              "^" +
              pattern
                .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                .replace(/%/g, ".*")
                .replace(/_/g, ".") +
              "$";
            return new RegExp(expression).test(
              tableName
            );
          }
        ) ||
        definition.tableNames?.includes(
          tableName
        )
    );
    const knownCounts =
      await countKnownTableRecords(
        definition.tableNames || [],
        context.tenantId,
        context.hospitalId,
        context.branchId
      );
    const recordCount = Object.values(
      knownCounts
    ).reduce(
      (total, value) => total + value,
      0
    );
    const expected =
      definition.tableNames?.length || 1;
    const existingRequired =
      (definition.tableNames || []).filter(
        (name) => tableNames.includes(name)
      ).length;
    const tableCoverage =
      expected > 0
        ? Math.round(
            (existingRequired / expected) *
              100
          )
        : matchingTables.length
          ? 100
          : 0;
    const status =
      tableCoverage >= 90
        ? "WORKING"
        : tableCoverage > 0 ||
            matchingTables.length > 0
          ? "PARTIAL"
          : "MISSING";

    modules.push({
      ...definition,
      status,
      tableCoverage,
      existingRequired,
      expectedRequired: expected,
      matchingTables: matchingTables.slice(
        0,
        40
      ),
      matchingTableCount:
        matchingTables.length,
      knownCounts,
      recordCount,
    });
  }

  const totals = {
    modules: modules.length,
    working: modules.filter(
      (module) => module.status === "WORKING"
    ).length,
    partial: modules.filter(
      (module) => module.status === "PARTIAL"
    ).length,
    missing: modules.filter(
      (module) => module.status === "MISSING"
    ).length,
    totalKnownRecords:
      modules.reduce(
        (total, module) =>
          total + module.recordCount,
        0
      ),
  };

  return NextResponse.json({
    context: {
      tenantId: context.tenantId,
      hospitalId: context.hospitalId,
      branchId: context.branchId,
      clinicId: context.clinicId,
      hospitalName: context.hospitalName,
      branchName: context.branchName,
      clinicName: context.clinicName,
      roleName: context.roleName,
      roleKey: context.roleKey,
    },
    totals,
    modules,
  });
}
