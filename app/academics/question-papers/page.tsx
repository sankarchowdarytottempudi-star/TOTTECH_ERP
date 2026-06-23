"use client";

import {
  Eye,
  FileQuestion,
  Plus,
  Printer,
  Trash2,
  X,
} from "lucide-react";
import NextImage from "next/image";
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import {
  printBrandedDocument,
  printMetaGrid,
} from "@/lib/client/print";
import { notify } from "@/lib/notify";

const initialPaper = {
  paper_name: "",
  exam_id: "",
  exam_type_id: "",
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_date: "",
  duration_minutes: "180",
  instructions: "",
};

const emptyQuestion = {
  section_name: "A",
  question_type: "SHORT_ANSWER",
  difficulty_level: "MEDIUM",
  bloom_level: "",
  chapter_name: "",
  topic_name: "",
  learning_outcome: "",
  question_text: "",
  answer_text: "",
  formula_text: "",
  scribble_data: "",
  question_marks: "5",
  is_optional: false,
};

type IdValue = number | string;
type QuestionForm = typeof emptyQuestion;

type PaperRow = {
  id: IdValue;
  paper_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  subject_name?: string | null;
  question_count?: number | string | null;
  total_marks?: number | string | null;
  exam_date?: string | null;
};

type PaperDetailQuestion = {
  id?: IdValue;
  question_id?: IdValue | null;
  display_order?: IdValue | null;
  section_name?: string | null;
  question_type?: string | null;
  difficulty_level?: string | null;
  bloom_level?: string | null;
  chapter_name?: string | null;
  topic_name?: string | null;
  learning_outcome?: string | null;
  question_text?: string | null;
  answer_text?: string | null;
  formula_text?: string | null;
  scribble_data?: string | null;
  question_marks?: IdValue | null;
  max_marks?: IdValue | null;
  is_optional?: boolean | null;
};

type PaperDetail = {
  paper?: PaperRow & {
    exam_name?: string | null;
    exam_type_name?: string | null;
    duration_minutes?: IdValue | null;
    instructions?: string | null;
  };
  questions?: PaperDetailQuestion[];
};

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

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
};

export default function QuestionPapersPage() {
  const [paper, setPaper] =
    useState(initialPaper);
  const [questions, setQuestions] =
    useState<QuestionForm[]>([
      emptyQuestion,
    ]);
  const [papers, setPapers] =
    useState<PaperRow[]>([]);
  const [
    selectedPaper,
    setSelectedPaper,
  ] = useState<PaperDetail | null>(
    null
  );
  const [
    loadingPaperId,
    setLoadingPaperId,
  ] = useState<IdValue | null>(null);
  const [exams, setExams] =
    useState<ExamRow[]>([]);
  const [examTypes, setExamTypes] =
    useState<ExamTypeRow[]>([]);
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [subjects, setSubjects] =
    useState<SubjectRow[]>([]);
  const [saving, setSaving] =
    useState(false);

  const loadData = async () => {
    try {
      const [
        paperRows,
        examPayload,
        types,
        roster,
        subjectRows,
      ] = await Promise.all([
        apiJson<PaperRow[]>(
          "/api/question-papers"
        ),
        apiJson<{
          exams?: ExamRow[];
        }>("/api/exams"),
        apiJson<ExamTypeRow[]>(
          "/api/exam-types"
        ),
        apiJson<RosterPayload>(
          "/api/roster"
        ),
        apiJson<SubjectRow[]>(
          "/api/subjects"
        ),
      ]);

      setPapers(
        Array.isArray(paperRows)
          ? paperRows
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
      setSubjects(
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load question papers"
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
        !paper.class_id ||
        Number(section.class_id) ===
          Number(paper.class_id)
    );

  const totalMarks = useMemo(
    () =>
      questions.reduce(
        (sum, question) =>
          sum +
          Number(
            question.question_marks ||
              0
          ),
        0
      ),
    [questions]
  );

  const updateQuestion = (
    index: number,
    key: keyof QuestionForm,
    value: string | boolean
  ) => {
    setQuestions((previous) =>
      previous.map(
        (question, currentIndex) =>
          currentIndex === index
            ? {
                ...question,
                [key]: value,
              }
            : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      {
        ...emptyQuestion,
        section_name:
          previous.at(-1)?.section_name ||
          "A",
      },
    ]);
  };

  const removeQuestion = (
    index: number
  ) => {
    setQuestions((previous) =>
      previous.length === 1
        ? previous
        : previous.filter(
            (_, currentIndex) =>
              currentIndex !== index
          )
    );
  };

  const savePaper = async () => {
    try {
      setSaving(true);
      const created =
        await apiJson<PaperRow>(
          "/api/question-papers",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...paper,
              total_marks: totalMarks,
              questions,
            }),
          }
        );

      notify.success(
        "Question paper created"
      );
      setPaper(initialPaper);
      setQuestions([emptyQuestion]);
      await loadData();

      if (created?.id) {
        await openPaper(created.id);
      }
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create question paper"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const openPaper = async (
    id: IdValue
  ) => {
    try {
      setLoadingPaperId(id);
      const detail =
        await apiJson<PaperDetail>(
          `/api/question-papers/${id}`
        );
      setSelectedPaper(detail);
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to open question paper"
        )
      );
    } finally {
      setLoadingPaperId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Question Paper Builder
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Build papers question by question, then use them in exam schedules and marks entry.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Paper Details
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input
              label="Paper Name"
              value={paper.paper_name}
              onChange={(value) =>
                setPaper({
                  ...paper,
                  paper_name: value,
                })
              }
            />
            <Select
              label="Exam"
              value={paper.exam_id}
              onChange={(value) =>
                setPaper({
                  ...paper,
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
              value={paper.exam_type_id}
              onChange={(value) =>
                setPaper({
                  ...paper,
                  exam_type_id: value,
                })
              }
            >
              <option value="">
                Optional
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
            <Input
              label="Exam Date"
              type="date"
              value={paper.exam_date}
              onChange={(value) =>
                setPaper({
                  ...paper,
                  exam_date: value,
                })
              }
            />
            <Select
              label="Class"
              value={paper.class_id}
              onChange={(value) =>
                setPaper({
                  ...paper,
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
            </Select>
            <Select
              label="Section"
              value={paper.section_id}
              onChange={(value) =>
                setPaper({
                  ...paper,
                  section_id: value,
                })
              }
              disabled={!paper.class_id}
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
              value={paper.subject_id}
              onChange={(value) =>
                setPaper({
                  ...paper,
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
            <Input
              label="Duration Minutes"
              value={
                paper.duration_minutes
              }
              onChange={(value) =>
                setPaper({
                  ...paper,
                  duration_minutes:
                    value,
                })
              }
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Instructions"
              value={paper.instructions}
              onChange={(value) =>
                setPaper({
                  ...paper,
                  instructions: value,
                })
              }
            />
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Questions
              </h2>
              <p className="text-sm text-slate-600">
                Total marks: {totalMarks}
              </p>
            </div>
            <button
              onClick={addQuestion}
              className="tt-button-secondary inline-flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map(
              (question, index) => (
                <article
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-black">
                      Question {index + 1}
                    </h3>
                    <button
                      onClick={() =>
                        removeQuestion(
                          index
                        )
                      }
                      className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-700"
                      aria-label="Remove question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <Input
                      label="Section"
                      value={
                        question.section_name
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "section_name",
                          value
                        )
                      }
                    />
                    <Select
                      label="Type"
                      value={
                        question.question_type
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "question_type",
                          value
                        )
                      }
                    >
                      <option value="SHORT_ANSWER">
                        Short Answer
                      </option>
                      <option value="LONG_ANSWER">
                        Long Answer
                      </option>
                      <option value="OBJECTIVE">
                        Objective
                      </option>
                      <option value="ESSAY">
                        Essay
                      </option>
                    </Select>
                    <Select
                      label="Difficulty"
                      value={
                        question.difficulty_level
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "difficulty_level",
                          value
                        )
                      }
                    >
                      <option value="EASY">
                        Easy
                      </option>
                      <option value="MEDIUM">
                        Medium
                      </option>
                      <option value="HARD">
                        Hard
                      </option>
                    </Select>
                    <Input
                      label="Marks"
                      value={
                        question.question_marks
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "question_marks",
                          value
                        )
                      }
                    />
                    <Input
                      label="Topic"
                      value={
                        question.topic_name
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "topic_name",
                          value
                        )
                      }
                    />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Textarea
                      label="Question"
                      value={
                        question.question_text
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "question_text",
                          value
                        )
                      }
                    />
                    <Textarea
                      label="Answer / Evaluation Notes"
                      value={
                        question.answer_text
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "answer_text",
                          value
                        )
                      }
                    />
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <Textarea
                      label="Formula / Equation Notes"
                      value={
                        question.formula_text
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "formula_text",
                          value
                        )
                      }
                    />
                    <ScribblePad
                      label="Scribble / Diagram Pad"
                      value={
                        question.scribble_data
                      }
                      onChange={(value) =>
                        updateQuestion(
                          index,
                          "scribble_data",
                          value
                        )
                      }
                    />
                  </div>
                </article>
              )
            )}
          </div>

          <button
            onClick={savePaper}
            disabled={saving}
            className="tt-button mt-5 inline-flex items-center gap-2"
          >
            <FileQuestion size={17} />
            {saving
              ? "Saving..."
              : "Create Question Paper"}
          </button>
        </section>

        {papers.length === 0 ? (
          <div className="tt-card tt-card-pad">
            No question papers found for the selected school/college and academic year yet.
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((item) => (
            <article
              key={item.id}
              className="tt-card tt-card-pad"
            >
              <h2 className="truncate text-lg font-black">
                {item.paper_name}
              </h2>
              <p className="truncate text-sm font-semibold text-amber-700">
                {item.class_name || "-"}
                {item.section_name
                  ? ` ${item.section_name}`
                  : ""}{" "}
                · {item.subject_name || "-"}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <Info
                  label="Questions"
                  value={String(
                    item.question_count || 0
                  )}
                />
                <Info
                  label="Marks"
                  value={String(
                    item.total_marks || 0
                  )}
                />
                <Info
                  label="Date"
                  value={
                    item.exam_date
                      ? new Date(
                          item.exam_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
              <button
                onClick={() =>
                  openPaper(item.id)
                }
                disabled={
                  String(
                    loadingPaperId
                  ) === String(item.id)
                }
                className="tt-button-secondary mt-5 inline-flex w-full items-center justify-center gap-2"
              >
                <Eye size={16} />
                {String(
                  loadingPaperId
                ) === String(item.id)
                  ? "Opening..."
                  : "View Paper"}
              </button>
            </article>
          ))}
        </div>
        )}

        {selectedPaper ? (
          <PaperPreview
            detail={selectedPaper}
            onClose={() =>
              setSelectedPaper(null)
            }
          />
        ) : null}
      </div>
    </Layout>
  );
}

function PaperPreview({
  detail,
  onClose,
}: {
  detail: PaperDetail;
  onClose: () => void;
}) {
  const paper = detail.paper;
  const questions =
    detail.questions || [];

  if (!paper) {
    return null;
  }

  const printPaper = async () => {
    const rows = questions
      .map(
        (question, index) => `
          <section class="question">
            <div class="q-head">
              <strong>Question ${question.display_order || index + 1}</strong>
              <span>${question.section_name || "-"} | ${question.question_marks ?? question.max_marks ?? 0} marks</span>
            </div>
            <p class="q-text">${escapeHtml(question.question_text || "Question text missing")}</p>
            ${
              question.formula_text
                ? `<p class="formula"><strong>Formula/Notes:</strong> ${escapeHtml(question.formula_text)}</p>`
                : ""
            }
            ${
              question.scribble_data
                ? `<img src="${question.scribble_data}" class="scribble" alt="Question diagram" />`
                : ""
            }
          </section>
        `
      )
      .join("");

    await printBrandedDocument({
      title:
        paper.paper_name ||
        "Question Paper",
      subtitle:
        [
          paper.exam_name ||
            paper.exam_type_name,
          paper.class_name,
          paper.section_name,
          paper.subject_name,
        ]
          .filter(Boolean)
          .join(" / ") || "-",
      documentLabel: "Question Paper",
      metaHtml: printMetaGrid([
        {
          label: "Questions",
          value: questions.length,
        },
        {
          label: "Total Marks",
          value: paper.total_marks || 0,
        },
        {
          label: "Duration",
          value: paper.duration_minutes
            ? `${paper.duration_minutes} min`
            : "-",
        },
        {
          label: "Exam Date",
          value: paper.exam_date
            ? new Date(
                paper.exam_date
              ).toLocaleDateString()
            : "-",
        },
      ]),
      bodyHtml: `
        ${
          paper.instructions
            ? `<div class="print-notice">${escapeHtml(paper.instructions)}</div>`
            : ""
        }
        ${rows || "<p>No questions are attached.</p>"}
      `,
      popupError:
        "Allow popups to print this document.",
    });
  };

  return (
    <section className="tt-card tt-card-pad">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">
            Created Question Paper
          </p>
          <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
            {paper.paper_name ||
              "Question Paper"}
          </h2>
          <p className="mt-1 break-words text-sm font-semibold text-slate-600">
            {[
              paper.exam_name ||
                paper.exam_type_name,
              paper.class_name,
              paper.section_name,
              paper.subject_name,
            ]
              .filter(Boolean)
              .join(" / ") || "-"}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={printPaper}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 text-sm font-black text-amber-900 shadow-sm"
          >
            <Printer size={17} />
            Print
          </button>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Close question paper preview"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Info
          label="Questions"
          value={String(
            questions.length
          )}
        />
        <Info
          label="Total Marks"
          value={String(
            paper.total_marks || 0
          )}
        />
        <Info
          label="Duration"
          value={
            paper.duration_minutes
              ? `${paper.duration_minutes} min`
              : "-"
          }
        />
        <Info
          label="Exam Date"
          value={
            paper.exam_date
              ? new Date(
                  paper.exam_date
                ).toLocaleDateString()
              : "-"
          }
        />
      </div>

      {paper.instructions ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase text-amber-800">
            Instructions
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">
            {paper.instructions}
          </p>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {questions.length ? (
          questions.map(
            (question, index) => (
              <article
                key={
                  question.id ||
                  question.question_id ||
                  index
                }
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="break-words text-lg font-black text-slate-950">
                    Question{" "}
                    {question.display_order ||
                      index + 1}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      Section{" "}
                      {question.section_name ||
                        "-"}
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      {String(
                        question.question_marks ??
                          question.max_marks ??
                          0
                      )}{" "}
                      marks
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <ReadBlock
                    label="Question"
                    value={
                      question.question_text
                    }
                  />
                  <ReadBlock
                    label="Answer / Evaluation Notes"
                    value={
                      question.answer_text
                    }
                  />
                  <ReadBlock
                    label="Formula / Equation Notes"
                    value={
                      question.formula_text
                    }
                  />
                  <ReadBlock
                    label="Topic"
                    value={[
                      question.chapter_name,
                      question.topic_name,
                      question.learning_outcome,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  />
                </div>

                {question.scribble_data ? (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-black text-slate-700">
                      Scribble / Diagram
                    </p>
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
                      <NextImage
                        src={
                          question.scribble_data
                        }
                        alt="Saved question scribble or diagram"
                        width={720}
                        height={260}
                        unoptimized
                        className="h-auto max-h-[320px] w-full object-contain"
                      />
                    </div>
                  </div>
                ) : null}
              </article>
            )
          )
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            No questions are attached to this paper.
          </div>
        )}
      </div>
    </section>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    notify.error("Allow popups to print this document.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function ReadBlock({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function ScribblePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (!value) {
      return;
    }

    const image = new window.Image();
    image.onload = () => {
      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };
    image.src = value;
  }, [value]);

  const getPoint = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      event.currentTarget;
    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        ((event.clientX - rect.left) /
          rect.width) *
        canvas.width,
      y:
        ((event.clientY - rect.top) /
          rect.height) *
        canvas.height,
    };
  };

  const startDrawing = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      event.currentTarget;
    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const point = getPoint(event);
    drawingRef.current = true;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#07162d";
    context.beginPath();
    context.moveTo(point.x, point.y);
    canvas.setPointerCapture(
      event.pointerId
    );
  };

  const draw = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    if (!drawingRef.current) {
      return;
    }

    const canvas =
      event.currentTarget;
    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    if (!drawingRef.current) {
      return;
    }

    const canvas =
      event.currentTarget;
    drawingRef.current = false;
    onChange(
      canvas.toDataURL("image/png")
    );

    if (
      canvas.hasPointerCapture(
        event.pointerId
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId
      );
    }
  };

  const clear = () => {
    const canvas =
      canvasRef.current;
    const context =
      canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
    onChange("");
  };

  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-700">
          {label}
        </span>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={720}
        height={260}
        onPointerDown={
          startDrawing
        }
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={
          stopDrawing
        }
        className="h-[220px] w-full touch-none rounded-lg border border-slate-300 bg-white shadow-inner"
      />
      <p className="mt-1 text-xs font-semibold text-slate-500">
        Use touch, mouse, or stylus for diagrams, formulas, maps, and working notes.
      </p>
    </div>
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
        rows={4}
        className="input min-h-[110px]"
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
