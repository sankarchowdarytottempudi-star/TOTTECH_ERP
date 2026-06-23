"use client";

import {
  CalendarClock,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const initialForm = {
  class_id: "",
  section_id: "",
  subject_id: "",
  teacher_id: "",
  day_of_week: "MONDAY",
  start_time: "",
  end_time: "",
  room_no: "",
};

type Entry = {
  id: number;
  class_id?: number | null;
  section_id?: number | null;
  subject_id?: number | null;
  teacher_id?: number | null;
  day_of_week?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  room_no?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  subject_name?: string | null;
  teacher_name?: string | null;
  status?: string | null;
};

export default function TimetablePage() {
  const [entries, setEntries] =
    useState<Entry[]>([]);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [subjects, setSubjects] =
    useState<any[]>([]);
  const [teachers, setTeachers] =
    useState<any[]>([]);
  const [form, setForm] =
    useState(initialForm);
  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [role, setRole] =
    useState("");
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "erpUser"
        );
      setRole(
        stored
          ? JSON.parse(stored)?.role ||
              ""
          : ""
      );
    } catch {
      setRole("");
    }

    loadData();
  }, []);

  const canCreate =
    canManageRecord(
      role,
      "timetable",
      "create"
    );
  const canUpdate =
    canManageRecord(
      role,
      "timetable",
      "update"
    );
  const canDelete =
    canManageRecord(
      role,
      "timetable",
      "delete"
    );

  const loadData = async () => {
    try {
      const [
        timetable,
        roster,
        subjectRows,
      ] = await Promise.all([
        apiJson<{
          entries?: Entry[];
        }>("/api/timetable"),
        apiJson<any>("/api/roster"),
        apiJson<any[]>(
          "/api/subjects"
        ),
      ]);

      setEntries(
        timetable.entries || []
      );
      setClasses(
        Array.isArray(roster.classes)
          ? roster.classes
          : []
      );
      setSections(
        Array.isArray(roster.sections)
          ? roster.sections
          : []
      );
      setTeachers(
        Array.isArray(roster.teachers)
          ? roster.teachers
          : []
      );
      setSubjects(
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load timetable"
        )
      );
    }
  };

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  const teacherName = (
    teacher: any
  ) =>
    [
      teacher.first_name,
      teacher.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    `Teacher ${teacher.id}`;

  const saveEntry = async () => {
    try {
      setSaving(true);
      await apiJson(
        editingId
          ? `/api/timetable/${editingId}`
          : "/api/timetable",
        {
          method: editingId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      notify.success(
        editingId
          ? "Timetable updated"
          : "Timetable entry created"
      );
      setForm(initialForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save timetable"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (
    entry: Entry
  ) => {
    setEditingId(entry.id);
    setForm({
      class_id: String(
        entry.class_id || ""
      ),
      section_id: String(
        entry.section_id || ""
      ),
      subject_id: String(
        entry.subject_id || ""
      ),
      teacher_id: String(
        entry.teacher_id || ""
      ),
      day_of_week:
        entry.day_of_week ||
        "MONDAY",
      start_time:
        entry.start_time
          ? String(
              entry.start_time
            ).slice(0, 5)
          : "",
      end_time:
        entry.end_time
          ? String(
              entry.end_time
            ).slice(0, 5)
          : "",
      room_no:
        entry.room_no || "",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteEntry = async (
    entry: Entry
  ) => {
    if (
      !confirm(
        "Delete this timetable entry?"
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/timetable/${entry.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Timetable entry deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete timetable entry"
        )
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Timetable Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage class-section timetable entries using live ERP records.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            {editingId
              ? "Edit Timetable Entry"
              : "Create Timetable Entry"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <NativeSelect
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  class_id: value,
                  section_id: "",
                })
              }
            >
              <option value="">
                Select Class
              </option>
              {classes.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.class_name}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              label="Section"
              value={form.section_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  section_id: value,
                })
              }
            >
              <option value="">
                Select Section
              </option>
              {filteredSections.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.section_name}
                  </option>
                )
              )}
            </NativeSelect>
            <NativeSelect
              label="Subject"
              value={form.subject_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  subject_id: value,
                })
              }
            >
              <option value="">
                Select Subject
              </option>
              {subjects.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.subject_name}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              label="Teacher"
              value={form.teacher_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  teacher_id: value,
                })
              }
            >
              <option value="">
                Select Teacher
              </option>
              {teachers.map(
                (teacher) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacherName(
                      teacher
                    )}
                  </option>
                )
              )}
            </NativeSelect>
            <NativeSelect
              label="Day"
              value={form.day_of_week}
              onChange={(value) =>
                setForm({
                  ...form,
                  day_of_week: value,
                })
              }
            >
              {days.map((day) => (
                <option
                  key={day}
                  value={day}
                >
                  {day}
                </option>
              ))}
            </NativeSelect>
            <Input
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={(value) =>
                setForm({
                  ...form,
                  start_time: value,
                })
              }
            />
            <Input
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={(value) =>
                setForm({
                  ...form,
                  end_time: value,
                })
              }
            />
            <Input
              label="Room"
              value={form.room_no}
              onChange={(value) =>
                setForm({
                  ...form,
                  room_no: value,
                })
              }
            />
          </div>
          {(editingId
            ? canUpdate
            : canCreate) && (
            <button
              type="button"
              onClick={saveEntry}
              disabled={saving}
              className="tt-button mt-5 inline-flex items-center gap-2"
            >
              <Plus size={17} />
              {editingId
                ? "Update Entry"
                : "Create Entry"}
            </button>
          )}
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
              className="tt-button-secondary ml-3 mt-5 inline-flex px-5 py-3"
            >
              Cancel
            </button>
          )}
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Existing Timetable
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-amber-300">
                    <CalendarClock
                      size={20}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black">
                      {entry.day_of_week}
                    </h3>
                    <p className="truncate text-sm font-semibold text-amber-700">
                      {entry.class_name ||
                        "-"}
                      {entry.section_name
                        ? ` ${entry.section_name}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info
                    label="Subject"
                    value={
                      entry.subject_name ||
                      "-"
                    }
                  />
                  <Info
                    label="Teacher"
                    value={
                      entry.teacher_name ||
                      "-"
                    }
                  />
                  <Info
                    label="Time"
                    value={`${String(entry.start_time || "-").slice(0, 5)} - ${String(entry.end_time || "-").slice(0, 5)}`}
                  />
                  <Info
                    label="Room"
                    value={
                      entry.room_no ||
                      "-"
                    }
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {canUpdate && (
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(entry)
                      }
                      className="tt-button-secondary px-4 py-2 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteEntry(entry)
                      }
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Input({
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
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="input mt-1"
      />
    </label>
  );
}

function NativeSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="input mt-1"
      >
        {children}
      </select>
    </label>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-white px-3 py-2">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="truncate font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}
