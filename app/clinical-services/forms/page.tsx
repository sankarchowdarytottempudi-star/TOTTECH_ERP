"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Layers3,
  Plus,
  Settings2,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ClinicalForm = Row & {
  id: number;
  form_key: string;
  form_name: string;
  module_name: string;
  fields?: Row[];
};

const fieldTypes = [
  "Text",
  "Number",
  "Date",
  "Date Time",
  "Email",
  "Phone",
  "Dropdown",
  "Multi Select",
  "Checkbox",
  "Radio",
  "File Upload",
  "Image Upload",
  "Rich Text",
  "Formula",
  "Lookup",
  "Section",
  "Tab",
  "Grid",
  "Repeating Group",
];

const initialForm = {
  form_key: "",
  form_name: "",
  module_name: "patients",
};

const initialField = {
  form_id: "",
  field_key: "",
  label: "",
  field_type: "Text",
  section_key: "",
  tab_key: "",
  sort_order: "10",
  is_required: false,
  options: "",
};

export default function ClinicalFormsPage() {
  const [forms, setForms] = useState<ClinicalForm[]>([]);
  const [form, setForm] = useState(initialForm);
  const [field, setField] = useState(initialField);
  const [saving, setSaving] = useState(false);

  const selectedForm = useMemo(
    () =>
      forms.find((item) => String(item.id) === String(field.form_id)) ||
      forms[0],
    [field.form_id, forms]
  );

  const load = async () => {
    const response = await fetch("/api/clinical/forms");

    if (response.ok) {
      const payload = await response.json();
      const loadedForms = payload.forms || [];
      setForms(loadedForms);
      if (!field.form_id && loadedForms[0]) {
        setField((current) => ({
          ...current,
          form_id: String(loadedForms[0].id),
        }));
      }
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveForm = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/clinical/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save form");
      }

      notify.success("Clinical form saved");
      setForm(initialForm);
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to save form"
      );
    } finally {
      setSaving(false);
    }
  };

  const saveField = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/clinical/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...field,
          action: "field",
          options: field.options
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          sort_order: Number(field.sort_order || 0),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save field");
      }

      notify.success("Clinical field saved");
      setField({
        ...initialField,
        form_id: field.form_id,
      });
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to save field"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-teal-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">
            No Code Clinical Configuration
          </p>
          <h1 className="mt-2 text-4xl font-black">Dynamic Form Builder</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Configure patient, appointment, IVF, laboratory, radiology, billing,
            and workflow forms from the database. The patient registration page
            is already generated from this form definition.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <ClipboardList size={22} />
              </div>
              <h2 className="text-2xl font-black">Create Form</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <TextField
                label="Form Key"
                value={form.form_key}
                placeholder="patient_registration"
                onChange={(value) => setForm({ ...form, form_key: value })}
              />
              <TextField
                label="Form Name"
                value={form.form_name}
                placeholder="Patient Registration"
                onChange={(value) => setForm({ ...form, form_name: value })}
              />
              <TextField
                label="Module"
                value={form.module_name}
                placeholder="patients"
                onChange={(value) => setForm({ ...form, module_name: value })}
              />
            </div>
            <button
              onClick={saveForm}
              disabled={saving}
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              <Plus size={17} />
              Save Form
            </button>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <Settings2 size={22} />
              </div>
              <h2 className="text-2xl font-black">Add Field</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-xs font-black uppercase text-slate-600">
                  Form
                </span>
                <select
                  value={field.form_id || String(forms[0]?.id || "")}
                  onChange={(event) =>
                    setField({ ...field, form_id: event.target.value })
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                >
                  {forms.map((item) => (
                    <option key={String(item.id)} value={String(item.id)}>
                      {item.form_name}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="Field Key"
                value={field.field_key}
                placeholder="chief_complaint"
                onChange={(value) => setField({ ...field, field_key: value })}
              />
              <TextField
                label="Label"
                value={field.label}
                placeholder="Chief Complaint"
                onChange={(value) => setField({ ...field, label: value })}
              />
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">
                  Field Type
                </span>
                <select
                  value={field.field_type}
                  onChange={(event) =>
                    setField({ ...field, field_type: event.target.value })
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="Sort Order"
                value={field.sort_order}
                onChange={(value) => setField({ ...field, sort_order: value })}
              />
              <TextField
                label="Section"
                value={field.section_key}
                onChange={(value) => setField({ ...field, section_key: value })}
              />
              <TextField
                label="Tab"
                value={field.tab_key}
                onChange={(value) => setField({ ...field, tab_key: value })}
              />
              <TextField
                label="Options"
                value={field.options}
                placeholder="Female, Male, Other"
                onChange={(value) => setField({ ...field, options: value })}
              />
              <label className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black">
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(event) =>
                    setField({ ...field, is_required: event.target.checked })
                  }
                />
                Required Field
              </label>
            </div>
            <button
              onClick={saveField}
              disabled={saving || !forms.length}
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              <Plus size={17} />
              Save Field
            </button>
          </article>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
              <Layers3 size={22} />
            </div>
            <h2 className="text-2xl font-black">Configured Forms</h2>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-3">
              {forms.map((item) => (
                <button
                  key={String(item.id)}
                  onClick={() =>
                    setField({
                      ...field,
                      form_id: String(item.id),
                    })
                  }
                  className={`w-full rounded-[8px] border p-4 text-left ${
                    selectedForm?.id === item.id
                      ? "border-teal-300 bg-teal-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="break-words font-black">{item.form_name}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                    {item.module_name} | {String(item.fields?.length || 0)}{" "}
                    fields
                  </p>
                </button>
              ))}
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xl font-black">
                {selectedForm?.form_name || "Select a form"}
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(selectedForm?.fields || []).map((item) => (
                  <div
                    key={String(item.id)}
                    className="rounded-[8px] border border-slate-200 bg-white p-4"
                  >
                    <p className="break-words font-black">
                      {String(item.label || item.field_key)}
                    </p>
                    <p className="mt-1 break-words text-xs font-black uppercase text-teal-700">
                      {String(item.field_type)} |{" "}
                      {item.is_required ? "Required" : "Optional"}
                    </p>
                  </div>
                ))}
              </div>
              {!selectedForm?.fields?.length ? (
                <p className="mt-4 rounded-[8px] border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600">
                  No fields configured for this form.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
    </label>
  );
}
