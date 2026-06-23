"use client";

import {
  Archive,
  Edit,
  KeyRound,
  Lock,
  RotateCcw,
  Save,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type UserRow = {
  id: number;
  school_id?: number | null;
  school_ids?: number[];
  school_access?: {
    id: number;
    school_name?: string | null;
    school_code?: string | null;
    is_primary?: boolean | null;
  }[];
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  is_deleted?: boolean | null;
  locked_at?: string | null;
  archived_at?: string | null;
  schools?: {
    school_name?: string | null;
  } | null;
};

type SchoolRow = {
  id: number;
  school_name?: string | null;
};

type ModuleAccessRow = {
  id: number;
  module_key: string;
  module_name: string;
  category?: string | null;
  enabled_for_school?: boolean;
  enabled_for_user?: boolean;
};

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  whatsapp_number: "",
  alternative_mobile: "",
  emergency_contact_number: "",
  password: "",
  role: "TEACHER",
  school_ids: [] as number[],
  primary_school_id: "",
  is_active: true,
};

const roleOptions = [
  "SUPER_ADMIN",
  "ADMIN",
  "PRINCIPAL",
  "TEACHER",
  "ACCOUNTANT",
  "HOSTEL_ADMIN",
  "TRANSPORT_ADMIN",
  "PARENT",
];

export default function UsersPage() {
  const [users, setUsers] =
    useState<UserRow[]>([]);
  const [schools, setSchools] =
    useState<SchoolRow[]>([]);
  const [search, setSearch] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [form, setForm] =
    useState(initialForm);
  const [editingUserId, setEditingUserId] =
    useState<number | null>(null);
  const [saving, setSaving] =
    useState(false);
  const [moduleAccessUser, setModuleAccessUser] =
    useState<UserRow | null>(null);
  const [moduleSchoolId, setModuleSchoolId] =
    useState("");
  const [moduleRows, setModuleRows] =
    useState<ModuleAccessRow[]>([]);
  const [moduleSaving, setModuleSaving] =
    useState(false);

  async function loadData() {
    try {
      const [userRows, schoolRows] =
        await Promise.all([
          apiJson<UserRow[]>(
            "/api/users"
          ),
          apiJson<SchoolRow[]>(
            "/api/schools"
          ),
        ]);

      setUsers(
        Array.isArray(userRows)
          ? userRows
          : []
      );
      setSchools(
        Array.isArray(schoolRows)
          ? schoolRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load users"
        )
      );
    }
  }

  useEffect(() => {
    void Promise.resolve().then(
      loadData
    );
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingUserId(null);
  };

  const startEdit = (user: UserRow) => {
    setEditingUserId(user.id);
    setForm({
      full_name:
        user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      whatsapp_number: (user as any).whatsapp_number || "",
      alternative_mobile: (user as any).alternative_mobile || "",
      emergency_contact_number: (user as any).emergency_contact_number || "",
      password: "",
      role: user.role || "TEACHER",
      school_ids:
        user.school_access?.map(
          (school) => school.id
        ) ??
        (user.school_id
          ? [user.school_id]
          : []),
      primary_school_id:
        String(
          user.school_access?.find(
            (school) =>
              school.is_primary
          )?.id ??
            user.school_id ??
            ""
        ),
      is_active:
        user.is_active !== false,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const submitUser = async () => {
    try {
      setSaving(true);
      const method = editingUserId
        ? "PUT"
        : "POST";
      const endpoint = editingUserId
        ? `/api/users/${editingUserId}`
        : "/api/users";

      await apiJson(endpoint, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      notify.success(
        editingUserId
          ? "User updated"
          : "User created"
      );
      resetForm();
      await loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save user"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (
    user: UserRow
  ) => {
    const password = prompt(
      `New password for ${user.full_name || user.email}`
    );

    if (!password) {
      return;
    }

    try {
      await apiJson(
        "/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            password,
          }),
        }
      );
      notify.success(
        "Password updated"
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update password"
        )
      );
    }
  };

  const updateLifecycle = async (
    user: UserRow,
    action: "DISABLE" | "LOCK" | "ARCHIVE" | "RESTORE"
  ) => {
    const label =
      action.charAt(0) +
      action.slice(1).toLowerCase();

    if (
      !confirm(
        `${label} ${user.full_name || user.email}?`
      )
    ) {
      return;
    }

    try {
      await apiJson(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });
      notify.success(
        `User ${label.toLowerCase()}d`
      );
      await loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update user"
        )
      );
    }
  };

  const viewHistory = async (
    user: UserRow
  ) => {
    try {
      const history = await apiJson<{
        loginHistory?: unknown[];
        auditHistory?: unknown[];
      }>(`/api/users/${user.id}/history`);

      alert(
        JSON.stringify(
          history,
          null,
          2
        )
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load user history"
        )
      );
    }
  };

  const openModuleAccess = async (
    user: UserRow
  ) => {
    const firstSchool =
      user.school_access?.find(
        (school) => school.is_primary
      )?.id ||
      user.school_access?.[0]?.id ||
      user.school_id ||
      schools[0]?.id ||
      null;
    if (!firstSchool) {
      notify.error(
        "Assign a school/college before managing module access."
      );
      return;
    }

    setModuleAccessUser(user);
    setModuleSchoolId(String(firstSchool));
    try {
      const payload = await apiJson<{
        modules?: ModuleAccessRow[];
      }>(
        `/api/users/${user.id}/modules?school_id=${firstSchool}`
      );
      setModuleRows(
        Array.isArray(payload.modules)
          ? payload.modules
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load module access"
        )
      );
    }
  };

  const loadUserModuleAccess = async (
    userId: number,
    schoolId: number
  ) => {
    const payload = await apiJson<{
      modules?: ModuleAccessRow[];
    }>(
      `/api/users/${userId}/modules?school_id=${schoolId}`
    );
    setModuleRows(
      Array.isArray(payload.modules)
        ? payload.modules
        : []
    );
  };

  const saveModuleAccess = async () => {
    if (!moduleAccessUser) return;
    try {
      setModuleSaving(true);
      await apiJson(
        `/api/users/${moduleAccessUser.id}/modules`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            school_id: Number(moduleSchoolId),
            module_keys: moduleRows
              .filter((row) => row.enabled_for_user)
              .map((row) => row.module_key),
          }),
        }
      );
      notify.success("Module access updated");
      setModuleAccessUser(null);
      setModuleRows([]);
      await loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save module access"
        )
      );
    } finally {
      setModuleSaving(false);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const text = `
          ${user.full_name || ""}
          ${user.email || ""}
          ${user.phone || ""}
          ${user.role || ""}
          ${user.schools?.school_name || ""}
          ${(user.school_access || [])
            .map((school) => school.school_name)
            .join(" ")}
        `.toLowerCase();

        const matchesSearch =
          text.includes(
            search.toLowerCase()
          );
        const normalizedStatus =
          (user.status ||
            (user.is_active === false
              ? "INACTIVE"
              : "ACTIVE")
          ).toUpperCase();
        const matchesStatus =
          statusFilter === "ALL" ||
          normalizedStatus === statusFilter;

        return (
          matchesSearch && matchesStatus
        );
      }),
    [users, search, statusFilter]
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="tt-hero p-8 text-white">
          <p className="text-xs font-black uppercase tracking-wide text-amber-300">
            Security Center
          </p>
          <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
            User Management
          </h1>
          <p className="mt-2 max-w-3xl text-white/85">
            Manage users, school/college access, roles, active status, and login credentials.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
          />
          <StatCard
            title="Teachers"
            value={
              users.filter(
                (user) =>
                  user.role ===
                  "TEACHER"
              ).length
            }
          />
          <StatCard
            title="Principals"
            value={
              users.filter(
                (user) =>
                  user.role ===
                  "PRINCIPAL"
              ).length
            }
          />
          <StatCard
            title="Active Users"
            value={
              users.filter(
                (user) =>
                  (user.status ||
                    "ACTIVE") ===
                    "ACTIVE" &&
                  user.is_active !== false
              ).length
            }
          />
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {editingUserId
                  ? "Edit User"
                  : "Create User"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {editingUserId
                  ? "Update the same fields used during user creation. Password is optional."
                  : "Create a user with school/college, role, and login access."}
              </p>
            </div>
            {editingUserId ? (
              <button
                onClick={resetForm}
                className="tt-button-secondary inline-flex items-center gap-2"
              >
                <X size={16} />
                Cancel Edit
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Full Name"
              value={form.full_name}
              onChange={(value) =>
                setForm({
                  ...form,
                  full_name: value,
                })
              }
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(value) =>
                setForm({
                  ...form,
                  email: value,
                })
              }
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                setForm({
                  ...form,
                  phone: value,
                })
              }
            />
            <Field
              label="WhatsApp Number"
              value={form.whatsapp_number}
              onChange={(value) =>
                setForm({
                  ...form,
                  whatsapp_number: value,
                })
              }
            />
            <Field
              label="Alternative Mobile Number"
              value={form.alternative_mobile}
              onChange={(value) =>
                setForm({
                  ...form,
                  alternative_mobile: value,
                })
              }
            />
            <Field
              label="Emergency Contact Number"
              value={form.emergency_contact_number}
              onChange={(value) =>
                setForm({
                  ...form,
                  emergency_contact_number: value,
                })
              }
            />
            <Field
              label={
                editingUserId
                  ? "New Password (optional)"
                  : "Password"
              }
              type="password"
              value={form.password}
              onChange={(value) =>
                setForm({
                  ...form,
                  password: value,
                })
              }
            />
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Role
              </span>
              <select
                className="input"
                value={form.role}
                onChange={(event) =>
                  setForm({
                    ...form,
                    role: event.target.value,
                  })
                }
              >
                {roleOptions.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <div className="min-w-0 xl:col-span-2">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="block text-sm font-bold text-slate-700">
                  School/College Access
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800"
                  onClick={() =>
                    setForm((current) => {
                      const allIds =
                        schools.map(
                          (school) =>
                            school.id
                        );
                      return {
                        ...current,
                        school_ids: allIds,
                        primary_school_id:
                          current.primary_school_id ||
                          String(
                            allIds[0] || ""
                          ),
                      };
                    })
                  }
                >
                  Select All Schools/Colleges
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  {schools.map((school) => {
                    const checked =
                      form.school_ids.includes(
                        school.id
                      );
                    return (
                      <label
                        key={school.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            setForm(
                              (current) => {
                                const nextIds =
                                  event.target
                                    .checked
                                    ? [
                                        ...current.school_ids,
                                        school.id,
                                      ]
                                    : current.school_ids.filter(
                                        (id) =>
                                          id !==
                                          school.id
                                      );
                                const primaryStillValid =
                                  nextIds.includes(
                                    Number(
                                      current.primary_school_id
                                    )
                                  );
                                return {
                                  ...current,
                                  school_ids:
                                    Array.from(
                                      new Set(
                                        nextIds
                                      )
                                    ),
                                  primary_school_id:
                                    primaryStillValid
                                      ? current.primary_school_id
                                      : String(
                                          nextIds[0] ||
                                            ""
                                        ),
                                };
                              }
                            )
                          }
                        />
                        <span className="truncate">
                          {school.school_name ||
                            `School ${school.id}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Primary School/College
              </span>
              <select
                className="input"
                value={
                  form.primary_school_id
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    primary_school_id:
                      event.target.value,
                  })
                }
              >
                <option value="">
                  Select Primary School/College
                </option>
                {schools
                  .filter((school) =>
                    form.school_ids.includes(
                      school.id
                    )
                  )
                  .map((school) => (
                    <option
                      key={school.id}
                      value={school.id}
                    >
                      {school.school_name ||
                        `School ${school.id}`}
                    </option>
                  ))}
              </select>
            </label>
            <label className="flex min-h-[58px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_active:
                      event.target.checked,
                  })
                }
              />
              <span className="text-sm font-bold text-slate-800">
                Active User
              </span>
            </label>
          </div>

          <button
            onClick={submitUser}
            disabled={saving}
            className="tt-button mt-6 inline-flex items-center gap-2"
          >
            {editingUserId ? (
              <Save size={17} />
            ) : (
              <UserPlus size={17} />
            )}
            {saving
              ? "Saving..."
              : editingUserId
                ? "Update User"
                : "Create User"}
          </button>
        </section>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-black text-slate-950">
            All Users
          </h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="input md:w-48"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="ACTIVE">
                Active
              </option>
              <option value="INACTIVE">
                Inactive
              </option>
              <option value="LOCKED">
                Locked
              </option>
              <option value="ARCHIVED">
                Archived
              </option>
            </select>
            <input
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="input md:max-w-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-amber-300 bg-slate-950 text-xl font-black text-amber-300">
                    {user.full_name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-black text-slate-950">
                      {user.full_name ||
                        "Unnamed User"}
                    </h3>
                    <p className="truncate text-sm font-semibold text-slate-600">
                      {user.email}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {user.phone ||
                        "No phone"}{" "}
                      ·{" "}
                      {user.school_access?.length
                        ? user.school_access
                            .map((school) =>
                              school.is_primary
                                ? `${school.school_name} (Primary)`
                                : school.school_name
                            )
                            .join(", ")
                        : user.schools
                          ?.school_name ||
                          "No school/college assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-800">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-black ${
                      (user.status ||
                        "ACTIVE") ===
                        "ACTIVE" &&
                      user.is_active !== false
                        ? "bg-green-50 text-green-700"
                        : (user.status ||
                              "").toUpperCase() ===
                            "LOCKED"
                          ? "bg-orange-50 text-orange-700"
                          : (user.status ||
                                "").toUpperCase() ===
                              "ARCHIVED"
                            ? "bg-slate-200 text-slate-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {user.status ||
                      (user.is_active !== false
                        ? "ACTIVE"
                        : "INACTIVE")}
                  </span>
                  <button
                    onClick={() =>
                      startEdit(user)
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-950"
                  >
                    <Edit size={15} />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      resetPassword(user)
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                  >
                    <KeyRound size={15} />
                    Reset Password
                  </button>
                  {(user.status || "ACTIVE") !==
                  "ARCHIVED" ? (
                    <>
                      <button
                        onClick={() =>
                          updateLifecycle(
                            user,
                            "DISABLE"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
                      >
                        <X size={15} />
                        Disable
                      </button>
                      <button
                        onClick={() =>
                          updateLifecycle(
                            user,
                            "LOCK"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700"
                      >
                        <Lock size={15} />
                        Lock
                      </button>
                      <button
                        onClick={() =>
                          updateLifecycle(
                            user,
                            "ARCHIVE"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800"
                      >
                        <Archive size={15} />
                        Archive
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        updateLifecycle(
                          user,
                          "RESTORE"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700"
                    >
                      <RotateCcw size={15} />
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() =>
                      viewHistory(user)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    History
                  </button>
                  <button
                    onClick={() =>
                      openModuleAccess(user)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800"
                  >
                    Modules & Pages
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {moduleAccessUser ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">
                    Manage Module & Page Access
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {moduleAccessUser.full_name || moduleAccessUser.email}
                  </p>
                </div>
                <button
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
                  onClick={() => {
                    setModuleAccessUser(null);
                    setModuleRows([]);
                  }}
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    School/College
                  </span>
                  <select
                    className="input"
                    value={moduleSchoolId}
                    onChange={async (event) => {
                      const nextSchoolId = event.target.value;
                      setModuleSchoolId(nextSchoolId);
                      if (moduleAccessUser && nextSchoolId) {
                        await loadUserModuleAccess(
                          moduleAccessUser.id,
                          Number(nextSchoolId)
                        );
                      }
                    }}
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.school_name || `School ${school.id}`}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Modules and pages are limited by the selected school/college subscription. A user can only receive what the school/college already owns.
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {moduleRows.map((module) => (
                  <label
                    key={module.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                      module.enabled_for_school
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={module.enabled_for_user !== false}
                      disabled={!module.enabled_for_school}
                      onChange={(event) =>
                        setModuleRows((current) =>
                          current.map((row) =>
                            row.id === module.id
                              ? {
                                  ...row,
                                  enabled_for_user:
                                    event.target.checked,
                                }
                              : row
                          )
                        )
                      }
                      className="mt-1"
                    />
                    <div className="min-w-0">
                      <div className="font-black text-slate-950">
                        {module.module_name}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        {module.module_key}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="tt-button-secondary"
                  onClick={() => {
                    setModuleAccessUser(null);
                    setModuleRows([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="tt-button inline-flex items-center gap-2"
                  onClick={saveModuleAccess}
                  disabled={moduleSaving}
                >
                  <Save size={16} />
                  {moduleSaving ? "Saving..." : "Save Module Access"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="tt-card p-6">
      <p className="text-sm font-bold uppercase text-slate-500">
        {title}
      </p>
      <h2 className="mt-2 text-4xl font-black text-slate-950">
        {value}
      </h2>
    </div>
  );
}
