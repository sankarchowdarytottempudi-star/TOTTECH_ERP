"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type ModuleOption = {
  module_code: string;
  label: string;
};

type HospitalLicenseRow = {
  id: number;
  hospital_name?: string | null;
  hospital_code?: string | null;
  email?: string | null;
  phone?: string | null;
  hospital_status?: string | null;
  plan_name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  subscription_status?: string | null;
  modules?: {
    module_code: string;
    enabled: boolean;
    label?: string;
  }[];
};

const planOptions = [
  "IVF_ONLY",
  "CLINICAL_PRO",
  "ENTERPRISE",
  "CUSTOM",
];

export default function HospitalLicensingPage() {
  const [rows, setRows] = useState<
    HospitalLicenseRow[]
  >([]);
  const [modules, setModules] = useState<
    ModuleOption[]
  >([]);
  const [canEdit, setCanEdit] =
    useState(false);
  const [selectedId, setSelectedId] =
    useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    plan_name: "ENTERPRISE",
    status: "ACTIVE",
    start_date: "",
    end_date: "",
    modules: [] as string[],
  });

  const selected = useMemo(
    () =>
      rows.find(
        (row) => Number(row.id) === selectedId
      ) || rows[0],
    [rows, selectedId]
  );

  const loadLicenses = async () => {
    setLoading(true);
    try {
      const payload = await apiJson<{
        canEdit: boolean;
        modules: ModuleOption[];
        rows: HospitalLicenseRow[];
      }>(
        "/api/clinical/platform/licensing"
      );
      setRows(
        Array.isArray(payload.rows)
          ? payload.rows
          : []
      );
      setModules(
        Array.isArray(payload.modules)
          ? payload.modules
          : []
      );
      setCanEdit(Boolean(payload.canEdit));

      const first =
        payload.rows?.[0] || null;
      if (first && !selectedId) {
        setSelectedId(Number(first.id));
      }
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load hospital licensing"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLicenses();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const enabledModules =
      selected.modules
        ?.filter((item) => item.enabled)
        .map((item) => item.module_code) ||
      modules.map((item) => item.module_code);

    setDraft({
      plan_name:
        selected.plan_name || "ENTERPRISE",
      status:
        selected.subscription_status ||
        "ACTIVE",
      start_date:
        selected.start_date?.slice(0, 10) ||
        "",
      end_date:
        selected.end_date?.slice(0, 10) ||
        "",
      modules: enabledModules,
    });
  }, [selected?.id, modules.length]);

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      `${row.hospital_name || ""} ${row.hospital_code || ""} ${row.email || ""} ${row.phone || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [rows, search]);

  const toggleModule = (
    moduleCode: string
  ) => {
    if (!canEdit) return;

    setDraft((current) => {
      const enabled =
        current.modules.includes(moduleCode);
      return {
        ...current,
        plan_name:
          current.plan_name === "CUSTOM"
            ? "CUSTOM"
            : "CUSTOM",
        modules: enabled
          ? current.modules.filter(
              (item) => item !== moduleCode
            )
          : [
              ...current.modules,
              moduleCode,
            ],
      };
    });
  };

  const saveLicense = async () => {
    if (!selected) return;

    setSaving(true);
    try {
      await apiJson(
        "/api/clinical/platform/licensing",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            hospital_id: selected.id,
            plan_name: draft.plan_name,
            status: draft.status,
            start_date:
              draft.start_date || null,
            end_date: draft.end_date || null,
            modules: draft.modules,
          }),
        }
      );
      notify.success(
        "Hospital licensing updated"
      );
      await loadLicenses();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save licensing"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Platform Administration
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Hospital Licensing
          </h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-200">
            Assign subscription plans and licensed clinical modules per hospital. Menus, routes, APIs and dashboard widgets follow this configuration.
          </p>
        </section>

        <section className="grid gap-5 xl:grid-cols-[430px_1fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Hospitals
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {filteredRows.length} hospitals visible in this tenant.
                </p>
              </div>
              <button
                type="button"
                onClick={loadLicenses}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-black text-slate-950"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-[8px] border border-slate-300 bg-slate-50 px-3">
              <Search
                size={16}
                className="text-[#8a6500]"
              />
              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search hospital name, code, phone, or email..."
                className="min-h-11 flex-1 bg-transparent text-sm font-bold outline-none"
              />
            </label>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-600">
                  Loading hospitals...
                </div>
              ) : null}
              {filteredRows.map((row) => {
                const enabledCount =
                  row.modules?.filter(
                    (item) => item.enabled
                  ).length || 0;
                const active =
                  Number(selected?.id) ===
                  Number(row.id);

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() =>
                      setSelectedId(
                        Number(row.id)
                      )
                    }
                    className={`w-full rounded-[8px] border p-4 text-left transition ${
                      active
                        ? "border-[#D4AF37] bg-[#fff9e8]"
                        : "border-slate-200 bg-slate-50 hover:border-teal-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {row.hospital_name ||
                            `Hospital ${row.id}`}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-600">
                          {row.hospital_code ||
                            "-"}{" "}
                          ·{" "}
                          {row.phone ||
                            row.email ||
                            "-"}
                        </p>
                      </div>
                      {active ? (
                        <CheckCircle2
                          size={20}
                          className="text-[#8a6500]"
                        />
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>
                        {row.plan_name ||
                          "ENTERPRISE"}
                      </Badge>
                      <Badge>
                        {enabledCount} modules
                      </Badge>
                      <Badge>
                        {row.subscription_status ||
                          "ACTIVE"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            {selected ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                      Subscription Configuration
                    </p>
                    <h2 className="mt-1 text-3xl font-black text-slate-950">
                      {selected.hospital_name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {selected.hospital_code} ·{" "}
                      {selected.email ||
                        selected.phone ||
                        "-"}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-black text-teal-800">
                    {canEdit
                      ? "Editable"
                      : "View Only"}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <SelectField
                    label="Plan"
                    value={draft.plan_name}
                    options={planOptions}
                    disabled={!canEdit}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        plan_name: value,
                        modules:
                          value ===
                          "ENTERPRISE"
                            ? modules.map(
                                (module) =>
                                  module.module_code
                              )
                            : value ===
                              "IVF_ONLY"
                            ? [
                                "PATIENTS",
                                "APPOINTMENTS",
                                "OP",
                                "IVF",
                                "BILLING",
                              ]
                            : value ===
                              "CLINICAL_PRO"
                            ? [
                                "PATIENTS",
                                "APPOINTMENTS",
                                "OP",
                                "IVF",
                                "LAB",
                                "RADIOLOGY",
                                "PHARMACY",
                                "BILLING",
                                "FINANCE",
                              ]
                            : current.modules,
                      }))
                    }
                  />
                  <SelectField
                    label="Status"
                    value={draft.status}
                    options={[
                      "ACTIVE",
                      "TRIAL",
                      "SUSPENDED",
                      "EXPIRED",
                    ]}
                    disabled={!canEdit}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        status: value,
                      }))
                    }
                  />
                  <DateField
                    label="Start Date"
                    value={draft.start_date}
                    disabled={!canEdit}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        start_date: value,
                      }))
                    }
                  />
                  <DateField
                    label="End Date"
                    value={draft.end_date}
                    disabled={!canEdit}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        end_date: value,
                      }))
                    }
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-slate-950">
                      Licensed Modules
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      {
                        draft.modules.length
                      }{" "}
                      enabled
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {modules.map((module) => {
                      const enabled =
                        draft.modules.includes(
                          module.module_code
                        );

                      return (
                        <button
                          type="button"
                          key={
                            module.module_code
                          }
                          disabled={!canEdit}
                          onClick={() =>
                            toggleModule(
                              module.module_code
                            )
                          }
                          className={`flex min-h-16 items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-left transition disabled:cursor-not-allowed ${
                            enabled
                              ? "border-[#D4AF37] bg-[#fff9e8]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-black text-slate-950">
                              {module.label}
                            </span>
                            <span className="mt-1 block text-xs font-bold text-slate-500">
                              {
                                module.module_code
                              }
                            </span>
                          </span>
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                              enabled
                                ? "border-[#D4AF37] bg-[#04142E] text-[#D4AF37]"
                                : "border-slate-300 bg-white text-slate-400"
                            }`}
                          >
                            <ShieldCheck
                              size={15}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {canEdit ? (
                  <button
                    type="button"
                    onClick={saveLicense}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B1F3A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving
                      ? "Saving..."
                      : "Save Licensing"}
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Select a hospital to view licensing.
              </div>
            )}
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase text-slate-700">
      {children}
    </span>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-900">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-[8px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:opacity-70"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-900">
      <span>{label}</span>
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-[8px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:opacity-70"
      />
    </label>
  );
}
