"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialForm = {
  template_key: "appointment_reminder",
  channel: "WHATSAPP",
  template_name: "",
  subject: "",
  body: "",
  status: "ACTIVE",
};

export default function CommunicationTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const payload = await apiJson<any>("/api/clinical/notifications/templates");
      setTemplates(Array.isArray(payload.templates) ? payload.templates : []);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load templates"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    try {
      await apiJson("/api/clinical/notifications/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      notify.success("Template saved");
      setForm(initialForm);
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to save template"));
    }
  };

  const remove = async (id: number) => {
    try {
      await apiJson(`/api/clinical/notifications/templates?id=${id}`, {
        method: "DELETE",
      });
      notify.success("Template disabled");
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to disable template"));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Templates</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Manage WhatsApp, SMS, and email templates used by communication workflows.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="input"
              placeholder="Template key"
              value={form.template_key}
              onChange={(event) => setForm({ ...form, template_key: event.target.value })}
            />
            <select
              className="input"
              value={form.channel}
              onChange={(event) => setForm({ ...form, channel: event.target.value })}
            >
              <option value="WHATSAPP">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
            </select>
            <input
              className="input md:col-span-2"
              placeholder="Template name"
              value={form.template_name}
              onChange={(event) => setForm({ ...form, template_name: event.target.value })}
            />
            <input
              className="input md:col-span-2"
              placeholder="Subject"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
            />
            <textarea
              className="input md:col-span-2"
              rows={5}
              placeholder="Template body with {{variables}}"
              value={form.body}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
            />
            <select
              className="input"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
          <button className="tt-button mt-4" onClick={save}>
            Save Template
          </button>
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">Template Register</h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">
                      {template.template_name || template.template_key}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {template.template_key} • {template.channel} • {template.status}
                    </p>
                  </div>
                  <button
                    className="tt-button-secondary"
                    onClick={() => remove(Number(template.id))}
                  >
                    Disable
                  </button>
                </div>
                {template.subject && (
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {template.subject}
                  </p>
                )}
                {template.body && (
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                    {template.body}
                  </p>
                )}
              </div>
            ))}
            {!templates.length && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                No templates found.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
