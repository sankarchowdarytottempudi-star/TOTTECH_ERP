"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialForm = {
  meeting_title: "",
  meeting_date: new Date().toISOString().slice(0, 10),
  meeting_time: "",
  student_id: "",
  teacher_id: "",
  class_id: "",
  section_id: "",
  mode: "IN_PERSON",
  notes: "",
  action_items: "",
  follow_up_date: "",
};

export default function PTMPage() {
  const [roster, setRoster] = useState<any>({});
  const [meetings, setMeetings] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const [rosterRows, meetingRows] = await Promise.all([
        apiJson<any>("/api/roster"),
        apiJson<any>("/api/ptm"),
      ]);
      setRoster(rosterRows);
      setMeetings(Array.isArray(meetingRows.meetings) ? meetingRows.meetings : []);
      setSummary(meetingRows.summary || {});
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load PTM"));
    }
  };

  const sendPtmNotice = async (id: number, template: string) => {
    try {
      await apiJson(`/api/ptm/${id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });
      notify.success("PTM message queued");
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to queue PTM message"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    try {
      await apiJson("/api/ptm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      notify.success("PTM scheduled");
      setForm(initialForm);
      await load();
    } catch (error) {
      notify.error(errorMessage(error, "Failed to schedule PTM"));
    }
  };

  const sections = (roster.sections || []).filter(
    (section: any) => !form.class_id || Number(section.class_id) === Number(form.class_id)
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Parent Teacher Meetings</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Schedule meetings, record parent confirmation, action items and follow-up.
          </p>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total PTMs", summary.total_ptms ?? 0],
            ["Scheduled", summary.scheduled_count ?? 0],
            ["Completed", summary.completed_count ?? 0],
            ["Missed", summary.missed_count ?? 0],
            ["Attendance %", `${summary.parent_attendance_pct ?? 0}%`],
          ].map(([label, value]) => (
            <div key={String(label)} className="tt-card tt-card-pad">
              <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">{label}</div>
              <div className="mt-3 text-3xl font-black text-slate-950">{String(value)}</div>
            </div>
          ))}
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">Schedule Meeting</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input" placeholder="Meeting Title" value={form.meeting_title} onChange={(event) => setForm({ ...form, meeting_title: event.target.value })} />
            <input className="input" type="date" value={form.meeting_date} onChange={(event) => setForm({ ...form, meeting_date: event.target.value })} />
            <input className="input" type="time" value={form.meeting_time} onChange={(event) => setForm({ ...form, meeting_time: event.target.value })} />
            <select className="input" value={form.class_id} onChange={(event) => setForm({ ...form, class_id: event.target.value, section_id: "" })}>
              <option value="">Class</option>
              {(roster.classes || []).map((item: any) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
            </select>
            <select className="input" value={form.section_id} onChange={(event) => setForm({ ...form, section_id: event.target.value })}>
              <option value="">Section</option>
              {sections.map((item: any) => <option key={item.id} value={item.id}>{item.section_name}</option>)}
            </select>
            <select className="input" value={form.student_id} onChange={(event) => setForm({ ...form, student_id: event.target.value })}>
              <option value="">Student</option>
              {(roster.students || []).map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name || [item.first_name, item.last_name].filter(Boolean).join(" ") || `Student ${item.id}`}
                </option>
              ))}
            </select>
            <select className="input" value={form.teacher_id} onChange={(event) => setForm({ ...form, teacher_id: event.target.value })}>
              <option value="">Teacher</option>
              {(roster.teachers || []).map((item: any) => (
                <option key={item.id} value={item.id}>
                  {[item.first_name, item.last_name].filter(Boolean).join(" ") || `Teacher ${item.id}`}
                </option>
              ))}
            </select>
            <select className="input" value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })}>
              <option value="IN_PERSON">In Person</option>
              <option value="PHONE">Phone</option>
              <option value="ONLINE">Online</option>
            </select>
            <input className="input" type="date" value={form.follow_up_date} onChange={(event) => setForm({ ...form, follow_up_date: event.target.value })} />
            <textarea className="input md:col-span-3" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            <textarea className="input md:col-span-3" placeholder="Action Items" value={form.action_items} onChange={(event) => setForm({ ...form, action_items: event.target.value })} />
          </div>
          <button className="tt-button mt-4" onClick={save}>Schedule PTM</button>
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">PTM Register</h2>
          <div className="space-y-3">
            {meetings.map((row) => (
              <div key={row.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{row.meeting_title}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {[row.student_name, row.teacher_name, row.class_name, row.section_name].filter(Boolean).join(" • ") || "-"}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">{row.status}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {new Date(String(row.meeting_date)).toLocaleDateString()} {row.meeting_time || ""}
                </p>
                {row.action_items && <p className="mt-2 text-sm text-slate-700">{row.action_items}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold" onClick={() => sendPtmNotice(Number(row.id), "ptm_reminder")}>Send Reminder</button>
                  <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold" onClick={() => sendPtmNotice(Number(row.id), "ptm_feedback")}>Send Feedback</button>
                  <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold" onClick={async () => {
                    try {
                      await apiJson("/api/ptm", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: row.id, status: "RESCHEDULED" }),
                      });
                      notify.success("PTM updated");
                      await load();
                    } catch (error) {
                      notify.error(errorMessage(error, "Failed to update PTM"));
                    }
                  }}>Mark Rescheduled</button>
                </div>
              </div>
            ))}
            {!meetings.length && <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">No PTM meetings scheduled yet.</p>}
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">PTM AI Insights</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Common Parent Concerns</div>
              <p className="mt-2 text-sm font-semibold text-slate-700">Attendance, homework completion, assessment performance, and revision planning.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Teacher Feedback Summary</div>
              <p className="mt-2 text-sm font-semibold text-slate-700">Teacher remarks and follow-up items can be auto-summarized after PTM.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Weak Students Discussed</div>
              <p className="mt-2 text-sm font-semibold text-slate-700">Students with attendance or marks below target are highlighted during PTM review.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Action Items Pending</div>
              <p className="mt-2 text-sm font-semibold text-slate-700">Pending academic actions, counselling tasks, and follow-up reminders are tracked here.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
