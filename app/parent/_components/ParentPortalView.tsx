"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type ViewKey =
  | "dashboard"
  | "attendance"
  | "marks"
  | "fees"
  | "homework"
  | "syllabus"
  | "timetable"
  | "exams";

type ParentContext = {
  linked_students?: any[];
  selected_student?: any;
  attendance?: any[];
  marks?: any[];
  question_marks?: any[];
  homework?: any[];
  exams?: any[];
  timetable?: any[];
  syllabus?: any[];
  fees?: any[];
  ptm_meetings?: any[];
  declarations?: any[];
};

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";

const studentLabel = (student: any) =>
  student?.student_name ||
  [student?.first_name, student?.last_name]
    .filter(Boolean)
    .join(" ") ||
  `Student ${student?.id ?? ""}`;

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  rows,
  emptyText,
  renderRow,
}: {
  title: string;
  rows: any[];
  emptyText: string;
  renderRow: (row: any) => ReactNode;
}) {
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={row?.id ?? index}>{renderRow(row)}</div>
        ))}
        {!rows.length && (
          <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-500">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}

export default function ParentPortalView({
  view = "dashboard",
  title,
  subtitle,
}: {
  view?: ViewKey;
  title: string;
  subtitle: string;
}) {
  const [context, setContext] = useState<ParentContext>({});
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");

  const load = async (selectedStudentId?: string) => {
    try {
      setLoading(true);
      const query = selectedStudentId
        ? `?student_id=${encodeURIComponent(selectedStudentId)}`
        : "";
      const payload = await apiJson<ParentContext>(
        `/api/parent/context${query}`
      );
      setContext(payload);
      const nextId =
        String(
          payload.selected_student?.id ||
            payload.linked_students?.[0]?.id ||
            ""
        ) || "";
      setStudentId((current) => current || nextId);
      if (nextId && !selectedStudentId) {
        setStudentId(nextId);
      }
    } catch (error) {
      notify.error(
        errorMessage(error, "Failed to load parent portal")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (studentId) {
      void load(studentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const selectedStudent =
    context.selected_student ||
    context.linked_students?.[0] ||
    null;

  const totalAttendance =
    context.attendance?.length || 0;
  const presentCount =
    context.attendance?.filter(
      (row) =>
        String(row.status || "")
          .toUpperCase() === "PRESENT"
    ).length || 0;
  const attendancePct =
    totalAttendance > 0
      ? Math.round(
          (presentCount / totalAttendance) *
            100
        )
      : 0;
  const marksCount = context.marks?.length || 0;
  const questionCount =
    context.question_marks?.length || 0;
  const homeworkCount =
    context.homework?.length || 0;
  const syllabusCount =
    context.syllabus?.length || 0;
  const timetableCount =
    context.timetable?.length || 0;
  const examCount =
    context.exams?.length || 0;
  const feeDue = useMemo(() => {
    const total = (context.fees || []).reduce((sum, row) => {
      const amount = Number(
        row.assigned_amount ?? row.amount ?? 0
      );
      const paid = Number(row.paid_amount || 0);
      return sum + Math.max(amount - paid, 0);
    }, 0);
    return total.toLocaleString("en-IN");
  }, [context.fees]);

  const isDashboard = view === "dashboard";
  const isAttendance = view === "attendance";
  const isMarks = view === "marks";
  const isFees = view === "fees";
  const isHomework = view === "homework";
  const isSyllabus = view === "syllabus";
  const isTimetable = view === "timetable";
  const isExams = view === "exams";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-800 p-6 text-white shadow-lg">
        <div className="text-xs font-black uppercase tracking-[0.24em] text-white/80">
          Parent Portal
        </div>
        <div className="mt-2 text-3xl font-black md:text-4xl">{title}</div>
        <p className="mt-2 max-w-3xl text-sm text-white/80 md:text-base">
          {subtitle}
        </p>
      </div>

      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              Linked Student
            </div>
            <p className="mt-1 text-lg font-black text-slate-950">
              {selectedStudent ? studentLabel(selectedStudent) : "No linked students found"}
            </p>
            <p className="text-sm font-semibold text-slate-500">
              Read-only parent view scoped to tagged student(s) only.
            </p>
          </div>
          <div className="min-w-[260px]">
            <select
              className="input"
              value={studentId}
              onChange={(event) =>
                setStudentId(event.target.value)
              }
            >
              {(context.linked_students || []).map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {studentLabel(student)}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </section>

      {isDashboard && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Attendance"
              value={`${attendancePct}%`}
            />
            <StatCard
              label="Marks Entries"
              value={marksCount}
            />
            <StatCard
              label="Homework"
              value={homeworkCount}
            />
            <StatCard
              label="Fee Due"
              value={`₹${feeDue}`}
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionBlock
              title="Latest Attendance"
              rows={context.attendance || []}
              emptyText="No attendance records found."
              renderRow={(row) => (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-950">
                      {row.attendance_date
                        ? new Date(
                            String(row.attendance_date)
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                      {String(row.status || "").replaceAll("_", " ")}
                    </span>
                  </div>
                  {row.remarks && (
                    <p className="mt-2 text-sm text-slate-600">
                      {row.remarks}
                    </p>
                  )}
                </div>
              )}
            />
            <SectionBlock
              title="Recent Parent Declarations"
              rows={context.declarations || []}
              emptyText="No parent declarations found."
              renderRow={(row) => (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-950">
                      {row.declaration_date
                        ? new Date(
                            String(row.declaration_date)
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                      {String(row.declaration_status || "").replaceAll("_", " ")}
                    </span>
                  </div>
                  {row.reason && (
                    <p className="mt-2 text-sm text-slate-600">
                      {row.reason}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionBlock
              title="Recent Marks"
              rows={context.question_marks || context.marks || []}
              emptyText="No marks found."
              renderRow={(row) => (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-950">
                      {row.subject_name || row.question_text || "Assessment"}
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                      {row.obtained_marks ?? row.grade ?? "-"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {row.exam_name || row.exam_type || row.teacher_review_status || ""}
                  </p>
                </div>
              )}
            />
            <SectionBlock
              title="Upcoming Exams"
              rows={context.exams || []}
              emptyText="No exams found."
              renderRow={(row) => (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-950">
                      {row.exam_name || row.exam_type || "Exam"}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                      {row.status || "-"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {row.exam_date
                      ? new Date(String(row.exam_date)).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              )}
            />
          </div>
        </>
      )}

      {isAttendance && (
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionBlock
            title="Attendance History"
            rows={context.attendance || []}
            emptyText="No attendance history found."
            renderRow={(row) => (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-slate-950">
                    {row.attendance_date
                      ? new Date(String(row.attendance_date)).toLocaleDateString()
                      : "-"}
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                    {String(row.status || "").replaceAll("_", " ")}
                  </span>
                </div>
                {row.remarks && <p className="mt-2 text-sm text-slate-600">{row.remarks}</p>}
              </div>
            )}
          />
          <SectionBlock
            title="Parent Declarations"
            rows={context.declarations || []}
            emptyText="No parent declarations found."
            renderRow={(row) => (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-slate-950">
                    {row.declaration_date
                      ? new Date(String(row.declaration_date)).toLocaleDateString()
                      : "-"}
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                    {String(row.declaration_status || "").replaceAll("_", " ")}
                  </span>
                </div>
                {row.reason && <p className="mt-2 text-sm text-slate-600">{row.reason}</p>}
              </div>
            )}
          />
        </div>
      )}

      {isMarks && (
        <SectionBlock
          title="Question Wise Marks"
          rows={context.question_marks || []}
          emptyText="No question-wise marks found."
          renderRow={(row) => (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">
                  {row.question_text || row.subject_name || "Question"}
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  {row.obtained_marks ?? 0}/{row.max_marks ?? row.question_bank_max_marks ?? 0}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {row.exam_name || row.exam_status || row.teacher_review_status || ""}
              </p>
            </div>
          )}
        />
      )}

      {isFees && (
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionBlock
            title="Fee Records"
            rows={context.fees || []}
            emptyText="No fee records found."
            renderRow={(row) => (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-slate-950">
                    {row.fee_name || row.fee_type || "Fee"}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    Due {Math.max(Number(row.assigned_amount ?? row.amount ?? 0) - Number(row.paid_amount || 0), 0)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Amount: ₹{Number(row.assigned_amount ?? row.amount ?? 0).toLocaleString("en-IN")} • Paid: ₹{Number(row.paid_amount || 0).toLocaleString("en-IN")} {row.discount_amount ? `• Discount: ₹${Number(row.discount_amount || 0).toLocaleString("en-IN")}` : ""}
                </p>
              </div>
            )}
          />
          <SectionBlock
            title="Fee Summary"
            rows={selectedStudent ? [selectedStudent] : []}
            emptyText="No linked student available."
            renderRow={() => (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="Total Homework" value={homeworkCount} />
                  <StatCard label="Syllabus Units" value={syllabusCount} />
                  <StatCard label="Timetable Slots" value={timetableCount} />
                </div>
              </div>
            )}
          />
        </div>
      )}

      {isHomework && (
        <SectionBlock
          title="Homework"
          rows={context.homework || []}
          emptyText="No homework found for the student's class/section."
          renderRow={(row) => (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">
                  {row.title || "Homework"}
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                  {row.status || "-"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {row.subject_name || row.class_name || ""} {row.section_name ? `• ${row.section_name}` : ""}
              </p>
            </div>
          )}
        />
      )}

      {isSyllabus && (
        <SectionBlock
          title="Syllabus"
          rows={context.syllabus || []}
          emptyText="No syllabus records found."
          renderRow={(row) => (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">
                  {row.title || "Syllabus"}
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                  {row.status || "-"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {row.subject_name || row.class_name || ""} {row.section_name ? `• ${row.section_name}` : ""} {row.exam_type_name ? `• ${row.exam_type_name}` : ""}
              </p>
            </div>
          )}
        />
      )}

      {isTimetable && (
        <SectionBlock
          title="Timetable"
          rows={context.timetable || []}
          emptyText="No timetable slots found."
          renderRow={(row) => (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">
                  {row.day_of_week || "Day"}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {row.start_time || "-"}{row.end_time ? ` - ${row.end_time}` : ""}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {row.subject_name || "Subject"} • {row.teacher_name || "Teacher"} {row.room_no ? `• Room ${row.room_no}` : ""}
              </p>
            </div>
          )}
        />
      )}

      {isExams && (
        <SectionBlock
          title="Exam Schedule"
          rows={context.exams || []}
          emptyText="No exam schedule found."
          renderRow={(row) => (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">
                  {row.exam_name || row.exam_type || "Exam"}
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  {row.status || "-"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {row.exam_date ? new Date(String(row.exam_date)).toLocaleDateString() : "-"} • {row.subject_name || "Subject"}
              </p>
            </div>
          )}
        />
      )}

      <section className={cardClass}>
        <div className="flex flex-wrap gap-3">
          <Link className="tt-button" href="/parent/attendance-declaration">
            Parent Daily Declaration
          </Link>
          <Link className="tt-button" href="/ptm">
            Parent Teacher Meetings
          </Link>
          <Link className="tt-button" href="/communication/feedback">
            Complaints & Suggestions
          </Link>
        </div>
        {loading && (
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading parent data...
          </p>
        )}
      </section>
    </div>
  );
}
