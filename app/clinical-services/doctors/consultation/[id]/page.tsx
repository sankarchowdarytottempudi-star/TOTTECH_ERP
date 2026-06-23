"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  History,
  Pill,
  Save,
  ScanLine,
  Stethoscope,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ConsultationPayload = {
  appointment?: Row;
  currentRecord?: Row | null;
  patientSummary?: Row;
  vitals?: Row[];
  masters?: {
    labTests?: Row[];
    medicines?: Row[];
    radiologyStudies?: string[];
  };
  history?: {
    previousConsultations?: Row[];
    previousPrescriptions?: Row[];
    previousDiagnoses?: Row[];
    previousAdmissions?: Row[];
    previousDischarges?: Row[];
    previousLabReports?: Row[];
    previousRadiologyReports?: Row[];
    previousIvfCycles?: Row[];
    previousProcedures?: Row[];
    previousSurgeries?: Row[];
    previousAllergies?: unknown;
    previousChronicDiseases?: unknown;
    documents?: Row[];
    timeline?: Row[];
  };
};

type MedicineRow = {
  medicine_master_id?: string;
  medicine_id?: string;
  name: string;
  strength: string;
  dosage_form: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
};

const asObject = (value: unknown): Row =>
  value && typeof value === "object"
    ? (value as Row)
    : {};

const emptyMedicine: MedicineRow = {
  medicine_master_id: "",
  medicine_id: "",
  name: "",
  strength: "",
  dosage_form: "",
  frequency: "",
  duration: "",
  route: "Oral",
  instructions: "",
};

export default function DoctorConsultationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ConsultationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    chief_complaint: "",
    history: "",
    diagnosis: "",
    clinical_notes: "",
    advice: "",
    follow_up_date: "",
    custom_lab_test: "",
    custom_radiology_study: "",
    medication_scribble: "",
    study_notes_scribble: "",
    doctor_notes_scribble: "",
  });
  const [medications, setMedications] = useState<MedicineRow[]>([
    { ...emptyMedicine },
  ]);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectedRadiology, setSelectedRadiology] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/clinical/doctors/consultations/${params?.id}`
    );

    if (response.ok) {
      const payload = (await response.json()) as ConsultationPayload;
      const record = payload.currentRecord || {};
      const metadata = asObject(record.metadata);
      setData(payload);
      setForm({
        chief_complaint: String(record.chief_complaint || ""),
        history: String(record.history || ""),
        diagnosis: String(record.diagnosis || ""),
        clinical_notes: String(record.clinical_notes || ""),
        advice: String(record.advice || record.treatment_plan || ""),
        follow_up_date: String(record.follow_up_date || "").slice(0, 10),
        custom_lab_test: "",
        custom_radiology_study: "",
        medication_scribble: String(metadata.medication_scribble || ""),
        study_notes_scribble: String(metadata.study_notes_scribble || ""),
        doctor_notes_scribble: String(metadata.doctor_notes_scribble || ""),
      });
    } else {
      notify.error("Consultation was not found");
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const patient = data?.patientSummary || {};
  const appointment = data?.appointment || {};
  const history = data?.history || {};
  const latestVitals = data?.vitals?.[0] || {};
  const labTests = (data?.masters?.labTests || []).map((test) =>
    String(test.lab_test_name || "")
  ).filter(Boolean);
  const medicinesMaster = data?.masters?.medicines || [];
  const radiologyStudies = data?.masters?.radiologyStudies || [
    "X-Ray",
    "2D Echo",
    "3D Echo",
    "Ultrasound",
    "CT Scan",
    "MRI",
    "Doppler",
    "Custom",
  ];
  const patientHref = patient.patient_id
    ? `/clinical-services/patients/${patient.patient_id}`
    : "/clinical-services/patients";
  const currentLabReports = (history.previousLabReports || []).filter(
    (row) =>
      Number(row.appointment_id) === Number(params?.id) &&
      (
        row.result_id ||
        row.result_uid ||
        ["RELEASED", "RESULT_RELEASED", "APPROVED"].includes(
          String(row.result_status || row.status || row.order_status || "")
        )
      )
  );

  const labResultFields = (row: Row) => {
    const resultData = row.result_data && typeof row.result_data === "object"
      ? row.result_data as Row
      : {};
    const resultValue = String(
      row.result_value ||
        resultData.value ||
        resultData.result_value ||
        ""
    ).trim();
    const interpretation = String(row.interpretation || resultData.remarks || "").trim();
    const status = String(row.result_status || row.status || row.order_status || "").trim();
    return {
      name: String(row.lab_test_name || row.order_type || resultData.test_name || row.result_uid || "Lab result"),
      value: resultValue,
      unit: String(row.result_unit || resultData.unit || "").trim(),
      referenceRange: String(row.reference_range || resultData.reference_range || "").trim(),
      critical: Boolean(row.critical_value || resultData.critical_value),
      interpretation,
      status,
      releasedBy: String(row.released_by_name || row.validated_by_name || "").trim(),
      releasedAt: String(row.released_at || row.validated_at || row.updated_at || "").trim(),
    };
  };

  const labResultSummary = (row: Row) => {
    const result = labResultFields(row);
    return [
      result.name,
      result.value ? `${result.value}${result.unit ? ` ${result.unit}` : ""}` : "",
      result.referenceRange ? `Ref: ${result.referenceRange}` : "",
      result.critical ? "CRITICAL" : "",
      result.status ? `Status: ${result.status}` : "",
    ].filter(Boolean).join(" | ");
  };

  const selectedLabOrders = useMemo(() => {
    const custom = form.custom_lab_test.trim();
    return [
      ...selectedLabs.map((name) => ({ name })),
      ...(custom ? [{ name: custom, notes: "Custom test" }] : []),
    ];
  }, [form.custom_lab_test, selectedLabs]);

  const selectedRadiologyOrders = useMemo(() => {
    const custom = form.custom_radiology_study.trim();
    return [
      ...selectedRadiology.map((name) => ({ name })),
      ...(custom ? [{ name: custom, notes: "Custom study" }] : []),
    ];
  }, [form.custom_radiology_study, selectedRadiology]);

  const startConsultation = async () => {
    const response = await fetch("/api/clinical/doctors/consultations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment_id: params?.id,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      notify.error(payload.error || "Failed to start consultation");
      return;
    }

    notify.success("Consultation started");
    await load();
  };

  const saveConsultation = async (complete = false) => {
    setSaving(true);

    try {
      const cleanMedications = medications.filter(
        (medicine) =>
          medicine.name.trim() ||
          medicine.strength.trim() ||
          medicine.frequency.trim()
      );
      const response = await fetch(
        `/api/clinical/doctors/consultations/${params?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            medications: cleanMedications,
            lab_orders: selectedLabOrders,
            radiology_orders: selectedRadiologyOrders,
            complete,
          }),
        }
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save consultation");
      }

      notify.success(
        complete ? "Consultation completed" : "Consultation saved"
      );
      await load();

      if (complete) {
        router.push("/clinical-services/doctors/completed");
      }
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to save consultation"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleLab = (name: string) => {
    setSelectedLabs((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  const toggleRadiology = (name: string) => {
    setSelectedRadiology((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/clinical-services/doctors/queue"
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#04142E] shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
          >
            <ArrowLeft size={16} />
            Back to Queue
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startConsultation}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-4 py-2 text-sm font-black text-[#735300]"
            >
              <Stethoscope size={16} />
              Start Consultation
            </button>
            <button
              type="button"
              onClick={() => saveConsultation(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-2 text-sm font-black text-white disabled:opacity-50"
            >
              <Save size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={() => saveConsultation(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#D4AF37] px-4 py-2 text-sm font-black text-[#04142E] disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Finish Consultation
            </button>
          </div>
        </div>

        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Doctor Consultation Workspace
          </p>
          <h1 className="mt-2 break-words text-4xl font-black">
            {loading ? "Loading consultation..." : String(patient.patient_name || "Patient")}
          </h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            Appointment {String(appointment.appointment_uid || params?.id)} |
            Token {String(appointment.token_number || "-")} | Status{" "}
            {String(appointment.status || "-")} | Queue{" "}
            {String(appointment.queue_status || "-")}
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.45fr_0.9fr]">
          <aside className="space-y-4">
            <Panel title="Patient Summary" icon={UserRound}>
              <Summary label="Name" value={patient.patient_name} />
              <Summary label="MRN / UHID" value={patient.mrn} />
              <Summary label="Age / Gender" value={`${patient.age || "-"} / ${patient.gender || "-"}`} />
              <Summary label="Mobile" value={patient.mobile} />
              <Summary label="Blood Group" value={patient.blood_group} />
              <Summary label="Allergies" value={patient.allergies} danger />
              <Summary label="Insurance" value={patient.insurance} />
              <Summary label="Current Visit" value={patient.current_visit} />
              <Summary label="Last Visit" value={patient.last_visit} />
              <Summary label="Primary Doctor" value={patient.primary_doctor} />
              <Link
                href={patientHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white"
              >
                <HeartPulse size={16} />
                Open Patient 360
              </Link>
            </Panel>
          </aside>

          <main className="space-y-4">
            <Panel title="Clinical Notes" icon={ClipboardList}>
              <div className="grid gap-3 md:grid-cols-4">
                <Summary label="BP" value={latestVitals.blood_pressure} />
                <Summary label="Pulse" value={latestVitals.pulse} />
                <Summary label="SpO2" value={latestVitals.spo2} />
                <Summary label="BMI" value={latestVitals.bmi} />
              </div>
              <Textarea
                label="Chief Complaint"
                value={form.chief_complaint}
                onChange={(value) =>
                  setForm({ ...form, chief_complaint: value })
                }
              />
              <Textarea
                label="History"
                value={form.history}
                onChange={(value) => setForm({ ...form, history: value })}
              />
              <Textarea
                label="Diagnosis"
                value={form.diagnosis}
                onChange={(value) => setForm({ ...form, diagnosis: value })}
              />
              <Textarea
                label="Clinical Notes"
                value={form.clinical_notes}
                onChange={(value) =>
                  setForm({ ...form, clinical_notes: value })
                }
              />
              <Textarea
                label="Advice"
                value={form.advice}
                onChange={(value) => setForm({ ...form, advice: value })}
              />
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">
                  Follow Up Date
                </span>
                <input
                  type="date"
                  value={form.follow_up_date}
                  onChange={(event) =>
                    setForm({ ...form, follow_up_date: event.target.value })
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                />
              </label>
            </Panel>

            <Panel title="Prescription" icon={Pill}>
              <div className="space-y-3">
                {medications.map((medicine, index) => (
                  <div
                    key={index}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <MedicineInput
                        label="Medicine Search"
                        value={medicine.name}
                        medicines={medicinesMaster}
                        onChange={(value, selected) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    medicine_master_id: selected ? String(selected.id || "") : item.medicine_master_id || "",
                                    medicine_id: selected ? String(selected.id || "") : item.medicine_id || "",
                                    name: value,
                                    strength: String(selected?.strength || item.strength || ""),
                                    dosage_form: String(selected?.form || selected?.medicine_type || item.dosage_form || ""),
                                  }
                                : item
                            )
                          )
                        }
                      />
                      <TextInput
                        label="Strength"
                        value={medicine.strength}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, strength: value } : item
                            )
                          )
                        }
                      />
                      <TextInput
                        label="Dosage Form"
                        value={medicine.dosage_form}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, dosage_form: value } : item
                            )
                          )
                        }
                      />
                      <FrequencySelect
                        value={medicine.frequency}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, frequency: value } : item
                            )
                          )
                        }
                      />
                      <TextInput
                        label="Duration Days"
                        value={medicine.duration}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, duration: value } : item
                            )
                          )
                        }
                      />
                      <TextInput
                        label="Quantity"
                        value={medicine.route}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, route: value } : item
                            )
                          )
                        }
                      />
                      <TextInput
                        label="Instructions"
                        value={medicine.instructions}
                        onChange={(value) =>
                          setMedications((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, instructions: value } : item
                            )
                          )
                        }
                      />
                    </div>
                    {medications.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMedications((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="mt-3 rounded-[8px] border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700"
                      >
                        Remove Medicine
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setMedications((current) => [...current, { ...emptyMedicine }])
                }
                className="mt-3 rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-4 py-2 text-sm font-black text-[#735300]"
              >
                Add Medicine
              </button>
            </Panel>

            <Panel title="Lab Orders" icon={FlaskConical}>
              {!labTests.length ? (
                <p className="rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
                  No active Lab Master records found. Admin can add tests under Clinical Operations Admin.
                </p>
              ) : null}
              <ChipGrid
                items={labTests}
                selected={selectedLabs}
                onToggle={toggleLab}
              />
              <TextInput
                label="Custom Test"
                value={form.custom_lab_test}
                onChange={(value) =>
                  setForm({ ...form, custom_lab_test: value })
                }
              />
            </Panel>

            <Panel title="Doctor Scribble Pad" icon={ClipboardList}>
              <div className="grid gap-4 lg:grid-cols-3">
                <ScribblePad
                  label="Medication Scribble"
                  value={form.medication_scribble}
                  onChange={(value) =>
                    setForm({ ...form, medication_scribble: value })
                  }
                />
                <ScribblePad
                  label="Study Notes Scribble"
                  value={form.study_notes_scribble}
                  onChange={(value) =>
                    setForm({ ...form, study_notes_scribble: value })
                  }
                />
                <ScribblePad
                  label="Doctor Notes Scribble"
                  value={form.doctor_notes_scribble}
                  onChange={(value) =>
                    setForm({ ...form, doctor_notes_scribble: value })
                  }
                />
              </div>
            </Panel>

            <Panel title="Radiology Orders" icon={ScanLine}>
              <ChipGrid
                items={radiologyStudies}
                selected={selectedRadiology}
                onToggle={toggleRadiology}
              />
              <TextInput
                label="Custom Study"
                value={form.custom_radiology_study}
                onChange={(value) =>
                  setForm({ ...form, custom_radiology_study: value })
                }
              />
            </Panel>

            <Panel title="Current Lab Results" icon={FlaskConical}>
              <LabResultRows
                title="Released reports sent back from Lab"
                rows={currentLabReports}
                resultFields={labResultFields}
              />
            </Panel>
          </main>

          <aside className="space-y-4">
            <Panel title="Clinical History" icon={History}>
              <HistoryRows
                title="Previous Consultations"
                rows={history.previousConsultations || []}
                primary={(row) => String(row.diagnosis || row.chief_complaint || "Consultation")}
              />
              <HistoryRows
                title="Prescriptions"
                rows={history.previousPrescriptions || []}
                primary={(row) => String(row.prescription_uid || "Prescription")}
              />
              <HistoryRows
                title="Diagnoses"
                rows={history.previousDiagnoses || []}
                primary={(row) => String(row.diagnosis || "Diagnosis")}
              />
              <HistoryRows
                title="Admissions / Discharges"
                rows={[
                  ...(history.previousAdmissions || []),
                  ...(history.previousDischarges || []),
                ]}
                primary={(row) =>
                  String(row.admission_number || row.discharge_number || "IP record")
                }
              />
              <LabResultRows
                title="Lab Reports"
                rows={history.previousLabReports || []}
                resultFields={labResultFields}
              />
              <HistoryRows
                title="Radiology"
                rows={history.previousRadiologyReports || []}
                primary={(row) => String(row.study_type || row.report_number || row.file_name || "Radiology record")}
              />
              <HistoryRows
                title="IVF / Procedures"
                rows={[
                  ...(history.previousIvfCycles || []),
                  ...(history.previousProcedures || []),
                ]}
                primary={(row) =>
                  String(row.couple_number || row.cycle_number || row.procedure_name || "Record")
                }
              />
              <Summary label="Allergies" value={history.previousAllergies} danger />
              <Summary
                label="Chronic Diseases"
                value={history.previousChronicDiseases}
              />
            </Panel>

            <Panel title="Timeline" icon={Activity}>
              <HistoryRows
                title="Patient Timeline"
                rows={history.timeline || []}
                primary={(row) =>
                  String(row.event_title || row.event_type || "Timeline event")
                }
              />
            </Panel>
          </aside>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="group rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <summary className="mb-4 flex cursor-pointer list-none items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <Icon size={18} />
        </div>
        <h2 className="break-words text-xl font-black text-[#04142E]">
          {title}
        </h2>
        <span className="ml-auto rounded-[8px] border border-slate-200 px-3 py-1 text-xs font-black text-slate-500 group-open:hidden">
          Open
        </span>
        <span className="ml-auto hidden rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-3 py-1 text-xs font-black text-[#8a6500] group-open:inline-flex">
          Collapse
        </span>
      </summary>
      <div className="space-y-3">{children}</div>
    </details>
  );
}

function Summary({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: unknown;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[8px] border p-3 ${
        danger
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.06em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-[#04142E]">
        {value ? String(value) : "-"}
      </p>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-24 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold leading-6 outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}

function ScribblePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const snapshot = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL("image/png") : "";
  };

  const loadImage = (dataUrl: string) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !dataUrl) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = dataUrl;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.4;
    context.strokeStyle = "#04142E";
    if (value) {
      loadImage(value);
    }
  }, [value]);

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setHistory((current) => [...current, snapshot()].slice(-20));
    setRedoStack([]);
    drawingRef.current = true;
    lastPoint.current = getPoint(event);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastPoint.current) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint.current = point;
  };

  const stop = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPoint.current = null;
    onChange(snapshot());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    setHistory((current) => [...current, snapshot()].slice(-20));
    setRedoStack([]);
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  const undo = () => {
    const previous = history.at(-1);
    if (previous === undefined) return;
    setRedoStack((current) => [snapshot(), ...current].slice(0, 20));
    setHistory((current) => current.slice(0, -1));
    if (previous) {
      loadImage(previous);
      onChange(previous);
    } else {
      clear();
    }
  };

  const redo = () => {
    const next = redoStack[0];
    if (!next) return;
    setHistory((current) => [...current, snapshot()].slice(-20));
    setRedoStack((current) => current.slice(1));
    loadImage(next);
    onChange(next);
  };

  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-600">
        {label}
      </p>
      <div className="mt-2 max-h-80 overflow-auto rounded-[8px] border border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          width={520}
          height={220}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerCancel={stop}
          className="block h-56 w-full touch-none bg-white"
          aria-label={label}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={undo} className="rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black">
          Undo
        </button>
        <button type="button" onClick={redo} className="rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black">
          Redo
        </button>
        <button type="button" onClick={clear} className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700">
          Clear
        </button>
      </div>
    </div>
  );
}

function MedicineInput({
  label,
  value,
  medicines,
  onChange,
}: {
  label: string;
  value: string;
  medicines: Row[];
  onChange: (value: string, selected?: Row) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  useEffect(() => setQuery(value), [value]);
  const normalized = query.trim().toLowerCase();
  const suggestions =
    normalized.length >= 3
      ? medicines
          .filter((medicine) =>
            [
              medicine.medicine_name,
              medicine.generic_name,
              medicine.brand_name,
              medicine.strength,
              medicine.medicine_type,
              medicine.form,
              medicine.medicine_code,
              `${medicine.generic_name || ""} ${medicine.strength || ""}`,
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalized)
          )
          .slice(0, 12)
      : [];

  const selectMedicine = (medicine: Row) => {
    const name = String(medicine.medicine_name || "");
    setQuery(name);
    setOpen(false);
    onChange(name, medicine);
  };

  return (
    <label className="relative block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(next.trim().length >= 3);
          onChange(next);
        }}
        onFocus={() => setOpen(query.trim().length >= 3)}
        placeholder="Type 3 letters: name, generic, brand, strength..."
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
      />
      {open && suggestions.length ? (
        <div className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-[8px] border border-[#D4AF37]/50 bg-white shadow-xl">
          {suggestions.map((medicine) => (
            <button
              key={String(medicine.id)}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectMedicine(medicine)}
              className="block w-full border-b border-slate-100 px-3 py-3 text-left transition hover:bg-[#fff9e8]"
            >
              <p className="text-sm font-black text-[#04142E]">
                {String(medicine.medicine_name || "Medicine")}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-600">
                {String(medicine.generic_name || "-")} | {String(medicine.brand_name || "-")}
              </p>
              <p className="mt-1 text-xs font-black text-[#8a6500]">
                Strength: {String(medicine.strength || "-")} | Form: {String(medicine.form || medicine.medicine_type || "-")} | Stock: {String(medicine.stock_quantity || medicine.available_quantity || 0)}
              </p>
            </button>
          ))}
        </div>
      ) : null}
      {open && normalized.length >= 3 && !suggestions.length ? (
        <p className="absolute z-30 mt-2 w-full rounded-[8px] border border-dashed border-slate-300 bg-white p-3 text-xs font-bold text-slate-600 shadow-lg">
          No Pharmacy Master medicine found.
        </p>
      ) : null}
    </label>
  );
}

function FrequencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const options = [
    "Before Breakfast",
    "After Breakfast",
    "Before Lunch",
    "After Lunch",
    "Evening",
    "Before Dinner",
    "After Dinner",
  ];
  const selected = value
    ? value.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  return (
    <div>
      <p className="text-xs font-black uppercase text-slate-600">
        Frequency
      </p>
      <div className="mt-2 grid gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                const next = active
                  ? selected.filter((item) => item !== option)
                  : [...selected, option];
                onChange(next.join(", "));
              }}
              className={`rounded-[8px] border px-3 py-2 text-left text-xs font-black transition ${
                active
                  ? "border-[#D4AF37] bg-[#04142E] text-white"
                  : "border-slate-200 bg-slate-50 text-[#04142E] hover:border-[#D4AF37]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipGrid({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`rounded-[8px] border px-3 py-2 text-left text-sm font-black transition ${
              active
                ? "border-[#D4AF37] bg-[#04142E] text-white"
                : "border-slate-200 bg-slate-50 text-[#04142E] hover:border-[#D4AF37]"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function LabResultRows({
  title,
  rows,
  resultFields,
}: {
  title: string;
  rows: Row[];
  resultFields: (row: Row) => {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    critical: boolean;
    interpretation: string;
    status: string;
    releasedBy: string;
    releasedAt: string;
  };
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-[#8a6500]">
        {title}
      </p>
      {rows.length ? (
        <div className="space-y-2">
          {rows.slice(0, 5).map((row, index) => {
            const result = resultFields(row);
            return (
              <div
                key={`${title}-${index}`}
                className={`rounded-[8px] border p-3 ${
                  result.critical
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="break-words text-sm font-black text-[#04142E]">
                      {result.name}
                    </p>
                    <p className="mt-1 break-words text-lg font-black text-[#04142E]">
                      {result.value || "-"}
                      {result.unit ? (
                        <span className="ml-1 text-xs font-black uppercase text-slate-500">
                          {result.unit}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#D4AF37]/60 bg-[#fff7df] px-2 py-1 text-[11px] font-black uppercase text-[#8a6500]">
                    {result.critical ? "Critical" : result.status || "Released"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <p className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700">
                    Reference: {result.referenceRange || "-"}
                  </p>
                  <p className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700">
                    Released: {result.releasedAt || "-"}
                  </p>
                  <p className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700">
                    Released By: {result.releasedBy || "-"}
                  </p>
                  <p className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700">
                    Notes: {result.interpretation || "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-500">
          No released lab results yet.
        </p>
      )}
    </div>
  );
}

function HistoryRows({
  title,
  rows,
  primary,
}: {
  title: string;
  rows: Row[];
  primary: (row: Row) => string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-[#8a6500]">
        {title}
      </p>
      {rows.length ? (
        <div className="space-y-2">
          {rows.slice(0, 5).map((row, index) => (
            <div
              key={`${title}-${index}`}
              className="rounded-[8px] border border-slate-200 bg-slate-50 p-3"
            >
              <p className="break-words text-sm font-black text-[#04142E]">
                {primary(row)}
              </p>
              <p className="mt-1 break-words text-xs font-bold text-slate-600">
                {String(row.status || row.order_status || row.created_at || row.updated_at || "-")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-500">
          No records yet.
        </p>
      )}
    </div>
  );
}
