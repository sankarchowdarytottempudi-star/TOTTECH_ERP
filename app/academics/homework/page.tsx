"use client";

import {
  BookOpenCheck,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialForm = {
  class_id: "",
  section_id: "",
  subject_id: "",
  teacher_id: "",
  title: "",
  description: "",
  due_date: "",
  status: "ASSIGNED",
};

type ClassRow = {
  id: number | string;
  class_name?: string | null;
};

type SectionRow = {
  id: number | string;
  class_id?: number | string | null;
  section_name?: string | null;
};

type SubjectRow = {
  id: number | string;
  subject_name?: string | null;
};

type TeacherAssignment = {
  class_id?: number | string | null;
};

type TeacherRow = {
  id: number | string;
  first_name?: string | null;
  last_name?: string | null;
  assignments?: TeacherAssignment[];
};

type HomeworkRow = {
  id: number | string;
  title?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  subject_name?: string | null;
  description?: string | null;
  due_date?: string | null;
  teacher_name?: string | null;
  status?: string | null;
};

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  teachers?: TeacherRow[];
};

export default function HomeworkPage() {
  const [form, setForm] =
    useState(initialForm);
  const [homework, setHomework] =
    useState<HomeworkRow[]>([]);
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [subjects, setSubjects] =
    useState<SubjectRow[]>([]);
  const [teachers, setTeachers] =
    useState<TeacherRow[]>([]);
  const [saving, setSaving] =
    useState(false);

  const loadData = async () => {
    try {
      const [
        homeworkPayload,
        roster,
        subjectRows,
      ] = await Promise.all([
        apiJson<{
          homework?: HomeworkRow[];
        }>("/api/homework"),
        apiJson<RosterPayload>(
          "/api/roster"
        ),
        apiJson<SubjectRow[]>(
          "/api/subjects"
        ),
      ]);

      setHomework(
        homeworkPayload.homework || []
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
          "Failed to load homework"
        )
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(
      loadData
    );
  }, []);

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  const filteredTeachers =
    teachers.filter((teacher) => {
      if (!form.class_id) {
        return true;
      }

      const assignments =
        Array.isArray(
          teacher.assignments
        )
          ? teacher.assignments
          : [];

      return (
        assignments.length === 0 ||
        assignments.some(
          (assignment) =>
            Number(
              assignment.class_id
            ) ===
            Number(form.class_id)
        )
      );
    });

  const assignHomework = async () => {
    try {
      setSaving(true);
      await apiJson("/api/homework", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      notify.success(
        "Homework assigned"
      );
      setForm(initialForm);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to assign homework"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Homework
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Assign homework by class, section, subject, and teacher.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Assign Homework
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  class_id: value,
                  section_id: "",
                  teacher_id: "",
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
            </Select>
            <Select
              label="Section"
              value={form.section_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  section_id: value,
                })
              }
              disabled={!form.class_id}
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
            </Select>
            <Select
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
            </Select>
            <Select
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
                Optional
              </option>
              {filteredTeachers.map(
                (teacher) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {[
                      teacher.first_name,
                      teacher.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                      `Teacher ${teacher.id}`}
                  </option>
                )
              )}
            </Select>
            <Input
              label="Title"
              value={form.title}
              onChange={(value) =>
                setForm({
                  ...form,
                  title: value,
                })
              }
            />
            <Input
              label="Due Date"
              type="date"
              value={form.due_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  due_date: value,
                })
              }
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(value) =>
                setForm({
                  ...form,
                  status: value,
                })
              }
            >
              <option value="ASSIGNED">
                Assigned
              </option>
              <option value="DRAFT">
                Draft
              </option>
              <option value="CLOSED">
                Closed
              </option>
            </Select>
          </div>
          <div className="mt-4">
            <Textarea
              label="Homework Details"
              value={form.description}
              onChange={(value) =>
                setForm({
                  ...form,
                  description: value,
                })
              }
            />
          </div>
          <button
            onClick={assignHomework}
            disabled={saving}
            className="tt-button mt-5 inline-flex items-center gap-2"
          >
            <Plus size={17} />
            {saving
              ? "Assigning..."
              : "Assign Homework"}
          </button>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homework.map((item) => (
            <article
              key={item.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                  <BookOpenCheck
                    size={20}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {item.title}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {item.class_name || "-"}
                    {item.section_name
                      ? ` ${item.section_name}`
                      : ""}{" "}
                    · {item.subject_name || "-"}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                {item.description ||
                  "No details recorded"}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <Info
                  label="Due"
                  value={
                    item.due_date
                      ? new Date(
                          item.due_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
                <Info
                  label="Teacher"
                  value={
                    item.teacher_name ||
                    "-"
                  }
                />
                <Info
                  label="Status"
                  value={
                    item.status ||
                    "ASSIGNED"
                  }
                />
              </div>
            </article>
          ))}
        </div>
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

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <textarea
        rows={5}
        className="input min-h-[130px]"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        className="input"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
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
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase text-slate-500">
        {label}
      </p>
      <p className="truncate font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
