"use client";

import Layout from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Analytics = {
  active_count?: number;
  promoted_count?: number;
  transferred_count?: number;
  dropout_count?: number;
  alumni_count?: number;
  suspended_count?: number;
  graduated_count?: number;
  backlogSummary?: {
    total_backlogs?: number;
    students_with_backlogs?: number;
    cleared_backlogs?: number;
    pending_backlogs?: number;
  };
  backlogByClass?: Array<{
    class_name?: string;
    backlog_count?: number;
    cleared_count?: number;
    pending_count?: number;
  }>;
  backlogBySubject?: Array<{
    subject_name?: string;
    backlog_count?: number;
    cleared_count?: number;
    pending_count?: number;
  }>;
  backlogBySchool?: Array<{
    school_name?: string;
    backlog_count?: number;
    cleared_count?: number;
    pending_count?: number;
  }>;
  backlogByAcademicYear?: Array<{
    academic_year?: string;
    backlog_count?: number;
    cleared_count?: number;
    pending_count?: number;
  }>;
};

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

export default function StudentLifecyclePage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [data, setData] = useState<Analytics>({});
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [gender, setGender] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (schoolId) params?.set("school_id", schoolId);
    if (academicYearId) params?.set("academic_year_id", academicYearId);
    if (classId) params?.set("class_id", classId);
    if (sectionId) params?.set("section_id", sectionId);
    if (gender) params?.set("gender", gender);
    if (from) params?.set("from", from);
    if (to) params?.set("to", to);
    return params?.toString();
  }, [schoolId, academicYearId, classId, sectionId, gender, from, to]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/student-lifecycle/analytics${query ? `?${query}` : ""}`
      );
      const json = await res.json();
      setData(json || {});
    } catch (error) {
      console.error("Failed to load lifecycle analytics", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [schoolRows, yearRows] = await Promise.all([
        apiJson<any[]>("/api/schools"),
        apiJson<any[]>("/api/academic-years"),
      ]);
      setSchools(Array.isArray(schoolRows) ? schoolRows : []);
      setAcademicYears(Array.isArray(yearRows) ? yearRows : []);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to load backlog filters"));
    }
  };

  useEffect(() => {
    load();
    loadOptions();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className={cardClass}>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">School/College</label>
              <select className="mt-2 rounded-xl border px-3 py-2" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
                <option value="">All Schools/Colleges</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.school_name || `School ${school.id}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Academic Year</label>
              <select className="mt-2 rounded-xl border px-3 py-2" value={academicYearId} onChange={(e) => setAcademicYearId(e.target.value)}>
                <option value="">All Years</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.academic_year || `Year ${year.id}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Class ID</label>
              <input className="mt-2 rounded-xl border px-3 py-2" value={classId} onChange={(e) => setClassId(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Section ID</label>
              <input className="mt-2 rounded-xl border px-3 py-2" value={sectionId} onChange={(e) => setSectionId(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Gender</label>
              <input className="mt-2 rounded-xl border px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">From</label>
              <input type="date" className="mt-2 rounded-xl border px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">To</label>
              <input type="date" className="mt-2 rounded-xl border px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <button
              onClick={load}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
            >
              Refresh
            </button>
            <a
              href={`/api/student-backlogs/export${query ? `?${query}` : ""}`}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900"
            >
              Export Excel
            </a>
            <a
              href={`/api/student-backlogs/reports${query ? `?${query}` : ""}`}
              className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 font-semibold text-amber-900"
            >
              View Report JSON
            </a>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-black">Import Backlogs</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => setImportFile(event.target.files?.[0] || null)}
            />
            <button
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
              onClick={async () => {
                if (!importFile) {
                  notify.error("Choose an Excel file first.");
                  return;
                }
                try {
                  const form = new FormData();
                  form.append("file", importFile);
                  if (academicYearId) {
                    form.append("academic_year_id", academicYearId);
                  }
                  const response = await fetch("/api/student-backlogs/import", {
                    method: "POST",
                    body: form,
                  });
                  const payload = await response.json();
                  if (!response.ok) {
                    throw new Error(payload.error || "Import failed");
                  }
                  notify.success(`Imported ${payload.imported || 0} backlog row(s).`);
                  setImportFile(null);
                  await load();
                } catch (error) {
                  notify.error(errorMessage(error, "Failed to import backlogs"));
                }
              }}
            >
              Import Excel
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Active", data.active_count],
            ["Promoted", data.promoted_count],
            ["Transferred", data.transferred_count],
            ["Dropout", data.dropout_count],
            ["Alumni", data.alumni_count],
            ["Suspended", data.suspended_count],
            ["Graduated", data.graduated_count],
          ].map(([label, value]) => (
            <div key={String(label)} className={cardClass}>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
              <div className="mt-3 text-4xl font-black text-slate-900">{loading ? "..." : Number(value || 0)}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className={cardClass}>
            <h2 className="text-lg font-black">Backlog Summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Backlogs", data.backlogSummary?.total_backlogs],
                ["Students With Backlogs", data.backlogSummary?.students_with_backlogs],
                ["Cleared", data.backlogSummary?.cleared_backlogs],
                ["Pending", data.backlogSummary?.pending_backlogs],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {label}
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-950">
                    {loading ? "..." : Number(value || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-black">Backlogs by Class</h2>
            <div className="mt-4 space-y-3">
              {(data.backlogByClass || []).slice(0, 5).map((row, index) => (
                <div key={`${row.class_name || "class"}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-950">{row.class_name || "Unassigned"}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
                      {Number(row.backlog_count || 0)} total
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Cleared {Number(row.cleared_count || 0)} · Pending {Number(row.pending_count || 0)}
                  </div>
                </div>
              ))}
              {!(data.backlogByClass || []).length ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No backlog class summary available.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className={cardClass}>
            <h2 className="text-lg font-black">Backlogs by School/College</h2>
            <div className="mt-4 space-y-3">
              {(data.backlogBySchool || []).slice(0, 5).map((row, index) => (
                <div key={`${row.school_name || "school"}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-950">{row.school_name || "Unassigned"}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
                      {Number(row.backlog_count || 0)} total
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Cleared {Number(row.cleared_count || 0)} · Pending {Number(row.pending_count || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-black">Backlogs by Academic Year</h2>
            <div className="mt-4 space-y-3">
              {(data.backlogByAcademicYear || []).slice(0, 5).map((row, index) => (
                <div key={`${row.academic_year || "year"}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-950">{row.academic_year || "Unassigned"}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-900">
                      {Number(row.backlog_count || 0)} total
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Cleared {Number(row.cleared_count || 0)} · Pending {Number(row.pending_count || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-black">Backlogs by Subject</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(data.backlogBySubject || []).slice(0, 8).map((row, index) => (
              <div key={`${row.subject_name || "subject"}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-bold text-slate-950">{row.subject_name || "Unassigned"}</div>
                <div className="mt-2 text-sm text-slate-600">
                  Total {Number(row.backlog_count || 0)} · Pending {Number(row.pending_count || 0)}
                </div>
              </div>
            ))}
            {!(data.backlogBySubject || []).length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                No backlog subject summary available.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
