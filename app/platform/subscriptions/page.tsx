"use client";

import {
  CheckCircle2,
  RefreshCw,
  Save,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type ModuleRow = {
  module_key: string;
  enabled: boolean;
  enabled_at?: string | null;
  updated_at?: string | null;
};

type SchoolRow = {
  id: number;
  school_name: string;
  school_code?: string | null;
  email?: string | null;
  phone?: string | null;
  owner_name?: string | null;
  owner_contact?: string | null;
  subscription_plan?: string | null;
  subscription_status?: string | null;
  is_active?: boolean | null;
  updated_at?: string | null;
  school_module_access: ModuleRow[];
};

type Payload = {
  moduleKeys: string[];
  planDefaults: Record<string, string[]>;
  schools: SchoolRow[];
};

const plans = [
  "STARTER",
  "PROFESSIONAL",
  "ENTERPRISE",
  "CUSTOM",
];

const labels: Record<string, string> = {
  STUDENTS: "Students",
  TEACHERS: "Teachers",
  ACADEMICS: "Academics",
  FINANCE: "Finance",
  OPERATIONS: "Operations",
  DINING: "Dining",
  TRANSPORT: "Transport",
  HOSTEL: "Hostel",
  REPORTS: "Reports",
  ANALYTICS: "Analytics",
  AI: "AI",
  USER_MANAGEMENT: "User Management",
  PARENT_PORTAL: "Parent Portal",
  MOBILE_APP: "Mobile App",
};

export default function SchoolSubscriptionsPage() {
  const [payload, setPayload] =
    useState<Payload | null>(null);
  const [query, setQuery] =
    useState("");
  const [savingId, setSavingId] =
    useState<number | null>(null);
  const [drafts, setDrafts] =
    useState<
      Record<
        number,
        {
          plan: string;
          modules: string[];
        }
      >
    >({});

  const load = async () => {
    const data = await apiJson<Payload>(
      "/api/platform/subscriptions"
    );
    setPayload(data);
    setDrafts(
      Object.fromEntries(
        data.schools.map((school) => [
          school.id,
          {
            plan:
              school.subscription_plan ||
              "STARTER",
            modules:
              school.school_module_access
                .filter((row) => row.enabled)
                .map((row) => row.module_key),
          },
        ])
      )
    );
  };

  useEffect(() => {
    load().catch((error) =>
      notify.error(
        errorMessage(
          error,
          "Failed to load subscriptions"
        )
      )
    );
  }, []);

  const schools = useMemo(() => {
    const term = query.toLowerCase();

    return (payload?.schools || []).filter(
      (school) =>
        `
        ${school.school_name}
        ${school.school_code || ""}
        ${school.email || ""}
        ${school.phone || ""}
        ${school.owner_name || ""}
        ${school.owner_contact || ""}
      `
          .toLowerCase()
          .includes(term)
    );
  }, [payload, query]);

  const setPlan = (
    schoolId: number,
    plan: string
  ) => {
    setDrafts((current) => {
      const modules =
        plan === "CUSTOM"
          ? current[schoolId]?.modules || []
          : payload?.planDefaults[plan] || [];

      return {
        ...current,
        [schoolId]: {
          plan,
          modules,
        },
      };
    });
  };

  const toggleModule = (
    schoolId: number,
    moduleKey: string
  ) => {
    setDrafts((current) => {
      const existing =
        current[schoolId]?.modules || [];
      const enabled =
        existing.includes(moduleKey);
      const modules = enabled
        ? existing.filter(
            (key) => key !== moduleKey
          )
        : [...existing, moduleKey];

      return {
        ...current,
        [schoolId]: {
          plan: "CUSTOM",
          modules,
        },
      };
    });
  };

  const save = async (school: SchoolRow) => {
    const draft = drafts[school.id];
    if (!draft) return;

    try {
      setSavingId(school.id);
      await apiJson(
        "/api/platform/subscriptions",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            school_id: school.id,
            plan: draft.plan,
            subscription_status:
              school.subscription_status ||
              "ACTIVE",
            enabled_modules:
              draft.modules,
          }),
        }
      );
      notify.success(
        "Subscription updated"
      );
      await load();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update subscription"
        )
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-hero p-8 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                Platform Administration
              </p>
              <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                School/College Subscription Management
              </h1>
              <p className="mt-3 max-w-3xl text-white/85">
                Control which modules each school/college can use. Disabled modules are hidden from navigation and blocked by protected APIs.
              </p>
            </div>
            <button
              onClick={() =>
                load().catch((error) =>
                  notify.error(
                    errorMessage(
                      error,
                      "Refresh failed"
                    )
                  )
                )
              }
              className="tt-button-secondary inline-flex items-center gap-2 bg-white text-slate-950"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                SaaS Entitlements
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                Starter, Professional, Enterprise, or custom module toggles per school/college.
              </p>
            </div>
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search school/college, owner, phone, email..."
              className="input max-w-lg"
            />
          </div>
        </section>

        <div className="grid gap-5">
          {schools.map((school) => {
            const draft =
              drafts[school.id] || {
                plan:
                  school.subscription_plan ||
                  "STARTER",
                modules:
                  school.school_module_access
                    .filter((row) => row.enabled)
                    .map((row) => row.module_key),
              };

            return (
              <article
                key={school.id}
                className="tt-card tt-card-pad"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-950">
                        {school.school_name}
                      </h3>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
                        {school.subscription_status ||
                          "ACTIVE"}
                      </span>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                        {draft.plan}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {school.school_code || "-"} | {school.email || "-"} | {school.phone || "-"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Owner: {school.owner_name || "-"} {school.owner_contact ? `| ${school.owner_contact}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {plans.map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() =>
                          setPlan(school.id, plan)
                        }
                        className={`rounded-lg border px-3 py-2 text-xs font-black ${
                          draft.plan === plan
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {(payload?.moduleKeys || []).map(
                    (moduleKey) => {
                      const enabled =
                        draft.modules.includes(
                          moduleKey
                        );

                      return (
                        <button
                          key={moduleKey}
                          type="button"
                          onClick={() =>
                            toggleModule(
                              school.id,
                              moduleKey
                            )
                          }
                          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
                            enabled
                              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-black">
                              {labels[moduleKey] ||
                                moduleKey}
                            </span>
                            <span className="mt-1 block text-xs font-bold opacity-70">
                              {moduleKey}
                            </span>
                          </span>
                          {enabled ? (
                            <ToggleRight className="text-emerald-700" />
                          ) : (
                            <ToggleLeft />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row md:items-center md:justify-between">
                  <div className="inline-flex items-center gap-2 text-sm font-black text-slate-600">
                    <ShieldCheck
                      size={17}
                      className="text-amber-600"
                    />
                    Enabled modules: {draft.modules.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => save(school)}
                    disabled={savingId === school.id}
                    className="tt-button-primary inline-flex items-center gap-2"
                  >
                    {savingId === school.id ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}
                    Save Entitlements
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!schools.length ? (
          <section className="tt-card tt-card-pad text-center">
            <CheckCircle2 className="mx-auto text-slate-400" />
            <p className="mt-3 font-bold text-slate-600">
              No schools/colleges match the current search.
            </p>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
