"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type PermissionCatalogRow = {
  module_key: string;
  actions: string[];
};

type ClinicalRoleRow = {
  id: number;
  role_name: string;
  role_key: string;
  permissions?: {
    modules?: Array<{
      module_key: string;
      actions: string[];
    }>;
  } | null;
  field_permissions?: Record<string, unknown> | null;
  user_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

type Payload = {
  roles?: ClinicalRoleRow[];
  permissionCatalog?: PermissionCatalogRow[];
  standard_roles?: string[];
};

type PermissionMap = Record<string, string[]>;

const emptyForm = {
  id: null as number | null,
  role_name: "",
  role_key: "",
  permissions: {} as PermissionMap,
  field_permissions: {} as Record<string, unknown>,
};

const labelFromKey = (key: string) =>
  String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (part) => part.toUpperCase());

const normalizeKey = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

function permissionsToMap(
  permissions?: ClinicalRoleRow["permissions"]
) {
  const output: PermissionMap = {};
  for (const module of permissions?.modules || []) {
    output[module.module_key] = Array.isArray(module.actions)
      ? [...module.actions]
      : [];
  }
  return output;
}

function mapToPermissions(map: PermissionMap) {
  return {
    modules: Object.entries(map)
      .filter(([, actions]) => actions.length > 0)
      .map(([module_key, actions]) => ({
        module_key,
        actions: Array.from(new Set(actions)).sort(),
      })),
    source: "manual" as const,
  };
}

export default function ClinicalRoleManager() {
  const [payload, setPayload] = useState<Payload>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await apiJson<Payload>("/api/clinical/operations/roles");
      setPayload(data || {});
      if (!form.id) {
        const first = data?.roles?.[0];
        if (first) {
          setForm({
            id: first.id,
            role_name: first.role_name || "",
            role_key: first.role_key || "",
            permissions: permissionsToMap(first.permissions),
            field_permissions: first.field_permissions || {},
          });
        }
      }
    } catch (error) {
      notify.error(
        errorMessage(error, "Failed to load roles")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roles = useMemo(
    () =>
      (payload.roles || []).filter((role) => {
        const text = `${role.role_name || ""} ${role.role_key || ""} ${JSON.stringify(role.permissions || {})}`.toLowerCase();
        return text.includes(search.toLowerCase());
      }),
    [payload.roles, search]
  );

  const modules = payload.permissionCatalog || [];

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === form.id) || null,
    [roles, form.id]
  );

  const startCreate = () => {
    setForm(emptyForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (role: ClinicalRoleRow) => {
    setForm({
      id: role.id,
      role_name: role.role_name || "",
      role_key: role.role_key || "",
      permissions: permissionsToMap(role.permissions),
      field_permissions: role.field_permissions || {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updatePermission = (
    moduleKey: string,
    action: string,
    enabled: boolean
  ) => {
    setForm((current) => {
      const next = {
        ...current.permissions,
      };
      const currentActions = new Set(
        next[moduleKey] || []
      );
      if (enabled) {
        currentActions.add(action);
      } else {
        currentActions.delete(action);
      }
      next[moduleKey] = Array.from(
        currentActions
      ).sort();
      return {
        ...current,
        permissions: next,
      };
    });
  };

  const toggleModule = (
    moduleKey: string,
    enabled: boolean
  ) => {
    setForm((current) => {
      const next = {
        ...current.permissions,
      };
      if (!enabled) {
        delete next[moduleKey];
      } else if (!next[moduleKey]) {
        next[moduleKey] = ["READ"];
      }
      return {
        ...current,
        permissions: next,
      };
    });
  };

  const saveRole = async () => {
    if (!form.role_name || !form.role_key) {
      notify.error("Role name and role key are required.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        id: form.id,
        role_name: form.role_name,
        role_key: normalizeKey(form.role_key),
        permissions: mapToPermissions(form.permissions),
        field_permissions: form.field_permissions,
      };

      await apiJson("/api/clinical/operations/roles", {
        method: form.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      notify.success(
        form.id ? "Role updated" : "Role created"
      );
      setForm(emptyForm);
      await loadRoles();
    } catch (error) {
      notify.error(
        errorMessage(error, "Failed to save role")
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (role: ClinicalRoleRow) => {
    if (
      !window.confirm(
        `Delete role ${role.role_name}?`
      )
    ) {
      return;
    }

    try {
      await apiJson("/api/clinical/operations/roles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: role.id }),
      });
      notify.success("Role deleted");
      if (form.id === role.id) {
        setForm(emptyForm);
      }
      await loadRoles();
    } catch (error) {
      notify.error(
        errorMessage(error, "Failed to delete role")
      );
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Security Governance
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Roles & Module Permissions
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Create the operational clinical roles used during user creation, then attach module-level permissions so Doctor, Nurse, Lab, Pharmacy, Finance, and Admin accounts can be configured from one screen.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric
            title="Roles"
            value={(payload.roles || []).length}
          />
          <Metric
            title="Modules"
            value={modules.length}
          />
          <Metric
            title="Selected Role Users"
            value={selectedRole?.user_count || 0}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <div className="tt-card tt-card-pad space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
                  Role Builder
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  {form.id ? "Edit Role" : "Create Role"}
                </h2>
              </div>
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm"
              >
                <Plus size={16} />
                New Role
              </button>
            </div>

            <div className="grid gap-4">
              <Field
                label="Role Name"
                value={form.role_name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role_name: value,
                    role_key: current.role_key || normalizeKey(value),
                  }))
                }
              />
              <Field
                label="Role Key"
                value={form.role_key}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role_key: normalizeKey(value),
                  }))
                }
                helper="Use a stable lowercase key like doctor or nurse."
              />
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
                    Module Permissions
                  </p>
                  <h3 className="text-lg font-black text-slate-950">
                    Select modules and actions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      permissions: {},
                    }))
                  }
                  className="text-xs font-black text-slate-500"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3 max-h-[38rem] overflow-y-auto pr-1">
                {modules.map((module) => {
                  const selected = form.permissions[module.module_key] || [];
                  const selectedSet = new Set(selected);
                  const enabled = selected.length > 0;

                  return (
                    <div
                      key={module.module_key}
                      className="rounded-[8px] border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-900">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(event) =>
                              toggleModule(
                                module.module_key,
                                event.target.checked
                              )
                            }
                          />
                          <span>{module.module_key}</span>
                        </label>
                        <span className="text-xs font-bold text-slate-500">
                          {module.actions.length} action(s)
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {module.actions.map((action) => (
                          <label
                            key={`${module.module_key}.${action}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSet.has(action)}
                              onChange={(event) =>
                                updatePermission(
                                  module.module_key,
                                  action,
                                  event.target.checked
                                )
                              }
                            />
                            {action}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveRole}
                disabled={saving}
                className="tt-button inline-flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : form.id ? "Update Role" : "Create Role"}
              </button>
              {form.id ? (
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-950"
                >
                  <RefreshCcw size={16} />
                  Reset
                </button>
              ) : null}
            </div>
          </div>

          <div className="tt-card tt-card-pad">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
                  Role Registry
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  Available Roles
                </h2>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search roles..."
                className="input sm:max-w-xs"
              />
            </div>

            {loading ? (
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                Loading roles...
              </div>
            ) : null}

            <div className="space-y-3">
              {roles.map((role) => {
                const permissionCount =
                  role.permissions?.modules?.reduce(
                    (count, module) =>
                      count +
                      (Array.isArray(module.actions)
                        ? module.actions.length
                        : 0),
                    0
                  ) || 0;

                return (
                  <article
                    key={role.id}
                    className={`rounded-[8px] border p-4 shadow-sm transition ${
                      form.id === role.id
                        ? "border-[#D4AF37] bg-[#fff9e8]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-950">
                          {role.role_name}
                        </h3>
                        <p className="truncate text-sm font-semibold text-slate-600">
                          {role.role_key} · {role.user_count || 0} user(s)
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {permissionCount} permission(s) · {role.updated_at || role.created_at || "recent"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(role)}
                          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-950"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRole(role)}
                          className="inline-flex items-center gap-2 rounded-[8px] border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(role.permissions?.modules || []).slice(0, 8).map((module) => (
                        <span
                          key={module.module_key}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-700"
                        >
                          <Check size={11} />
                          {labelFromKey(module.module_key)}
                        </span>
                      ))}
                      {(role.permissions?.modules || []).length > 8 ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-800">
                          +{(role.permissions?.modules || []).length - 8} more
                        </span>
                      ) : null}
                    </div>
                  </article>
                );
              })}

              {!roles.length ? (
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No roles found.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input"
      />
      {helper ? (
        <span className="mt-1 block text-xs font-semibold text-slate-500">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-black text-slate-950">
        {value}
      </p>
      <div className="mt-4 h-1.5 rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-[#D4AF37]" style={{ width: "45%" }} />
      </div>
    </div>
  );
}

