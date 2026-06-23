import { ClinicalContext, recordClinicalAudit } from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) => String(value ?? "").trim();

const numberOrZero = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const billableMap: Record<
  string,
  { itemType: string; description: string; rate: number; eventType: string }
> = {
  consultations: {
    itemType: "CONSULTATION",
    description: "Consultation Fee",
    rate: 500,
    eventType: "Consultation Completed",
  },
  laboratory: {
    itemType: "LAB",
    description: "Lab Charges",
    rate: 0,
    eventType: "Lab Order Released",
  },
  radiology: {
    itemType: "RADIOLOGY",
    description: "Radiology Charges",
    rate: 1200,
    eventType: "Radiology Order Released",
  },
  pharmacy: {
    itemType: "PHARMACY",
    description: "Pharmacy Charges",
    rate: 0,
    eventType: "Medicine Dispensed",
  },
  ipd: {
    itemType: "ADMISSION",
    description: "Admission Charges",
    rate: 1500,
    eventType: "Admission",
  },
  "bed-management": {
    itemType: "BED",
    description: "Bed Charges",
    rate: 1000,
    eventType: "Bed Allocation",
  },
  ot: {
    itemType: "OT",
    description: "OT Charges",
    rate: 5000,
    eventType: "OT Procedure",
  },
  icu: {
    itemType: "ICU",
    description: "ICU Charges",
    rate: 3000,
    eventType: "ICU Admission",
  },
  ivf: {
    itemType: "IVF",
    description: "IVF Package Charges",
    rate: 25000,
    eventType: "IVF Procedure",
  },
};

export async function createPatientTimelineEvent(
  context: ClinicalContext,
  input: {
    patientId: number | null;
    eventType: string;
    eventSource: string;
    sourceRecordId?: number | null;
    title: string;
    description?: string | null;
    eventDatetime?: Date | string | null;
  }
) {
  if (!input.patientId) {
    return null;
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO patient_timeline_events (
      patient_id,
      event_type,
      event_source,
      source_record_id,
      title,
      description,
      event_datetime,
      created_by,
      tenant_id,
      hospital_id,
      branch_id
    )
	    VALUES ($1::int,$2::varchar,$3::varchar,$4::int,$5::text,$6::text,COALESCE($7::timestamp,CURRENT_TIMESTAMP),$8::int,$9::int,$10::int,$11::int)
    ON CONFLICT ON CONSTRAINT patient_timeline_events_pkey DO NOTHING
    RETURNING *
    `,
    input.patientId,
    input.eventType,
    input.eventSource,
    input.sourceRecordId ?? null,
    input.title,
    input.description ?? null,
    input.eventDatetime ?? null,
    context.user.id ?? null,
    context.tenantId,
    context.hospitalId,
    context.branchId
  ).catch(async () => {
    return prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO patient_timeline_events (
        patient_id,
        event_type,
        event_source,
        source_record_id,
        title,
        description,
        event_datetime,
        created_by,
        tenant_id,
        hospital_id,
        branch_id
      )
	      SELECT $1::int,$2::varchar,$3::varchar,$4::int,$5::text,$6::text,COALESCE($7::timestamp,CURRENT_TIMESTAMP),$8::int,$9::int,$10::int,$11::int
      WHERE NOT EXISTS (
        SELECT 1 FROM patient_timeline_events
	        WHERE tenant_id=$9::int
	          AND hospital_id=$10::int
	          AND branch_id=$11::int
	          AND event_source=$3::varchar
	          AND source_record_id IS NOT DISTINCT FROM $4::int
	          AND event_type=$2::varchar
          AND COALESCE(is_deleted,false)=false
      )
      RETURNING *
      `,
      input.patientId,
      input.eventType,
      input.eventSource,
      input.sourceRecordId ?? null,
      input.title,
      input.description ?? null,
      input.eventDatetime ?? null,
      context.user.id ?? null,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );
  });

  return rows[0] || null;
}

async function getOrCreateOpenInvoice(
  context: ClinicalContext,
  patientId: number,
  sourceModule: string,
  sourceRecordId: number
) {
  const existing = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM billing_invoices
    WHERE tenant_id=$1::int
      AND hospital_id=$2::int
      AND branch_id=$3::int
      AND patient_id=$4::int
      AND status IN ('DRAFT','OPEN','PARTIAL')
      AND COALESCE(is_deleted,false)=false
    ORDER BY created_at DESC
    LIMIT 1
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    patientId
  );

  if (existing[0]) {
    return existing[0];
  }

  const invoiceNumber = uid("INV");
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO billing_invoices (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      invoice_number,
      patient_id,
      invoice_date,
      status,
      subtotal,
      discount,
      tax,
      total,
      paid_amount,
      balance_amount,
      balance,
      invoice_type,
      source_module,
      source_record_id,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1::int,$2::int,$3::int,$4::int,$5::varchar,$6::int,CURRENT_DATE,'OPEN',0,0,0,0,0,0,0,'PATIENT',$7::varchar,$8::int,$9::int,$9::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    invoiceNumber,
    patientId,
    sourceModule,
    sourceRecordId,
    context.user.id ?? null
  );
  return rows[0];
}

export async function createBillingItemForWorkflow(
  context: ClinicalContext,
  input: {
    moduleKey: string;
    patientId: number | null;
    sourceRecordId: number;
    description?: string;
    amount?: number;
    quantity?: number;
  }
) {
  const billable = billableMap[input.moduleKey];
  if (!billable || !input.patientId) {
    return null;
  }

  const invoice = await getOrCreateOpenInvoice(
    context,
    input.patientId,
    input.moduleKey,
    input.sourceRecordId
  );
  const quantity = input.quantity || 1;
  const rate =
    input.amount ??
    (input.moduleKey === "pharmacy"
      ? 0
      : billable.rate);
  if (
    input.moduleKey === "laboratory" &&
    (!Number.isFinite(rate) || rate <= 0)
  ) {
    throw new Error(
      "Lab billing amount must come from Lab Test Master and must be greater than zero."
    );
  }
  const amount = quantity * rate;

  const duplicate = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT id FROM billing_invoice_items
    WHERE invoice_id=$1::int
      AND item_type=$2::varchar
      AND item_reference_id=$3::int
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,
    invoice.id,
    billable.itemType,
    input.sourceRecordId
  );

  if (!duplicate[0]) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO billing_invoice_items (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        invoice_id,
        item_type,
        item_reference_id,
        item_description,
        item_name,
        quantity,
        rate,
        discount,
        tax,
        amount,
        total,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::varchar,$7::int,$8::text,$8::text,$9::numeric,$10::numeric,0,0,$11::numeric,$11::numeric,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      invoice.id,
      billable.itemType,
      input.sourceRecordId,
      input.description || billable.description,
      quantity,
      rate,
      amount,
      context.user.id ?? null
    );
  }

  await recalculateInvoice(invoice.id);

  await createPatientTimelineEvent(context, {
    patientId: input.patientId,
    eventType: "Billing Events",
    eventSource: "billing_invoice_items",
    sourceRecordId: input.sourceRecordId,
    title: `${billable.description} added to invoice`,
    description: `Invoice ${invoice.invoice_number || invoice.id} updated with ${input.description || billable.description}.`,
  });

  await queueClinicalWorkflowNotification(context, {
    templateKey: "bill_generated",
    patientId: input.patientId,
    invoiceId: Number(invoice.id),
    sourceModule: "billing_invoice_items",
    sourceRecordId: input.sourceRecordId,
    variables: {
      invoice_number: invoice.invoice_number || invoice.id,
      amount,
      department: input.moduleKey,
    },
  }).catch(() => null);

  return invoice;
}

export async function recalculateInvoice(
  invoiceId: unknown
) {
  const id = Number(invoiceId);
  if (!Number.isFinite(id)) {
    return;
  }

  const totals = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      COALESCE(SUM(amount),0)::numeric AS subtotal,
      COALESCE(SUM(discount),0)::numeric AS discount,
      COALESCE(SUM(tax),0)::numeric AS tax,
      COALESCE(SUM(total),0)::numeric AS total
    FROM billing_invoice_items
    WHERE invoice_id=$1::int
      AND COALESCE(is_deleted,false)=false
    `,
    id
  );
  const total = numberOrZero(totals[0]?.total);
  const payments = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT COALESCE(SUM(amount),0)::numeric AS paid
    FROM payments
    WHERE invoice_id=$1::int
      AND COALESCE(is_deleted,false)=false
    `,
    id
  );
  const paid = numberOrZero(payments[0]?.paid);
  const refunds = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT COALESCE(SUM(COALESCE(amount, refund_amount, 0)),0)::numeric AS refunded
    FROM refunds
    WHERE invoice_id=$1::int
      AND COALESCE(is_deleted,false)=false
      AND UPPER(COALESCE(status,'')) IN ('APPROVED','PROCESSED','COMPLETED','REFUNDED')
    `,
    id
  );
  const refunded = numberOrZero(refunds[0]?.refunded);
  const netPaid = Math.max(paid - refunded, 0);
  const balance = Math.max(total - netPaid, 0);

  await prisma.$executeRawUnsafe(
    `
    UPDATE billing_invoices
    SET subtotal=$2::numeric,
        discount=$3::numeric,
        tax=$4::numeric,
        total=$5::numeric,
        paid_amount=$6::numeric,
        balance_amount=$7::numeric,
        balance=$7::numeric,
        status=CASE
          WHEN $5::numeric = 0 THEN 'OPEN'
          WHEN $8::numeric > 0 AND $6::numeric <= 0 THEN 'REFUNDED'
          WHEN $7::numeric <= 0 THEN 'PAID'
          WHEN $6::numeric > 0 THEN 'PARTIAL'
          ELSE 'OPEN'
        END,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    `,
    id,
    numberOrZero(totals[0]?.subtotal),
    numberOrZero(totals[0]?.discount),
    numberOrZero(totals[0]?.tax),
    total,
    netPaid,
    balance,
    refunded
  );
}

export async function createDocumentRecord(
  context: ClinicalContext,
  input: {
    patientId?: number | null;
    documentType: string;
    title: string;
    sourceModule?: string;
    sourceRecordId?: number | null;
    fileName?: string;
    fileUrl?: string;
    contentType?: string;
  }
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO document_repository (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      document_type,
      document_title,
      source_module,
      source_record_id,
      version,
      file_name,
      file_url,
      content_type,
      generated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1,$10,$11,$12,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    input.patientId ?? null,
    input.documentType,
    input.title,
    input.sourceModule ?? null,
    input.sourceRecordId ?? null,
    input.fileName ?? null,
    input.fileUrl ?? null,
    input.contentType ?? "application/pdf",
    context.user.id ?? null
  );

  await createPatientTimelineEvent(context, {
    patientId: input.patientId ?? null,
    eventType: "Documents Generated",
    eventSource: "document_repository",
    sourceRecordId: Number(rows[0]?.id),
    title: `${input.documentType}: ${input.title}`,
    description: input.fileName || input.fileUrl || null,
  });

  await recordClinicalAudit(context, {
    moduleName: "document_repository",
    action: "create",
    entityType: "document_repository",
    entityId: Number(rows[0]?.id),
    summary: `${input.documentType} document registered`,
    payload: input,
  });

  const documentId = Number(rows[0]?.id);
  if (Number.isFinite(documentId)) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_document_verifications (
        tenant_id,
        hospital_id,
        branch_id,
        document_id,
        document_type,
        source_module,
        source_record_id,
        verification_token,
        verification_status,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'VALID',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (verification_token) DO NOTHING
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      documentId,
      input.documentType,
      input.sourceModule ?? null,
      input.sourceRecordId ?? null,
      `DOC-${documentId}-${context.tenantId}-${context.hospitalId}-${context.branchId}`
    ).catch(() => {});
  }

  return rows[0];
}

export async function recordWorkflowSpineEffects(
  context: ClinicalContext,
  input: {
    moduleKey: string;
    record: Row;
    body: Record<string, unknown>;
  }
) {
  const patientId = Number(
    input.record.patient_id || input.body.patient_id
  );
  const sourceRecordId = Number(input.record.id);
  if (!Number.isFinite(sourceRecordId)) {
    return;
  }

  const billable = billableMap[input.moduleKey];
  const eventType =
    billable?.eventType ||
    ({
      nursing: "Vitals",
      "bed-management": "Bed Transfers",
    } as Record<string, string>)[input.moduleKey] ||
    "Clinical Event";

  await createPatientTimelineEvent(context, {
    patientId: Number.isFinite(patientId) ? patientId : null,
    eventType,
    eventSource: input.moduleKey,
    sourceRecordId,
    title: text(input.record.title) || `${input.moduleKey} record saved`,
    description:
      text(input.body.notes) ||
      text(input.body.clinical_notes) ||
      text(input.body.admission_reason) ||
      text(input.body.findings) ||
      text(input.body.critical_notes) ||
      null,
  });

  await createBillingItemForWorkflow(context, {
    moduleKey: input.moduleKey,
    patientId: Number.isFinite(patientId) ? patientId : null,
    sourceRecordId,
    description: billable?.description,
    amount:
      input.moduleKey === "pharmacy"
        ? numberOrZero(input.body.quantity) * 100
        : input.moduleKey === "ivf"
          ? numberOrZero(input.body.package_billing) || undefined
          : undefined,
  });
}
