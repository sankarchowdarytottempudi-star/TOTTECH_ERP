"use client";

import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  Database,
  FileText,
  Plus,
  Search,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  getInteropModuleConfig,
  type InteropModuleConfig,
} from "@/lib/clinical/interoperability-core";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: InteropModuleConfig;
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
  screens?: Row[];
  reports?: Row[];
  endpoints?: Row[];
};

const defaultStatus: Record<string, string> = {
  abha: "ACTIVE",
  "abha-verification": "REQUESTED",
  consents: "REQUESTED",
  hie: "PENDING",
  "fhir-resources": "ACTIVE",
  hl7: "PENDING",
  "hl7-errors": "OPEN",
  "dicom-nodes": "ACTIVE",
  "pacs-studies": "STORED",
  "ayushman-beneficiaries": "ACTIVE",
  "ayushman-packages": "ACTIVE",
  "ayushman-claims": "DRAFT",
  "partner-labs": "ACTIVE",
  "partner-pharmacies": "ACTIVE",
  "referral-network": "ACTIVE",
  marketplace: "ACTIVE",
  terminology: "ACTIVE",
  "terminology-mappings": "ACTIVE",
  mpi: "ACTIVE",
};

export default function ClinicalInteropModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getInteropModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);
  const [patients, setPatients] =
    useState<Row[]>([]);
  const [doctors, setDoctors] =
    useState<Row[]>([]);
  const [abhaProfiles, setAbhaProfiles] =
    useState<Row[]>([]);
  const [consents, setConsents] =
    useState<Row[]>([]);
  const [fhirResources, setFhirResources] =
    useState<Row[]>([]);
  const [ayushmanBeneficiaries, setAyushmanBeneficiaries] =
    useState<Row[]>([]);
  const [ayushmanPackages, setAyushmanPackages] =
    useState<Row[]>([]);
  const [partnerLabs, setPartnerLabs] =
    useState<Row[]>([]);
  const [partnerPharmacies, setPartnerPharmacies] =
    useState<Row[]>([]);
  const [referralHospitals, setReferralHospitals] =
    useState<Row[]>([]);
  const [terminologyCodes, setTerminologyCodes] =
    useState<Row[]>([]);
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [saving, setSaving] =
    useState(false);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const [
      moduleResponse,
      patientsResponse,
      doctorsResponse,
      abhaResponse,
      consentsResponse,
      fhirResponse,
      ayBeneficiaryResponse,
      ayPackageResponse,
      labResponse,
      pharmacyResponse,
      referralResponse,
      terminologyResponse,
    ] = await Promise.all([
      fetch(`/api/clinical/interoperability/${moduleKey}`),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch("/api/clinical/interoperability/abha"),
      fetch("/api/clinical/interoperability/consents"),
      fetch("/api/clinical/interoperability/fhir-resources"),
      fetch("/api/clinical/interoperability/ayushman-beneficiaries"),
      fetch("/api/clinical/interoperability/ayushman-packages"),
      fetch("/api/clinical/interoperability/partner-labs"),
      fetch("/api/clinical/interoperability/partner-pharmacies"),
      fetch("/api/clinical/interoperability/referral-network"),
      fetch("/api/clinical/interoperability/terminology"),
    ]);

    if (moduleResponse.ok) {
      setData(await moduleResponse.json());
    }

    if (patientsResponse.ok) {
      const payload =
        await patientsResponse.json();
      setPatients(payload.patients || []);
    }

    if (doctorsResponse.ok) {
      const payload =
        await doctorsResponse.json();
      setDoctors(payload.doctors || []);
    }

    if (abhaResponse.ok) {
      const payload =
        await abhaResponse.json();
      setAbhaProfiles(payload.rows || []);
    }

    if (consentsResponse.ok) {
      const payload =
        await consentsResponse.json();
      setConsents(payload.rows || []);
    }

    if (fhirResponse.ok) {
      const payload =
        await fhirResponse.json();
      setFhirResources(payload.rows || []);
    }

    if (ayBeneficiaryResponse.ok) {
      const payload =
        await ayBeneficiaryResponse.json();
      setAyushmanBeneficiaries(
        payload.rows || []
      );
    }

    if (ayPackageResponse.ok) {
      const payload =
        await ayPackageResponse.json();
      setAyushmanPackages(
        payload.rows || []
      );
    }

    if (labResponse.ok) {
      const payload =
        await labResponse.json();
      setPartnerLabs(payload.rows || []);
    }

    if (pharmacyResponse.ok) {
      const payload =
        await pharmacyResponse.json();
      setPartnerPharmacies(
        payload.rows || []
      );
    }

    if (referralResponse.ok) {
      const payload =
        await referralResponse.json();
      setReferralHospitals(
        payload.rows || []
      );
    }

    if (terminologyResponse.ok) {
      const payload =
        await terminologyResponse.json();
      setTerminologyCodes(
        payload.rows || []
      );
    }
  }, [config, moduleKey]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [load]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown Interoperability Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the interoperability engine.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const save = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/clinical/interoperability/${moduleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            status:
              form.status ||
              defaultStatus[moduleKey] ||
              "ACTIVE",
            resource_status:
              form.resource_status ||
              defaultStatus[moduleKey],
            processing_status:
              form.processing_status ||
              defaultStatus[moduleKey],
            consent_status:
              form.consent_status ||
              defaultStatus[moduleKey],
            claim_status:
              form.claim_status ||
              defaultStatus[moduleKey],
            verification_status:
              form.verification_status ||
              defaultStatus[moduleKey],
          }),
        }
      );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Failed to save interoperability record"
        );
      }

      notify.success(
        "Interoperability record saved"
      );
      setForm({});
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save interoperability record"
      );
    } finally {
      setSaving(false);
    }
  };

  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Interoperability Module
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Standards, government exchange, consent, external network,
            terminology, MPI, security, and audit records are scoped by
            tenant, hospital, branch, and clinic.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Database}
            title="Records"
            value={metrics.total}
          />
          <Metric
            icon={Activity}
            title="Today"
            value={metrics.today}
          />
          <Metric
            icon={Workflow}
            title="Screens"
            value={data?.screens?.length || 0}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={data?.reports?.length || 0}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                <Plus size={21} />
              </div>
              <h2 className="text-2xl font-black">
                Create Record
              </h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {config.createColumns.map((column) => (
                <DynamicInput
                  key={column}
                  column={column}
                  config={config}
                  value={form[column] || ""}
                  patients={patients}
                  doctors={doctors}
                  abhaProfiles={abhaProfiles}
                  consents={consents}
                  fhirResources={fhirResources}
                  ayushmanBeneficiaries={ayushmanBeneficiaries}
                  ayushmanPackages={ayushmanPackages}
                  partnerLabs={partnerLabs}
                  partnerPharmacies={partnerPharmacies}
                  referralHospitals={referralHospitals}
                  terminologyCodes={terminologyCodes}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      [column]: value,
                    })
                  }
                />
              ))}
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="mt-5 rounded-[8px] bg-[#0B1F3A] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : `Save ${config.label}`}
            </button>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                <Search size={21} />
              </div>
              <h2 className="text-2xl font-black">
                Records
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {(data?.rows || []).map((row) => (
                <ClinicalRecordCard
                  key={String(row.id)}
                  href={`/clinical-services/interoperability/${moduleKey}/${row.id}`}
                  eyebrow={`#${String(row.id)}`}
                  title={recordTitle(row, config)}
                  description={`Interoperability ${config.label} record`}
                  status={String(
                      row.status ||
                        row.resource_status ||
                        row.processing_status ||
                        row.consent_status ||
                        row.claim_status ||
                        row.verification_status ||
                        row.storage_status ||
                        row.resolution_status ||
                        "-"
                    )}
                  patientHref={
                    row.patient_id
                      ? `/clinical-services/patients/${row.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/interoperability/${moduleKey}?record=${row.id}&mode=edit`}
                  auditHref={`/clinical-services/interoperability/${moduleKey}/${row.id}#audit`}
                  historyHref={`/clinical-services/interoperability/${moduleKey}/${row.id}#history`}
                />
              ))}
              {!data?.rows?.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No records created for this interoperability module yet.
                </p>
              ) : null}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel title="Screens">
            <Rows
              rows={data?.screens || []}
              empty="No interoperability screens configured."
              primary={(row) =>
                String(row.screen_name || "-")
              }
              secondary={(row) =>
                String(row.screen_key || "-")
              }
            />
          </Panel>
          <Panel title="API Definitions">
            <Rows
              rows={(data?.endpoints || []).slice(0, 12)}
              empty="No interoperability API definitions configured."
              primary={(row) =>
                `${row.method || "-"} ${row.path || ""}`
              }
              secondary={(row) =>
                String(row.permission_key || "-")
              }
            />
          </Panel>
          <Panel title="Reports">
            <Rows
              rows={data?.reports || []}
              empty="No interoperability reports configured."
              primary={(row) =>
                String(row.report_name || "-")
              }
              secondary={(row) =>
                `${row.report_category || "Interop"} | ${row.report_key || "-"}`
              }
            />
          </Panel>
        </section>
      </div>
    </ClinicalShell>
  );
}

function DynamicInput({
  column,
  config,
  value,
  patients,
  doctors,
  abhaProfiles,
  consents,
  fhirResources,
  ayushmanBeneficiaries,
  ayushmanPackages,
  partnerLabs,
  partnerPharmacies,
  referralHospitals,
  terminologyCodes,
  onChange,
}: {
  column: string;
  config: InteropModuleConfig;
  value: string;
  patients: Row[];
  doctors: Row[];
  abhaProfiles: Row[];
  consents: Row[];
  fhirResources: Row[];
  ayushmanBeneficiaries: Row[];
  ayushmanPackages: Row[];
  partnerLabs: Row[];
  partnerPharmacies: Row[];
  referralHospitals: Row[];
  terminologyCodes: Row[];
  onChange: (value: string) => void;
}) {
  const label = column
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");

  if (
    [
      "patient_id",
      "candidate_patient_id",
    ].includes(column)
  ) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={patients.map((patient) => ({
          value: String(patient.id),
          label: `${patient.patient_uid || patient.uhid || ""} ${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (
    [
      "doctor_id",
      "practitioner_id",
      "approved_by",
    ].includes(column)
  ) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={doctors.map((doctor) => ({
          value: String(doctor.id),
          label: String(doctor.full_name),
        }))}
      />
    );
  }

  if (column === "abha_profile_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={abhaProfiles.map((profile) => ({
          value: String(profile.id),
          label: `${profile.abha_number || ""} ${profile.abha_address || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "consent_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={consents.map((consent) => ({
          value: String(consent.id),
          label: `${consent.consent_id || ""} ${consent.purpose || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "resource_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={fhirResources.map((resource) => ({
          value: String(resource.id),
          label: `${resource.resource_type || ""} ${resource.fhir_id || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "beneficiary_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={ayushmanBeneficiaries.map((beneficiary) => ({
          value: String(beneficiary.id),
          label: `${beneficiary.ayushman_id || ""} ${beneficiary.scheme || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "package_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={ayushmanPackages.map((pkg) => ({
          value: String(pkg.id),
          label: `${pkg.package_code || ""} ${pkg.package_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "partner_lab_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={partnerLabs.map((lab) => ({
          value: String(lab.id),
          label: `${lab.lab_code || ""} ${lab.lab_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "partner_pharmacy_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={partnerPharmacies.map((pharmacy) => ({
          value: String(pharmacy.id),
          label: `${pharmacy.pharmacy_code || ""} ${pharmacy.pharmacy_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "network_hospital_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={referralHospitals.map((hospital) => ({
          value: String(hospital.id),
          label: `${hospital.network_code || ""} ${hospital.hospital_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "national_code_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={terminologyCodes.map((code) => ({
          value: String(code.id),
          label: `${code.code_system || ""} ${code.code_value || ""} ${code.display_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (
    config.booleanColumns?.includes(column)
  ) {
    return (
      <label className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3">
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(event) =>
            onChange(
              event.target.checked
                ? "true"
                : "false"
            )
          }
        />
        <span className="text-xs font-black uppercase text-slate-600">
          {label}
        </span>
      </label>
    );
  }

  const type =
    config.dateColumns?.includes(column)
      ? "date"
      : config.numericColumns?.includes(column)
        ? "number"
        : column.includes("email")
          ? "email"
          : "text";

  if (
    config.textAreaColumns?.includes(column) ||
    config.jsonColumns?.includes(column)
  ) {
    return (
      <label className="block md:col-span-2">
        <span className="text-xs font-black uppercase text-slate-600">
          {label}
        </span>
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={4}
          placeholder={
            config.jsonColumns?.includes(column)
              ? "{} or []"
              : undefined
          }
          className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        type={type}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function recordTitle(
  row: Row,
  config: InteropModuleConfig
) {
  return String(
    row.abha_number ||
      row.abha_address ||
      row.consent_id ||
      row.exchange_number ||
      row.fhir_id ||
      row.resource_type ||
      row.message_control_id ||
      row.ae_title ||
      row.study_instance_uid ||
      row.ayushman_id ||
      row.package_code ||
      row.package_name ||
      row.claim_number ||
      row.lab_code ||
      row.lab_name ||
      row.pharmacy_code ||
      row.pharmacy_name ||
      row.network_code ||
      row.hospital_name ||
      row.consumer_key ||
      row.consumer_name ||
      row.code_value ||
      row.display_name ||
      row.mpi_number ||
      row.event_type ||
      config.label
  );
}

function Metric({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Activity;
  title: string;
  value: unknown;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-4xl font-black">
        {String(value ?? 0)}
      </p>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Rows({
  rows,
  empty,
  primary,
  secondary,
}: {
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${primary(row)}-${index}`}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="break-words font-black">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-600">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}
