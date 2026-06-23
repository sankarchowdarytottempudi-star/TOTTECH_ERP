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
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import {
  getFinanceModuleConfig,
  type FinanceModuleConfig,
} from "@/lib/clinical/finance-core";
import {
  getFinanceStatusModule,
  isControlledStatusField,
  statusOptionsToSelect,
  type ClinicalStatusOption,
} from "@/lib/clinical/status-master";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: FinanceModuleConfig;
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
  coa: "ACTIVE",
  gl: "DRAFT",
  "cost-centers": "ACTIVE",
  "profit-centers": "ACTIVE",
  ar: "DRAFT",
  ap: "PENDING",
  cash: "POSTED",
  banks: "ACTIVE",
  gst: "ACTIVE",
  tds: "DEDUCTED",
  assets: "ACTIVE",
  budgets: "ACTIVE",
  "revenue-cycle": "POSTED",
  "insurance-companies": "ACTIVE",
  tpa: "ACTIVE",
  preauth: "DRAFT",
  claims: "DRAFT",
  "claim-documents": "PENDING",
  corporates: "ACTIVE",
  "corporate-patients": "ACTIVE",
  referrals: "ACTIVE",
  "commission-rules": "ACTIVE",
  "commission-calculations": "GENERATED",
  "doctor-incentives": "GENERATED",
  payouts: "PENDING",
  "ai-finance": "ACTIVE",
};

export default function ClinicalFinanceModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getFinanceModuleConfig(moduleKey),
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
  const [accounts, setAccounts] =
    useState<Row[]>([]);
  const [costCenters, setCostCenters] =
    useState<Row[]>([]);
  const [profitCenters, setProfitCenters] =
    useState<Row[]>([]);
  const [insuranceCompanies, setInsuranceCompanies] =
    useState<Row[]>([]);
  const [tpas, setTpas] =
    useState<Row[]>([]);
  const [claims, setClaims] =
    useState<Row[]>([]);
  const [corporates, setCorporates] =
    useState<Row[]>([]);
  const [referrals, setReferrals] =
    useState<Row[]>([]);
  const [commissionRules, setCommissionRules] =
    useState<Row[]>([]);
  const [banks, setBanks] =
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

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const [
      moduleResponse,
      patientsResponse,
      doctorsResponse,
      accountsResponse,
      costCentersResponse,
      profitCentersResponse,
      insuranceResponse,
      tpaResponse,
      claimsResponse,
      corporatesResponse,
      referralsResponse,
      commissionRulesResponse,
      banksResponse,
      statusResponse,
    ] = await Promise.all([
      fetch(
        `/api/clinical/finance/${moduleKey}?limit=10&page=${page}&q=${encodeURIComponent(recordSearch.length >= 2 ? recordSearch : "")}`
      ),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch("/api/clinical/finance/coa"),
      fetch("/api/clinical/finance/cost-centers"),
      fetch("/api/clinical/finance/profit-centers"),
      fetch("/api/clinical/finance/insurance-companies"),
      fetch("/api/clinical/finance/tpa"),
      fetch("/api/clinical/finance/claims"),
      fetch("/api/clinical/finance/corporates"),
      fetch("/api/clinical/finance/referrals"),
      fetch("/api/clinical/finance/commission-rules"),
      fetch("/api/clinical/finance/banks"),
      fetch(
        `/api/clinical/status-master?module=${encodeURIComponent(getFinanceStatusModule(moduleKey))}`
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

    if (accountsResponse.ok) {
      const payload =
        await accountsResponse.json();
      setAccounts(payload.rows || []);
    }

    if (costCentersResponse.ok) {
      const payload =
        await costCentersResponse.json();
      setCostCenters(payload.rows || []);
    }

    if (profitCentersResponse.ok) {
      const payload =
        await profitCentersResponse.json();
      setProfitCenters(payload.rows || []);
    }

    if (insuranceResponse.ok) {
      const payload =
        await insuranceResponse.json();
      setInsuranceCompanies(
        payload.rows || []
      );
    }

    if (tpaResponse.ok) {
      const payload =
        await tpaResponse.json();
      setTpas(payload.rows || []);
    }

    if (claimsResponse.ok) {
      const payload =
        await claimsResponse.json();
      setClaims(payload.rows || []);
    }

    if (corporatesResponse.ok) {
      const payload =
        await corporatesResponse.json();
      setCorporates(payload.rows || []);
    }

    if (referralsResponse.ok) {
      const payload =
        await referralsResponse.json();
      setReferrals(payload.rows || []);
    }

    if (commissionRulesResponse.ok) {
      const payload =
        await commissionRulesResponse.json();
      setCommissionRules(payload.rows || []);
    }

    if (banksResponse.ok) {
      const payload =
        await banksResponse.json();
      setBanks(payload.rows || []);
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

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown Finance Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the finance engine.
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
        `/api/clinical/finance/${moduleKey}`,
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
            collection_status:
              form.collection_status ||
              defaultStatus[moduleKey],
            approval_status:
              form.approval_status ||
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
            "Failed to save finance record"
        );
      }

      notify.success("Finance record saved");
      setForm({});
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save finance record"
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
            Finance Module
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Finance, insurance, RCM, corporate, referral, commission, audit,
            and AI revenue records are scoped by tenant, hospital, branch,
            and clinic.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Database}
            title="Records"
            value={metrics.total}
            drillDownUrl={`/clinical-services/finance/${moduleKey}`}
            caption="Open finance records"
          />
          <DashboardCard
            icon={Activity}
            title="Today"
            value={metrics.today}
            drillDownUrl={`/clinical-services/finance/${moduleKey}?date=today`}
            caption="Today's finance activity"
          />
          <DashboardCard
            icon={Workflow}
            title="Patients"
            value={patients.length}
            drillDownUrl="/clinical-services/patients"
            caption="Patient billing context"
          />
          <DashboardCard
            icon={FileText}
            title="Invoices"
            value={metrics.invoices || 0}
            drillDownUrl="/clinical-services/hms/billing"
            caption="Billing records"
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "Create Invoice",
              href: "/clinical-services/hms/billing",
              icon: Plus,
            },
            {
              label: "Collect Payment",
              href: "/clinical-services/finance/cash",
              icon: Activity,
            },
            {
              label: "Submit Claim",
              href: "/clinical-services/finance/claims",
              icon: Workflow,
            },
            {
              label: "Revenue Dashboard",
              href: "/clinical-services/analytics/cfo-dashboard",
              icon: FileText,
            },
          ]}
        />

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
                  departments={departments}
                  accounts={accounts}
                  costCenters={costCenters}
                  profitCenters={profitCenters}
                  insuranceCompanies={insuranceCompanies}
                  tpas={tpas}
                  claims={claims}
                  corporates={corporates}
                  referrals={referrals}
                  commissionRules={commissionRules}
                  banks={banks}
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
                  href={recordHref(
                    row,
                    moduleKey
                  )}
                  eyebrow={recordEyebrow(row, patients, doctors, accounts, config.label)}
                  title={recordTitle(row, config, patients, doctors, accounts)}
                  description={recordDescription(row, patients, doctors, accounts)}
                  status={String(
                      row.status ||
                        row.collection_status ||
                        row.approval_status ||
                        row.verification_status ||
                        "-"
                    )}
                  metadata={[
                    `Module ${config.label}`,
                    row.claim_id
                      ? `Claim ${String(row.claim_id)}`
                      : `Record ${String(row.id)}`,
                  ]}
                  patientHref={
                    row.patient_id
                      ? `/clinical-services/patients/${row.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/finance/${moduleKey}?record=${row.id}&mode=edit`}
                  auditHref={`/clinical-services/finance/${moduleKey}/${row.id}#audit`}
                  historyHref={`/clinical-services/finance/${moduleKey}/${row.id}#history`}
                />
              ))}
              {!data?.rows?.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No records created for this finance module yet.
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
  return `/clinical-services/finance/${moduleKey}/${row.id}`;
}

function DynamicInput({
  column,
  config,
  value,
  patients,
  doctors,
  departments,
  accounts,
  costCenters,
  profitCenters,
  insuranceCompanies,
  tpas,
  claims,
  corporates,
  referrals,
  commissionRules,
  banks,
  statusOptions,
  onChange,
}: {
  column: string;
  config: FinanceModuleConfig;
  value: string;
  patients: Row[];
  doctors: Row[];
  departments: Row[];
  accounts: Row[];
  costCenters: Row[];
  profitCenters: Row[];
  insuranceCompanies: Row[];
  tpas: Row[];
  claims: Row[];
  corporates: Row[];
  referrals: Row[];
  commissionRules: Row[];
  banks: Row[];
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

  if (
    [
      "account_id",
      "parent_account_id",
    ].includes(column)
  ) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={accounts.map((account) => ({
          value: String(account.id),
          label: `${account.account_code || ""} ${account.account_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "cost_center_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={costCenters.map((center) => ({
          value: String(center.id),
          label: `${center.cost_center_code || ""} ${center.cost_center_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "profit_center_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={profitCenters.map((center) => ({
          value: String(center.id),
          label: `${center.profit_center_code || ""} ${center.profit_center_name || ""}`.trim(),
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
      "uploaded_by",
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

  if (column === "insurance_company_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={insuranceCompanies.map((company) => ({
          value: String(company.id),
          label: `${company.company_code || ""} ${company.company_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "tpa_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={tpas.map((tpa) => ({
          value: String(tpa.id),
          label: `${tpa.tpa_code || ""} ${tpa.tpa_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "claim_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={claims.map((claim) => ({
          value: String(claim.id),
          label: `${claim.claim_number || ""} ${claim.status || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "corporate_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={corporates.map((corporate) => ({
          value: String(corporate.id),
          label: `${corporate.corporate_code || ""} ${corporate.corporate_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "referral_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={referrals.map((referral) => ({
          value: String(referral.id),
          label: `${referral.referral_code || ""} ${referral.name || ""}`.trim(),
        }))}
      />
    );
  }

  if (column === "rule_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={commissionRules.map((rule) => ({
          value: String(rule.id),
          label: String(rule.rule_name || rule.id),
        }))}
      />
    );
  }

  if (column === "bank_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={banks.map((bank) => ({
          value: String(bank.id),
          label: `${bank.bank_name || ""} ${bank.account_number || ""}`.trim(),
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
  accounts: Row[],
  fallback: string
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.approved_by);
  const account = findById(accounts, row.account_id);
  return (
    text(row.invoice_number) ||
    text(row.receipt_number) ||
    text(row.claim_number) ||
    text(row.transaction_number) ||
    text(row.reference_number) ||
    text(patient?.uhid || patient?.patient_uid) ||
    text(doctor?.full_name) ||
    text(account?.account_code) ||
    fallback
  );
}

function recordTitle(
  row: Row,
  config: FinanceModuleConfig,
  patients: Row[],
  doctors: Row[],
  accounts: Row[]
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.approved_by);
  const account = findById(accounts, row.account_id);
  return String(
    fullName(patient) ||
      row.patient_name ||
      row.invoice_number ||
      row.claim_number ||
      row.account_code ||
      account?.account_name ||
      doctor?.full_name ||
      row.account_name ||
      row.journal_number ||
      row.cost_center_code ||
      row.cost_center_name ||
      row.profit_center_code ||
      row.profit_center_name ||
      row.invoice_number ||
      row.transaction_number ||
      row.bank_name ||
      row.gstin ||
      row.pan ||
      row.asset_number ||
      row.asset_name ||
      row.financial_year ||
      row.revenue_number ||
      row.company_code ||
      row.company_name ||
      row.tpa_code ||
      row.tpa_name ||
      row.request_number ||
      row.claim_number ||
      row.document_title ||
      row.corporate_code ||
      row.corporate_name ||
      row.referral_code ||
      row.name ||
      row.rule_name ||
      row.calculation_number ||
      row.payout_number ||
      row.forecast_number ||
      config.label
  );
}

function recordDescription(
  row: Row,
  patients: Row[],
  doctors: Row[],
  accounts: Row[]
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.approved_by);
  const account = findById(accounts, row.account_id);
  return [
    text(patient?.uhid || patient?.patient_uid),
    text(patient?.phone),
    text(doctor?.full_name),
    text(account?.account_name),
    text(row.total_amount || row.amount || row.paid_amount ? `Amount ${row.total_amount || row.amount || row.paid_amount}` : ""),
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
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search patient, UHID, mobile, doctor, invoice..." className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
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
