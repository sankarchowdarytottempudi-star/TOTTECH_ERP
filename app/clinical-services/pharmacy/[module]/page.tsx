"use client";

import { useParams, useSearchParams } from "next/navigation";
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
import ClinicalMobilePatientSearch from "@/components/clinical/ClinicalMobilePatientSearch";
import {
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import {
  getPharmacyModuleConfig,
  type PharmacyModuleConfig,
} from "@/lib/clinical/pharmacy-core";
import {
  getPharmacyStatusModule,
  isControlledStatusField,
  statusOptionsToSelect,
  type ClinicalStatusOption,
} from "@/lib/clinical/status-master";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: PharmacyModuleConfig;
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

const defaultStatus: Record<string, string> = {
  "prescription-queue": "PENDING",
  medicines: "ACTIVE",
  categories: "ACTIVE",
  vendors: "ACTIVE",
  requisitions: "PENDING",
  "purchase-orders": "PENDING",
  grn: "COMPLETED",
  inventory: "COMPLETED",
  warehouses: "ACTIVE",
  transfers: "PENDING",
  sales: "PENDING",
  "ip-dispensing": "DISPENSED",
  "ivf-medications": "ACTIVE",
  "controlled-drugs": "COMPLETED",
  expiry: "PENDING",
  returns: "PENDING",
  adjustments: "PENDING",
  audits: "PENDING",
  reorder: "ACTIVE",
  "ai-forecast": "PENDING",
  formulary: "PENDING",
  pricing: "ACTIVE",
  claims: "PENDING",
  mobile: "ACTIVE",
};

export default function ClinicalPharmacyModulePage() {
  const params =
    useParams<{ module: string }>();
  const searchParams = useSearchParams();
  const moduleKey = params?.module || "";
  const recordId = searchParams?.get("record") || "";
  const editMode =
    searchParams?.get("mode") === "edit" && Boolean(recordId);
  const config = useMemo(
    () => getPharmacyModuleConfig(moduleKey),
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
  const [medicines, setMedicines] =
    useState<Row[]>([]);
  const [categories, setCategories] =
    useState<Row[]>([]);
  const [vendors, setVendors] =
    useState<Row[]>([]);
  const [warehouses, setWarehouses] =
    useState<Row[]>([]);
  const [batches, setBatches] =
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
  const [saving, setSaving] =
    useState(false);
  const [editingRecord, setEditingRecord] =
    useState<Row | null>(null);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const [
      moduleResponse,
      patientsResponse,
      doctorsResponse,
      medicinesResponse,
      categoriesResponse,
      vendorsResponse,
      warehousesResponse,
      cyclesResponse,
      statusResponse,
    ] = await Promise.all([
      fetch(
        `/api/clinical/pharmacy/${moduleKey}?limit=10&page=${page}&q=${encodeURIComponent(recordSearch.length >= 2 ? recordSearch : "")}${editMode && recordId ? `&record_id=${encodeURIComponent(recordId)}` : ""}`
      ),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch("/api/clinical/pharmacy/medicines"),
      fetch("/api/clinical/pharmacy/categories"),
      fetch("/api/clinical/pharmacy/vendors"),
      fetch("/api/clinical/pharmacy/warehouses"),
      fetch("/api/clinical/ivf/cycles"),
      fetch(
        `/api/clinical/status-master?module=${encodeURIComponent(getPharmacyStatusModule())}`
      ),
    ]);

    if (moduleResponse.ok) {
      const payload = await moduleResponse.json();
      setData(payload);
      setEditingRecord(
        editMode
          ? (payload.rows || []).find(
              (row: Row) =>
                String(row.id) === String(recordId)
            ) || (payload.rows || [])[0] || null
          : null
      );
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

    if (medicinesResponse.ok) {
      const payload =
        await medicinesResponse.json();
      setMedicines(payload.rows || []);
    }

    if (categoriesResponse.ok) {
      const payload =
        await categoriesResponse.json();
      setCategories(payload.rows || []);
    }

    if (vendorsResponse.ok) {
      const payload =
        await vendorsResponse.json();
      setVendors(payload.rows || []);
    }

    if (warehousesResponse.ok) {
      const payload =
        await warehousesResponse.json();
      setWarehouses(payload.rows || []);
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

    setBatches([]);
  }, [config, editMode, moduleKey, page, recordId, recordSearch]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!editMode || !editingRecord || !config) {
      return;
    }

    const nextForm: Record<string, string> = {};
    for (const column of config.createColumns) {
      nextForm[column] = String(
        editingRecord[column] ?? ""
      );
    }
    if (config.statusColumn) {
      nextForm.status = String(
        editingRecord[config.statusColumn] ?? ""
      );
    }
    setForm(nextForm);
  }, [config, editMode, editingRecord]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown Pharmacy Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the pharmacy engine.
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
        `/api/clinical/pharmacy/${moduleKey}`,
        {
          method: editMode ? "PATCH" : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...(editMode && recordId
              ? { id: recordId }
              : {}),
            ...form,
            status:
              form.status ||
              defaultStatus[moduleKey] ||
              "ACTIVE",
            inventory_status:
              form.inventory_status ||
              defaultStatus[moduleKey],
            approval_status:
              form.approval_status ||
              defaultStatus[moduleKey],
          }),
        }
      );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Failed to save pharmacy record"
        );
      }

      notify.success("Pharmacy record saved");
      setForm({});
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save pharmacy record"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!editMode || !recordId) {
      return;
    }

    const response = await fetch(
      `/api/clinical/pharmacy/${moduleKey}?id=${encodeURIComponent(recordId)}`,
      { method: "DELETE" }
    );
    const payload = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      notify.error(
        payload.error ||
          "Failed to delete pharmacy record"
      );
      return;
    }

    notify.success("Pharmacy record deleted");
    window.location.href = `/clinical-services/pharmacy/${moduleKey}`;
  };

  const updateStatus = async (
    row: Row,
    status: string
  ) => {
    const response = await fetch(
      `/api/clinical/pharmacy/${moduleKey}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: row.id,
          status,
          _mode: "status",
        }),
      }
    );
    const payload =
      await response.json();

    if (!response.ok) {
      notify.error(
        payload.error ||
          "Failed to update pharmacy status"
      );
      return;
    }

    notify.success(
      `Prescription ${status.toLowerCase().replaceAll("_", " ")}`
    );
    await load();
  };

  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            Pharmacy Module
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-200">
            Records, inventory movements, procurement state, batch/expiry
            control, audit, and timeline are tenant, hospital, branch, and
            clinic scoped.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Database}
            title="Records"
            value={metrics.total}
            drillDownUrl={`/clinical-services/pharmacy/${moduleKey}`}
            caption="Open pharmacy records"
          />
          <DashboardCard
            icon={Activity}
            title="Today"
            value={metrics.today}
            drillDownUrl={`/clinical-services/pharmacy/${moduleKey}?date=today`}
            caption="Today's pharmacy activity"
          />
          <DashboardCard
            icon={Workflow}
            title="Inventory Items"
            value={medicines.length}
            drillDownUrl="/clinical-services/pharmacy/medicines"
            caption="Medicine master"
          />
          <DashboardCard
            icon={FileText}
            title="Returns"
            value={metrics.returns || 0}
            drillDownUrl="/clinical-services/pharmacy/returns"
            caption="Medicine returns"
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "New Sale",
              href: "/clinical-services/pharmacy/sales",
              icon: Plus,
            },
            {
              label: "Inventory",
              href: "/clinical-services/pharmacy/inventory",
              icon: Database,
            },
            {
              label: "Purchase Order",
              href: "/clinical-services/pharmacy/purchase-orders",
              icon: Workflow,
            },
            {
              label: "Low Stock Review",
              href: "/clinical-services/pharmacy/reorder",
              icon: FileText,
            },
          ]}
        />

        {moduleKey === "prescription-queue" ? (
          <ClinicalMobilePatientSearch compact />
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <Plus size={21} />
              </div>
              <h2 className="text-2xl font-black">
                {editMode ? "Edit Record" : "Create Record"}
              </h2>
            </div>
            {editMode ? (
              <div className="mt-3 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-4 py-3 text-sm font-semibold text-[#735300]">
                Editing record #{recordId}. Make changes and save to persist the update.
              </div>
            ) : null}
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
                  medicines={medicines}
                  categories={categories}
                  vendors={vendors}
                  warehouses={warehouses}
                  batches={batches}
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
            <button
              onClick={save}
              disabled={saving}
              className="mt-5 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editMode
                  ? `Update ${config.label}`
                  : `Save ${config.label}`}
            </button>
            {editMode ? (
              <button
                onClick={deleteRecord}
                type="button"
                className="ml-3 mt-5 rounded-[8px] border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-800"
              >
                Delete Record
              </button>
            ) : null}
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
                    moduleKey
                  )}
                  eyebrow={recordEyebrow(row, patients, doctors, medicines, config.label)}
                  title={recordTitle(row, config, patients, doctors, medicines)}
                  description={recordDescription(row, patients, doctors, medicines)}
                  status={String(
                      row.status ||
                        row.inventory_status ||
                        row.approval_status ||
                        "-"
                    )}
                  metadata={[
                    `Module ${config.label}`,
                    row.medicine_id
                      ? `Medicine ${String(row.medicine_id)}`
                      : `Record ${String(row.id)}`,
                  ]}
                  patientHref={
                    row.patient_id
                      ? `/clinical-services/patients/${row.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/pharmacy/${moduleKey}?record=${row.id}&mode=edit`}
                  auditHref={`/clinical-services/pharmacy/${moduleKey}/${row.id}#audit`}
                  historyHref={`/clinical-services/pharmacy/${moduleKey}/${row.id}#history`}
                >
                  {moduleKey === "prescription-queue" ? (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-[8px] border border-slate-200 bg-white p-3 text-xs font-bold leading-5 text-slate-700">
                        <p className="font-black text-[#04142E]">
                          Prescription handoff
                        </p>
                        <p className="mt-1 break-words">
                          {String(row.patient_name || "Patient")} |{" "}
                          {String(row.patient_mobile || "No mobile")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "PENDING",
                          "PARTIALLY_DISPENSED",
                          "COMPLETED",
                        ].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void updateStatus(row, status);
                            }}
                            className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300] transition hover:bg-[#04142E] hover:text-white"
                          >
                            {status.replaceAll("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </ClinicalRecordCard>
              ))}
              {!data?.rows?.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No records created for this pharmacy module yet.
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
  return `/clinical-services/pharmacy/${moduleKey}/${row.id}`;
}

function DynamicInput({
  column,
  config,
  value,
  patients,
  doctors,
  departments,
  medicines,
  categories,
  vendors,
  warehouses,
  batches,
  cycles,
  statusOptions,
  onChange,
}: {
  column: string;
  config: PharmacyModuleConfig;
  value: string;
  patients: Row[];
  doctors: Row[];
  departments: Row[];
  medicines: Row[];
  categories: Row[];
  vendors: Row[];
  warehouses: Row[];
  batches: Row[];
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

  if (column === "medicine_id" || column === "alternative_medicine_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={medicines.map((medicine) => ({
          value: String(medicine.id),
          label: `${medicine.medicine_code || ""} ${medicine.brand_name || ""} ${medicine.strength || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "category_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={categories.map((category) => ({
          value: String(category.id),
          label: `${category.category_code || ""} ${category.category_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "vendor_id" || column === "preferred_vendor_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={vendors.map((vendor) => ({
          value: String(vendor.id),
          label: `${vendor.vendor_code || ""} ${vendor.vendor_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (
    [
      "warehouse_id",
      "source_store_id",
      "destination_store_id",
    ].includes(column)
  ) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={warehouses.map((warehouse) => ({
          value: String(warehouse.id),
          label: `${warehouse.warehouse_code || ""} ${warehouse.warehouse_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "batch_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={batches.map((batch) => ({
          value: String(batch.id),
          label: `${batch.batch_number || ""} ${batch.expiry_date || ""}`.trim(),
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

  if (column === "patient_id") {
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
      "manager_id",
      "requested_by",
      "authorized_by",
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
      : config.numericColumns?.includes(column)
        ? "number"
        : column.includes("email")
          ? "email"
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

function fullName(row?: Row) {
  return [row?.first_name, row?.middle_name, row?.last_name]
    .map(text)
    .filter(Boolean)
    .join(" ");
}

function findById(rows: Row[], id: unknown) {
  return rows.find((row) => String(row.id) === String(id));
}

function recordEyebrow(
  row: Row,
  patients: Row[],
  doctors: Row[],
  medicines: Row[],
  fallback: string
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id);
  const medicine = findById(medicines, row.medicine_id);
  return (
    text(row.prescription_number) ||
    text(row.bill_number) ||
    text(row.dispensing_number) ||
    text(row.po_number) ||
    text(row.grn_number) ||
    text(row.return_number) ||
    text(patient?.uhid || patient?.patient_uid) ||
    text(doctor?.full_name) ||
    text(medicine?.medicine_code) ||
    fallback
  );
}

function recordTitle(
  row: Row,
  config: PharmacyModuleConfig,
  patients: Row[],
  doctors: Row[],
  medicines: Row[]
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id);
  const medicine = findById(medicines, row.medicine_id);
  return String(
    fullName(patient) ||
      row.patient_name ||
      row.brand_name ||
      row.medicine_name ||
      medicine?.brand_name ||
      medicine?.medicine_name ||
      doctor?.full_name ||
      row.medicine_code ||
      row.brand_name ||
      row.category_code ||
      row.category_name ||
      row.vendor_code ||
      row.vendor_name ||
      row.requisition_number ||
      row.po_number ||
      row.grn_number ||
      row.warehouse_code ||
      row.warehouse_name ||
      row.transfer_number ||
      row.bill_number ||
      row.dispensing_number ||
      row.register_number ||
      row.action_number ||
      row.return_number ||
      row.adjustment_number ||
      row.audit_number ||
      row.forecast_number ||
      row.claim_number ||
      row.title ||
      config.label
  );
}

function recordDescription(
  row: Row,
  patients: Row[],
  doctors: Row[],
  medicines: Row[]
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id);
  const medicine = findById(medicines, row.medicine_id);
  return [
    text(patient?.uhid || patient?.patient_uid),
    text(patient?.phone),
    text(doctor?.full_name),
    text(medicine?.strength || row.strength),
    text(row.total_amount || row.net_amount || row.bill_amount ? `Amount ${row.total_amount || row.net_amount || row.bill_amount}` : ""),
  ]
    .filter(Boolean)
    .join(" | ");
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
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search patient, UHID, mobile, doctor, prescription..." className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
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
