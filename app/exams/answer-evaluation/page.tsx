"use client";

import {
  BarChart3,
  CheckCircle2,
  Camera,
  FileText,
  FileUp,
  FlaskConical,
  Gauge,
  GraduationCap,
  ListChecks,
  PenLine,
  Printer,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Layout from "@/components/Layout";
import CommandCenterHero from "@/components/ui/CommandCenterHero";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Row = Record<string, any>;

type SchoolOption = {
  id: number;
  school_name?: string | null;
  school_code?: string | null;
};

type AcademicYearOption = {
  id: number | string;
  academic_year?: string | null;
  is_selected?: boolean;
};

type ExamScheduleOption = {
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

type ClassOption = {
  id: number;
  class_name?: string | null;
};

type SectionOption = {
  id: number;
  class_id?: number | null;
  section_name?: string | null;
};

type StudentOption = {
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

type AnswerEvaluationRecord = {
  id: number;
  school_id?: number | null;
  academic_year_id?: number | null;
  exam_schedule_id?: number | null;
  question_paper_id?: number | null;
  class_id?: number | null;
  section_id?: number | null;
  student_id?: number | null;
  uploaded_by?: number | null;
  original_file_name?: string | null;
  stored_file_name?: string | null;
  file_path?: string | null;
  mime_type?: string | null;
  page_count?: number | null;
  ocr_text?: string | null;
  extracted_answers?: Row[] | string | null;
  ai_evaluation?: Row[] | string | null;
  ai_summary?: Row | string | null;
  teacher_review_status?: string | null;
  teacher_reviewed_by?: number | null;
  teacher_reviewed_at?: string | null;
  teacher_comments?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  school_name?: string | null;
  academic_year?: string | null;
  student_name?: string | null;
  admission_number?: string | null;
  roll_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  exam_date?: string | null;
  exam_status?: string | null;
  paper_name?: string | null;
};

type AnalyticsRow = {
  student_id?: number | null;
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

type EvaluationResponse = {
  records?: AnswerEvaluationRecord[];
  summary?: {
    total_records?: number;
    pending_reviews?: number;
    approved_reviews?: number;
    override_reviews?: number;
  } | null;
  analytics?: AnalyticsRow[];
};

const WORKFLOW_STATUS_OPTIONS = [
  "DRAFT",
  "AI_EVALUATED",
  "TEACHER_REVIEW_PENDING",
  "TEACHER_APPROVED",
  "TEACHER_REJECTED",
  "PUBLISHED",
] as const;

function workflowStatusLabel(status?: string | null) {
  const normalized = String(status || "").trim().toUpperCase();
  switch (normalized) {
    case "DRAFT":
      return "Draft";
    case "AI_EVALUATED":
      return "AI Evaluated";
    case "TEACHER_REVIEW_PENDING":
      return "Teacher Review Pending";
    case "TEACHER_APPROVED":
      return "Teacher Approved";
    case "TEACHER_REJECTED":
      return "Teacher Rejected";
    case "PUBLISHED":
      return "Published";
    default:
      return normalized || "Teacher Review Pending";
  }
}

function normalizeWorkflowStatus(status?: string | null) {
  const normalized = String(status || "").trim().toUpperCase();
  switch (normalized) {
    case "DRAFT":
    case "AI_EVALUATED":
    case "TEACHER_REVIEW_PENDING":
    case "TEACHER_APPROVED":
    case "TEACHER_REJECTED":
    case "PUBLISHED":
      return normalized;
    case "APPROVED":
    case "OVERRIDE":
      return "TEACHER_APPROVED";
    case "REJECTED":
      return "TEACHER_REJECTED";
    default:
      return "TEACHER_REVIEW_PENDING";
  }
}

type UploadResponse = {
  success?: boolean;
  records?: Row[];
};

const emptyFilters = {
  school_id: "",
  academic_year_id: "",
  exam_schedule_id: "",
  class_id: "",
  section_id: "",
  student_id: "",
};

const money = (value: unknown) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

function displayStudent(student?: StudentOption | null) {
  if (!student) {
    return "-";
  }

  return [
    [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" "),
    student.name,
    student.admission_number,
  ]
    .filter(Boolean)
    .join(" • ");
}

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function asObject(value: unknown): Row {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Row;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Row) : {};
    } catch {
      return {};
    }
  }

  return {};
}

export default function AnswerEvaluationCenterPage() {
  const [records, setRecords] = useState<AnswerEvaluationRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [summary, setSummary] = useState<EvaluationResponse["summary"]>(null);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamScheduleOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("TEACHER_APPROVED");
  const [reviewComments, setReviewComments] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [finalMarks, setFinalMarks] = useState<Record<number, string>>({});
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || records[0] || null,
    [records, selectedRecordId]
  );

  useEffect(() => {
    if (!selectedRecordId && records[0]?.id) {
      setSelectedRecordId(records[0].id);
    }
  }, [records, selectedRecordId]);

  useEffect(() => {
    void loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.school_id, filters.academic_year_id]);

  useEffect(() => {
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (filters.exam_schedule_id) {
      void loadStudents(filters.exam_schedule_id);
    } else {
      setStudents([]);
    }
  }, [filters.exam_schedule_id]);

  useEffect(() => {
    const record = selectedRecord;
    const evaluations = asArray<Row>(record?.extracted_answers);
    const nextMarks: Record<number, string> = {};
    evaluations.forEach((item) => {
      const qid = Number(item.question_id || item.question_id);
      if (qid) {
        nextMarks[qid] = String(item.teacher_override_marks ?? item.recommended_marks ?? "");
      }
    });
    setFinalMarks(nextMarks);
    setReviewStatus(normalizeWorkflowStatus(record?.teacher_review_status));
    setReviewComments(String(record?.teacher_comments || ""));
  }, [selectedRecord]);

  async function loadFilterOptions() {
    try {
      const query = new URLSearchParams();
      if (filters.school_id) {
        query.set("school_id", filters.school_id);
      }
      if (filters.academic_year_id) {
        query.set("academic_year_id", filters.academic_year_id);
      }

      const [schoolRows, yearRows, examRows, classRows, sectionRows] = await Promise.all([
        apiJson<SchoolOption[]>("/api/schools"),
        apiJson<AcademicYearOption[]>("/api/academic-years?include_all=true"),
        apiJson<ExamScheduleOption[]>(`/api/exam-schedule${query.toString() ? `?${query.toString()}` : ""}`),
        apiJson<ClassOption[]>(`/api/classes${query.toString() ? `?${query.toString()}` : ""}`),
        apiJson<SectionOption[]>(`/api/sections${query.toString() ? `?${query.toString()}` : ""}`),
      ]);

      setSchools(Array.isArray(schoolRows) ? schoolRows : []);
      setAcademicYears(Array.isArray(yearRows) ? yearRows : []);
      setExamSchedules(Array.isArray(examRows) ? examRows : []);
      setClasses(Array.isArray(classRows) ? classRows : []);
      setSections(Array.isArray(sectionRows) ? sectionRows : []);

      const selectedYear = Array.isArray(yearRows) ? yearRows.find((year) => year.is_selected && year.id !== "all") : null;
      if (selectedYear?.id && !filters.academic_year_id) {
        setFilters((current) => ({
          ...current,
          academic_year_id: String(selectedYear.id),
        }));
      }
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to load answer evaluation filters"));
    }
  }

  async function loadStudents(examScheduleId: string) {
    try {
      const rows = await apiJson<StudentOption[]>(`/api/marks-entry/students?exam_schedule_id=${examScheduleId}`);
      setStudents(Array.isArray(rows) ? rows : []);
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to load students"));
    }
  }

  async function loadRecords() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params?.set(key, value);
        }
      });
      const payload = await apiJson<EvaluationResponse>(`/api/exams/answer-evaluation${params?.toString() ? `?${params?.toString()}` : ""}`);
      setRecords(payload.records || []);
      setSummary(payload.summary || null);
      setAnalytics(payload.analytics || []);
      if (!selectedRecordId && (payload.records || []).length) {
        setSelectedRecordId(payload.records?.[0]?.id || null);
      }
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to load answer evaluations"));
    } finally {
      setLoading(false);
    }
  }

  const visibleSections = useMemo(
    () => sections.filter((section) => !filters.class_id || String(section.class_id || "") === filters.class_id),
    [filters.class_id, sections]
  );

  const visibleStudents = useMemo(
    () =>
      students.filter((student) => {
        if (!filters.class_id) return true;
        const selectedClass = classes.find((item) => String(item.id) === filters.class_id);
        return String(student.class_name || "").trim() === String(selectedClass?.class_name || "").trim() || !selectedClass;
      }),
    [classes, filters.class_id, students]
  );

  const evaluations = asArray<Row>(selectedRecord?.extracted_answers);
  const aiSummary = asObject(selectedRecord?.ai_summary);
  const ocrPreview = String(selectedRecord?.ocr_text || "").slice(0, 1800);

  const topPerformers = useMemo(() => analytics.slice(0, 3), [analytics]);
  const weakPerformers = useMemo(() => analytics.slice(-3).reverse(), [analytics]);

  async function uploadAnswerSheets() {
    if (!filters.school_id || !filters.academic_year_id || !filters.exam_schedule_id || !filters.student_id) {
      notify.error("Select school/college, academic year, exam and student before uploading.");
      return;
    }

    if (!uploadFiles.length) {
      notify.error("Choose at least one PDF, JPG, or PNG answer sheet.");
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          form.append(key, value);
        }
      });
      uploadFiles.forEach((file) => form.append("answer_sheets", file));

      const response = await fetch("/api/exams/answer-evaluation", {
        method: "POST",
        body: form,
      });
      const payload = (await response.json().catch(() => null)) as UploadResponse | null;
      if (!response.ok) {
        throw new Error((payload as Row)?.error || (payload as Row)?.message || `Request failed with ${response.status}`);
      }

      notify.success("Answer sheet evaluated successfully.");
      setUploadFiles([]);
      await loadRecords();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to upload answer sheet"));
    } finally {
      setSaving(false);
    }
  }

  async function saveReview() {
    if (!selectedRecord?.id) {
      notify.error("Select an evaluation record first.");
      return;
    }

    try {
      setSaving(true);
      const overrides = evaluations
        .map((item) => ({
          question_id: Number(item.question_id || 0),
          final_marks: Number(finalMarks[Number(item.question_id || 0)] || item.teacher_override_marks || item.recommended_marks || 0),
        }))
        .filter((item) => Number.isFinite(item.question_id) && Number.isFinite(item.final_marks));

      await apiJson("/api/exams/answer-evaluation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upload_id: selectedRecord.id,
          teacher_review_status: reviewStatus,
          teacher_comments: reviewComments,
          overrides,
        }),
      });
      notify.success("Teacher review saved.");
      await loadRecords();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to save teacher review"));
    } finally {
      setSaving(false);
    }
  }

  const exportUrl = (type: string, format: "pdf" | "xlsx") => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params?.set(key, value);
    });
    params?.set("type", type);
    params?.set("format", format);
    return `/api/exams/answer-evaluation/export?${params?.toString()}`;
  };

  function appendUploadFiles(files: FileList | null) {
    const nextFiles = Array.from(files || []);
    if (!nextFiles.length) {
      return;
    }

    setUploadFiles((current) => {
      const merged = [...current, ...nextFiles];
      const unique = new Map<string, File>();

      merged.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!unique.has(key)) {
          unique.set(key, file);
        }
      });

      return Array.from(unique.values());
    });
  }

  const metrics = selectedRecord ? asObject(selectedRecord.ai_evaluation) : {};
  const metricCards = [
    { label: "Concept Understanding", value: Number(metrics.conceptUnderstandingPercent || 0) },
    { label: "Memory Retention", value: Number(metrics.memoryRetentionPercent || 0) },
    { label: "Application Skill", value: Number(metrics.applicationSkillPercent || 0) },
    { label: "Analytical Skill", value: Number(metrics.analyticalSkillPercent || 0) },
    { label: "Critical Thinking", value: Number(metrics.criticalThinkingPercent || 0) },
    { label: "Writing Skill", value: Number(metrics.writingSkillPercent || 0) },
    { label: "Problem Solving", value: Number(metrics.problemSolvingPercent || 0) },
    { label: "Confidence Score", value: Number(metrics.confidenceScorePercent || 0) },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <CommandCenterHero
          label="Answer Evaluation Center"
          title="AI Answer Evaluation Center"
          subtitle="Upload PDF, JPG or PNG answer sheets, extract text with OCR, score every question with AI, and let the teacher approve or override the final marks."
        >
          <div className="rounded-[8px] border border-[#D4AF37]/45 bg-black/20 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Pending Reviews</p>
            <p className="mt-1 text-3xl font-black text-white">{summary?.pending_reviews || 0}</p>
          </div>
          <div className="rounded-[8px] border border-[#D4AF37]/45 bg-black/20 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Total Records</p>
            <p className="mt-1 text-3xl font-black text-white">{summary?.total_records || 0}</p>
          </div>
        </CommandCenterHero>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="grid gap-3 xl:grid-cols-3">
            <FilterSelect label="School/College" value={filters.school_id} onChange={(value) => setFilters((current) => ({ ...current, school_id: value }))} options={[{ value: "", label: "All Schools/Colleges" }, ...schools.map((school) => ({ value: String(school.id), label: `${school.school_name || `School ${school.id}`}${school.school_code ? ` (${school.school_code})` : ""}` }))]} />
            <FilterSelect label="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters((current) => ({ ...current, academic_year_id: value }))} options={[{ value: "", label: "All Academic Years" }, ...academicYears.map((year) => ({ value: String(year.id), label: year.id === "all" ? "All Years" : String(year.academic_year || year.id) }))]} />
            <FilterSelect label="Exam" value={filters.exam_schedule_id} onChange={(value) => setFilters((current) => ({ ...current, exam_schedule_id: value, class_id: "", section_id: "", student_id: "" }))} options={[{ value: "", label: "Select Exam" }, ...examSchedules.map((exam) => ({ value: String(exam.id), label: [exam.exam_name, exam.exam_type_name, exam.paper_name, exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : ""].filter(Boolean).join(" • ") }))]} />
            <FilterSelect label="Class" value={filters.class_id} onChange={(value) => setFilters((current) => ({ ...current, class_id: value, section_id: "", student_id: "" }))} options={[{ value: "", label: "All Classes" }, ...classes.map((item) => ({ value: String(item.id), label: item.class_name || `Class ${item.id}` }))]} />
            <FilterSelect label="Section" value={filters.section_id} onChange={(value) => setFilters((current) => ({ ...current, section_id: value, student_id: "" }))} options={[{ value: "", label: "All Sections" }, ...visibleSections.map((item) => ({ value: String(item.id), label: item.section_name || `Section ${item.id}` }))]} />
            <FilterSelect label="Student" value={filters.student_id} onChange={(value) => setFilters((current) => ({ ...current, student_id: value }))} options={[{ value: "", label: "Select Student" }, ...visibleStudents.map((student) => ({ value: String(student.id), label: displayStudent(student) }))]} />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ActionLink label="Student Evaluation Report" href={exportUrl("student", "pdf")} icon={<FileText size={16} />} />
            <ActionLink label="Exam Evaluation Report" href={exportUrl("exam", "pdf")} icon={<Printer size={16} />} />
            <ActionLink label="Class Evaluation Report" href={exportUrl("class", "xlsx")} icon={<BarChart3 size={16} />} />
            <ActionLink label="Concept Mastery Report" href={exportUrl("concept", "pdf")} icon={<Sparkles size={16} />} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="tt-card tt-card-pad space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Upload Answer Sheet</h2>
                <p className="text-sm font-medium text-slate-600">Capture a photo or upload PDF, JPG, PNG, DOC or DOCX answer sheets.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
                OCR + AI
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="tt-button-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black"
              >
                <Camera size={16} />
                Take Photo
              </button>
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="tt-button-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black"
              >
                <FileUp size={16} />
                Upload File
              </button>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(event) => appendUploadFiles(event.target.files)}
            />
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(event) => appendUploadFiles(event.target.files)}
            />

            <div className="rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              {uploadFiles.length ? (
                <ul className="space-y-1">
                  {uploadFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold text-slate-800">{file.name}</span>
                      <span className="text-xs">{Math.round(file.size / 1024)} KB</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Take a photo or choose a real answer sheet to run OCR and AI evaluation.</p>
              )}
            </div>

            <div className="grid gap-3">
              <ActionButton onClick={uploadAnswerSheets} loading={saving} icon={<FileUp size={16} />} label="Run OCR & Evaluate" />
              <ActionButton onClick={saveReview} loading={saving} icon={<Save size={16} />} label="Finalize Teacher Review" secondary />
            </div>

            {uploadFiles.length ? (
              <button
                type="button"
                onClick={() => setUploadFiles([])}
                className="text-left text-xs font-black uppercase tracking-[0.18em] text-slate-500 underline decoration-dotted underline-offset-4"
              >
                Clear selected files
              </button>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Approval Stage</span>
              <select className="input" value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)}>
                {WORKFLOW_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {workflowStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Teacher Comment</span>
              <textarea className="input min-h-[120px]" value={reviewComments} onChange={(event) => setReviewComments(event.target.value)} placeholder="Review note, rationale, or improvement suggestion" />
            </label>
          </aside>

          <div className="space-y-6">
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard title="Subject Performance" value={`${Number(metrics.concept_understanding_percent || 0).toFixed(0)}%`} icon={<GraduationCap size={18} />} />
              <InfoCard title="Concept Mastery" value={`${Number(metrics.concept_understanding_percent || 0).toFixed(0)}%`} icon={<FlaskConical size={18} />} />
              <InfoCard title="Weak Performers" value={String(weakPerformers.length)} icon={<ShieldCheck size={18} />} />
              <InfoCard title="Top Performers" value={String(topPerformers.length)} icon={<UserRoundCheck size={18} />} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="tt-card tt-card-pad space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">OCR Preview & Question-wise AI Analysis</h2>
                    <p className="text-sm font-medium text-slate-600">Proof of extracted text, suggested marks, and teacher override tracking.</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    {loading ? "Loading..." : `${records.length} records`}
                  </div>
                </div>

                {selectedRecord ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MiniStat label="Student" value={selectedRecord.student_name || "-"} />
                      <MiniStat label="Admission" value={selectedRecord.admission_number || "-"} />
                      <MiniStat label="File" value={selectedRecord.original_file_name || "-"} />
                      <MiniStat label="Review" value={workflowStatusLabel(selectedRecord.teacher_review_status)} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {metricCards.map((card) => (
                        <MetricPill key={card.label} label={card.label} value={`${card.value.toFixed(0)}%`} />
                      ))}
                    </div>

                    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">OCR Extracted Text</p>
                        <p className="text-xs font-semibold text-slate-500">Multi-page sheets are joined page-wise</p>
                      </div>
                      <pre className="mt-3 max-h-[280px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
                        {ocrPreview || "No OCR text available yet."}
                      </pre>
                    </div>

                    <div className="space-y-3">
                      {evaluations.map((item, index) => (
                        <article key={`${item.question_id}-${index}`} className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Question {item.question_number}</p>
                              <h3 className="mt-1 text-base font-black text-slate-950">{String(item.question_text || item.question || item.question_label || "Question")}</h3>
                              <p className="mt-1 text-sm text-slate-600">Bloom: {String((item as Row).bloom_level || "-")} • Difficulty: {String((item as Row).difficulty_level || "-")}</p>
                            </div>
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-right">
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">AI Suggested Marks</p>
                              <p className="text-xl font-black text-emerald-800">{Number(item.recommended_marks || item.recommendedMarks || 0).toFixed(2)} / {Number(item.max_marks || 0).toFixed(0)}</p>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <ScoreChip label="Accuracy" value={Number(item.conceptMatchScore || item.concept_match_score || 0)} />
                            <ScoreChip label="Concept" value={Number(item.conceptMatchScore || item.concept_match_score || 0)} />
                            <ScoreChip label="Keywords" value={Number(item.keywordMatchScore || item.keyword_match_score || 0)} />
                            <ScoreChip label="Writing" value={Number(item.writingQualityScore || item.writing_quality_score || 0)} />
                            <ScoreChip label="Completeness" value={Number(item.completenessScore || item.completeness_score || 0)} />
                            <ScoreChip label="Critical Thinking" value={Number(item.criticalThinkingScore || item.critical_thinking_score || 0)} />
                            <ScoreChip label="Confidence" value={Number(item.confidencePercent || item.confidence_percent || 0)} />
                            <ScoreChip label="Understanding" value={item.understandingLevel === "YES" ? 100 : item.understandingLevel === "PARTIAL" ? 50 : 0} />
                          </div>

                          <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_180px]">
                            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Student Answer</p>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{String(item.student_answer || "-")}</p>
                            </div>
                            <label className="block">
                              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Teacher Final Marks</span>
                              <input
                                className="input"
                                inputMode="decimal"
                                value={finalMarks[Number(item.question_id)] || ""}
                                onChange={(event) =>
                                  setFinalMarks((current) => ({
                                    ...current,
                                    [Number(item.question_id)]: event.target.value,
                                  }))
                                }
                                placeholder={String(item.recommended_marks || item.recommendedMarks || 0)}
                              />
                            </label>
                          </div>

                          <div className="mt-4 grid gap-3 xl:grid-cols-2">
                            <div className="rounded-[8px] border border-slate-200 bg-white p-3">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Missing Concepts</p>
                              <p className="mt-2 text-sm text-slate-700">{(item.missingConcepts || item.missing_concepts || []).length ? (item.missingConcepts || item.missing_concepts || []).join(", ") : "None"}</p>
                            </div>
                            <div className="rounded-[8px] border border-slate-200 bg-white p-3">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Wrong Concepts</p>
                              <p className="mt-2 text-sm text-slate-700">{(item.misconceptions || []).length ? (item.misconceptions || []).join(" • ") : "None"}</p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 p-3">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Teacher Review Trail</p>
                            <p className="mt-1 text-sm font-medium text-amber-900">
                              {workflowStatusLabel(selectedRecord.teacher_review_status)} • {selectedRecord.teacher_comments || "No comments yet"}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Student Evaluation Report", exportUrl("student", "pdf")],
                        ["Exam Evaluation Report", exportUrl("exam", "pdf")],
                        ["Class Evaluation Report", exportUrl("class", "xlsx")],
                        ["Teacher Review Report", exportUrl("teacher", "pdf")],
                      ].map(([label, href]) => (
                        <a key={label} href={href as string} className="tt-button-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                          <Printer size={15} />
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>

              <div className="space-y-6">
                <section className="tt-card tt-card-pad space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">Recent Evaluation Sessions</h3>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      {records.length} items
                    </div>
                  </div>

                  <div className="space-y-3">
                    {records.length ? (
                      records.map((record) => (
                        <button
                          key={record.id}
                          type="button"
                          onClick={() => setSelectedRecordId(record.id)}
                          className={`w-full rounded-[8px] border px-4 py-3 text-left transition ${
                            selectedRecordId === record.id ? "border-[#D4AF37] bg-[#FEF7E2]" : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-950">{record.student_name || "Student"}</p>
                              <p className="truncate text-xs font-semibold text-slate-500">
                                {record.admission_number || "-"} • {record.class_name || "-"} {record.section_name || ""} • {record.paper_name || "Question Paper"}
                              </p>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-black uppercase text-emerald-700">
                              {workflowStatusLabel(record.teacher_review_status)}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No answer evaluation records yet. Upload a real answer sheet to create the first record.
                      </p>
                    )}
                  </div>
                </section>

                <section className="tt-card tt-card-pad space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">Class Analytics</h3>
                    <BarChart3 size={18} className="text-[#D4AF37]" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <MiniStat label="Top 3" value={String(topPerformers.length)} />
                    <MiniStat label="Weak 3" value={String(weakPerformers.length)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Top Performers</p>
                    {topPerformers.map((row, index) => (
                      <div key={`${row.student_id || index}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <span className="font-semibold text-slate-800">{row.student_name || "-"}</span>
                        <span className="font-black text-emerald-700">{Number(row.percentage || 0).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Weak Performers</p>
                    {weakPerformers.map((row, index) => (
                      <div key={`${row.student_id || index}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <span className="font-semibold text-slate-800">{row.student_name || "-"}</span>
                        <span className="font-black text-red-600">{Number(row.percentage || 0).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="tt-card tt-card-pad space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">AI Insights</h3>
                    <Sparkles size={18} className="text-[#D4AF37]" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {metricCards.slice(0, 4).map((item) => (
                      <InsightCard key={item.label} label={item.label} value={item.value} />
                    ))}
                  </div>
                  <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="font-black text-slate-950">AI Reasoning</p>
                    <p className="mt-1 leading-6">{String(aiSummary.reasoning || selectedRecord?.teacher_comments || "AI evaluation completed from OCR extracted answers and question-paper mapping.")}</p>
                  </div>
                  <div className="rounded-[8px] border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Teacher Approval Workflow</p>
                    <p className="mt-2">Review, approve, override and comment are captured in the audit trail and persisted against the answer evaluation upload.</p>
                  </div>
                </section>

                <section className="tt-card tt-card-pad space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">Parent View</h3>
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <MiniStat label="Marks" value={`${Number(aiSummary.average_recommended_marks || 0).toFixed(2)}`} />
                    <MiniStat label="Comments" value={workflowStatusLabel(selectedRecord?.teacher_review_status)} />
                  </div>
                  <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="font-black text-slate-950">Improvement Areas</p>
                    <p className="mt-1 leading-6">
                      {String(aiSummary.teacher_approval_required ? "Teacher approval is pending or recorded. Review the concept gaps and suggested marks before publishing to parents." : "Student evaluation completed and ready for reporting.")}
                    </p>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionButton({
  label,
  onClick,
  loading,
  icon,
  secondary = false,
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
  icon: ReactNode;
  secondary?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className={secondary ? "tt-button-secondary inline-flex items-center justify-center gap-2" : "tt-button inline-flex items-center justify-center gap-2"}>
      {icon}
      {loading ? "Working..." : label}
    </button>
  );
}

function ActionLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <a href={href} className="tt-button-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
      {icon}
      {label}
    </a>
  );
}

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <div className="rounded-lg bg-[#FEF7E2] p-2 text-[#B88900]">{icon}</div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function ScoreChip({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{Number.isFinite(value) ? `${value.toFixed(0)}%` : "0%"}</p>
    </div>
  );
}

function InsightCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[8px] border border-[#D4AF37]/35 bg-[#FEF7E2] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9D7300]">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{Number.isFinite(value) ? `${value.toFixed(0)}%` : "0%"}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-[8px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="max-w-lg space-y-3">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FEF7E2] text-[#B88900]">
          <Search size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-950">Select a record or upload an answer sheet</h2>
        <p className="text-sm font-medium leading-6 text-slate-600">
          The center will show OCR extraction, question-wise AI scoring, concept mastery, teacher review and downloadable reports once a real upload is processed.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/exams" className="tt-button-secondary inline-flex items-center gap-2 px-4 py-3 text-sm font-black">
            <GraduationCap size={16} />
            Back to Exams
          </Link>
        </div>
      </div>
    </div>
  );
}
