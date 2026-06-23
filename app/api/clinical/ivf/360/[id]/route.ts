import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const coupleId = toNumber(id);

  if (!coupleId) {
    return NextResponse.json(
      {
        error: "Valid couple id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const coupleRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        c.*,
        fp.patient_uid AS female_patient_uid,
        fp.uhid AS female_uhid,
        fp.first_name AS female_first_name,
        fp.last_name AS female_last_name,
        mp.patient_uid AS male_patient_uid,
        mp.uhid AS male_uhid,
        mp.first_name AS male_first_name,
        mp.last_name AS male_last_name
      FROM ivf_couples c
      LEFT JOIN patients fp ON fp.id = c.female_patient_id
      LEFT JOIN patients mp ON mp.id = c.male_patient_id
      WHERE c.id = $1
        AND c.tenant_id = $2
        AND c.hospital_id = $3
        AND c.branch_id = $4
        AND COALESCE(c.is_deleted,false) = false
      LIMIT 1
      `,
      coupleId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  if (!coupleRows.length) {
    return NextResponse.json(
      {
        error: "Couple record not found.",
      },
      {
        status: 404,
      }
    );
  }

  const [
    femaleAssessments,
    maleAssessments,
    treatmentPlans,
    cycles,
    stimulation,
    follicleTracking,
    retrievals,
    fertilization,
    embryos,
    freezing,
    transfers,
    pregnancies,
    billing,
    referrals,
    documents,
    alerts,
    timeline,
    aiSummaries,
  ] = await Promise.all([
    scopedRows(
      "ivf_female_assessments",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_male_assessments",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_treatment_plans",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_cycles",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_stimulation_records",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_follicle_tracking",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_retrievals",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_fertilization_records",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_embryos",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_freezing_records",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_embryo_transfers",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_pregnancies",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_billing",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_referrals",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_documents",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_alerts",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_timeline",
      coupleId,
      context
    ),
    scopedRows(
      "ivf_ai_summaries",
      coupleId,
      context
    ),
  ]);

  return NextResponse.json({
    context,
    couple: coupleRows[0],
    femaleAssessments,
    maleAssessments,
    treatmentPlans,
    cycles,
    stimulation,
    follicleTracking,
    retrievals,
    fertilization,
    embryos,
    freezing,
    transfers,
    pregnancies,
    billing,
    referrals,
    documents,
    alerts,
    timeline,
    aiSummaries,
    metrics: {
      cycles: cycles.length,
      embryos: embryos.length,
      frozenEmbryos: embryos.filter(
        (row) =>
          String(row.current_status || "")
            .toUpperCase()
            .includes("FROZEN")
      ).length,
      transfers: transfers.length,
      pregnancies: pregnancies.length,
      invoices: billing.length,
    },
  });
}

async function scopedRows(
  table: string,
  coupleId: number,
  context: {
    tenantId: number;
    hospitalId: number;
    branchId: number;
  }
) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM ${table}
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND couple_id = $4
      AND COALESCE(is_deleted,false) = false
    ORDER BY created_at DESC NULLS LAST, id DESC
    LIMIT 100
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    coupleId
  );
}
