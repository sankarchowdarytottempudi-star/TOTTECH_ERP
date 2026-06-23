import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const dateLabel = (value: unknown, fallback: string) => {
  if (!value) return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 10);
};

const groupCount = (rows: Row[], column: string) => {
  const grouped = new Map<string, number>();
  rows.forEach((row) => {
    const key = String(row[column] || "Not recorded");
    grouped.set(key, (grouped.get(key) || 0) + 1);
  });
  return Array.from(grouped.entries()).map(([name, value]) => ({
    name,
    value,
  }));
};

const sumRows = (rows: Row[], column: string) =>
  rows.reduce((total, row) => total + numberValue(row[column]), 0);

const trendRows = (
  rows: Row[],
  dateColumn: string,
  fields: string[]
) =>
  rows
    .slice()
    .reverse()
    .map((row, index) => {
      const item: Row = {
        name: dateLabel(row[dateColumn], `Record ${index + 1}`),
      };
      fields.forEach((field) => {
        item[field] = numberValue(row[field]);
      });
      return item;
    });

const avgFollicles = (row: Row, prefix: "right" | "left") => {
  const values = [1, 2, 3, 4, 5]
    .map((item) => numberValue(row[`${prefix}_follicle_${item}`]))
    .filter((item) => item > 0);
  if (!values.length) return 0;
  return Number(
    (values.reduce((total, item) => total + item, 0) / values.length).toFixed(2)
  );
};

const scopedRows = (
  table: string,
  context: {
    tenantId: number;
    hospitalId: number;
    branchId: number;
  },
  options?: {
    coupleId?: number | null;
    orderColumn?: string;
    limit?: number;
  }
) => {
  const values: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];
  const filters = [
    "tenant_id = $1",
    "hospital_id = $2",
    "branch_id = $3",
    "COALESCE(is_deleted,false) = false",
  ];

  if (options?.coupleId) {
    values.push(options.coupleId);
    filters.push(`couple_id = $${values.length}`);
  }

  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM ${table}
    WHERE ${filters.join(" AND ")}
    ORDER BY ${options?.orderColumn || "created_at"} DESC NULLS LAST, id DESC
    LIMIT ${options?.limit || 200}
    `,
    ...values
  );
};

const searchSuggestions = async (
  query: string,
  context: {
    tenantId: number;
    hospitalId: number;
    branchId: number;
  }
) => {
  const search = `%${query.toLowerCase()}%`;
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM (
      SELECT
        'couple' AS result_type,
        c.id AS couple_id,
        NULL::integer AS patient_id,
        NULL::integer AS cycle_id,
        c.couple_number AS primary_label,
        CONCAT_WS(' / ', c.female_name, c.male_name) AS secondary_label,
        CONCAT_WS(' ', fp.uhid, mp.uhid) AS uhid,
        CONCAT_WS(' ', fp.phone, mp.phone) AS phone
      FROM ivf_couples c
      LEFT JOIN patients fp ON fp.id = c.female_patient_id
      LEFT JOIN patients mp ON mp.id = c.male_patient_id
      WHERE c.tenant_id = $1
        AND c.hospital_id = $2
        AND c.branch_id = $3
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', c.couple_number, c.female_name, c.male_name, fp.uhid, mp.uhid, fp.patient_uid, mp.patient_uid, fp.phone, mp.phone, fp.abha_id, mp.abha_id)) LIKE $4

      UNION ALL

      SELECT
        'patient' AS result_type,
        c.id AS couple_id,
        p.id AS patient_id,
        NULL::integer AS cycle_id,
        CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name) AS primary_label,
        CONCAT('UHID ', COALESCE(p.uhid, p.patient_uid, '-'), ' | ', COALESCE(p.phone, '-')) AS secondary_label,
        COALESCE(p.uhid, p.patient_uid, '') AS uhid,
        COALESCE(p.phone, p.whatsapp_number, '') AS phone
      FROM patients p
      JOIN ivf_couples c ON p.id IN (c.female_patient_id, c.male_patient_id)
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name, p.uhid, p.patient_uid, p.phone, p.whatsapp_number, p.abha_id, c.couple_number)) LIKE $4

      UNION ALL

      SELECT
        'cycle' AS result_type,
        c.id AS couple_id,
        cyc.patient_id AS patient_id,
        cyc.id AS cycle_id,
        cyc.cycle_number AS primary_label,
        CONCAT_WS(' | ', c.couple_number, cyc.cycle_type, cyc.status) AS secondary_label,
        CONCAT_WS(' ', fp.uhid, mp.uhid) AS uhid,
        CONCAT_WS(' ', fp.phone, mp.phone) AS phone
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      LEFT JOIN patients fp ON fp.id = c.female_patient_id
      LEFT JOIN patients mp ON mp.id = c.male_patient_id
      WHERE cyc.tenant_id = $1
        AND cyc.hospital_id = $2
        AND cyc.branch_id = $3
        AND COALESCE(cyc.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', cyc.cycle_number, cyc.cycle_type, cyc.status, cyc.outcome, c.couple_number, c.female_name, c.male_name)) LIKE $4
    ) matches
    ORDER BY result_type, primary_label
    LIMIT 12
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    search
  );
};

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const query = String(searchParams?.get("search") || "").trim();
  const coupleId = toNumber(searchParams?.get("couple_id"));

  if (query.length >= 2) {
    const suggestions = await searchSuggestions(query, context);
    return NextResponse.json({
      context,
      suggestions,
    });
  }

  if (!coupleId) {
    const recentCouples = await scopedRows("ivf_couples", context, {
      orderColumn: "created_at",
      limit: 10,
    });

    return NextResponse.json({
      context,
      recentCouples,
      suggestions: [],
    });
  }

  const coupleRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      c.*,
      fp.uhid AS female_uhid,
      fp.patient_uid AS female_patient_uid,
      fp.phone AS female_phone,
      mp.uhid AS male_uhid,
      mp.patient_uid AS male_patient_uid,
      mp.phone AS male_phone
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
        error: "IVF couple context was not found.",
      },
      {
        status: 404,
      }
    );
  }

  const [
    femaleAssessments,
    maleAssessments,
    cycles,
    stimulation,
    follicleTracking,
    retrievals,
    fertilization,
    embryos,
    freezing,
    transfers,
    pregnancies,
    donors,
    surrogates,
  ] = await Promise.all([
    scopedRows("ivf_female_assessments", context, {
      coupleId,
      orderColumn: "assessment_date",
    }),
    scopedRows("ivf_male_assessments", context, {
      coupleId,
      orderColumn: "assessment_date",
    }),
    scopedRows("ivf_cycles", context, {
      coupleId,
      orderColumn: "start_date",
    }),
    scopedRows("ivf_stimulation_records", context, {
      coupleId,
      orderColumn: "monitoring_date",
    }),
    scopedRows("ivf_follicle_tracking", context, {
      coupleId,
      orderColumn: "tracking_date",
    }),
    scopedRows("ivf_retrievals", context, {
      coupleId,
      orderColumn: "retrieval_date",
    }),
    scopedRows("ivf_fertilization_records", context, {
      coupleId,
      orderColumn: "created_at",
    }),
    scopedRows("ivf_embryos", context, {
      coupleId,
      orderColumn: "creation_date",
    }),
    scopedRows("ivf_freezing_records", context, {
      coupleId,
      orderColumn: "freezing_date",
    }),
    scopedRows("ivf_embryo_transfers", context, {
      coupleId,
      orderColumn: "transfer_date",
    }),
    scopedRows("ivf_pregnancies", context, {
      coupleId,
      orderColumn: "beta_hcg_date",
    }),
    scopedRows("ivf_donors", context, {
      orderColumn: "created_at",
      limit: 100,
    }),
    scopedRows("ivf_surrogates", context, {
      orderColumn: "created_at",
      limit: 100,
    }),
  ]);

  const follicleGrowth = follicleTracking
    .slice()
    .reverse()
    .map((row, index) => ({
      name: dateLabel(row.tracking_date, `Day ${index + 1}`),
      right: avgFollicles(row, "right"),
      left: avgFollicles(row, "left"),
      endometrium: numberValue(row.endometrial_thickness),
    }));

  const pregnancyPositive = pregnancies.filter((row) =>
    String(row.beta_hcg_status || "").toUpperCase().includes("POSITIVE")
  ).length;
  const heartbeat = pregnancies.filter((row) => row.heartbeat === true).length;
  const delivered = pregnancies.filter((row) =>
    String(row.pregnancy_outcome || row.status || "")
      .toUpperCase()
      .includes("DELIVER")
  ).length;

  return NextResponse.json({
    context,
    couple: coupleRows[0],
    records: {
      femaleAssessments,
      maleAssessments,
      cycles,
      stimulation,
      follicleTracking,
      retrievals,
      fertilization,
      embryos,
      freezing,
      transfers,
      pregnancies,
      donors,
      surrogates,
    },
    analytics: {
      femaleAssessmentTrend: trendRows(femaleAssessments, "assessment_date", [
        "amh",
        "fsh",
        "right_ovary_afc",
        "left_ovary_afc",
      ]).map((row) => ({
        ...row,
        afc: numberValue(row.right_ovary_afc) + numberValue(row.left_ovary_afc),
        bmi: numberValue(coupleRows[0].female_bmi),
      })),
      femaleHormoneTrend: trendRows(femaleAssessments, "assessment_date", [
        "lh",
        "estradiol",
        "progesterone",
        "tsh",
        "prolactin",
      ]),
      maleAssessmentTrend: trendRows(maleAssessments, "assessment_date", [
        "sperm_count",
        "motility",
        "morphology",
      ]),
      cycleTimeline: cycles
        .slice()
        .reverse()
        .map((row, index) => ({
          name: String(row.cycle_number || `Cycle ${index + 1}`),
          date: dateLabel(row.start_date || row.created_at, `Cycle ${index + 1}`),
          status: String(row.status || "Not recorded"),
          outcome: String(row.outcome || "Pending"),
        })),
      cycleStatus: groupCount(cycles, "status"),
      cycleOutcomes: groupCount(cycles, "outcome"),
      follicleGrowth,
      medicationTimeline: stimulation
        .slice()
        .reverse()
        .map((row, index) => ({
          name: dateLabel(row.monitoring_date, `Day ${row.cycle_day || index + 1}`),
          medication: String(row.medication || "Medication not recorded"),
          dose: String(row.dose || "-"),
          status: String(row.status || "-"),
        })),
      retrievalBreakdown: [
        {
          name: "Retrieved Eggs",
          value: sumRows(retrievals, "oocytes_retrieved"),
        },
        {
          name: "Mature Eggs",
          value: sumRows(retrievals, "mii"),
        },
        {
          name: "Immature Eggs",
          value: sumRows(retrievals, "mi") + sumRows(retrievals, "gv"),
        },
        {
          name: "Degenerated Eggs",
          value: sumRows(retrievals, "degenerated"),
        },
      ],
      embryologyBreakdown: [
        {
          name: "2PN",
          value: sumRows(fertilization, "two_pn"),
        },
        {
          name: "4 Cell",
          value: embryos.filter((row) =>
            String(row.day3_grade || row.embryo_grade || "").toUpperCase().includes("4")
          ).length,
        },
        {
          name: "8 Cell",
          value: embryos.filter((row) =>
            String(row.day3_grade || row.embryo_grade || "").toUpperCase().includes("8")
          ).length,
        },
        {
          name: "Blastocyst",
          value: embryos.filter((row) =>
            String(row.day5_grade || row.embryo_grade || "").toUpperCase().includes("BLAST")
          ).length,
        },
        {
          name: "Frozen",
          value: embryos.filter((row) =>
            String(row.current_status || "").toUpperCase().includes("FROZEN")
          ).length,
        },
        {
          name: "Discarded",
          value: embryos.filter((row) =>
            String(row.current_status || "").toUpperCase().includes("DISCARD")
          ).length,
        },
      ],
      cryoBreakdown: [
        {
          name: "Frozen Embryos",
          value: freezing.filter((row) =>
            String(row.status || "").toUpperCase().includes("FROZEN")
          ).length,
        },
        {
          name: "Frozen Oocytes",
          value: freezing.filter((row) =>
            String(row.method || "").toUpperCase().includes("OOCYTE")
          ).length,
        },
        {
          name: "Frozen Sperm",
          value: freezing.filter((row) =>
            String(row.method || "").toUpperCase().includes("SPERM")
          ).length,
        },
      ],
      transferHistory: transfers
        .slice()
        .reverse()
        .map((row, index) => ({
          name: String(row.transfer_number || `Transfer ${index + 1}`),
          date: dateLabel(row.transfer_date, `Transfer ${index + 1}`),
          embryos: numberValue(row.embryo_count),
          status: String(row.status || "Not recorded"),
        })),
      transferSuccessRate: [
        {
          name: "Transfers",
          value: transfers.length,
        },
        {
          name: "Positive Beta HCG",
          value: pregnancyPositive,
        },
        {
          name: "Heartbeat",
          value: heartbeat,
        },
        {
          name: "Delivery",
          value: delivered,
        },
      ],
      donorUsage: groupCount(donors, "donor_type"),
      donorSuccessRate: groupCount(donors, "availability_status"),
      surrogacyProgress: groupCount(surrogates, "availability_status"),
      surrogacyMilestones: [
        {
          name: "Profiles",
          value: surrogates.length,
        },
        {
          name: "Legal Clearance",
          value: surrogates.filter((row) => row.legal_clearance === true).length,
        },
        {
          name: "Available",
          value: surrogates.filter((row) =>
            String(row.availability_status || "").toUpperCase().includes("AVAILABLE")
          ).length,
        },
      ],
      pregnancyFunnel: [
        {
          name: "Beta HCG",
          value: pregnancies.length,
        },
        {
          name: "Heartbeat",
          value: heartbeat,
        },
        {
          name: "12 Weeks",
          value: pregnancies.filter((row) => row.gestational_sac === true).length,
        },
        {
          name: "20 Weeks",
          value: pregnancies.filter((row) =>
            String(row.status || "").toUpperCase().includes("ONGOING")
          ).length,
        },
        {
          name: "Delivery",
          value: delivered,
        },
      ],
    },
  });
}
