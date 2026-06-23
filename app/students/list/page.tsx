"use client";

import {
  Edit,
  Eye,
  Phone,
  Search as SearchIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Student = {
  id: number;
  admission_number?: string | null;
  enrollment_number?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  selected_academic_year?: string | null;
  school_name?: string | null;
  photo_url?: string | null;
  roll_number?: string | null;
  student_status?: string | null;
};

const fullName = (student: Student) =>
  [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Unnamed Student";

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [timingMs, setTimingMs] = useState<number | null>(null);
  const [resultCount, setResultCount] = useState<number | null>(null);

  useEffect(() => {
    const trimmed = search.trim();
    const timeout = setTimeout(async () => {
      if (trimmed.length < 3) {
        setStudents([]);
        setLoading(false);
        setTimingMs(null);
        setResultCount(null);
        return;
      }

      try {
        setLoading(true);
        const data = await apiJson<{
          results: Student[];
          timing_ms?: number;
          count?: number;
        }>(`/api/students/search?q=${encodeURIComponent(trimmed)}`);
        setStudents(Array.isArray(data.results) ? data.results : []);
        setTimingMs(
          typeof data.timing_ms === "number"
            ? data.timing_ms
            : null
        );
        setResultCount(
          typeof data.count === "number"
            ? data.count
            : Array.isArray(data.results)
              ? data.results.length
              : 0
        );
      } catch (error) {
        notify.error(
          errorMessage(error, "Failed to search students")
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const deleteStudent = async (student: Student) => {
    if (
      !confirm(
        `Delete ${fullName(student)} permanently? This will remove the student from the database.`
      )
    ) {
      return;
    }

    try {
      await apiJson(`/api/students/${student.id}`, {
        method: "DELETE",
      });
      notify.success("Student deleted from database");
      setSearch((current) => `${current}`);
    } catch (error) {
      notify.error(errorMessage(error, "Failed to delete student"));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black md:text-4xl">Students</h1>
            <p className="mt-1 text-sm text-slate-600">
              Real-time student search across the selected school/college and academic year.
            </p>
          </div>

          <Link href="/students" className="tt-button text-center">
            + Add Student
          </Link>
        </div>

        <div className="tt-card tt-card-pad">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Live Search</h2>
              <p className="text-sm text-slate-600">
                Search by student name, admission number, enrollment number, mobile number, father name, mother name, Aadhaar/UID last 4 digits, class, or section.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
              {resultCount === null ? "Ready" : `${resultCount} result(s)`}
              {timingMs !== null ? ` · ${timingMs} ms` : ""}
            </div>
          </div>

          <label className="relative block">
            <SearchIcon
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type at least 3 characters to search students..."
              className="input !pl-11 md:!pl-12"
            />
          </label>
        </div>

        {loading ? (
          <div className="tt-card tt-card-pad">Searching students...</div>
        ) : search.trim().length < 3 ? (
          <div className="tt-card tt-card-pad">
            Type 3 or more characters to begin searching.
          </div>
        ) : students.length === 0 ? (
          <div className="tt-card tt-card-pad">No matching students found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {students.map((student) => (
              <article
                key={student.id}
                className="tt-card tt-card-pad flex min-h-[240px] flex-col justify-between gap-5"
              >
                <div className="min-w-0 space-y-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-amber-300/70 bg-slate-950 shadow-sm">
                      {student.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={student.photo_url}
                          alt={fullName(student)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={20}
                          strokeWidth={2.4}
                          className="text-amber-100"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-950">
                        {fullName(student)}
                      </h2>
                      <p className="truncate text-sm font-semibold text-amber-700">
                        Admission {student.admission_number || "-"}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {student.school_name || "Assigned School/College"}
                      </p>
                      {student.student_status ? (
                        <span className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          {student.student_status.toLowerCase()}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info label="Class" value={student.class_name || "-"} />
                    <Info label="Section" value={student.section_name || "-"} />
                    <Info
                      label="Academic Year"
                      value={student.selected_academic_year || "Unassigned"}
                    />
                    <Info label="Roll No" value={student.roll_number || "-"} />
                  </div>

                  <div className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <Phone size={15} className="shrink-0" />
                    <span className="truncate">
                      {student.phone || "No phone number"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <ActionLink
                    href={`/students/${student.id}`}
                    label="View"
                    icon={<Eye size={15} />}
                  />
                  <ActionLink
                    href={`/students/edit/${student.id}`}
                    label="Edit"
                    icon={<Edit size={15} />}
                  />
                  <button
                    onClick={() => deleteStudent(student)}
                    className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700"
                  >
                    <span className="truncate">Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
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
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="truncate font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ActionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}
