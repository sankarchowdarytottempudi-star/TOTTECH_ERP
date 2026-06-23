"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialForm = {
  feedback_type: "COMPLAINT",
  title: "",
  description: "",
  priority: "NORMAL",
  parent_name: "",
  contact_phone: "",
};

export default function FeedbackPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const payload = await apiJson<any>("/api/feedback");
      setRows(Array.isArray(payload.feedback) ? payload.feedback : []);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load feedback"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    try {
      await apiJson("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      notify.success("Feedback saved");
      setForm(initialForm);
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to save feedback"));
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiJson("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      notify.success("Status updated");
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to update status"));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Complaints & Suggestions</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Track complaints, suggestions, feedback and escalations from one communication register.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-3 md:grid-cols-3">
            <select className="input" value={form.feedback_type} onChange={(event) => setForm({ ...form, feedback_type: event.target.value })}>
              <option value="COMPLAINT">Complaint</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="FEEDBACK">Feedback</option>
              <option value="ESCALATION">Escalation</option>
            </select>
            <input className="input" placeholder="Parent / Contact Name" value={form.parent_name} onChange={(event) => setForm({ ...form, parent_name: event.target.value })} />
            <input className="input" placeholder="Mobile" value={form.contact_phone} onChange={(event) => setForm({ ...form, contact_phone: event.target.value })} />
            <input className="input md:col-span-2" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <select className="input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <textarea className="input md:col-span-3" placeholder="Details" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>
          <button className="tt-button mt-4" onClick={save}>Save</button>
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">Register</h2>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{row.title}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {row.feedback_type} • {row.priority} • {row.parent_name || "-"}
                    </p>
                  </div>
                  <select className="input max-w-[180px]" value={row.status} onChange={(event) => updateStatus(Number(row.id), event.target.value)}>
                    <option value="OPEN">Open</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                {row.description && <p className="mt-2 text-sm text-slate-700">{row.description}</p>}
              </div>
            ))}
            {!rows.length && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                No feedback records found.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
