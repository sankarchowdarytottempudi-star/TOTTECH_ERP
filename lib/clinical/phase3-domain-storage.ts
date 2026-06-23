import {
  ClinicalContext,
  recordClinicalAudit,
} from "@/lib/clinical/context";
import {
  getPhase2Module,
  Phase2Module,
  titleForRecord,
} from "@/lib/clinical/phase2-workflows";
import { recordWorkflowSpineEffects } from "@/lib/clinical/phase4-operational-spine";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type DomainConfig = {
  table: string;
  idColumn: string;
  uidColumn: string;
  uidPrefix: string;
  patientColumn?: string;
  statusColumn: string;
  titleSql: string;
  dataSql: string;
  dateColumn: string;
};

const text = (value: unknown) =>
  String(value ?? "").trim();

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const boolValue = (value: unknown) =>
  ["YES", "TRUE", "1", "CRITICAL"].includes(
    text(value).toUpperCase()
  );

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(
    Math.random() * 9000 + 1000
  )}`;

const domainConfigs: Record<
  string,
  DomainConfig
> = {
  nursing: {
    table: "nursing_vitals",
    idColumn: "id",
    uidColumn: "record_uid",
    uidPrefix: "NUR",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.record_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'temperature', t.temperature,
        'pulse', t.pulse,
        'respiratory_rate', t.respiratory_rate,
        'blood_pressure', t.blood_pressure,
        'spo2', t.spo2,
        'weight', t.weight,
        'height', t.height,
        'bmi', t.bmi,
        'medicine_id', mar.medicine_id,
        'dose', mar.dose,
        'administration_time', mar.administration_time,
        'nurse_name', mar.nurse_name,
        'handover_to', sh.handover_to,
        'notes', COALESCE(nn.note_text, sh.notes)
      )
    `,
  },
  consultations: {
    table: "consultations",
    idColumn: "id",
    uidColumn: "consultation_uid",
    uidPrefix: "CON",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.consultation_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.chief_complaint,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'doctor_id', t.doctor_id,
        'chief_complaint', t.chief_complaint,
        'symptoms', t.symptoms,
        'diagnosis', COALESCE(cd.diagnosis_text, t.diagnosis_summary),
        'clinical_notes', t.clinical_notes,
        'follow_up_date', t.follow_up_date,
        'medicine_id', cp.medicine_id,
        'dose', cp.dose,
        'lab_test_id', clo.lab_test_id,
        'radiology_modality', cro.modality,
        'procedure', cro.study_name,
        'notes', t.clinical_notes
      )
    `,
  },
  laboratory: {
    table: "lab_orders",
    idColumn: "id",
    uidColumn: "order_uid",
    uidPrefix: "LAB",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.order_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(lt.test_name, lt.lab_test_name, '')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'lab_test_id', t.lab_test_id,
        'sample_number', COALESCE(ls.sample_number, t.sample_number),
        'sample_type', ls.sample_type,
        'collection_time', ls.collection_time,
        'result_value', COALESCE(lr.result_value, t.result_value),
        'critical_value', CASE WHEN COALESCE(lr.critical_value, t.critical_value, false) THEN 'YES' ELSE 'NO' END,
        'validated_by', COALESCE(lra.approved_by, t.validated_by),
        'notes', t.notes
      )
    `,
  },
  radiology: {
    table: "consultation_radiology_orders",
    idColumn: "id",
    uidColumn: "order_uid",
    uidPrefix: "RAD",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.order_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.modality,'') || ' ' || COALESCE(t.study_name,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'modality', t.modality,
        'study_name', t.study_name,
        'scheduled_date', t.scheduled_date,
        'technician', t.technician,
        'findings', t.findings,
        'impression', t.impression,
        'approved_by', t.approved_by,
        'notes', t.findings
      )
    `,
  },
  "bed-management": {
    table: "bed_allocations",
    idColumn: "id",
    uidColumn: "allocation_uid",
    uidPrefix: "BED",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.allocation_uid,'') || ' | Bed ' || COALESCE(t.bed_number,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",
    dataSql: `
      jsonb_build_object(
        'building', t.building,
        'ward', t.ward,
        'room_id', t.room_id,
        'bed_number', t.bed_number,
        'patient_id', t.patient_id,
        'action', t.action,
        'notes', t.notes
      )
    `,
  },
  ipd: {
    table: "admissions",
    idColumn: "id",
    uidColumn: "admission_uid",
    uidPrefix: "IPD",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.admission_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.admission_reason,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'doctor_id', t.doctor_id,
        'admission_date', t.admission_date,
        'admission_reason', t.admission_reason,
        'daily_round_notes', nn.note_text,
        'nursing_notes', nn.note_text,
        'discharge_summary', d.discharge_summary,
        'room_id', ba.room_id,
        'notes', t.admission_reason
      )
    `,
  },
  ot: {
    table: "ot_schedules",
    idColumn: "id",
    uidColumn: "schedule_uid",
    uidPrefix: "OT",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.schedule_uid,'') || ' | ' || COALESCE(t.procedure_name,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'procedure', t.procedure_name,
        'surgeon_id', t.surgeon_id,
        'assistant_surgeon', t.assistant_surgeon,
        'anaesthetist', t.anaesthetist,
        'ot_room', t.ot_room_id,
        'procedure_date', t.scheduled_date,
        'start_time', t.start_time,
        'end_time', t.end_time,
        'billing_notes', op.billing_notes,
        'notes', t.notes
      )
    `,
  },
  icu: {
    table: "icu_admissions",
    idColumn: "id",
    uidColumn: "admission_uid",
    uidPrefix: "ICU",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.admission_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'pulse', im.pulse,
        'bp', im.bp,
        'spo2', im.spo2,
        'respiratory_rate', im.respiratory_rate,
        'ventilator_mode', vt.ventilator_mode,
        'fio2', vt.fio2,
        'peep', vt.peep,
        'critical_notes', im.critical_notes,
        'notes', im.critical_notes
      )
    `,
  },
  ivf: {
    table: "ivf_cycles",
    idColumn: "id",
    uidColumn: "cycle_number",
    uidPrefix: "IVF",
    patientColumn: "patient_id",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.cycle_number,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.workflow_stage,'')",
    dataSql: `
      jsonb_build_object(
        'patient_id', t.patient_id,
        'cycle_number', t.cycle_number,
        'workflow_stage', t.workflow_stage,
        'amh', ist.amh,
        'fsh', ist.fsh,
        'lh', ist.lh,
        'estradiol', ist.estradiol,
        'afc', ist.afc,
        'sperm_count', ie.sperm_count,
        'motility', ie.motility,
        'morphology', ie.morphology,
        'embryo_grade', ie.embryo_grade,
        'storage_tank', ic.storage_tank,
        'canister', ic.canister,
        'straw_number', ic.straw_number,
        'freeze_date', ic.freeze_date,
        'package_billing', t.notes,
        'notes', t.notes
      )
    `,
  },
  pharmacy: {
    table: "pharmacy_stock",
    idColumn: "id",
    uidColumn: "stock_uid",
    uidPrefix: "PHR",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.stock_uid,'') || ' | ' || COALESCE(cm.medicine_name,'')",
    dataSql: `
      jsonb_build_object(
        'medicine_id', t.medicine_id,
        'batch_number', pb.batch_number,
        'expiry_date', pb.expiry_date,
        'quantity', COALESCE(pb.quantity, t.quantity),
        'purchase_order', ppo.purchase_order,
        'goods_receipt', ppo.goods_receipt,
        'patient_id', pd.patient_id,
        'dispense_notes', pd.dispense_notes,
        'return_reason', pd.return_reason,
        'notes', t.notes
      )
    `,
  },
  inventory: {
    table: "inventory_items",
    idColumn: "id",
    uidColumn: "item_uid",
    uidPrefix: "INV",
    statusColumn: "status",
    dateColumn: "updated_at",
    titleSql:
      "COALESCE(t.item_uid,'') || ' | ' || COALESCE(t.item_name,'')",
    dataSql: `
      jsonb_build_object(
        'category', t.category,
        'item_name', t.item_name,
        'quantity', t.quantity,
        'supplier', t.supplier,
        'purchase_date', it.transaction_date,
        'issued_to', ii.issued_to,
        'consumption_area', ii.consumption_area,
        'notes', it.notes
      )
    `,
  },
};

export function getDomainConfig(
  moduleKey: string
) {
  return domainConfigs[moduleKey];
}

function joinsFor(moduleKey: string) {
  if (moduleKey === "nursing") {
    return `
      LEFT JOIN nursing_notes nn ON nn.vital_id = t.id AND COALESCE(nn.is_deleted,false) = false
      LEFT JOIN medication_administration_records mar ON mar.vital_id = t.id AND COALESCE(mar.is_deleted,false) = false
      LEFT JOIN shift_handovers sh ON sh.vital_id = t.id AND COALESCE(sh.is_deleted,false) = false
    `;
  }
  if (moduleKey === "consultations") {
    return `
      LEFT JOIN consultation_diagnoses cd ON cd.consultation_id = t.id AND COALESCE(cd.is_deleted,false) = false
      LEFT JOIN consultation_prescriptions cp ON cp.consultation_id = t.id AND COALESCE(cp.is_deleted,false) = false
      LEFT JOIN consultation_lab_orders clo ON clo.consultation_id = t.id AND COALESCE(clo.is_deleted,false) = false
      LEFT JOIN consultation_radiology_orders cro ON cro.consultation_id = t.id AND COALESCE(cro.is_deleted,false) = false
    `;
  }
  if (moduleKey === "laboratory") {
    return `
      LEFT JOIN clinical_lab_test_master lt ON lt.id = t.lab_test_id
      LEFT JOIN lab_samples ls ON ls.lab_order_id = t.id AND COALESCE(ls.is_deleted,false) = false
      LEFT JOIN lab_results lr ON lr.lab_order_id = t.id AND COALESCE(lr.is_deleted,false) = false
      LEFT JOIN lab_result_approvals lra ON lra.lab_result_id = lr.id AND COALESCE(lra.is_deleted,false) = false
    `;
  }
  if (moduleKey === "ipd") {
    return `
      LEFT JOIN bed_allocations ba ON ba.admission_id = t.id AND COALESCE(ba.is_deleted,false) = false
      LEFT JOIN nursing_notes nn ON nn.admission_id = t.id AND COALESCE(nn.is_deleted,false) = false
      LEFT JOIN discharges d ON d.admission_id = t.id AND COALESCE(d.is_deleted,false) = false
    `;
  }
  if (moduleKey === "ot") {
    return `
      LEFT JOIN ot_procedures op ON op.ot_schedule_id = t.id AND COALESCE(op.is_deleted,false) = false
    `;
  }
  if (moduleKey === "icu") {
    return `
      LEFT JOIN icu_monitoring im ON im.icu_admission_id = t.id AND COALESCE(im.is_deleted,false) = false
      LEFT JOIN ventilator_tracking vt ON vt.icu_admission_id = t.id AND COALESCE(vt.is_deleted,false) = false
    `;
  }
  if (moduleKey === "ivf") {
    return `
      LEFT JOIN ivf_stimulation ist ON ist.ivf_cycle_id = t.id AND COALESCE(ist.is_deleted,false) = false
      LEFT JOIN ivf_embryos ie ON ie.ivf_cycle_id = t.id AND COALESCE(ie.is_deleted,false) = false
      LEFT JOIN ivf_cryostorage ic ON ic.ivf_cycle_id = t.id AND COALESCE(ic.is_deleted,false) = false
    `;
  }
  if (moduleKey === "pharmacy") {
    return `
      LEFT JOIN clinical_medicine_master cm ON cm.id = t.medicine_id
      LEFT JOIN pharmacy_batches pb ON pb.stock_id = t.id AND COALESCE(pb.is_deleted,false) = false
      LEFT JOIN pharmacy_purchase_orders ppo ON ppo.stock_id = t.id AND COALESCE(ppo.is_deleted,false) = false
      LEFT JOIN pharmacy_dispensing pd ON pd.stock_id = t.id AND COALESCE(pd.is_deleted,false) = false
    `;
  }
  if (moduleKey === "inventory") {
    return `
      LEFT JOIN inventory_transactions it ON it.inventory_item_id = t.id AND COALESCE(it.is_deleted,false) = false
      LEFT JOIN inventory_issues ii ON ii.inventory_item_id = t.id AND COALESCE(ii.is_deleted,false) = false
    `;
  }
  return "";
}

export async function listDomainRecords(
  context: ClinicalContext,
  moduleKey: string,
  query: string,
  status: string
) {
  const config = getDomainConfig(moduleKey);
  if (!config) {
    throw new Error(
      "Unknown normalized healthcare module."
    );
  }

  const search = query
    ? `%${query.toLowerCase()}%`
    : null;

  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT DISTINCT ON (t.${config.idColumn})
      t.${config.idColumn} AS id,
      t.${config.uidColumn} AS record_uid,
      ${config.titleSql} AS title,
      ${config.patientColumn ? `t.${config.patientColumn}` : "NULL"} AS patient_id,
      COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
      p.patient_uid,
      p.uhid,
      t.${config.statusColumn} AS status,
      COALESCE(t.priority, 'NORMAL') AS priority,
      ${config.dataSql} AS data,
      t.updated_at
    FROM ${config.table} t
    ${config.patientColumn ? `LEFT JOIN patients p ON p.id = t.${config.patientColumn}` : "LEFT JOIN patients p ON false"}
    ${joinsFor(moduleKey)}
    WHERE t.tenant_id = $1
      AND t.hospital_id = $2
      AND t.branch_id = $3
      AND COALESCE(t.is_deleted,false) = false
      AND ($4::text IS NULL OR t.${config.statusColumn} = $4::text)
      AND (
        $5::text IS NULL
        OR lower(COALESCE(t.${config.uidColumn}::text,'')) LIKE $5::text
        OR lower((${config.titleSql})::text) LIKE $5::text
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $5::text
        OR lower(COALESCE(p.phone,'')) LIKE $5::text
        OR lower(COALESCE(p.patient_uid,'')) LIKE $5::text
        OR lower(COALESCE(p.uhid,'')) LIKE $5::text
      )
    ORDER BY t.${config.idColumn}, t.${config.dateColumn} DESC NULLS LAST
    LIMIT 300
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    status || null,
    search
  );
}

async function insertRow(
  table: string,
  data: Record<string, unknown>
) {
  const keys = Object.keys(data);
  const placeholders = keys.map(
    (_, index) => `$${index + 1}`
  );
  const values = keys.map((key) => data[key]);
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO ${table} (${keys.join(",")})
      VALUES (${placeholders.join(",")})
      RETURNING *
      `,
      ...values
    );
  return rows[0];
}

async function updateRow(
  table: string,
  id: number,
  context: ClinicalContext,
  data: Record<string, unknown>
) {
  const keys = Object.keys(data);
  const assignments = keys.map(
    (key, index) => `${key} = $${index + 5}`
  );
  const values = keys.map((key) => data[key]);
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE ${table}
      SET ${assignments.join(",")},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,
      id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      ...values
    );
  return rows[0];
}

async function softDelete(
  table: string,
  id: number,
  context: ClinicalContext
) {
  await prisma.$executeRawUnsafe(
    `
    UPDATE ${table}
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null
  );
}

async function clearChildren(
  table: string,
  foreignKey: string,
  id: number,
  context: ClinicalContext
) {
  await prisma.$executeRawUnsafe(
    `
    UPDATE ${table}
    SET is_deleted = true
    WHERE ${foreignKey} = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
}

export async function saveDomainRecord(
  context: ClinicalContext,
  moduleKey: string,
  body: Record<string, unknown>,
  id?: number | null
) {
  const module = getPhase2Module(moduleKey);
  const config = getDomainConfig(moduleKey);
  if (!module || !config) {
    throw new Error(
      "Unknown normalized healthcare module."
    );
  }

  const status =
    text(body.status) || module.defaultStatus;
  const priority =
    text(body.priority) || "NORMAL";
  const common = {
    tenant_id: context.tenantId,
    clinic_id: context.clinicId,
    hospital_id: context.hospitalId,
    branch_id: context.branchId,
    created_by: context.user.id ?? null,
    updated_by: context.user.id ?? null,
  };
  let record: Row | undefined;

  if (moduleKey === "consultations") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      doctor_id: numberOrNull(body.doctor_id),
      consultation_uid:
        text(body.consultation_uid) || uid("CON"),
      status,
      chief_complaint: text(body.chief_complaint),
      symptoms: text(body.symptoms),
      diagnosis_summary: text(body.diagnosis),
      clinical_notes:
        text(body.clinical_notes) || text(body.notes),
      follow_up_date:
        text(body.follow_up_date) || null,
      priority,
    };
    record = id
      ? await updateRow("consultations", id, context, values)
      : await insertRow("consultations", values);
    await clearChildren("consultation_diagnoses", "consultation_id", Number(record.id), context);
    await clearChildren("consultation_prescriptions", "consultation_id", Number(record.id), context);
    await clearChildren("consultation_lab_orders", "consultation_id", Number(record.id), context);
    await clearChildren("consultation_radiology_orders", "consultation_id", Number(record.id), context);
    if (text(body.diagnosis)) {
      await insertRow("consultation_diagnoses", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        consultation_id: record.id,
        diagnosis_text: text(body.diagnosis),
        diagnosis_type: "CLINICAL",
        created_by: context.user.id ?? null,
      });
    }
    if (numberOrNull(body.medicine_id)) {
      await insertRow("consultation_prescriptions", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        consultation_id: record.id,
        medicine_id: numberOrNull(body.medicine_id),
        dose: text(body.dose),
        instructions: text(body.notes),
        created_by: context.user.id ?? null,
      });
    }
    if (numberOrNull(body.lab_test_id)) {
      await insertRow("consultation_lab_orders", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        consultation_id: record.id,
        lab_test_id: numberOrNull(body.lab_test_id),
        order_notes: text(body.notes),
        status: "ORDERED",
        created_by: context.user.id ?? null,
      });
    }
  } else if (moduleKey === "laboratory") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      lab_test_id: numberOrNull(body.lab_test_id),
      order_uid: text(body.order_uid) || uid("LAB"),
      order_type: "LAB",
      priority,
      status,
      sample_number: text(body.sample_number),
      result_value: text(body.result_value),
      critical_value: boolValue(body.critical_value),
      validated_by: text(body.validated_by),
      notes: text(body.notes),
    };
    record = id
      ? await updateRow("lab_orders", id, context, values)
      : await insertRow("lab_orders", values);
    await clearChildren("lab_samples", "lab_order_id", Number(record.id), context);
    await clearChildren("lab_results", "lab_order_id", Number(record.id), context);
    await insertRow("lab_samples", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      lab_order_id: record.id,
      sample_number: text(body.sample_number),
      sample_type: text(body.sample_type),
      collection_time: text(body.collection_time) || null,
      collected_by: context.user.id ?? null,
      status: status === "ORDERED" ? "PENDING" : "COLLECTED",
    });
    if (text(body.result_value)) {
      const result = await insertRow("lab_results", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        lab_order_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        result_uid: uid("LRES"),
        result_status: status,
        result_value: text(body.result_value),
        critical_value: boolValue(body.critical_value),
        entered_by: context.user.id ?? null,
        created_by: context.user.id ?? null,
      });
      await insertRow("lab_result_approvals", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        lab_result_id: result.id,
        approved_by: text(body.validated_by),
        approval_status: status === "APPROVED" ? "APPROVED" : "PENDING",
      });
    }
  } else if (moduleKey === "nursing") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      record_uid: text(body.record_uid) || uid("NUR"),
      temperature: numberValue(body.temperature),
      pulse: numberValue(body.pulse),
      respiratory_rate: numberValue(body.respiratory_rate),
      blood_pressure: text(body.blood_pressure),
      spo2: numberValue(body.spo2),
      weight: numberValue(body.weight),
      height: numberValue(body.height),
      bmi: numberValue(body.bmi),
      status,
      priority,
    };
    record = id
      ? await updateRow("nursing_vitals", id, context, values)
      : await insertRow("nursing_vitals", values);
    await clearChildren("nursing_notes", "vital_id", Number(record.id), context);
    await clearChildren("medication_administration_records", "vital_id", Number(record.id), context);
    await clearChildren("shift_handovers", "vital_id", Number(record.id), context);
    if (text(body.notes)) {
      await insertRow("nursing_notes", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        clinic_id: context.clinicId,
        patient_id: numberOrNull(body.patient_id),
        vital_id: record.id,
        note_text: text(body.notes),
        observation: text(body.notes),
        created_by: context.user.id ?? null,
      });
    }
    if (numberOrNull(body.medicine_id) || text(body.dose)) {
      await insertRow("medication_administration_records", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        vital_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        medicine_id: numberOrNull(body.medicine_id),
        dose: text(body.dose),
        administration_time: text(body.administration_time) || null,
        nurse_name: text(body.nurse_name),
        created_by: context.user.id ?? null,
      });
    }
    if (text(body.handover_to)) {
      await insertRow("shift_handovers", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        vital_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        handover_to: text(body.handover_to),
        notes: text(body.notes),
        created_by: context.user.id ?? null,
      });
    }
  } else if (moduleKey === "radiology") {
    const values = {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      patient_id: numberOrNull(body.patient_id),
      order_uid: text(body.order_uid) || uid("RAD"),
      modality: text(body.modality),
      study_name: text(body.study_name),
      scheduled_date: text(body.scheduled_date) || null,
      technician: text(body.technician),
      findings: text(body.findings),
      impression: text(body.impression),
      approved_by: text(body.approved_by),
      status,
      priority,
      created_by: context.user.id ?? null,
      updated_by: context.user.id ?? null,
    };
    record = id
      ? await updateRow("consultation_radiology_orders", id, context, values)
      : await insertRow("consultation_radiology_orders", values);
  } else if (moduleKey === "bed-management") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      room_id: numberOrNull(body.room_id),
      allocation_uid: text(body.allocation_uid) || uid("BED"),
      building: text(body.building),
      ward: text(body.ward),
      bed_number: text(body.bed_number),
      action: text(body.action),
      status,
      priority,
      notes: text(body.notes),
    };
    record = id
      ? await updateRow("bed_allocations", id, context, values)
      : await insertRow("bed_allocations", values);
  } else if (moduleKey === "ipd") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      doctor_id: numberOrNull(body.doctor_id),
      admission_uid: text(body.admission_uid) || uid("IPD"),
      admission_date: text(body.admission_date) || null,
      admission_reason: text(body.admission_reason),
      status,
      priority,
    };
    record = id
      ? await updateRow("admissions", id, context, values)
      : await insertRow("admissions", values);
    await clearChildren("bed_allocations", "admission_id", Number(record.id), context);
    await clearChildren("nursing_notes", "admission_id", Number(record.id), context);
    await clearChildren("discharges", "admission_id", Number(record.id), context);
    if (numberOrNull(body.room_id)) {
      await insertRow("bed_allocations", {
        tenant_id: context.tenantId,
        clinic_id: context.clinicId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        admission_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        room_id: numberOrNull(body.room_id),
        allocation_uid: uid("BED"),
        bed_number: text(body.room_id),
        status: "OCCUPIED",
        created_by: context.user.id ?? null,
        updated_by: context.user.id ?? null,
      });
    }
    if (text(body.nursing_notes) || text(body.daily_round_notes)) {
      await insertRow("nursing_notes", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        clinic_id: context.clinicId,
        admission_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        note_text: text(body.nursing_notes) || text(body.daily_round_notes),
        observation: text(body.daily_round_notes),
        created_by: context.user.id ?? null,
      });
    }
    if (text(body.discharge_summary)) {
      await insertRow("discharges", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        admission_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        discharge_summary: text(body.discharge_summary),
        status: "DISCHARGE_PLANNED",
        created_by: context.user.id ?? null,
        updated_by: context.user.id ?? null,
      });
    }
  } else if (moduleKey === "ot") {
    const values = {
      ...common,
      schedule_uid: text(body.schedule_uid) || uid("OT"),
      procedure_name: text(body.procedure),
      patient_id: numberOrNull(body.patient_id),
      surgeon_id: numberOrNull(body.surgeon_id),
      assistant_surgeon: text(body.assistant_surgeon),
      anaesthetist: text(body.anaesthetist),
      ot_room_id: numberOrNull(body.ot_room),
      scheduled_date: text(body.procedure_date) || null,
      start_time: text(body.start_time) || null,
      end_time: text(body.end_time) || null,
      status,
      priority,
      notes: text(body.notes),
    };
    record = id
      ? await updateRow("ot_schedules", id, context, values)
      : await insertRow("ot_schedules", values);
    await clearChildren("ot_procedures", "ot_schedule_id", Number(record.id), context);
    await clearChildren("ot_staff_assignments", "ot_schedule_id", Number(record.id), context);
    await insertRow("ot_procedures", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      ot_schedule_id: record.id,
      procedure_name: text(body.procedure),
      procedure_notes: text(body.notes),
      billing_notes: text(body.billing_notes),
      created_by: context.user.id ?? null,
    });
  } else if (moduleKey === "icu") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      admission_uid: text(body.admission_uid) || uid("ICU"),
      status,
      priority,
    };
    record = id
      ? await updateRow("icu_admissions", id, context, values)
      : await insertRow("icu_admissions", values);
    await clearChildren("icu_monitoring", "icu_admission_id", Number(record.id), context);
    await clearChildren("ventilator_tracking", "icu_admission_id", Number(record.id), context);
    await insertRow("icu_monitoring", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      icu_admission_id: record.id,
      pulse: numberValue(body.pulse),
      bp: text(body.bp),
      spo2: numberValue(body.spo2),
      respiratory_rate: numberValue(body.respiratory_rate),
      critical_notes: text(body.critical_notes) || text(body.notes),
      created_by: context.user.id ?? null,
    });
    await insertRow("ventilator_tracking", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      icu_admission_id: record.id,
      ventilator_mode: text(body.ventilator_mode),
      fio2: numberValue(body.fio2),
      peep: numberValue(body.peep),
      created_by: context.user.id ?? null,
    });
  } else if (moduleKey === "ivf") {
    const values = {
      ...common,
      patient_id: numberOrNull(body.patient_id),
      cycle_number: text(body.cycle_number) || uid("IVF"),
      cycle_type: "IVF",
      workflow_stage: text(body.workflow_stage),
      status,
      priority,
      notes: text(body.notes) || text(body.package_billing),
    };
    record = id
      ? await updateRow("ivf_cycles", id, context, values)
      : await insertRow("ivf_cycles", values);
    await clearChildren("ivf_stimulation", "ivf_cycle_id", Number(record.id), context);
    await clearChildren("ivf_embryos", "ivf_cycle_id", Number(record.id), context);
    await clearChildren("ivf_cryostorage", "ivf_cycle_id", Number(record.id), context);
    await insertRow("ivf_stimulation", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      ivf_cycle_id: record.id,
      amh: numberValue(body.amh),
      fsh: numberValue(body.fsh),
      lh: numberValue(body.lh),
      estradiol: numberValue(body.estradiol),
      afc: numberValue(body.afc),
    });
    await insertRow("ivf_embryos", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      clinic_id: context.clinicId,
      ivf_cycle_id: record.id,
      embryo_id: uid("EMB"),
      cycle_id: record.id,
      embryo_grade: text(body.embryo_grade),
      sperm_count: text(body.sperm_count),
      motility: text(body.motility),
      morphology: text(body.morphology),
    });
    await insertRow("ivf_cryostorage", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      ivf_cycle_id: record.id,
      storage_tank: text(body.storage_tank),
      canister: text(body.canister),
      straw_number: text(body.straw_number),
      freeze_date: text(body.freeze_date) || null,
    });
  } else if (moduleKey === "pharmacy") {
    const values = {
      ...common,
      medicine_id: numberOrNull(body.medicine_id),
      stock_uid: text(body.stock_uid) || uid("PHR"),
      quantity: numberValue(body.quantity),
      status,
      priority,
      notes: text(body.notes),
    };
    record = id
      ? await updateRow("pharmacy_stock", id, context, values)
      : await insertRow("pharmacy_stock", values);
    await clearChildren("pharmacy_batches", "stock_id", Number(record.id), context);
    await clearChildren("pharmacy_purchase_orders", "stock_id", Number(record.id), context);
    await clearChildren("pharmacy_dispensing", "stock_id", Number(record.id), context);
    await insertRow("pharmacy_batches", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      clinic_id: context.clinicId,
      stock_id: record.id,
      medicine_id: numberOrNull(body.medicine_id),
      batch_number: text(body.batch_number),
      expiry_date: text(body.expiry_date) || null,
      quantity: numberValue(body.quantity),
      created_by: context.user.id ?? null,
      updated_by: context.user.id ?? null,
    });
    await insertRow("pharmacy_purchase_orders", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      clinic_id: context.clinicId,
      stock_id: record.id,
      po_number: text(body.purchase_order) || uid("PO"),
      purchase_order: text(body.purchase_order),
      goods_receipt: text(body.goods_receipt),
      supplier: text(body.supplier),
      created_by: context.user.id ?? null,
      updated_by: context.user.id ?? null,
    });
    if (numberOrNull(body.patient_id)) {
      await insertRow("pharmacy_dispensing", {
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        stock_id: record.id,
        patient_id: numberOrNull(body.patient_id),
        quantity: numberValue(body.quantity),
        dispense_notes: text(body.dispense_notes),
        return_reason: text(body.return_reason),
        created_by: context.user.id ?? null,
      });
    }
  } else if (moduleKey === "inventory") {
    const values = {
      ...common,
      item_uid: text(body.item_uid) || uid("INV"),
      category: text(body.category),
      item_name: text(body.item_name),
      quantity: numberValue(body.quantity),
      supplier: text(body.supplier),
      status,
      priority,
    };
    record = id
      ? await updateRow("inventory_items", id, context, values)
      : await insertRow("inventory_items", values);
    await clearChildren("inventory_transactions", "inventory_item_id", Number(record.id), context);
    await clearChildren("inventory_issues", "inventory_item_id", Number(record.id), context);
    await insertRow("inventory_transactions", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      inventory_item_id: record.id,
      transaction_type: status,
      quantity: numberValue(body.quantity),
      transaction_date: text(body.purchase_date) || null,
      notes: text(body.notes),
      created_by: context.user.id ?? null,
    });
    await insertRow("inventory_issues", {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      inventory_item_id: record.id,
      issued_to: text(body.issued_to),
      consumption_area: text(body.consumption_area),
      quantity: numberValue(body.quantity),
      created_by: context.user.id ?? null,
    });
  }

  if (!record) {
    throw new Error("Domain record was not saved.");
  }

  await recordClinicalAudit(context, {
    moduleName: moduleKey,
    action: id ? "update" : "create",
    entityType: config.table,
    entityId: Number(record.id),
    summary: `${module.title} saved in normalized table ${config.table}`,
    payload: {
      table: config.table,
      id: record.id,
      status,
      title: titleForRecord(module, body),
    },
  });

  await recordWorkflowSpineEffects(context, {
    moduleKey,
    record,
    body,
  });

  return record;
}

export async function deleteDomainRecord(
  context: ClinicalContext,
  moduleKey: string,
  id: number
) {
  const module = getPhase2Module(moduleKey);
  const config = getDomainConfig(moduleKey);
  if (!module || !config) {
    throw new Error(
      "Unknown normalized healthcare module."
    );
  }

  await softDelete(config.table, id, context);
  await recordClinicalAudit(context, {
    moduleName: moduleKey,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${module.title} deleted from normalized table ${config.table}`,
  });
}
