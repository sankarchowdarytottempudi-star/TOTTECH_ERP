import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { pdfFormatters, pdfResponse, renderClinicalPdf, type ClinicalPdfSection } from "@/lib/clinical/pdf-engine";
import { createDocumentRecord } from "@/lib/clinical/phase4-operational-spine";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

const patientSelect = `
  COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
  p.patient_uid,
  p.uhid,
  p.phone,
  p.gender
`;

const documentLabels: Record<string, { title: string; type: string; source: string }> = {
  prescription: {
    title: "Prescription",
    type: "Prescription",
    source: "consultations",
  },
  "lab-report": {
    title: "Lab Report",
    type: "Lab Report",
    source: "lab_orders",
  },
  "radiology-report": {
    title: "Radiology Report",
    type: "Radiology Report",
    source: "consultation_radiology_orders",
  },
  "discharge-summary": {
    title: "Discharge Summary",
    type: "Discharge Summary",
    source: "discharges",
  },
  "payment-receipt": {
    title: "Payment Receipt",
    type: "Payment Receipt",
    source: "payments",
  },
  "insurance-claim": {
    title: "Insurance Claim",
    type: "Insurance Claim",
    source: "insurance_claims",
  },
  "ivf-cycle-report": {
    title: "IVF Cycle Report",
    type: "IVF Cycle Report",
    source: "ivf_cycles",
  },
};

async function renderPrescription(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT c.*, d.signature_url AS doctor_signature_url, d.full_name AS doctor_name, ${patientSelect}
    FROM consultations c
    LEFT JOIN patients p ON p.id=c.patient_id
    LEFT JOIN doctors d ON d.id=c.doctor_id
    WHERE c.id=$1 AND c.tenant_id=$2 AND c.hospital_id=$3 AND c.branch_id=$4 AND COALESCE(c.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const prescriptions = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT medicine_name, dose, frequency, duration, instructions
    FROM consultation_prescriptions
    WHERE consultation_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    ORDER BY id
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  if (record) {
    return {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Consultation",
            rows: [
              ["Consultation UID", record.consultation_uid],
              ["Date", pdfFormatters.date(record.consultation_date)],
              ["Chief Complaint", record.chief_complaint],
              ["Diagnosis", record.diagnosis_summary],
              ["Clinical Notes", record.clinical_notes],
              ["Follow Up", pdfFormatters.date(record.follow_up_date)],
            ],
          },
          {
            title: "Medicines",
            table: {
              columns: [
                { key: "medicine_name", label: "Medicine", width: 150 },
                { key: "dose", label: "Dose", width: 85 },
                { key: "frequency", label: "Frequency", width: 100 },
                { key: "duration", label: "Duration", width: 90 },
                { key: "instructions", label: "Instructions", width: 150 },
              ],
              rows: prescriptions,
            },
          },
        ] as ClinicalPdfSection[],
      };
  }

  const operationalRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT pr.*, d.signature_url AS doctor_signature_url, d.full_name AS doctor_name, ${patientSelect}
    FROM prescriptions pr
    LEFT JOIN patients p ON p.id=pr.patient_id
    LEFT JOIN doctors d ON d.id=pr.doctor_id
    WHERE pr.id=$1 AND pr.tenant_id=$2 AND pr.hospital_id=$3 AND pr.branch_id=$4 AND COALESCE(pr.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const operational = operationalRows[0];
  if (!operational) {
    return null;
  }
  const medications = Array.isArray(operational.medications)
    ? operational.medications as Row[]
    : [];

  return {
    record: {
      ...operational,
      consultation_uid: operational.prescription_uid,
      consultation_date: operational.created_at,
      diagnosis_summary: operational.diagnosis,
      clinical_notes: operational.advice || operational.instructions,
    },
    patientId: Number(operational.patient_id),
    sections: [
      {
        title: "Consultation",
        rows: [
          ["Prescription UID", operational.prescription_uid],
          ["Date", pdfFormatters.date(operational.created_at)],
          ["Chief Complaint", operational.chief_complaint],
          ["Diagnosis", operational.diagnosis],
          ["Advice", operational.advice],
          ["Follow Up", pdfFormatters.date(operational.follow_up_date)],
        ],
      },
      {
        title: "Medicines",
        table: {
          columns: [
            { key: "name", label: "Medicine", width: 150 },
            { key: "dose", label: "Dose", width: 85 },
            { key: "frequency", label: "Frequency", width: 100 },
            { key: "duration", label: "Duration", width: 90 },
            { key: "instructions", label: "Instructions", width: 150 },
          ],
          rows: medications,
        },
      },
    ] as ClinicalPdfSection[],
  };
}

async function renderLabReport(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT lo.*, ${patientSelect}
    FROM lab_orders lo
    LEFT JOIN patients p ON p.id=lo.patient_id
    WHERE lo.id=$1 AND lo.tenant_id=$2 AND lo.hospital_id=$3 AND lo.branch_id=$4 AND COALESCE(lo.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const results = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT result_uid, result_status, result_value, critical_value, interpretation, validated_at
    FROM lab_results
    WHERE lab_order_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    ORDER BY id
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Order",
            rows: [
              ["Order UID", record.order_uid],
              ["Order Type", record.order_type],
              ["Priority", record.priority],
              ["Status", record.status],
              ["Ordered At", pdfFormatters.date(record.ordered_at)],
              ["Notes", record.notes],
            ],
          },
          {
            title: "Results",
            table: {
              columns: [
                { key: "result_uid", label: "Result", width: 110 },
                { key: "result_status", label: "Status", width: 90 },
                { key: "result_value", label: "Value", width: 100 },
                { key: "critical_value", label: "Critical", width: 95 },
                { key: "interpretation", label: "Interpretation", width: 180 },
              ],
              rows: results,
            },
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

async function renderRadiologyReport(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT r.*, ${patientSelect}
    FROM consultation_radiology_orders r
    LEFT JOIN patients p ON p.id=r.patient_id
    WHERE r.id=$1 AND r.tenant_id=$2 AND r.hospital_id=$3 AND r.branch_id=$4 AND COALESCE(r.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Radiology Study",
            rows: [
              ["Order UID", record.order_uid],
              ["Modality", record.modality],
              ["Study", record.study_name],
              ["Scheduled Date", pdfFormatters.date(record.scheduled_date)],
              ["Technician", record.technician],
              ["Findings", record.findings],
              ["Impression", record.impression],
              ["Status", record.status],
            ],
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

async function renderDischargeSummary(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT d.*, a.admission_uid, a.admission_date, a.admission_reason, ${patientSelect}
    FROM discharges d
    LEFT JOIN admissions a ON a.id=d.admission_id
    LEFT JOIN patients p ON p.id=d.patient_id
    WHERE d.id=$1 AND d.tenant_id=$2 AND d.hospital_id=$3 AND d.branch_id=$4 AND COALESCE(d.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Admission and Discharge",
            rows: [
              ["Admission UID", record.admission_uid],
              ["Admission Date", pdfFormatters.date(record.admission_date)],
              ["Admission Reason", record.admission_reason],
              ["Discharge Date", pdfFormatters.date(record.discharge_date)],
              ["Status", record.status],
              ["Summary", record.discharge_summary],
            ],
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

async function renderPaymentReceipt(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT pay.*, i.invoice_number, ${patientSelect}
    FROM payments pay
    LEFT JOIN billing_invoices i ON i.id=pay.invoice_id
    LEFT JOIN patients p ON p.id=pay.patient_id
    WHERE pay.id=$1 AND pay.tenant_id=$2 AND pay.hospital_id=$3 AND pay.branch_id=$4 AND COALESCE(pay.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Payment",
            rows: [
              ["Receipt Number", record.receipt_number || record.payment_number],
              ["Invoice Number", record.invoice_number],
              ["Payment Date", pdfFormatters.date(record.payment_date)],
              ["Payment Mode", record.payment_mode || record.payment_method],
              ["Reference", record.reference_number],
              ["Amount", pdfFormatters.money(record.amount)],
              ["Remarks", record.remarks],
            ],
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

async function renderInsuranceClaim(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT c.*, pcy.policy_number, pcy.insurance_company, pcy.tpa, i.invoice_number, ${patientSelect}
    FROM insurance_claims c
    LEFT JOIN insurance_policies pcy ON pcy.id=c.policy_id
    LEFT JOIN billing_invoices i ON i.id=c.invoice_id
    LEFT JOIN patients p ON p.id=c.patient_id
    WHERE c.id=$1 AND c.tenant_id=$2 AND c.hospital_id=$3 AND c.branch_id=$4 AND COALESCE(c.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Claim",
            rows: [
              ["Claim Number", record.claim_number],
              ["Policy Number", record.policy_number],
              ["Insurance Company", record.insurance_company],
              ["TPA", record.tpa],
              ["Invoice", record.invoice_number],
              ["Submitted", pdfFormatters.date(record.submission_date)],
              ["Claimed", pdfFormatters.money(record.claimed_amount)],
              ["Approved", pdfFormatters.money(record.approved_amount)],
              ["Rejected", pdfFormatters.money(record.rejected_amount)],
              ["Status", record.status],
            ],
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

async function renderIvfCycleReport(context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>, id: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT cycle.*, ${patientSelect}
    FROM ivf_cycles cycle
    LEFT JOIN patients p ON p.id=cycle.patient_id
    WHERE cycle.id=$1 AND cycle.tenant_id=$2 AND cycle.hospital_id=$3 AND cycle.branch_id=$4 AND COALESCE(cycle.is_deleted,false)=false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const embryos = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT embryo_number, embryo_grade, embryo_day, embryo_status, freeze_date, transfer_date, outcome
    FROM ivf_embryos
    WHERE cycle_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    ORDER BY id
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  ).catch(() => []);
  const record = rows[0];
  return record
    ? {
        record,
        patientId: Number(record.patient_id),
        sections: [
          {
            title: "Cycle",
            rows: [
              ["Cycle Number", record.cycle_number],
              ["Cycle Type", record.cycle_type],
              ["Protocol", record.protocol_type],
              ["Start Date", pdfFormatters.date(record.start_date)],
              ["Retrieval Date", pdfFormatters.date(record.expected_retrieval_date)],
              ["Transfer Date", pdfFormatters.date(record.expected_transfer_date)],
              ["Status", record.status],
              ["Outcome", record.outcome],
            ],
          },
          {
            title: "Embryos",
            table: {
              columns: [
                { key: "embryo_number", label: "Embryo", width: 90 },
                { key: "embryo_grade", label: "Grade", width: 80 },
                { key: "embryo_day", label: "Day", width: 60 },
                { key: "embryo_status", label: "Status", width: 110 },
                { key: "outcome", label: "Outcome", width: 160 },
              ],
              rows: embryos,
            },
          },
        ] as ClinicalPdfSection[],
      }
    : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentType: string; id: string }> }
) {
  const auth = await requireClinicalContext(request);
  if (auth.response) {
    return auth.response;
  }
  const context = auth.context!;
  const { documentType, id } = await params;
  const numericId = Number(id);
  const definition = documentLabels[documentType];

  if (!definition || !Number.isFinite(numericId)) {
    return NextResponse.json({ error: "Unsupported document type." }, { status: 400 });
  }

  const builders: Record<string, typeof renderPrescription> = {
    prescription: renderPrescription,
    "lab-report": renderLabReport,
    "radiology-report": renderRadiologyReport,
    "discharge-summary": renderDischargeSummary,
    "payment-receipt": renderPaymentReceipt,
    "insurance-claim": renderInsuranceClaim,
    "ivf-cycle-report": renderIvfCycleReport,
  };
  const payload = await builders[documentType](context, numericId);

  if (!payload) {
    return NextResponse.json({ error: "Source record not found." }, { status: 404 });
  }

  const fileName = `${documentType}-${numericId}.pdf`;
  await createDocumentRecord(context, {
    patientId: payload.patientId,
    documentType: definition.type,
    title: `${definition.title} #${numericId}`,
    sourceModule: definition.source,
    sourceRecordId: numericId,
    fileName,
    contentType: "application/pdf",
  });

  await recordClinicalAudit(context, {
    moduleName: "document_repository",
    action: "print_pdf",
    entityType: definition.source,
    entityId: numericId,
    summary: `${definition.title} PDF generated`,
    payload: { documentType, sourceRecordId: numericId, fileName },
  });

  const buffer = await renderClinicalPdf(context, {
    title: definition.title,
    documentNumber: String(numericId),
    patient: payload.record,
    qrText: `${documentType}:${numericId}:tenant:${context.tenantId}:hospital:${context.hospitalId}:branch:${context.branchId}`,
    signatureLabel:
      documentType === "payment-receipt"
        ? "Cashier Signature"
        : documentType === "insurance-claim"
          ? "Claims Authorized Signature"
          : "Doctor / Authorized Signature",
    signatureImageUrl:
      documentType === "prescription"
        ? String(payload.record.doctor_signature_url || "")
        : null,
    sections: payload.sections,
  });

  return pdfResponse(buffer, fileName);
}
