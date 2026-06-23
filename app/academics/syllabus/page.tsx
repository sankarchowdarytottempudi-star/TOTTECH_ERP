"use client";

import {
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  Save,
  UserCheck,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type IdValue = number | string;

type Roster = {
  classes?: Array<{
    id: IdValue;
    class_name?: string;
  }>;
  sections?: Array<{
    id: IdValue;
    class_id?: IdValue;
    section_name?: string;
  }>;
};

type Subject = {
  id: IdValue;
  subject_name?: string;
};

type Teacher = {
  id: IdValue;
  first_name?: string;
  last_name?: string;
  name?: string;
};

type ExamType = {
  id: IdValue;
  exam_name?: string;
};

type SyllabusAssignment = {
  assignment_id: number;
  teacher_id?: number;
  teacher_name?: string;
  expected_completion_percent?: number | string;
  actual_completion_percent?: number | string;
  completed_periods?: number | string;
  status?: string;
  remarks?: string;
};

type SyllabusRow = {
  id: number;
  title?: string;
  description?: string;
  class_name?: string;
  section_name?: string;
  subject_name?: string;
  exam_type_name?: string;
  total_periods?: number;
  target_completion_percent?: number | string;
  target_date?: string;
  status?: string;
  assignments?: SyllabusAssignment[];
};

const emptyForm = {
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_type_id: "",
  teacher_id: "",
  title: "",
  description: "",
  total_periods: "0",
  target_completion_percent: "100",
  expected_completion_percent: "100",
  start_date: "",
  target_date: "",
  remarks: "",
};

export default function SyllabusPage() {
  const [roster, setRoster] =
    useState<Roster>({});
  const [subjects, setSubjects] =
    useState<Subject[]>([]);
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);
  const [examTypes, setExamTypes] =
    useState<ExamType[]>([]);
  const [syllabus, setSyllabus] =
    useState<SyllabusRow[]>([]);
  const [form, setForm] =
    useState(emptyForm);
  const [progress, setProgress] =
    useState<
      Record<
        string,
        {
          actual_completion_percent: string;
          completed_periods: string;
          remarks: string;
        }
      >
    >({});
  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    try {
      const [
        rosterRows,
        subjectRows,
        teacherRows,
        examTypeRows,
        syllabusRows,
      ] = await Promise.all([
        apiJson<Roster>("/api/roster"),
        apiJson<Subject[]>("/api/subjects"),
        apiJson<Teacher[]>("/api/teachers"),
        apiJson<ExamType[]>("/api/exam-types"),
        apiJson<SyllabusRow[]>("/api/syllabus"),
      ]);

      setRoster(rosterRows || {});
      setSubjects(
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
      setTeachers(
        Array.isArray(teacherRows)
          ? teacherRows
          : []
      );
      setExamTypes(
        Array.isArray(examTypeRows)
          ? examTypeRows
          : []
      );
      setSyllabus(
        Array.isArray(syllabusRows)
          ? syllabusRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load syllabus planner"
        )
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  const sections = useMemo(
    () =>
      (roster.sections || []).filter(
        (section) =>
          !form.class_id ||
          String(section.class_id) ===
            form.class_id
      ),
    [form.class_id, roster.sections]
  );

  const createSyllabus = async () => {
    try {
      setSaving(true);
      await apiJson("/api/syllabus", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });
      notify.success(
        "Syllabus created and assigned to staff."
      );
      setForm(emptyForm);
      await load();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create syllabus"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (
    assignmentId: number
  ) => {
    const row =
      progress[String(assignmentId)];

    try {
      await apiJson("/api/syllabus", {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          assignment_id:
            assignmentId,
          ...row,
        }),
      });
      notify.success(
        "Syllabus progress updated."
      );
      await load();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update syllabus progress"
        )
      );
    }
  };

  const completion = useMemo(() => {
    const assignments =
      syllabus.flatMap(
        (row) => row.assignments || []
      );
    if (!assignments.length) {
      return 0;
    }

    return Math.round(
      assignments.reduce(
        (sum, item) =>
          sum +
          Number(
            item.actual_completion_percent ||
              0
          ),
        0
      ) / assignments.length
    );
  }, [syllabus]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">
              Syllabus Planner
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Assign syllabus to staff by class, section, subject, and exam type. Track how much syllabus should be completed before every exam type.
            </p>
          </div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="text-xs font-black uppercase text-amber-800">
              Overall Completion
            </p>
            <p className="text-2xl font-black text-slate-950">
              {completion}%
            </p>
          </div>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
              <BookOpenCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">
                Create Syllabus
              </h2>
              <p className="text-sm text-slate-600">
                School/College and academic year are taken from the active context.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  class_id: value,
                  section_id: "",
                })
              }
              options={
                roster.classes || []
              }
              labelKey="class_name"
            />
            <Select
              label="Section"
              value={form.section_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  section_id: value,
                })
              }
              options={sections}
              labelKey="section_name"
            />
            <Select
              label="Subject"
              value={form.subject_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  subject_id: value,
                })
              }
              options={subjects}
              labelKey="subject_name"
            />
            <Select
              label="Exam Type"
              value={form.exam_type_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  exam_type_id: value,
                })
              }
              options={examTypes}
              labelKey="exam_name"
            />
            <Select
              label="Assign Staff"
              value={form.teacher_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  teacher_id: value,
                })
              }
              options={teachers.map(
                (teacher) => ({
                  ...teacher,
                  teacher_name:
                    teacher.name ||
                    [
                      teacher.first_name,
                      teacher.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    `Teacher ${teacher.id}`,
                })
              )}
              labelKey="teacher_name"
            />
            <Field
              label="Title"
              value={form.title}
              onChange={(value) =>
                setForm({
                  ...form,
                  title: value,
                })
              }
              placeholder="Algebra Unit 1"
            />
            <Field
              label="Total Periods"
              type="number"
              value={
                form.total_periods
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  total_periods: value,
                })
              }
            />
            <Field
              label="Complete Before Exam"
              type="number"
              value={
                form.target_completion_percent
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  target_completion_percent:
                    value,
                  expected_completion_percent:
                    value,
                })
              }
              suffix="%"
            />
            <Field
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  start_date: value,
                })
              }
            />
            <Field
              label="Target Date"
              type="date"
              value={form.target_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  target_date: value,
                })
              }
            />
            <label className="md:col-span-2 xl:col-span-4">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Description
              </span>
              <textarea
                className="input min-h-[96px]"
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    description:
                      event.target.value,
                  })
                }
                placeholder="Chapters, learning outcomes, textbook references, and expected completion notes."
              />
            </label>
          </div>

          <button
            className="tt-button mt-5 inline-flex items-center gap-2"
            onClick={createSyllabus}
            disabled={saving}
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : "Create Syllabus"}
          </button>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">
                Assigned Syllabus
              </h2>
              <p className="text-sm text-slate-600">
                Staff progress is tracked against exam-type completion expectations.
              </p>
            </div>
          </div>

          {syllabus.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm font-bold text-slate-600">
              No syllabus created yet.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {syllabus.map((row) => (
                <article
                  key={row.id}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase text-amber-700">
                        {row.exam_type_name ||
                          "Exam Type"}
                      </p>
                      <h3 className="mt-1 break-words text-xl font-black text-slate-950">
                        {row.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {[
                          row.class_name,
                          row.section_name,
                          row.subject_name,
                        ]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    </div>
                    <div className="rounded-lg bg-amber-50 px-3 py-2 text-right">
                      <p className="text-xs font-black uppercase text-amber-800">
                        Target
                      </p>
                      <p className="text-lg font-black text-slate-950">
                        {Number(
                          row.target_completion_percent ||
                            0
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MiniStat
                      icon={<CalendarDays size={16} />}
                      label="Target Date"
                      value={
                        row.target_date
                          ? new Date(
                              row.target_date
                            ).toLocaleDateString()
                          : "-"
                      }
                    />
                    <MiniStat
                      icon={<BookOpenCheck size={16} />}
                      label="Periods"
                      value={String(
                        row.total_periods || 0
                      )}
                    />
                    <MiniStat
                      icon={<UserCheck size={16} />}
                      label="Assignments"
                      value={String(
                        row.assignments?.length ||
                          0
                      )}
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {(row.assignments || []).map(
                      (assignment) => {
                        const key = String(
                          assignment.assignment_id
                        );
                        const draft =
                          progress[key] || {
                            actual_completion_percent:
                              String(
                                assignment.actual_completion_percent ||
                                  0
                              ),
                            completed_periods:
                              String(
                                assignment.completed_periods ||
                                  0
                              ),
                            remarks:
                              assignment.remarks ||
                              "",
                          };

                        return (
                          <div
                            key={key}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-black text-slate-950">
                                  {assignment.teacher_name ||
                                    "Assigned Staff"}
                                </p>
                                <p className="text-sm font-bold text-slate-600">
                                  Status:{" "}
                                  {assignment.status ||
                                    "ASSIGNED"}
                                </p>
                              </div>
                              <span className="w-fit rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-950">
                                {Number(
                                  assignment.actual_completion_percent ||
                                    0
                                )}
                                % done
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-[160px_160px_minmax(0,1fr)_auto] md:items-end">
                              <Field
                                label="Actual %"
                                type="number"
                                value={
                                  draft.actual_completion_percent
                                }
                                onChange={(value) =>
                                  setProgress({
                                    ...progress,
                                    [key]: {
                                      ...draft,
                                      actual_completion_percent:
                                        value,
                                    },
                                  })
                                }
                              />
                              <Field
                                label="Periods Done"
                                type="number"
                                value={
                                  draft.completed_periods
                                }
                                onChange={(value) =>
                                  setProgress({
                                    ...progress,
                                    [key]: {
                                      ...draft,
                                      completed_periods:
                                        value,
                                    },
                                  })
                                }
                              />
                              <Field
                                label="Remarks"
                                value={draft.remarks}
                                onChange={(value) =>
                                  setProgress({
                                    ...progress,
                                    [key]: {
                                      ...draft,
                                      remarks: value,
                                    },
                                  })
                                }
                              />
                              <button
                                className="tt-button h-[46px]"
                                onClick={() =>
                                  updateProgress(
                                    assignment.assignment_id
                                  )
                                }
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          className="input"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
        {suffix ? (
          <span className="font-black text-slate-700">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labelKey,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<Record<string, any>>;
  labelKey: string;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="">
          Select {label}
        </option>
        {options.map((option) => (
          <option
            key={String(option.id)}
            value={String(option.id)}
          >
            {option[labelKey] ||
              `${label} ${option.id}`}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-amber-700">
        {icon}
        <span className="text-xs font-black uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 break-words text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
