"use client";

import {
  CalendarClock,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import {
  canManageRecord,
} from "@/lib/access-control";
import { notify } from "@/lib/notify";

const initialForm = {
  exam_id: "",
  exam_type_id: "",
  question_paper_id: "",
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_date: "",
  start_time: "",
  end_time: "",
  room_no: "",
  invigilator_teacher_id: "",
};

type IdValue = number | string;

type ExamRow = {
  id: IdValue;
  exam_name?: string | null;
};

type ExamTypeRow = {
  id: IdValue;
  exam_name?: string | null;
};

type ClassRow = {
  id: IdValue;
  class_name?: string | null;
};

type SectionRow = {
  id: IdValue;
  class_id?: IdValue | null;
  section_name?: string | null;
};

type SubjectRow = {
  id: IdValue;
  subject_name?: string | null;
};

type PaperRow = {
  id: IdValue;
  class_id?: IdValue | null;
  section_id?: IdValue | null;
  subject_id?: IdValue | null;
  paper_name?: string | null;
};

type TeacherAssignment = {
  class_id?: IdValue | null;
};

type TeacherRow = {
  id: IdValue;
  first_name?: string | null;
  last_name?: string | null;
  assignments?: TeacherAssignment[];
};

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  teachers?: TeacherRow[];
};

type ScheduleRow = {
  id: IdValue;
  exam_id?: IdValue | null;
  exam_type_id?: IdValue | null;
  question_paper_id?: IdValue | null;
  class_id?: IdValue | null;
  section_id?: IdValue | null;
  subject_id?: IdValue | null;
  invigilator_teacher_id?: IdValue | null;
  exam_name?: string | null;
  exam_type_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  subject_name?: string | null;
  exam_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  room_no?: string | null;
  paper_name?: string | null;
  status?: string | null;
};

export default function ExamSchedulePage() {
  const [form, setForm] =
    useState(initialForm);
  const [schedules, setSchedules] =
    useState<ScheduleRow[]>([]);
  const [exams, setExams] =
    useState<ExamRow[]>([]);
  const [examTypes, setExamTypes] =
    useState<ExamTypeRow[]>([]);
  const [papers, setPapers] =
    useState<PaperRow[]>([]);
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
  const [role, setRole] =
    useState("");
  const [editingId, setEditingId] =
    useState<IdValue | null>(null);

  const loadData = async () => {
    try {
      const [
        scheduleRows,
        examPayload,
        types,
        paperRows,
        roster,
        subjectRows,
      ] = await Promise.all([
        apiJson<ScheduleRow[]>(
          "/api/exam-schedule"
        ),
        apiJson<{
          exams?: ExamRow[];
        }>("/api/exams"),
        apiJson<ExamTypeRow[]>(
          "/api/exam-types"
        ),
        apiJson<PaperRow[]>(
          "/api/question-papers"
        ),
        apiJson<RosterPayload>(
          "/api/roster"
        ),
        apiJson<SubjectRow[]>(
          "/api/subjects"
        ),
      ]);

      setSchedules(
        Array.isArray(scheduleRows)
          ? scheduleRows
          : []
      );
      setExams(
        examPayload.exams || []
      );
      setExamTypes(
        Array.isArray(types)
          ? types
          : []
      );
      setPapers(
        Array.isArray(paperRows)
          ? paperRows
          : []
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
          "Failed to load exam schedule"
        )
      );
    }
  };

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

    void Promise.resolve().then(
      loadData
    );
  }, []);

  const canCreateSchedule =
    canManageRecord(
      role,
      "exam_schedule",
      "create"
    );
  const canUpdateSchedule =
    canManageRecord(
      role,
      "exam_schedule",
      "update"
    );
  const canDeleteSchedule =
    canManageRecord(
      role,
      "exam_schedule",
      "delete"
    );

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  const filteredPapers =
    useMemo(
      () =>
        papers.filter((paper) => {
          const classMatches =
            !form.class_id ||
            Number(paper.class_id) ===
              Number(form.class_id);
          const sectionMatches =
            !form.section_id ||
            Number(paper.section_id) ===
              Number(form.section_id);
          const subjectMatches =
            !form.subject_id ||
            Number(paper.subject_id) ===
              Number(form.subject_id);

          return (
            classMatches &&
            sectionMatches &&
            subjectMatches
          );
        }),
      [
        papers,
        form.class_id,
        form.section_id,
        form.subject_id,
      ]
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

  const saveSchedule = async () => {
    try {
      setSaving(true);
      await apiJson(
        editingId
          ? `/api/exam-schedule/${editingId}`
          : "/api/exam-schedule",
        {
          method: editingId
            ? "PUT"
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
          ? "Exam schedule updated"
          : "Exam scheduled"
      );
      setForm(initialForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to schedule exam"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (
    schedule: ScheduleRow
  ) => {
    setEditingId(schedule.id);
    setForm({
      exam_id: String(
        schedule.exam_id || ""
      ),
      exam_type_id: String(
        schedule.exam_type_id ||
          ""
      ),
      question_paper_id: String(
        schedule.question_paper_id ||
          ""
      ),
      class_id: String(
        schedule.class_id || ""
      ),
      section_id: String(
        schedule.section_id || ""
      ),
      subject_id: String(
        schedule.subject_id || ""
      ),
      exam_date:
        schedule.exam_date
          ? String(
              schedule.exam_date
            ).slice(0, 10)
          : "",
      start_time:
        schedule.start_time
          ? String(
              schedule.start_time
            ).slice(0, 5)
          : "",
      end_time:
        schedule.end_time
          ? String(
              schedule.end_time
            ).slice(0, 5)
          : "",
      room_no:
        schedule.room_no || "",
      invigilator_teacher_id:
        String(
          schedule.invigilator_teacher_id ||
            ""
        ),
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteSchedule = async (
    schedule: ScheduleRow
  ) => {
    if (
      !confirm(
        "Delete this exam schedule?"
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/exam-schedule/${schedule.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Exam schedule deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete schedule"
        )
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Exam Schedule
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Schedule exams by class, section, subject, question paper, room, and invigilator.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            {editingId
              ? "Edit Schedule"
              : "Create Schedule"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Exam"
              value={form.exam_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  exam_id: value,
                })
              }
            >
              <option value="">
                Optional
              </option>
              {exams.map((exam) => (
                <option
                  key={exam.id}
                  value={exam.id}
                >
                  {exam.exam_name}
                </option>
              ))}
            </Select>
            <Select
              label="Exam Type"
              value={form.exam_type_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  exam_type_id: value,
                })
              }
            >
              <option value="">
                Select Type
              </option>
              {examTypes.map((type) => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.exam_name}
                </option>
              ))}
            </Select>
            <Select
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  class_id: value,
                  section_id: "",
                  question_paper_id: "",
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
                  question_paper_id: "",
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
                  question_paper_id: "",
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
              label="Question Paper"
              value={
                form.question_paper_id
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  question_paper_id:
                    value,
                })
              }
            >
              <option value="">
                Optional
              </option>
              {filteredPapers.map(
                (paper) => (
                  <option
                    key={paper.id}
                    value={paper.id}
                  >
                    {paper.paper_name}
                  </option>
                )
              )}
            </Select>
            <Input
              label="Exam Date"
              type="date"
              value={form.exam_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  exam_date: value,
                })
              }
            />
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
            <Select
              label="Invigilator"
              value={
                form.invigilator_teacher_id
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  invigilator_teacher_id:
                    value,
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
          </div>
          {(editingId
            ? canUpdateSchedule
            : canCreateSchedule) && (
            <button
              onClick={saveSchedule}
              disabled={saving}
              className="tt-button mt-5 inline-flex items-center gap-2"
            >
              <Plus size={17} />
              {editingId
                ? "Update Schedule"
                : "Schedule Exam"}
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schedules.map((schedule) => (
            <article
              key={schedule.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                  <CalendarClock
                    size={20}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {schedule.exam_name ||
                      schedule.exam_type_name ||
                      `Exam ${schedule.id}`}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {schedule.class_name ||
                      "-"}
                    {schedule.section_name
                      ? ` ${schedule.section_name}`
                      : ""}{" "}
                    ·{" "}
                    {schedule.subject_name ||
                      "-"}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Date"
                  value={
                    schedule.exam_date
                      ? new Date(
                          schedule.exam_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
                <Info
                  label="Room"
                  value={
                    schedule.room_no ||
                    "-"
                  }
                />
                <Info
                  label="Paper"
                  value={
                    schedule.paper_name ||
                    "-"
                  }
                />
                <Info
                  label="Status"
                  value={
                    schedule.status ||
                    "SCHEDULED"
                  }
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {canUpdateSchedule && (
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        schedule
                      )
                    }
                    className="tt-button-secondary px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                )}
                {canDeleteSchedule && (
                  <button
                    type="button"
                    onClick={() =>
                      deleteSchedule(
                        schedule
                      )
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
