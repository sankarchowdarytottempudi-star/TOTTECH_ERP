"use client";

import {
  BarChart3,
  Calculator,
  ClipboardCheck,
  FileQuestion,
  Paperclip,
  Printer,
  Save,
  Search,
  Camera,
  UploadCloud,
} from "lucide-react";
import type { ReactNode } from "react";
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
import {
  printBrandedDocument,
  printMetaGrid,
} from "@/lib/client/print";
import { notify } from "@/lib/notify";

type ExamSchedule = {
  id: number;
  exam_name?: string | null;
  exam_type_name?: string | null;
  paper_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  subject_name?: string | null;
  exam_date?: string | null;
  question_paper_id?: number | null;
};

type Student = {
  id: number;
  name?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  admission_number?: string | null;
  roll_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
};

type PaperQuestion = {
  id: number;
  question_id: number;
  display_order?: number | null;
  section_name?: string | null;
  question_marks?: number | string | null;
  is_optional?: boolean | null;
  question_text?: string | null;
  answer_text?: string | null;
  topic_name?: string | null;
  difficulty_level?: string | null;
  question_type?: string | null;
};

type MarksState = Record<string, string>;

type ExistingMark = {
  id: number;
  question_id?: number | string | null;
  obtained_marks?: number | string | null;
  max_marks?: number | string | null;
  grade?: string | null;
  remarks?: string | null;
  question_text?: string | null;
  subject_name?: string | null;
  ai_suggested_marks?: number | string | null;
  ai_exact_match_score?: number | string | null;
  ai_concept_match_score?: number | string | null;
  ai_keyword_match_score?: number | string | null;
  ai_semantic_similarity_score?: number | string | null;
  ai_completeness_score?: number | string | null;
  ai_grammar_score?: number | string | null;
  ai_writing_quality_score?: number | string | null;
  ai_logical_flow_score?: number | string | null;
  ai_critical_thinking_score?: number | string | null;
  ai_quality_label?: string | null;
  ai_understanding_level?: string | null;
  ai_confidence_percent?: number | string | null;
  ai_reasoning?: string | null;
  teacher_review_status?: string | null;
  student_answer_text?: string | null;
};

type MarksAnalyticsRow = {
  student_id: number;
  student_name?: string | null;
  admission_number?: string | null;
  roll_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  obtained_marks?: number | string | null;
  max_marks?: number | string | null;
  percentage?: number | string | null;
  grade?: string | null;
};

type MarksAnalytics = {
  rows?: MarksAnalyticsRow[];
  summary?: {
    student_count?: number;
    class_name?: string | null;
    section_name?: string | null;
    highest?: MarksAnalyticsRow | null;
    lowest?: MarksAnalyticsRow | null;
    average_percentage?: number;
  } | null;
};

type AIEvaluationRow = {
  question_id?: number | string | null;
  student_answer?: string | null;
  ideal_answer?: string | null;
  recommendedMarks?: number | string | null;
  exactMatchScore?: number | string | null;
  conceptMatchScore?: number | string | null;
  keywordMatchScore?: number | string | null;
  semanticSimilarityScore?: number | string | null;
  completenessScore?: number | string | null;
  grammarScore?: number | string | null;
  writingQualityScore?: number | string | null;
  logicalFlowScore?: number | string | null;
  criticalThinkingScore?: number | string | null;
  understandingLevel?: string | null;
  qualityLabel?: string | null;
  confidencePercent?: number | string | null;
  reasoning?: string | null;
  misconceptions?: string[];
  missingConcepts?: string[];
  strongConcepts?: string[];
  rubricNotes?: string[];
};

type AIAggregateMetrics = {
  conceptUnderstandingPercent?: number | string | null;
  memoryRetentionPercent?: number | string | null;
  applicationSkillPercent?: number | string | null;
  analyticalSkillPercent?: number | string | null;
  criticalThinkingPercent?: number | string | null;
  writingSkillPercent?: number | string | null;
  problemSolvingPercent?: number | string | null;
  confidenceScorePercent?: number | string | null;
};

export default function MarksEntryPage() {
  const [exams, setExams] =
    useState<ExamSchedule[]>([]);
  const [students, setStudents] =
    useState<Student[]>([]);
  const [questions, setQuestions] =
    useState<PaperQuestion[]>([]);
  const [selectedExam, setSelectedExam] =
    useState<ExamSchedule | null>(
      null
    );
  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState<Student | null>(null);
  const [marks, setMarks] =
    useState<MarksState>({});
  const [remarks, setRemarks] =
    useState<MarksState>({});
  const [studentAnswers, setStudentAnswers] =
    useState<MarksState>({});
  const [existingMarks, setExistingMarks] =
    useState<ExistingMark[]>([]);
  const [
    analytics,
    setAnalytics,
  ] = useState<MarksAnalytics>({
    rows: [],
    summary: null,
  });
  const [aiEvaluations, setAiEvaluations] =
    useState<AIEvaluationRow[]>([]);
  const [aiAggregateMetrics, setAiAggregateMetrics] =
    useState<AIAggregateMetrics | null>(null);
  const [aiRunning, setAiRunning] =
    useState(false);
  const [answerAttachments, setAnswerAttachments] =
    useState<Record<number, File[]>>({});
  const [
    showAnalyticsGrid,
    setShowAnalyticsGrid,
  ] = useState(false);
  const [studentSearch, setStudentSearch] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [saving, setSaving] =
    useState(false);

  const loadExams = async () => {
    try {
      const rows =
        await apiJson<ExamSchedule[]>(
          "/api/marks-entry/exams"
        );

      setExams(
        Array.isArray(rows) ? rows : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load scheduled exams"
        )
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(
      loadExams
    );
  }, []);

  const selectExam = async (
    exam: ExamSchedule
  ) => {
    try {
      setLoading(true);
      setSelectedExam(exam);
      setSelectedStudent(null);
      setMarks({});
      setRemarks({});
      setStudentAnswers({});
      setExistingMarks([]);
      setAnalytics({
        rows: [],
        summary: null,
      });
      setAiEvaluations([]);
      setAiAggregateMetrics(null);
      setShowAnalyticsGrid(false);
      setStudentSearch("");

      const studentsPromise =
        apiJson<Student[]>(
          `/api/marks-entry/students?exam_schedule_id=${exam.id}`
        );
      const questionsPromise =
        exam.question_paper_id
          ? apiJson<PaperQuestion[]>(
              `/api/marks-entry/questions?paperId=${exam.question_paper_id}`
            )
          : Promise.resolve([]);

      const [studentRows, questionRows] =
        await Promise.all([
          studentsPromise,
          questionsPromise,
        ]);

      setStudents(
        Array.isArray(studentRows)
          ? studentRows
          : []
      );
      setQuestions(
        Array.isArray(questionRows)
          ? questionRows
          : []
      );
      await loadAnalytics(exam.id);
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load exam roster"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (
    examScheduleId: number
  ) => {
    try {
      const payload =
        await apiJson<MarksAnalytics>(
          `/api/marks-entry/analytics?exam_schedule_id=${examScheduleId}`
        );
      setAnalytics({
        rows: payload.rows || [],
        summary:
          payload.summary || null,
      });
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load marks analytics"
        )
      );
    }
  };

  const filteredStudents =
    useMemo(() => {
      const term =
        studentSearch
          .trim()
          .toLowerCase();

      if (!term) {
        return students;
      }

      return students.filter(
        (student) =>
          [
            studentName(student),
            student.admission_number,
            student.roll_number,
            student.class_name,
            student.section_name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term)
      );
    }, [students, studentSearch]);

  const maxMarks = useMemo(
    () =>
      questions.reduce(
        (sum, question) =>
          sum +
          Number(
            question.question_marks || 0
          ),
        0
      ),
    [questions]
  );

  const totalMarks = useMemo(
    () =>
      questions.reduce(
        (sum, question) => {
          const key =
            questionKey(question);
          return (
            sum +
            Number(marks[key] || 0)
          );
        },
        0
      ),
    [marks, questions]
  );

  const percentage =
    maxMarks > 0
      ? (totalMarks / maxMarks) * 100
      : 0;
  const grade =
    gradeFor(percentage);
  const missingMarks =
    questions.filter((question) => {
      const key =
        questionKey(question);
      return (
        marks[key] === undefined ||
        marks[key] === ""
      );
    }).length;

  const handleAttachmentSelection = (
    questionId: number,
    files: FileList | null
  ) => {
    const nextFiles = Array.from(
      files || []
    );
    if (!nextFiles.length) {
      return;
    }

    setAnswerAttachments((current) => ({
      ...current,
      [questionId]: [
        ...(current[questionId] || []),
        ...nextFiles,
      ].slice(0, 6),
    }));
  };

  const clearAttachments = (
    questionId: number
  ) => {
    setAnswerAttachments((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const saveMarks = async () => {
    if (!selectedExam) {
      notify.error(
        "Select a scheduled exam first."
      );
      return;
    }

    if (!selectedStudent) {
      notify.error(
        "Select a student before saving marks."
      );
      return;
    }

    if (
      !selectedExam.question_paper_id
    ) {
      notify.error(
        "Attach a question paper to this exam schedule before entering marks."
      );
      return;
    }

    if (!questions.length) {
      notify.error(
        "This paper has no questions to evaluate."
      );
      return;
    }

    if (missingMarks > 0) {
      notify.error(
        "Enter marks for every question before saving."
      );
      return;
    }

    const invalidQuestion =
      questions.find((question) => {
        const key =
          questionKey(question);
        const value = Number(
          marks[key]
        );
        const max = Number(
          question.question_marks || 0
        );

      return (
        !Number.isFinite(value) ||
        value < 0 ||
        value > max
      );
    });

    if (invalidQuestion) {
      notify.error(
        "Marks cannot be negative or greater than the question maximum."
      );
      return;
    }

    try {
      setSaving(true);
      const result =
        await apiJson<{
          grade?: string;
        }>("/api/marks-entry", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            student_id:
              selectedStudent.id,
            exam_schedule_id:
              selectedExam.id,
            question_paper_id:
              selectedExam.question_paper_id,
            entries: questions.map(
              (question) => {
                const key =
                  questionKey(question);

                return {
                  question_id:
                    question.question_id,
                  obtained_marks:
                    Number(marks[key]),
                  max_marks:
                    Number(
                      question.question_marks ||
                        0
                    ),
                  remarks:
                    remarks[key] || null,
                };
              }
            ),
          }),
        });

      notify.success(
        `Marks saved. Grade ${result.grade || grade}`
      );
      await loadExistingMarks(
        selectedExam,
        selectedStudent
      );
      await loadAnalytics(
        selectedExam.id
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save marks"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const selectStudent = async (
    student: Student
  ) => {
    setSelectedStudent(student);
    await loadExistingMarks(
      selectedExam,
      student
    );
  };

  const loadExistingMarks = async (
    exam: ExamSchedule | null,
    student: Student | null
  ) => {
    if (!exam || !student) {
      setExistingMarks([]);
      return;
    }

    try {
      const rows =
        await apiJson<ExistingMark[]>(
          `/api/marks-entry?exam_schedule_id=${exam.id}&student_id=${student.id}&question_paper_id=${exam.question_paper_id || ""}`
        );
      const list = Array.isArray(rows)
        ? rows
        : [];
      setExistingMarks(list);

      if (list.length) {
        const nextMarks: MarksState = {};
        const nextRemarks: MarksState = {};

        list.forEach((row) => {
          const key = String(
            row.question_id || ""
          );
          if (key) {
            nextMarks[key] = String(
              row.obtained_marks ?? ""
            );
            nextRemarks[key] = String(
              row.remarks ?? ""
            );
          }
        });

        setMarks(nextMarks);
        setRemarks(nextRemarks);
      } else {
        setStudentAnswers({});
      }
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load saved marks"
        )
      );
    }
  };

  const runAIEvaluation = async () => {
    if (!selectedExam || !selectedStudent) {
      notify.error(
        "Select an exam and student before running AI evaluation."
      );
      return;
    }

    if (!selectedExam.question_paper_id) {
      notify.error(
        "Attach a question paper before running AI evaluation."
      );
      return;
    }

    try {
      setAiRunning(true);
      const payload = await apiJson<{
        evaluations?: AIEvaluationRow[];
        aggregate_metrics?: AIAggregateMetrics;
      }>("/api/marks-entry/ai-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          exam_schedule_id: selectedExam.id,
          question_paper_id:
            selectedExam.question_paper_id,
          answers: questions.map((question) => ({
            question_id: question.question_id,
            student_answer:
              studentAnswers[
                questionKey(question)
              ] || "",
          })),
        }),
      });

      setAiEvaluations(
        Array.isArray(payload.evaluations)
          ? payload.evaluations
          : []
      );
      setAiAggregateMetrics(
        payload.aggregate_metrics || null
      );
      notify.success(
        "AI evaluation completed. Teacher review is required before publishing marks."
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "AI evaluation failed"
        )
      );
    } finally {
      setAiRunning(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Marks Entry
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Select a scheduled exam, load the class-section roster, then enter question-wise marks for each student.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Scheduled Exams
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Exam schedules connect exams, classes, sections, subjects, papers, and marks entry.
              </p>
            </div>
            <span className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
              {exams.length} schedules
            </span>
          </div>

          {exams.length === 0 ? (
            <EmptyState>
              Create an exam schedule before entering marks.
            </EmptyState>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() =>
                    selectExam(exam)
                  }
                  className={`min-w-0 rounded-lg border p-4 text-left transition ${
                    selectedExam?.id ===
                    exam.id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                        selectedExam?.id ===
                        exam.id
                          ? "bg-white/15"
                          : "bg-slate-100"
                      }`}
                    >
                      <ClipboardCheck
                        size={19}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-black">
                        {exam.exam_name ||
                          exam.exam_type_name ||
                          `Exam ${exam.id}`}
                      </h3>
                      <p
                        className={`mt-1 truncate text-sm ${
                          selectedExam?.id ===
                          exam.id
                            ? "text-white/70"
                            : "text-slate-600"
                        }`}
                      >
                        {[
                          exam.class_name,
                          exam.section_name,
                          exam.subject_name,
                        ]
                          .filter(Boolean)
                          .join(" / ") ||
                          "Class not mapped"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <Info
                      label="Date"
                      value={formatDate(
                        exam.exam_date
                      )}
                      inverse={
                        selectedExam?.id ===
                        exam.id
                      }
                    />
                    <Info
                      label="Paper"
                      value={
                        exam.paper_name ||
                        "Not attached"
                      }
                      inverse={
                        selectedExam?.id ===
                        exam.id
                      }
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedExam ? (
          <MarksDashboard
            exam={selectedExam}
            analytics={analytics}
            showGrid={showAnalyticsGrid}
            onToggleGrid={() =>
              setShowAnalyticsGrid(
                (value) => !value
              )
            }
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(280px,0.45fr)]">
          <section className="tt-card tt-card-pad min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                <Search size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black">
                  Students
                </h2>
                <p className="truncate text-sm text-slate-600">
                  {selectedExam
                    ? "Class-section roster for selected schedule"
                    : "Select an exam schedule"}
                </p>
              </div>
            </div>

            <input
              className="input mb-4"
              placeholder="Search student, admission no, roll no"
              value={studentSearch}
              onChange={(event) =>
                setStudentSearch(
                  event.target.value
                )
              }
              disabled={!selectedExam}
            />

            {loading ? (
              <EmptyState>
                Loading roster...
              </EmptyState>
            ) : filteredStudents.length ===
              0 ? (
              <EmptyState>
                {selectedExam
                  ? "No students found for this class and section."
                  : "Select a schedule to load students."}
              </EmptyState>
            ) : (
              <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {filteredStudents.map(
                  (student) => (
                    <button
                      key={student.id}
                      onClick={() =>
                        selectStudent(
                          student
                        )
                      }
                      className={`w-full min-w-0 rounded-lg border p-3 text-left transition ${
                        selectedStudent?.id ===
                        student.id
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white hover:border-amber-400"
                      }`}
                    >
                      <div className="truncate font-black">
                        {studentName(student)}
                      </div>
                      <div
                        className={`mt-1 grid gap-1 text-xs md:grid-cols-2 ${
                          selectedStudent?.id ===
                          student.id
                            ? "text-white/70"
                            : "text-slate-600"
                        }`}
                      >
                        <span className="truncate">
                          Admission:{" "}
                          {student.admission_number ||
                            "-"}
                        </span>
                        <span className="truncate">
                          Roll:{" "}
                          {student.roll_number ||
                            "-"}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </section>

          <section className="tt-card tt-card-pad min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                <FileQuestion size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black">
                  Question Evaluation
                </h2>
                <p className="truncate text-sm text-slate-600">
                  {selectedStudent
                    ? studentName(selectedStudent)
                    : "Select a student to enter marks"}
                </p>
              </div>
            </div>

            {!selectedExam ? (
              <EmptyState>
                Select a scheduled exam to load its paper.
              </EmptyState>
            ) : !selectedExam.question_paper_id ? (
              <EmptyState>
                This schedule has no question paper attached. Attach a paper from Exam Schedule first.
              </EmptyState>
            ) : questions.length === 0 ? (
              <EmptyState>
                The attached question paper has no questions.
              </EmptyState>
            ) : (
              <div className="space-y-4">
                {questions.map(
                  (question, index) => {
                    const key =
                      questionKey(question);
                    const max =
                      Number(
                        question.question_marks ||
                          0
                      );

                    return (
                      <article
                        key={key}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase text-amber-700">
                              Q{index + 1}
                              {question.section_name
                                ? ` - Section ${question.section_name}`
                                : ""}
                            </p>
                            <h3 className="mt-1 whitespace-pre-wrap break-words text-base font-black text-slate-950">
                              {question.question_text ||
                                "Question text missing"}
                            </h3>
                            <p className="mt-2 break-words text-sm text-slate-600">
                              {[
                                question.topic_name,
                                question.question_type,
                                question.difficulty_level,
                              ]
                                .filter(Boolean)
                                .join(" / ") ||
                                "No topic metadata"}
                            </p>
                          </div>
                          <span className="w-fit shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                            {max} marks
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[150px_minmax(0,1fr)]">
                          <label className="min-w-0">
                            <span className="mb-1 block text-sm font-bold text-slate-700">
                              Marks
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={max}
                              step="0.5"
                              className="input"
                              value={
                                marks[key] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                setMarks({
                                  ...marks,
                                  [key]:
                                    event.target
                                      .value,
                                })
                              }
                              disabled={
                                !selectedStudent
                              }
                              placeholder={`0-${max}`}
                            />
                          </label>
                          <label className="min-w-0">
                            <span className="mb-1 block text-sm font-bold text-slate-700">
                              Remarks
                            </span>
                            <input
                              className="input"
                              value={
                                remarks[key] ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                setRemarks({
                                  ...remarks,
                                  [key]:
                                    event.target
                                      .value,
                                })
                              }
                              disabled={
                                !selectedStudent
                              }
                              placeholder="Optional evaluator note"
                            />
                          </label>
                          <label className="min-w-0 md:col-span-2">
                            <span className="mb-1 block text-sm font-bold text-slate-700">
                              Student Answer for AI
                            </span>
                            <textarea
                              className="input min-h-24"
                              value={
                                studentAnswers[key] ||
                                ""
                              }
                              onChange={(event) =>
                                setStudentAnswers({
                                  ...studentAnswers,
                                  [key]:
                                    event.target
                                      .value,
                                })
                              }
                              disabled={
                                !selectedStudent
                              }
                              placeholder="Paste the student's answer here to generate AI suggestions."
                            />
                          </label>
                          <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900">
                                  Answer Capture / Upload
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-600">
                                  Take a photo, upload an image, PDF, or document, and keep the attachment with this answer.
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:border-amber-400">
                                  <Camera size={14} />
                                  Take Photo
                                  <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    disabled={!selectedStudent}
                                    onChange={(event) => {
                                      handleAttachmentSelection(
                                        question.question_id,
                                        event.target.files
                                      );
                                      event.currentTarget.value = "";
                                    }}
                                  />
                                </label>
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:border-amber-400">
                                  <UploadCloud size={14} />
                                  Upload File
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    multiple
                                    className="hidden"
                                    disabled={!selectedStudent}
                                    onChange={(event) => {
                                      handleAttachmentSelection(
                                        question.question_id,
                                        event.target.files
                                      );
                                      event.currentTarget.value = "";
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    clearAttachments(
                                      question.question_id
                                    )
                                  }
                                  disabled={
                                    !selectedStudent ||
                                    !(
                                      answerAttachments[
                                        question.question_id
                                      ] || []
                                    ).length
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-700">
                              {(
                                answerAttachments[
                                  question.question_id
                                ] || []
                              ).length ? (
                                <ul className="space-y-2">
                                  {(
                                    answerAttachments[
                                      question.question_id
                                    ] || []
                                  ).map((file) => (
                                    <li
                                      key={`${file.name}-${file.size}`}
                                      className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2"
                                    >
                                      <span className="truncate font-semibold text-slate-900">
                                        {file.name}
                                      </span>
                                      <span className="shrink-0 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                                        {Math.max(1, Math.round(file.size / 1024))} KB
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="flex items-start gap-2">
                                  <Paperclip
                                    size={16}
                                    className="mt-0.5 shrink-0 text-slate-400"
                                  />
                                  <p>
                                    No attachment added yet. Use photo capture or file upload to attach the student&apos;s answer sheet.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>

          <section className="tt-card tt-card-pad min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                <Calculator size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black">
                  Summary
                </h2>
                <p className="truncate text-sm text-slate-600">
                  Academic-year aware result
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Info
                label="Exam"
                value={
                  selectedExam?.exam_name ||
                  selectedExam?.exam_type_name ||
                  "-"
                }
              />
              <Info
                label="Student"
                value={
                  selectedStudent
                    ? studentName(
                        selectedStudent
                      )
                    : "-"
                }
              />
              <Info
                label="Total"
                value={`${totalMarks} / ${maxMarks}`}
              />
              <Info
                label="Percentage"
                value={`${percentage.toFixed(
                  2
                )}%`}
              />
              <Info
                label="Grade"
                value={grade}
              />
              <Info
                label="Missing Marks"
                value={String(missingMarks)}
              />
              <Info
                label="Saved Entries"
                value={String(
                  existingMarks.length
                )}
              />
              <Info
                label="AI Suggestions"
                value={String(
                  aiEvaluations.length
                )}
              />
              <Info
                label="Concept Understanding"
                value={`${Number(aiAggregateMetrics?.conceptUnderstandingPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Memory Retention"
                value={`${Number(aiAggregateMetrics?.memoryRetentionPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Application Skill"
                value={`${Number(aiAggregateMetrics?.applicationSkillPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Analytical Skill"
                value={`${Number(aiAggregateMetrics?.analyticalSkillPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Critical Thinking"
                value={`${Number(aiAggregateMetrics?.criticalThinkingPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Writing Skill"
                value={`${Number(aiAggregateMetrics?.writingSkillPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Problem Solving"
                value={`${Number(aiAggregateMetrics?.problemSolvingPercent || 0).toFixed(2)}%`}
              />
              <Info
                label="Confidence Score"
                value={`${Number(aiAggregateMetrics?.confidenceScorePercent || 0).toFixed(2)}%`}
              />
            </div>

            <button
              onClick={saveMarks}
              disabled={saving}
              className="tt-button mt-6 inline-flex w-full items-center justify-center gap-2"
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : "Save Marks"}
            </button>
            <button
              onClick={runAIEvaluation}
              disabled={
                aiRunning ||
                !selectedExam ||
                !selectedStudent
              }
              className="tt-button-secondary mt-3 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardCheck size={17} />
              {aiRunning
                ? "Evaluating..."
                : "Run AI Evaluation"}
            </button>
            <button
              onClick={() =>
                printMarksReport(
                  selectedExam,
                  selectedStudent,
                  existingMarks
                )
              }
              disabled={
                !selectedExam ||
                !selectedStudent ||
                existingMarks.length ===
                  0
              }
              className="tt-button-secondary mt-3 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer size={17} />
              Print Marks Report
            </button>
          </section>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black">
                Saved Marks View
              </h2>
              <p className="text-sm text-slate-600">
                View already entered marks for the selected student and exam schedule.
              </p>
            </div>
          </div>

          {!selectedStudent ? (
            <EmptyState>
              Select a student to view entered marks.
            </EmptyState>
          ) : existingMarks.length === 0 ? (
            <EmptyState>
              No marks have been saved for this student and schedule yet.
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">
                      Question
                    </th>
                    <th className="py-3 pr-4">
                      Marks
                    </th>
                    <th className="py-3 pr-4">
                      Grade
                    </th>
                    <th className="py-3 pr-4">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {existingMarks.map(
                    (row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100"
                      >
                        <td className="max-w-[520px] py-3 pr-4 font-bold text-slate-950">
                          {row.question_text ||
                            `Question ${row.question_id}`}
                        </td>
                        <td className="py-3 pr-4 font-black text-slate-950">
                          {row.obtained_marks} /{" "}
                          {row.max_marks}
                        </td>
                        <td className="py-3 pr-4 font-black text-amber-700">
                          {row.grade || "-"}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {row.remarks || "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black">
                AI Assessment Review
              </h2>
              <p className="text-sm text-slate-600">
                Teacher review queue for concept detection, partial credit, misconceptions and recommended marks.
              </p>
            </div>
          </div>

          {aiEvaluations.length === 0 ? (
            <EmptyState>
              Run AI evaluation for the selected student to see suggested marks and explanations.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {aiEvaluations.map((row, index) => (
                <div
                  key={String(row.question_id || index)}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-amber-700">
                        Question {index + 1}
                      </p>
                      <p className="mt-1 font-black text-slate-950">
                        AI Suggested Marks: {Number(row.recommendedMarks || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {row.qualityLabel || "-"} • Understanding {row.understandingLevel || "-"} • Confidence {Number(row.confidencePercent || 0).toFixed(2)}%
                      </p>
                    </div>
                    <button
                      className="tt-button-secondary"
                      onClick={() => {
                        const question = questions.find(
                          (item) =>
                            Number(item.question_id) ===
                            Number(row.question_id)
                        );
                        if (!question) return;
                        const key = questionKey(question);
                        setMarks((current) => ({
                          ...current,
                          [key]: String(
                            row.recommendedMarks || 0
                          ),
                        }));
                      }}
                    >
                      Use Suggested Marks
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricChip
                      label="Exact Match"
                      value={`${Number(row.exactMatchScore || 0).toFixed(2)}%`}
                    />
                    <MetricChip
                      label="Concept Match"
                      value={`${Number(row.conceptMatchScore || 0).toFixed(2)}%`}
                    />
                    <MetricChip
                      label="Keyword Match"
                      value={`${Number(row.keywordMatchScore || 0).toFixed(2)}%`}
                    />
                    <MetricChip
                      label="Completeness"
                      value={`${Number(row.completenessScore || 0).toFixed(2)}%`}
                    />
                  </div>
                  {row.reasoning ? (
                    <p className="mt-3 text-sm text-slate-700">
                      {row.reasoning}
                    </p>
                  ) : null}
                  {row.misconceptions?.length ? (
                    <p className="mt-2 text-sm font-semibold text-red-700">
                      Misconceptions: {row.misconceptions.join("; ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function MarksDashboard({
  exam,
  analytics,
  showGrid,
  onToggleGrid,
}: {
  exam: ExamSchedule;
  analytics: MarksAnalytics;
  showGrid: boolean;
  onToggleGrid: () => void;
}) {
  const rows = analytics.rows || [];
  const summary = analytics.summary;
  const highest = summary?.highest;
  const lowest = summary?.lowest;

  return (
    <section className="tt-card tt-card-pad">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black">
              Marks Dashboard
            </h2>
            <p className="truncate text-sm text-slate-600">
              {[
                exam.exam_name ||
                  exam.exam_type_name,
                exam.class_name,
                exam.section_name,
                exam.subject_name,
              ]
                .filter(Boolean)
                .join(" / ") ||
                "Selected class and section"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              printClassMarksReport(
                exam,
                rows
              )
            }
            disabled={rows.length === 0}
            className="tt-button-secondary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer size={16} />
            Print Class Report
          </button>
          <button
            onClick={onToggleGrid}
            className="tt-button inline-flex items-center gap-2"
          >
            {showGrid
              ? "Hide Grid"
              : "Explore More"}
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState>
          No saved marks yet for this class and section. Enter marks to generate analytics.
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <AnalyticsCard
              label="Students Evaluated"
              value={String(
                summary?.student_count ||
                  rows.length
              )}
            />
            <AnalyticsCard
              label="Class Average"
              value={`${Number(summary?.average_percentage || 0).toFixed(2)}%`}
            />
            <AnalyticsCard
              label="Highest Marks"
              value={
                highest
                  ? `${highest.student_name || "Student"} - ${Number(highest.percentage || 0).toFixed(2)}%`
                  : "-"
              }
            />
            <AnalyticsCard
              label="Least Marks"
              value={
                lowest
                  ? `${lowest.student_name || "Student"} - ${Number(lowest.percentage || 0).toFixed(2)}%`
                  : "-"
              }
            />
          </div>

          <div className="mt-6 space-y-3">
            {rows.slice(0, 8).map((row) => {
              const percent = Number(
                row.percentage || 0
              );

              return (
                <div
                  key={row.student_id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-black text-slate-950">
                      {row.student_name ||
                        `Student ${row.student_id}`}
                    </span>
                    <span className="font-black text-amber-700">
                      {percent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, percent))}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {showGrid ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">
                      Student
                    </th>
                    <th className="py-3 pr-4">
                      Admission
                    </th>
                    <th className="py-3 pr-4">
                      Roll
                    </th>
                    <th className="py-3 pr-4">
                      Class
                    </th>
                    <th className="py-3 pr-4">
                      Marks
                    </th>
                    <th className="py-3 pr-4">
                      %
                    </th>
                    <th className="py-3 pr-4">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.student_id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-3 pr-4 font-black text-slate-950">
                        {row.student_name ||
                          `Student ${row.student_id}`}
                      </td>
                      <td className="py-3 pr-4">
                        {row.admission_number ||
                          "-"}
                      </td>
                      <td className="py-3 pr-4">
                        {row.roll_number ||
                          "-"}
                      </td>
                      <td className="py-3 pr-4">
                        {[
                          row.class_name,
                          row.section_name,
                        ]
                          .filter(Boolean)
                          .join(" ") ||
                          "-"}
                      </td>
                      <td className="py-3 pr-4 font-bold">
                        {row.obtained_marks} /{" "}
                        {row.max_marks}
                      </td>
                      <td className="py-3 pr-4 font-bold">
                        {Number(
                          row.percentage || 0
                        ).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4 font-black text-amber-700">
                        {row.grade || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MetricChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

async function printMarksReport(
  exam: ExamSchedule | null,
  student: Student | null,
  marksRows: ExistingMark[]
) {
  if (!exam || !student || !marksRows.length) {
    notify.error("Select a student with saved marks before printing.");
    return;
  }

  const rows = marksRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.question_text || `Question ${row.question_id}`)}</td>
          <td>${row.obtained_marks} / ${row.max_marks}</td>
          <td>${escapeHtml(row.grade || "-")}</td>
          <td>${escapeHtml(row.remarks || "-")}</td>
        </tr>
      `
    )
    .join("");

  await printBrandedDocument({
    title: "Marks Report",
    subtitle:
      "Student-wise marks statement generated from saved exam entries.",
    documentLabel: "Marks Report",
    metaHtml: printMetaGrid([
      {
        label: "Exam",
        value:
          exam.exam_name ||
          exam.exam_type_name ||
          "-",
      },
      {
        label: "Student",
        value: studentName(student),
      },
      {
        label: "Class / Section",
        value:
          [
            exam.class_name,
            exam.section_name,
          ]
            .filter(Boolean)
            .join(" ") || "-",
      },
      {
        label: "Subject",
        value: exam.subject_name || "-",
      },
    ]),
    bodyHtml: `
      <table><thead><tr><th>Question</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="sign">Academic Coordinator Signature</p>
    `,
    popupError:
      "Allow popups to print this report.",
  });
}

async function printClassMarksReport(
  exam: ExamSchedule,
  rows: MarksAnalyticsRow[]
) {
  if (!rows.length) {
    notify.error("No class marks are available to print.");
    return;
  }

  const body = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.student_name || `Student ${row.student_id}`)}</td>
          <td>${escapeHtml(row.admission_number || "-")}</td>
          <td>${escapeHtml(row.roll_number || "-")}</td>
          <td>${row.obtained_marks} / ${row.max_marks}</td>
          <td>${Number(row.percentage || 0).toFixed(2)}%</td>
          <td>${escapeHtml(row.grade || "-")}</td>
        </tr>
      `
    )
    .join("");

  await printBrandedDocument({
    title: "Class Marks Report",
    subtitle:
      "Class and section performance report with student-wise marks.",
    documentLabel: "Class Marks",
    metaHtml: printMetaGrid([
      {
        label: "Exam",
        value:
          exam.exam_name ||
          exam.exam_type_name ||
          "-",
      },
      {
        label: "Class / Section",
        value:
          [
            exam.class_name,
            exam.section_name,
          ]
            .filter(Boolean)
            .join(" ") || "-",
      },
      {
        label: "Subject",
        value: exam.subject_name || "-",
      },
      {
        label: "Students",
        value: rows.length,
      },
    ]),
    bodyHtml: `
      <table><thead><tr><th>Student</th><th>Admission</th><th>Roll</th><th>Marks</th><th>%</th><th>Grade</th></tr></thead><tbody>${body}</tbody></table>
      <p class="sign">Academic Coordinator Signature</p>
    `,
    popupError:
      "Allow popups to print this report.",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printStyles() {
  return `<style>body{font-family:Arial,sans-serif;margin:32px;color:#111827}h1{border-bottom:2px solid #111827;padding-bottom:12px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #d1d5db;padding:10px;text-align:left;vertical-align:top}th{background:#f3f4f6;text-transform:uppercase;font-size:12px}@media print{body{margin:18mm}}</style>`;
}

function printHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    notify.error("Allow popups to print this report.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function studentName(
  student: Student
) {
  return (
    student.name ||
    [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    `Student ${student.id}`
  );
}

function questionKey(
  question: PaperQuestion
) {
  return String(
    question.question_id ||
      question.id
  );
}

function gradeFor(
  percentage: number
) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 35) return "E";
  return "F";
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "-";
  }

  return new Date(
    value
  ).toLocaleDateString();
}

function EmptyState({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
      {children}
    </div>
  );
}

function Info({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: string;
  inverse?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`text-xs font-bold uppercase ${
          inverse
            ? "text-white/55"
            : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`truncate font-semibold ${
          inverse
            ? "text-white"
            : "text-slate-950"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
