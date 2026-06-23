"use client";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  Database,
  Plus,
  Search,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import {
  getIvfModuleConfig,
  type IvfModuleConfig,
} from "@/lib/clinical/ivf-core";
import {
  getIvfStatusModule,
  isControlledStatusField,
  statusOptionsToSelect,
  type ClinicalStatusOption,
} from "@/lib/clinical/status-master";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: IvfModuleConfig;
  metrics?: Record<string, string | number | null>;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
  };
  rows?: Row[];
  screens?: Row[];
  reports?: Row[];
  endpoints?: Row[];
};

async function readApiPayload(response: Response) {
  const text = await response.text();

  if (!text) {
    return {} as Row;
  }

  try {
    return JSON.parse(text) as Row;
  } catch {
    return {
      error: text,
    } as Row;
  }
}

const defaultStatus: Record<string, string> = {
  couples: "NEW",
  "female-assessment": "PENDING",
  "male-assessment": "PENDING",
  "treatment-plans": "PLANNED",
  cycles: "ACTIVE",
  stimulation: "STARTED",
  retrievals: "COMPLETED",
  embryology: "FERTILIZED",
  embryos: "FERTILIZED",
  cryo: "STORED",
  transfers: "COMPLETED",
  pregnancies: "POSITIVE_BETA_HCG",
  donors: "ACTIVE",
  surrogacy: "ACTIVE",
  billing: "DRAFT",
  referrals: "ACTIVE",
};

export default function ClinicalIvfModulePage() {
  const params =
    useParams<{ module: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleKey = params?.module || "";
  const editRecordId = searchParams?.get("record") || "";
  const config = useMemo(
    () => getIvfModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);
  const [patients, setPatients] =
    useState<Row[]>([]);
  const [doctors, setDoctors] =
    useState<Row[]>([]);
  const [departments, setDepartments] =
    useState<Row[]>([]);
  const [couples, setCouples] =
    useState<Row[]>([]);
  const [cycles, setCycles] =
    useState<Row[]>([]);
  const [statusOptions, setStatusOptions] =
    useState<ClinicalStatusOption[]>([]);
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [recordSearch, setRecordSearch] =
    useState("");
  const [page, setPage] =
    useState(1);
  const [attachments, setAttachments] =
    useState<
      {
        name: string;
        type: string;
        size: number;
        dataUrl: string;
      }[]
    >([]);
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
      couplesResponse,
      cyclesResponse,
      statusResponse,
    ] = await Promise.all([
      fetch(
        `/api/clinical/ivf/${moduleKey}?limit=10&page=${page}&q=${encodeURIComponent(recordSearch.length >= 2 ? recordSearch : "")}`
      ),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch("/api/clinical/ivf/couples"),
      fetch("/api/clinical/ivf/cycles"),
      fetch(
        `/api/clinical/status-master?module=${encodeURIComponent(getIvfStatusModule(moduleKey))}`
      ),
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
      setDepartments(
        payload.departments || []
      );
    }

    if (couplesResponse.ok) {
      const payload =
        await couplesResponse.json();
      setCouples(payload.rows || []);
    }

    if (cyclesResponse.ok) {
      const payload =
        await cyclesResponse.json();
      setCycles(payload.rows || []);
    }

    if (statusResponse.ok) {
      const payload =
        await statusResponse.json();
      setStatusOptions(payload.statuses || []);
    }
  }, [config, moduleKey, page, recordSearch]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!editRecordId || !data?.rows?.length) {
      return;
    }

    const record = data.rows.find(
      (row) => String(row.id) === editRecordId
    );
    if (!record) {
      return;
    }

    const next: Record<string, string> = {
      id: String(record.id || ""),
    };
    config?.createColumns.forEach((column) => {
      const value = record[column];
      next[column] =
        value === null || value === undefined
          ? ""
          : String(value).slice(0, column.includes("date") ? 10 : undefined);
    });
    setForm(next);
  }, [config, data?.rows, editRecordId]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown IVF Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the IVF engine.
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
        `/api/clinical/ivf/${moduleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            attachments,
            status:
              form.status ||
              defaultStatus[moduleKey] ||
              "ACTIVE",
            current_status:
              form.current_status ||
              defaultStatus[moduleKey],
            availability_status:
              form.availability_status ||
              defaultStatus[moduleKey],
            approval_status:
              form.approval_status ||
              defaultStatus[moduleKey],
          }),
        }
      );
      const payload =
        await readApiPayload(response);

      if (!response.ok) {
        throw new Error(
          String(payload.error || "") ||
            "Failed to save IVF record"
        );
      }

      notify.success(
        moduleKey === "cycles"
          ? "IVF Cycle Saved Successfully"
          : `${config.label} Saved Successfully`
      );
      setForm({});
      setAttachments([]);
      if (editRecordId) {
        router.push(
          `/clinical-services/ivf/${moduleKey}`
        );
      }
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save IVF record"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!form.id) {
      notify.error("Select a record before deleting.");
      return;
    }

    const confirmed = window.confirm(
      `Delete this ${config.label} record?`
    );
    if (!confirmed) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `/api/clinical/ivf/${moduleKey}?id=${encodeURIComponent(form.id)}`,
        {
          method: "DELETE",
        }
      );
      const payload =
        await readApiPayload(response);

      if (!response.ok) {
        throw new Error(
          String(payload.error || "") ||
            "Failed to delete IVF record"
        );
      }

      notify.success(`${config.label} Deleted Successfully`);
      setForm({});
      setAttachments([]);
      router.push(
        `/clinical-services/ivf/${moduleKey}`
      );
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to delete IVF record"
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm({});
    setAttachments([]);
    if (editRecordId) {
      router.push(
        `/clinical-services/ivf/${moduleKey}`
      );
    }
  };

  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            IVF Module
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-200">
            Couple-centric IVF records, cycle status, notes, audit, and IVF
            timeline are scoped by tenant, hospital, branch, and clinic.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Database}
            title="Records"
            value={metrics.total}
            drillDownUrl={`/clinical-services/ivf/${moduleKey}`}
            caption="Open IVF records"
          />
          <DashboardCard
            icon={Activity}
            title="Today"
            value={metrics.today}
            drillDownUrl={`/clinical-services/ivf/${moduleKey}?date=today`}
            caption="Today's IVF activity"
          />
          <DashboardCard
            icon={Workflow}
            title="Active Cycles"
            value={cycles.length}
            drillDownUrl="/clinical-services/ivf/cycles?status=ACTIVE"
            caption="Cycle analytics"
          />
          <DashboardCard
            icon={Database}
            title="Couples"
            value={couples.length}
            drillDownUrl="/clinical-services/ivf/couples"
            caption="Couple records"
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "Couple Management",
              href: "/clinical-services/ivf/couples",
              icon: Plus,
            },
            {
              label: "Create IVF Cycle",
              href: "/clinical-services/ivf/cycles",
              icon: Workflow,
            },
            {
              label: "Embryology",
              href: "/clinical-services/ivf/embryology",
              icon: Database,
            },
            {
              label: "IVF Dashboard",
              href: "/clinical-services/ivf/dashboard",
              icon: Activity,
            },
          ]}
        />

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <Plus size={21} />
              </div>
              <h2 className="text-2xl font-black">
                {form.id ? "Edit Record" : "Create Record"}
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
                  departments={departments}
                  couples={couples}
                  cycles={cycles}
                  statusOptions={statusOptions}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      [column]: value,
                    })
                  }
                />
              ))}
            </div>
            {moduleKey === "embryology" ? (
              <AttachmentInput
                attachments={attachments}
                onChange={setAttachments}
              />
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-[#04142E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : form.id
                    ? `Update ${config.label}`
                    : `Save ${config.label}`}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="rounded-[8px] border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <a
                href="/clinical-services/ivf"
                className="rounded-[8px] border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                Close
              </a>
              {form.id ? (
                <button
                  type="button"
                  onClick={deleteRecord}
                  disabled={saving}
                  className="rounded-[8px] border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
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
                  href={recordHref(
                  row,
                  config.key
                  )}
                  eyebrow={recordEyebrow(row, config, patients, couples, cycles, doctors)}
                  title={recordTitle(row, config, patients, couples, cycles)}
                  description={recordDescription(row, config, patients, couples, cycles, doctors)}
                  status={String(
                      row.status ||
                        row.current_status ||
                        row.availability_status ||
                        row.approval_status ||
                        "-"
                    )}
                  metadata={[
                    `Module ${config.label}`,
                    `Couple ${String(row.couple_id || row.id || "-")}`,
                  ]}
                  patientHref={
                    row.patient_id
                      ? `/clinical-services/patients/${row.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/ivf/${config.key}?record=${row.id}&mode=edit`}
                  auditHref={`${recordHref(row, config.key)}#audit`}
                  historyHref={`${recordHref(row, config.key)}#history`}
                  attachmentsHref={`${recordHref(row, config.key)}#attachments`}
                />
              ))}
              {!data?.rows?.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No records created for this IVF module yet.
                </p>
              ) : null}
            </div>
            <RecordSearchAndPagination
              query={recordSearch}
              onQueryChange={(value) => {
                setRecordSearch(value);
                setPage(1);
              }}
              page={page}
              totalCount={Number(data?.pagination?.totalCount || 0)}
              onPrevious={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => current + 1)}
            />
          </article>
        </section>

      </div>
    </ClinicalShell>
  );
}

function recordHref(
  row: Row,
  moduleKey: string
) {
  if (moduleKey === "couples") {
    return `/clinical-services/ivf/couples/${row.id}`;
  }

  return `/clinical-services/ivf/${moduleKey}/${row.id}`;
}

function DynamicInput({
  column,
  config,
  value,
  patients,
  doctors,
  departments,
  couples,
  cycles,
  statusOptions,
  onChange,
}: {
  column: string;
  config: IvfModuleConfig;
  value: string;
  patients: Row[];
  doctors: Row[];
  departments: Row[];
  couples: Row[];
  cycles: Row[];
  statusOptions: ClinicalStatusOption[];
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

  if (column === "couple_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={couples.map((couple) => ({
          value: String(couple.id),
          label: `${couple.couple_number || ""} ${couple.female_name || ""} / ${couple.male_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "cycle_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={cycles.map((cycle) => ({
          value: String(cycle.id),
          label: `${cycle.cycle_number || ""} ${cycle.cycle_type || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "embryo_id" || column === "embryo_record_id") {
    return (
      <EmbryoAutocomplete
        label={label}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (
    [
      "patient_id",
      "female_patient_id",
      "male_patient_id",
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
      "embryologist_id",
      "anesthetist_id",
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

  if (column === "department_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={departments.map((department) => ({
          value: String(department.id),
          label: String(department.department_name),
        }))}
      />
    );
  }

  if (isControlledStatusField(column)) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={statusOptionsToSelect(statusOptions, value)}
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
      : column.includes("time")
        ? "time"
        : config.numericColumns?.includes(column)
          ? "number"
          : "text";

  if (
    config.textAreaColumns?.includes(column)
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
          className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
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
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
    </label>
  );
}

function EmbryoAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2 || !open) {
      setRows([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const response = await fetch(
        `/api/clinical/ivf/embryos?search=${encodeURIComponent(normalized)}`,
        { signal: controller.signal }
      ).catch(() => null);
      if (response?.ok) {
        const payload = await response.json();
        setRows((payload.rows || []).slice(0, 12));
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  return (
    <label className="relative block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          onChange(next);
        }}
        placeholder="Search embryo id, patient, cycle or grade..."
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
      {open && rows.length ? (
        <div className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-[8px] border border-[#D4AF37]/50 bg-white shadow-xl">
          {rows.map((row) => (
            <button
              key={String(row.id)}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                const selected = String(row.id || row.embryo_id || "");
                setQuery(String(row.embryo_id || selected));
                onChange(selected);
                setOpen(false);
              }}
              className="block w-full border-b border-slate-100 px-3 py-3 text-left transition hover:bg-[#fff9e8]"
            >
              <p className="text-sm font-black text-[#04142E]">
                {String(row.embryo_id || `Embryo #${row.id}`)}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-600">
                Cycle {String(row.cycle_id || row.ivf_cycle_id || "-")} | Grade {String(row.embryo_grade || row.day5_grade || row.day3_grade || "-")}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </label>
  );
}

function AttachmentInput({
  attachments,
  onChange,
}: {
  attachments: {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  }[];
  onChange: (
    value: {
      name: string;
      type: string;
      size: number;
      dataUrl: string;
    }[]
  ) => void;
}) {
  const readFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const next = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<{
            name: string;
            type: string;
            size: number;
            dataUrl: string;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: file.name,
                type: file.type || "application/octet-stream",
                size: file.size,
                dataUrl: String(reader.result || ""),
              });
            reader.onerror = () =>
              reject(new Error(`Unable to read ${file.name}`));
            reader.readAsDataURL(file);
          })
      )
    );

    onChange([...attachments, ...next]);
  };

  return (
    <div className="mt-5 rounded-[8px] border border-dashed border-[#D4AF37]/60 bg-[#fff9e8] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
        Embryology Attachments
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        Upload embryo images, microscope images, lab reports, or PDF attachments.
      </p>
      <input
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={(event) => void readFiles(event.target.files)}
        className="mt-3 block w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-sm font-bold"
      />
      {attachments.length ? (
        <div className="mt-3 space-y-2">
          {attachments.map((attachment, index) => (
            <div
              key={`${attachment.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-200 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#04142E]">
                  {attachment.name}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {attachment.type || "file"} | {Math.ceil(attachment.size / 1024)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange(attachments.filter((_, itemIndex) => itemIndex !== index))
                }
                className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
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
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
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

function text(value: unknown) {
  return String(value || "").trim();
}

function patientName(row?: Row) {
  return [
    row?.first_name,
    row?.middle_name,
    row?.last_name,
  ]
    .map(text)
    .filter(Boolean)
    .join(" ");
}

function findById(rows: Row[], id: unknown) {
  return rows.find((row) => String(row.id) === String(id));
}

function coupleLabel(couple?: Row) {
  const female =
    patientName(couple) ||
    text(couple?.female_name);
  const male = text(couple?.male_name);
  return [female, male].filter(Boolean).join(" / ");
}

function recordEyebrow(
  row: Row,
  config: IvfModuleConfig,
  patients: Row[],
  couples: Row[],
  cycles: Row[],
  doctors: Row[]
) {
  const patient = findById(patients, row.patient_id || row.female_patient_id);
  const couple = findById(couples, row.couple_id);
  const cycle = findById(cycles, row.cycle_id);
  const doctor = findById(doctors, row.doctor_id);
  if (config.key === "embryology" || config.key === "embryos") {
    return text(row.embryo_id) || text(row.embryo_number) || text(row.embryo_code) || text(cycle?.cycle_number);
  }
  return (
    text(row.cycle_number) ||
    text(cycle?.cycle_number) ||
    text(row.couple_number) ||
    text(couple?.couple_number) ||
    text(row.patient_uid) ||
    text(patient?.patient_uid) ||
    text(patient?.uhid) ||
    text(doctor?.full_name) ||
    config.label
  );
}

function recordTitle(
  row: Row,
  config: IvfModuleConfig,
  patients: Row[],
  couples: Row[],
  cycles: Row[]
) {
  const patient = findById(patients, row.patient_id || row.female_patient_id);
  const couple = findById(couples, row.couple_id);
  const cycle = findById(cycles, row.cycle_id);
  if (config.key === "embryology" || config.key === "embryos") {
    return (
      text(row.embryo_id) ||
      text(row.embryo_number) ||
      text(row.embryo_code) ||
      `${patientName(patient) || coupleLabel(couple) || "Embryology"} - ${text(row.grade || row.embryo_grade || row.day3_grade || row.day5_grade)}`
    );
  }
  if (config.key === "cycles") {
    return coupleLabel(couple) || text(row.cycle_number) || "IVF Cycle";
  }
  return String(
    coupleLabel(row) ||
      coupleLabel(couple) ||
      patientName(patient) ||
      text(cycle?.cycle_number) ||
      row.couple_number ||
      row.cycle_number ||
      row.plan_number ||
      row.retrieval_number ||
      row.fertilization_number ||
      row.embryo_id ||
      row.cryo_number ||
      row.transfer_number ||
      row.donor_number ||
      row.surrogate_number ||
      row.invoice_number ||
      row.referral_source ||
      row.summary_type ||
      row.female_name ||
      row.male_name ||
      config.label
  );
}

function recordDescription(
  row: Row,
  config: IvfModuleConfig,
  patients: Row[],
  couples: Row[],
  cycles: Row[],
  doctors: Row[]
) {
  const patient = findById(patients, row.patient_id || row.female_patient_id);
  const couple = findById(couples, row.couple_id);
  const cycle = findById(cycles, row.cycle_id);
  const doctor = findById(doctors, row.doctor_id || row.embryologist_id);
  const parts = [
    text(patient?.uhid || patient?.patient_uid || row.uhid),
    text(row.cycle_number || cycle?.cycle_number),
    text(row.cycle_type),
    text(row.start_date || row.planned_start_date || row.assessment_date || row.created_at).slice(0, 10),
    text(doctor?.full_name),
  ].filter(Boolean);
  return parts.length ? parts.join(" | ") : config.label;
}

function RecordSearchAndPagination({
  query,
  onQueryChange,
  page,
  totalCount,
  onPrevious,
  onNext,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  page: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const canNext = page * 10 < totalCount;
  return (
    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-[1fr_auto] md:items-center">
      <label className="flex min-h-11 items-center gap-2 rounded-[8px] border border-slate-300 px-3">
        <Search size={16} className="text-[#8a6500]" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search patient, UHID, mobile, doctor, cycle, embryo..."
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
        />
      </label>
      <div className="flex items-center gap-2 text-xs font-black text-slate-600">
        <span>Total {totalCount}</span>
        <button type="button" onClick={onPrevious} disabled={page <= 1} className="rounded-[8px] border border-slate-200 px-3 py-2 disabled:opacity-40">Previous</button>
        <span>Page {page}</span>
        <button type="button" onClick={onNext} disabled={!canNext} className="rounded-[8px] border border-slate-200 px-3 py-2 disabled:opacity-40">Next</button>
      </div>
    </div>
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
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
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
