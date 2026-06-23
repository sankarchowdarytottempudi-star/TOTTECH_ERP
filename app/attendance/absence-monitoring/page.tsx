"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Bell, CalendarDays, Mail, Megaphone, MessageSquare, ShieldAlert, Users } from "lucide-react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Dashboard = {
  today_absent?: number;
  weekly_absent?: number;
  monthly_absent?: number;
  total_absent?: number;
  partial_absent?: number;
  leave_count?: number;
  present_count?: number;
  today_absent_students?: number;
};

type TimelineRow = {
  attendance_date?: string | null;
  absent_count?: number | null;
  present_count?: number | null;
  partial_count?: number | null;
};

type SummaryRow = {
  label?: string | null;
  count?: number | null;
};

type ChronicRow = {
  student_id?: number | null;
  student_name?: string | null;
  admission_number?: string | null;
  enrollment_number?: string | null;
  absent_count?: number | null;
  recent_absent_score?: number | null;
};

type ResponseRow = {
  id?: number | null;
  student_id?: number | null;
  student_name?: string | null;
  admission_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  response_type?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

type Payload = {
  filters?: Record<string, unknown>;
  dashboard?: Dashboard;
  timeline?: TimelineRow[];
  class_summary?: SummaryRow[];
  section_summary?: SummaryRow[];
  gender_summary?: SummaryRow[];
  chronic_absentees?: ChronicRow[];
  responses?: ResponseRow[];
  parent_declarations?: {
    id?: number | null;
    student_name?: string | null;
    admission_number?: string | null;
    class_name?: string | null;
    section_name?: string | null;
    declaration_date?: string | null;
    declaration_status?: string | null;
    reason?: string | null;
  }[];
};

const today = () => new Date().toISOString().slice(0, 10);
const startOfWeek = () => {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - diff);
  return start.toISOString().slice(0, 10);
};

const endOfWeek = () => {
  const start = new Date(`${startOfWeek()}T00:00:00.000Z`);
  start.setUTCDate(start.getUTCDate() + 7);
  return start.toISOString().slice(0, 10);
};

const monthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const monthEnd = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10);

const field = "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm";

export default function AbsenceMonitoringPage() {
  const [payload, setPayload] = useState<Payload>({});
  const [schoolId, setSchoolId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [from, setFrom] = useState(startOfWeek());
  const [to, setTo] = useState(endOfWeek());
  const [loading, setLoading] = useState(true);
  const [savingResponse, setSavingResponse] = useState(false);
  const [responseType, setResponseType] = useState("SICK");
  const [notes, setNotes] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (schoolId) params?.set("school_id", schoolId);
    if (academicYearId) params?.set("academic_year_id", academicYearId);
    if (classId) params?.set("class_id", classId);
    if (sectionId) params?.set("section_id", sectionId);
    if (studentId) params?.set("student_id", studentId);
    if (from) params?.set("from", from);
    if (to) params?.set("to", to);
    return params?.toString();
  }, [schoolId, academicYearId, classId, sectionId, studentId, from, to]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiJson<Payload>(`/api/attendance/absence-monitoring?${query}`);
      setPayload(data);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load absence monitoring."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [query]);

  const saveResponse = async () => {
    try {
      setSavingResponse(true);
      await apiJson("/api/attendance/absence-monitoring", {
        method: "POST",
        body: JSON.stringify({
          school_id: schoolId || undefined,
          academic_year_id: academicYearId || undefined,
          student_id: studentId || undefined,
          response_type: responseType,
          notes,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
        }),
      });
      notify.success("Parent response saved.");
      setNotes("");
      setAttachmentUrl("");
      setAttachmentName("");
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to save parent response."));
    } finally {
      setSavingResponse(false);
    }
  };

  const dashboard = payload.dashboard || {};

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-amber-700">Attendance</div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Absence Monitoring</h1>
              <p className="mt-2 text-sm text-slate-500">Track absent students, parent notifications, escalation alerts, and responses in one place.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <Stat title="Today Absent" value={dashboard.today_absent ?? 0} icon={<MessageSquare className="h-4 w-4" />} />
              <Stat title="Weekly Absent" value={dashboard.weekly_absent ?? 0} icon={<CalendarDays className="h-4 w-4" />} />
              <Stat title="Monthly Absent" value={dashboard.monthly_absent ?? 0} icon={<BarChart3 className="h-4 w-4" />} />
              <Stat title="Responses" value={payload.responses?.length ?? 0} icon={<Bell className="h-4 w-4" />} />
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-6">
            <input className={field} placeholder="School/College ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} />
            <input className={field} placeholder="Academic Year ID" value={academicYearId} onChange={(e) => setAcademicYearId(e.target.value)} />
            <input className={field} placeholder="Class ID" value={classId} onChange={(e) => setClassId(e.target.value)} />
            <input className={field} placeholder="Section ID" value={sectionId} onChange={(e) => setSectionId(e.target.value)} />
            <input className={field} placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className={field} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <input className={field} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Panel title="Class Wise" rows={payload.class_summary || []} />
          <Panel title="Section Wise" rows={payload.section_summary || []} />
          <Panel title="Gender Wise" rows={payload.gender_summary || []} />
          <Panel title="Chronic Absentees" rows={(payload.chronic_absentees || []).map((row) => ({ label: row.student_name || `Student ${row.student_id}`, count: row.absent_count || 0 }))} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Timeline</div>
                <h2 className="text-2xl font-black text-slate-900">Daily/Weekly/Monthly Absence Trend</h2>
              </div>
              <Mail className="h-5 w-5 text-amber-700" />
            </div>
            <div className="mt-4 space-y-3">
              {(payload.timeline || []).map((row) => (
                <div key={row.attendance_date} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{row.attendance_date}</span>
                    <span>Absent {row.absent_count || 0}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <span>Present: {row.present_count || 0}</span>
                    <span>Partial: {row.partial_count || 0}</span>
                    <span>Absent: {row.absent_count || 0}</span>
                  </div>
                </div>
              ))}
              {!loading && (payload.timeline || []).length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">No absence records found for the selected range.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Parent Response</div>
                <h2 className="text-2xl font-black text-slate-900">Absence Reason Submission</h2>
              </div>
              <ShieldAlert className="h-5 w-5 text-amber-700" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select className={field} value={responseType} onChange={(e) => setResponseType(e.target.value)}>
                <option value="SICK">Sick</option>
                <option value="MEDICAL">Medical</option>
                <option value="FAMILY_EMERGENCY">Family Emergency</option>
                <option value="PERSONAL">Personal</option>
                <option value="OTHER">Other</option>
              </select>
              <input className={field} placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              <input className={field} placeholder="Attachment URL" value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} />
              <input className={field} placeholder="Attachment Name" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} />
            </div>
            <textarea className={`${field} mt-3 min-h-32 w-full`} placeholder="Reason notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button
              onClick={saveResponse}
              disabled={savingResponse || !studentId}
              className="mt-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingResponse ? "Saving..." : "Submit Parent Response"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Parent Daily Declarations</div>
          <h2 className="text-2xl font-black text-slate-900">Parent Submitted Attendance Notes</h2>
          <div className="mt-4 grid gap-3">
            {(payload.parent_declarations || []).map((row) => (
              <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-slate-900">{row.student_name || `Student ${row.id}`}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                    {String(row.declaration_status || "").replaceAll("_", " ")}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {row.class_name || "Class"} {row.section_name ? `• ${row.section_name}` : ""} • {row.admission_number || "Admission #"}
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {row.declaration_date ? new Date(String(row.declaration_date)).toLocaleDateString() : "-"}
                  {row.reason ? ` • ${row.reason}` : ""}
                </div>
              </div>
            ))}
            {!loading && (payload.parent_declarations || []).length === 0 && (
              <div className="text-sm text-slate-500">No parent declarations recorded yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Recent Responses</div>
          <h2 className="text-2xl font-black text-slate-900">Parent Reason Records</h2>
          <div className="mt-4 grid gap-3">
            {(payload.responses || []).map((row) => (
              <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-slate-900">{row.student_name || `Student ${row.student_id}`}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">{row.response_type}</div>
                </div>
                <div className="mt-1 text-sm text-slate-500">{row.class_name || "Class"} {row.section_name ? `• ${row.section_name}` : ""} • {row.admission_number || "Admission #"}</div>
                {row.notes && <div className="mt-2 text-sm text-slate-700">{row.notes}</div>}
              </div>
            ))}
            {!loading && (payload.responses || []).length === 0 && <div className="text-sm text-slate-500">No parent responses recorded yet.</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Stat({ title, value, icon }: { title: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        <span>{title}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function Panel({ title, rows }: { title: string; rows: { label?: string | null; count?: number | null }[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <span className="font-semibold text-slate-800">{row.label || "Unknown"}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{row.count || 0}</span>
          </div>
        ))}
        {!rows.length && <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No data</div>}
      </div>
    </div>
  );
}
