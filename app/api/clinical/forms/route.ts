import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value || "").trim();

export async function GET(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const forms =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        f.*,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'id', ff.id,
              'field_key', ff.field_key,
              'label', ff.label,
              'field_type', ff.field_type,
              'section_key', ff.section_key,
              'tab_key', ff.tab_key,
              'sort_order', ff.sort_order,
              'is_required', ff.is_required,
              'options', ff.options,
              'validations', ff.validations
            )
            ORDER BY ff.sort_order ASC, ff.id ASC
          ) FILTER (WHERE ff.id IS NOT NULL),
          '[]'::json
        ) AS fields
      FROM clinical_forms f
      LEFT JOIN clinical_form_fields ff
        ON ff.form_id = f.id
       AND COALESCE(ff.is_deleted, false) = false
      WHERE f.tenant_id = $1
        AND f.hospital_id = $2
        AND f.branch_id = $3
        AND COALESCE(f.is_deleted, false) = false
      GROUP BY f.id
      ORDER BY f.updated_at DESC
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  return NextResponse.json({
    forms,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body =
    await request.json();
  const action = text(body.action);

  if (action === "field") {
    const formId = Number(
      body.form_id
    );

    if (!formId || !text(body.field_key)) {
      return NextResponse.json(
        {
          error:
            "Form and field key are required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO clinical_form_fields (
          tenant_id,
          clinic_id,
          hospital_id,
          branch_id,
          form_id,
          field_key,
          label,
          field_type,
          section_key,
          tab_key,
          sort_order,
          is_required,
          options,
          validations,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        ON CONFLICT (form_id, field_key)
        DO UPDATE SET
          label = EXCLUDED.label,
          field_type = EXCLUDED.field_type,
          section_key = EXCLUDED.section_key,
          tab_key = EXCLUDED.tab_key,
          sort_order = EXCLUDED.sort_order,
          is_required = EXCLUDED.is_required,
          options = EXCLUDED.options,
          validations = EXCLUDED.validations,
          updated_by = EXCLUDED.updated_by,
          updated_at = CURRENT_TIMESTAMP,
          is_deleted = false
        RETURNING *
        `,
        context.tenantId,
        context.clinicId,
        context.hospitalId,
        context.branchId,
        formId,
        text(body.field_key),
        text(body.label) ||
          text(body.field_key),
        text(body.field_type) ||
          "Text",
        text(body.section_key) ||
          null,
        text(body.tab_key) || null,
        Number(body.sort_order || 0),
        Boolean(body.is_required),
        JSON.stringify(
          body.options || []
        ),
        JSON.stringify(
          body.validations || {}
        ),
        context.user.id ?? null
      );

    await recordClinicalAudit(context, {
      moduleName: "forms",
      action: "field_upsert",
      entityType:
        "clinical_form_field",
      entityId:
        Number(rows[0].id),
      summary:
        "Clinical form field saved",
      payload: {
        form_id: formId,
        field_key:
          body.field_key,
      },
    });

    return NextResponse.json(
      rows[0],
      {
        status: 201,
      }
    );
  }

  if (!text(body.form_key)) {
    return NextResponse.json(
      {
        error:
          "Form key is required.",
      },
      {
        status: 400,
      }
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO clinical_forms (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        form_key,
        form_name,
        module_name,
        version,
        layout,
        validations,
        workflow_key,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,1,$8::jsonb,$9::jsonb,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, clinic_id, form_key, version)
      DO UPDATE SET
        form_name = EXCLUDED.form_name,
        module_name = EXCLUDED.module_name,
        layout = EXCLUDED.layout,
        validations = EXCLUDED.validations,
        workflow_key = EXCLUDED.workflow_key,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP,
        is_deleted = false
      RETURNING *
      `,
      context.tenantId,
      context.clinicId,
      context.hospitalId,
      context.branchId,
      text(body.form_key),
      text(body.form_name) ||
        text(body.form_key),
      text(body.module_name) ||
        "custom",
      JSON.stringify(
        body.layout || {}
      ),
      JSON.stringify(
        body.validations || {}
      ),
      text(body.workflow_key) ||
        null,
      context.user.id ?? null
    );

  await recordClinicalAudit(context, {
    moduleName: "forms",
    action: "upsert",
    entityType: "clinical_form",
    entityId: Number(rows[0].id),
    summary:
      "Clinical form saved",
    payload: {
      form_key: body.form_key,
    },
  });

  return NextResponse.json(
    rows[0],
    {
      status: 201,
    }
  );
}
