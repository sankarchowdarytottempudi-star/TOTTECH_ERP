"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  Pencil,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type UserRow = {
  id: number;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  is_deleted?: boolean | null;
  deleted_at?: string | null;
  deleted_by_name?: string | null;
  display_name?: string | null;
  role_name?: string | null;
  role_key?: string | null;
  department_name?: string | null;
  created_at?: string | null;
  settings?: Record<string, unknown> | string | null;
};

type RoleOption = {
  id: number;
  role_name: string;
  role_key: string;
};

type FormState = {
  employee_id: string;
  name: string;
  mobile: string;
  email: string;
  department: string;
  role: string;
  username: string;
  password: string;
  status: string;
};

const initialForm: FormState = {
  employee_id: "",
  name: "",
  mobile: "",
  email: "",
  department: "",
  role: "receptionist",
  username: "",
  password: "",
  status: "Active",
};

export default function ClinicalUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [viewMode, setViewMode] = useState<"ACTIVE" | "DELETED">("ACTIVE");
  const [formError, setFormError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [userPayload, rolePayload] = await Promise.all([
        apiJson<{ rows: UserRow[] }>(
          `/api/clinical/operations/admin-users?deleted=${viewMode === "DELETED"}`
        ),
        apiJson<{ roles?: RoleOption[] }>(
          "/api/clinical/operations/roles"
        ),
      ]);

      setUsers(Array.isArray(userPayload.rows) ? userPayload.rows : []);
      setRoleOptions(Array.isArray(rolePayload.roles) ? rolePayload.roles : []);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load clinical users"));
    } finally {
      setLoading(false);
    }
  };

	  useEffect(() => {
	    void loadUsers();
	  }, [viewMode]);

  const resetForm = () => {
    setEditingUserId(null);
    setForm(initialForm);
    setFormError(null);
  };

  const startEdit = (user: UserRow) => {
    const settings = (typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings) || {};
    setEditingUserId(user.id);
    setForm({
      employee_id: settings.employee_id || "",
      name: user.full_name || user.display_name || "",
      mobile: user.phone || "",
      email: user.email || "",
      department: settings.department || "",
      role: user.role_key || user.role_name || user.role || "receptionist",
      username: user.email || "",
      password: "",
      status: user.is_active === false ? "Inactive" : "Active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveUser = async () => {
    setFormError(null);
    if (!form.name || !form.email) {
      const message = "Name and email are required.";
      setFormError(message);
      notify.error(message);
      return;
    }

    setSaving(true);
    try {
      const method = editingUserId ? "PATCH" : "POST";
      const body = {
        ...(editingUserId ? { id: editingUserId } : {}),
        employee_id: form.employee_id,
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        department: form.department,
        role: form.role,
        username: form.username,
        password: form.password,
        status: form.status,
      };

      await apiJson(
        "/api/clinical/operations/admin-users",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      notify.success(
        editingUserId ? "User updated" : "User created"
      );
      resetForm();
      await loadUsers();
    } catch (error) {
      const message = errorMessage(error, "Failed to save user");
      setFormError(message);
      notify.error(message);
      window.alert(`Error: ${message}`);
    } finally {
      setSaving(false);
    }
  };

	  const performAction = async (
	    userId: number,
	    action:
	      | "ACTIVATE"
	      | "DEACTIVATE"
	      | "LOCK"
	      | "ARCHIVE"
	      | "DELETE"
	      | "RESTORE"
	      | "PERMANENT_DELETE"
	  ) => {
	    if (
	      action === "DELETE" &&
	      !window.confirm(
	        "Soft delete this user? They will move to Deleted Users and can be restored."
	      )
	    ) {
	      return;
	    }

	    if (
	      action === "PERMANENT_DELETE" &&
	      !window.confirm(
	        "Permanently delete this user? This is only allowed when no clinical records reference the user."
	      )
	    ) {
	      return;
	    }

    try {
      await apiJson(
        "/api/clinical/operations/admin-users",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, action }),
        }
      );
	      notify.success(
	        action === "DELETE"
	          ? "User deleted"
	          : action === "RESTORE"
	          ? "User restored"
	          : action === "PERMANENT_DELETE"
	          ? "User permanently deleted"
	          : action === "LOCK"
	          ? "User locked"
	          : action === "ARCHIVE"
	          ? "User archived"
	          : action === "ACTIVATE"
	          ? "User activated"
	          : "User deactivated"
      );
      await loadUsers();
    } catch (error) {
      notify.error(errorMessage(error, "Action failed"));
    }
  };

  const resetPassword = async (user: UserRow) => {
    const password = window.prompt(
      `Enter new password for ${user.full_name || user.email}`
    );

    if (!password) {
      return;
    }

    try {
      await apiJson("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, password }),
      });
      notify.success("Password updated");
    } catch (error) {
      notify.error(errorMessage(error, "Password reset failed"));
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const text = `${user.full_name || ""} ${user.email || ""} ${user.role_name || user.role || ""} ${user.department_name || ""}`.toLowerCase();
        return text.includes(search.toLowerCase());
      }),
    [users, search]
  );

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Clinical User Management
          </p>
          <h1 className="mt-2 text-4xl font-black">Hospital Users</h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-200">
            Manage clinical operational users, roles, departments, account status and password resets within the active hospital context.
          </p>
        </section>

        <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingUserId ? "Edit User" : "Create User"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {editingUserId
                    ? "Update a hospital user record. Leave password blank to keep the current password."
                    : "Create a new hospital user and assign them to the current hospital."}
                </p>
              </div>
              {editingUserId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-black text-slate-950"
                >
                  <X size={16} />
                  Cancel
                </button>
              ) : null}
            </div>

            <div className="grid gap-4">
              {formError ? (
                <div className="rounded-[8px] border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {formError}
                </div>
              ) : null}
              <Field
                label="Name"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />
              <Field
                label="Mobile"
                value={form.mobile}
                onChange={(value) => setForm({ ...form, mobile: value })}
              />
              <Field
                label="Department"
                value={form.department}
                onChange={(value) => setForm({ ...form, department: value })}
              />
              <SelectField
                label="Role"
                value={form.role}
                options={
                  roleOptions.map((role) => [
                    role.role_key,
                    role.role_name,
                  ]) as [string, string][]
                }
                onChange={(value) => setForm({ ...form, role: value })}
              />
              {!editingUserId ? (
                <Field
                  label="Username"
                  value={form.username}
                  onChange={(value) => setForm({ ...form, username: value })}
                />
              ) : null}
              <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setForm({ ...form, password: value })}
              />
              <SelectField
                label="Status"
                value={form.status}
                options={["Active", "Inactive"]}
                onChange={(value) => setForm({ ...form, status: value })}
              />
            </div>

            <button
              type="button"
              onClick={saveUser}
              disabled={saving}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0B1F3A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#04142E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {editingUserId ? "Update User" : "Create User"}
            </button>
          </div>

          <div className="space-y-5">
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
	                <h2 className="text-2xl font-black text-slate-950">Users</h2>
	                  <p className="mt-1 text-sm text-slate-600">
	                    {filteredUsers.length} {viewMode === "DELETED" ? "deleted" : "active"} users in current hospital context.
	                  </p>
	                </div>
	                <div className="flex flex-wrap items-center gap-2">
	                  <button
	                    type="button"
	                    onClick={() => setViewMode("ACTIVE")}
	                    className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-black ${
	                      viewMode === "ACTIVE"
	                        ? "border-[#D4AF37] bg-[#fff9e8] text-slate-950"
	                        : "border-slate-300 bg-slate-50 text-slate-950"
	                    }`}
	                  >
	                    Active Users
	                  </button>
	                  <button
	                    type="button"
	                    onClick={() => setViewMode("DELETED")}
	                    className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-black ${
	                      viewMode === "DELETED"
	                        ? "border-[#D4AF37] bg-[#fff9e8] text-slate-950"
	                        : "border-slate-300 bg-slate-50 text-slate-950"
	                    }`}
	                  >
	                    Deleted Users
	                  </button>
	                  <button
                    type="button"
                    onClick={loadUsers}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-black text-slate-950"
                  >
                    <RefreshCcw size={16} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-[8px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4">
                {loading ? (
                  <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                    Loading users...
                  </div>
                ) : filteredUsers.length ? (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-[12px] border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-black text-slate-950">
                              {user.full_name || user.display_name || "Unnamed user"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {user.email} · {user.role_name || user.role || "Unknown role"}
                            </p>
                          </div>
	                          <div className="flex flex-wrap items-center gap-2">
	                            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${user.is_deleted ? "bg-slate-200 text-slate-700" : user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
	                              {user.is_deleted ? "Deleted" : user.status || (user.is_active ? "Active" : "Inactive")}
	                            </span>
	                            {viewMode === "ACTIVE" ? (
	                              <button
	                                type="button"
	                                onClick={() => startEdit(user)}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-950"
	                              >
	                                <Pencil size={14} /> Edit
	                              </button>
	                            ) : null}
                          </div>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-[8px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
                            <p className="font-black text-slate-950">Department</p>
                            <p>{user.department_name || "—"}</p>
                          </div>
	                          <div className="rounded-[8px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
	                            <p className="font-black text-slate-950">{viewMode === "DELETED" ? "Deleted" : "Created"}</p>
	                            <p>{viewMode === "DELETED" ? (user.deleted_at ? new Date(user.deleted_at).toLocaleString() : "—") : (user.created_at ? new Date(user.created_at).toLocaleString() : "—")}</p>
	                            {viewMode === "DELETED" && user.deleted_by_name ? (
	                              <p className="mt-1 text-xs">By {user.deleted_by_name}</p>
	                            ) : null}
	                          </div>
	                        </div>
	                        <div className="mt-4 flex flex-wrap gap-2">
	                          {viewMode === "ACTIVE" ? (
	                            <>
	                              <button
	                                type="button"
	                                onClick={() => performAction(user.id, user.is_active ? "DEACTIVATE" : "ACTIVATE")}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-950"
	                              >
	                                <CheckCircle2 size={14} />
	                                {user.is_active ? "Deactivate" : "Activate"}
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => performAction(user.id, "LOCK")}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-950"
	                              >
	                                <ShieldCheck size={14} />
	                                Lock
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => resetPassword(user)}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-950"
	                              >
	                                <KeyRound size={14} />
	                                Reset Password
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => performAction(user.id, "DELETE")}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700"
	                              >
	                                <Trash2 size={14} />
	                                Delete
	                              </button>
	                            </>
	                          ) : (
	                            <>
	                              <button
	                                type="button"
	                                onClick={() => performAction(user.id, "RESTORE")}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"
	                              >
	                                <CheckCircle2 size={14} />
	                                Restore
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => performAction(user.id, "PERMANENT_DELETE")}
	                                className="inline-flex items-center gap-2 rounded-[8px] border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700"
	                              >
	                                <Trash2 size={14} />
	                                Permanent Delete
	                              </button>
	                            </>
	                          )}
	                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                    No users found for the current hospital context.
                  </div>
                )}
              </div>
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-900">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[8px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
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
  options: Array<string | [string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-900">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[8px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      >
        {options.map((option) => {
          const [optionValue, optionLabel] = Array.isArray(option)
            ? option
            : [option, option];

          return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
          );
        })}
      </select>
    </label>
  );
}
