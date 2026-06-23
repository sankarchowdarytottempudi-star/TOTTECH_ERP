"use client";

import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

const statuses = [
  ["WILL_ATTEND", "Came To School/College Today"],
  ["BOARDED_BUS", "Boarded Bus Today"],
  ["ABSENT", "Not Attending Today"],
  ["LEAVE", "Leave Requested"],
  ["MEDICAL_LEAVE", "Medical Leave"],
];

const statusLabels: Record<string, string> = Object.fromEntries(
  statuses.map(([value, label]) => [value, label])
);

export default function ParentAttendanceDeclarationPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    student_id: "",
    declaration_date: new Date().toISOString().slice(0, 10),
    declaration_status: "WILL_ATTEND",
    reason: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const rows = await apiJson<any>("/api/parent/context");
      setStudents(Array.isArray(rows.linked_students) ? rows.linked_students : []);
      setDeclarations(Array.isArray(rows.declarations) ? rows.declarations : []);
      setForm((current) => ({
        ...current,
        student_id:
          current.student_id ||
          String(rows.selected_student?.id || rows.linked_students?.[0]?.id || ""),
      }));
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load declarations"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const requiresReason = useMemo(
    () => ["LEAVE", "MEDICAL_LEAVE"].includes(String(form.declaration_status || "").toUpperCase()),
    [form.declaration_status]
  );

  const save = async () => {
    try {
      if (!form.student_id) {
        notify.error("Select a student before submitting a declaration.");
        return;
      }
      if (requiresReason && !String(form.reason || "").trim()) {
        notify.error("Reason is required for leave or medical leave declarations.");
        return;
      }
      await apiJson("/api/parent-attendance-declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      notify.success("Attendance declaration saved");
      setForm((current) => ({ ...current, reason: "" }));
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to save declaration"));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Parent Daily Declaration
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Submit whether your child came to school/college, boarded the bus, or is absent today. Staff can review this on the school/college side.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-3 md:grid-cols-4">
            <select
              className="input"
              value={form.student_id}
              onChange={(event) =>
                setForm({ ...form, student_id: event.target.value })
              }
            >
              <option value="">Select Student *</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_name || `Student ${student.id}`}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="date"
              value={form.declaration_date}
              onChange={(event) =>
                setForm({ ...form, declaration_date: event.target.value })
              }
            />
            <select
              className="input"
              value={form.declaration_status}
              onChange={(event) =>
                setForm({
                  ...form,
                  declaration_status: event.target.value,
                })
              }
            >
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button className="tt-button" onClick={save}>
              Save Declaration
            </button>
            <textarea
              className="input md:col-span-4"
              placeholder={requiresReason ? "Reason *" : "Reason / notes"}
              value={form.reason}
              onChange={(event) =>
                setForm({ ...form, reason: event.target.value })
              }
            />
          </div>
          {!students.length && !loading && (
            <p className="mt-3 text-sm font-semibold text-amber-700">
              No parent-linked students were found for this account.
            </p>
          )}
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Recent Declarations
          </h2>
          <div className="space-y-3">
            {declarations.map((row) => (
              <div key={row.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">
                      {row.student_name}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {[row.admission_number, row.class_name, row.section_name].filter(Boolean).join(" • ") || "-"}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
                    {statusLabels[String(row.declaration_status || "").toUpperCase()] ||
                      String(row.declaration_status || "").replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {new Date(String(row.declaration_date)).toLocaleDateString()} {row.reason ? `- ${row.reason}` : ""}
                </p>
              </div>
            ))}
            {!declarations.length && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                No parent daily declarations have been submitted yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
