"use client";

import {
  CalendarDays,
  Plus,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import {
  canManageRecord,
} from "@/lib/access-control";
import { notify } from "@/lib/notify";

const initialExam = {
  exam_name: "",
  exam_type: "",
  start_date: "",
  end_date: "",
};

const initialType = {
  exam_name: "",
  description: "",
};

type ExamRow = {
  id: number;
  exam_name?: string | null;
  exam_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  schedule_count?: number | string | null;
  paper_count?: number | string | null;
};

type ExamTypeRow = {
  id: number;
  exam_name?: string | null;
  description?: string | null;
};

export default function ExamsPage() {
  const [exams, setExams] =
    useState<ExamRow[]>([]);
  const [examTypes, setExamTypes] =
    useState<ExamTypeRow[]>([]);
  const [examForm, setExamForm] =
    useState(initialExam);
  const [typeForm, setTypeForm] =
    useState(initialType);
  const [saving, setSaving] =
    useState(false);
  const [role, setRole] =
    useState("");

  const loadData = async () => {
    try {
      const [examPayload, types] =
        await Promise.all([
          apiJson<{
            exams?: ExamRow[];
          }>("/api/exams"),
          apiJson<ExamTypeRow[]>(
            "/api/exam-types"
          ),
        ]);

      setExams(
        examPayload.exams || []
      );
      setExamTypes(
        Array.isArray(types)
          ? types
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load exams"
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

  const canCreateExam =
    canManageRecord(
      role,
      "exam",
      "create"
    );
  const canUpdateExam =
    canManageRecord(
      role,
      "exam",
      "update"
    );
  const canDeleteExam =
    canManageRecord(
      role,
      "exam",
      "delete"
    );

  const createExam = async () => {
    try {
      setSaving(true);
      await apiJson("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(examForm),
      });

      notify.success("Exam created");
      setExamForm(initialExam);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create exam"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const editExam = async (
    exam: ExamRow
  ) => {
    const nextName = prompt(
      "Update exam name",
      exam.exam_name || ""
    );

    if (!nextName) {
      return;
    }

    const nextType = prompt(
      "Update exam type",
      exam.exam_type || ""
    );

    try {
      await apiJson(
        `/api/exams/${exam.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            exam_name: nextName,
            exam_type:
              nextType ||
              exam.exam_type,
            start_date:
              exam.start_date,
            end_date:
              exam.end_date,
          }),
        }
      );
      notify.success(
        "Exam updated"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update exam"
        )
      );
    }
  };

  const deleteExam = async (
    exam: ExamRow
  ) => {
    if (
      !confirm(
        `Delete ${exam.exam_name}? Schedules for this exam will also be removed.`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/exams/${exam.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Exam deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete exam"
        )
      );
    }
  };

  const createType = async () => {
    try {
      setSaving(true);
      await apiJson("/api/exam-types", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(typeForm),
      });

      notify.success(
        "Exam type created"
      );
      setTypeForm(initialType);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create exam type"
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
            Exams
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create academic exams and reusable exam types for schedule, papers, and marks entry.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <section className="tt-card tt-card-pad">
            <h2 className="mb-4 text-xl font-black">
              Create Exam
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Input
                label="Exam Name"
                value={examForm.exam_name}
                onChange={(value) =>
                  setExamForm({
                    ...examForm,
                    exam_name: value,
                  })
                }
              />
              <Select
                label="Exam Type"
                value={examForm.exam_type}
                onChange={(value) =>
                  setExamForm({
                    ...examForm,
                    exam_type: value,
                  })
                }
              >
                <option value="">
                  Select Type
                </option>
                {examTypes.map((type) => (
                  <option
                    key={type.id}
                    value={
                      type.exam_name || ""
                    }
                  >
                    {type.exam_name ||
                      "Exam Type"}
                  </option>
                ))}
              </Select>
              <Input
                label="Start Date"
                type="date"
                value={examForm.start_date}
                onChange={(value) =>
                  setExamForm({
                    ...examForm,
                    start_date: value,
                  })
                }
              />
              <Input
                label="End Date"
                type="date"
                value={examForm.end_date}
                onChange={(value) =>
                  setExamForm({
                    ...examForm,
                    end_date: value,
                  })
                }
              />
            </div>
            {canCreateExam && (
              <button
                onClick={createExam}
                disabled={saving}
                className="tt-button mt-5 inline-flex items-center gap-2"
              >
                <Plus size={17} />
                Create Exam
              </button>
            )}
          </section>

          <section className="tt-card tt-card-pad">
            <h2 className="mb-4 text-xl font-black">
              Exam Type
            </h2>
            <div className="space-y-3">
              <Input
                label="Type Name"
                value={typeForm.exam_name}
                onChange={(value) =>
                  setTypeForm({
                    ...typeForm,
                    exam_name: value,
                  })
                }
              />
              <Input
                label="Description"
                value={typeForm.description}
                onChange={(value) =>
                  setTypeForm({
                    ...typeForm,
                    description: value,
                  })
                }
              />
              <button
                onClick={createType}
                disabled={saving}
                className="tt-button-secondary w-full"
              >
                Add Type
              </button>
            </div>
          </section>
        </div>

        <section className="tt-card tt-card-pad border border-[#D4AF37]/35 bg-gradient-to-br from-[#04142E] via-[#0A1F3C] to-[#020816] text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                Answer Evaluation Center
              </p>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                AI Answer Evaluation Center
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Upload PDF, JPG, or PNG answer sheets, run OCR, generate question-wise AI marks, and approve or override teacher marks with audit trail support.
              </p>
            </div>
            <Link
              href="/exams/answer-evaluation"
              className="tt-button inline-flex items-center gap-2 self-start px-5 py-3 text-sm"
            >
              Open Evaluation Center
            </Link>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => (
            <article
              key={exam.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                  <CalendarDays
                    size={20}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {exam.exam_name}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {exam.exam_type ||
                      "Exam"}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Schedules"
                  value={String(
                    exam.schedule_count || 0
                  )}
                />
                <Info
                  label="Papers"
                  value={String(
                    exam.paper_count || 0
                  )}
                />
                <Info
                  label="Start"
                  value={
                    exam.start_date
                      ? new Date(
                          exam.start_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
                <Info
                  label="End"
                  value={
                    exam.end_date
                      ? new Date(
                          exam.end_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {canUpdateExam && (
                  <button
                    type="button"
                    onClick={() =>
                      editExam(exam)
                    }
                    className="tt-button-secondary px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                )}
                {canDeleteExam && (
                  <button
                    type="button"
                    onClick={() =>
                      deleteExam(exam)
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
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
