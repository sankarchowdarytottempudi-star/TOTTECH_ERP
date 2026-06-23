"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Layout from "@/components/Layout";
import { canManageRecord } from "@/lib/access-control";

type Row = Record<string, any>;

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function SubjectsPage() {
  const [schools, setSchools] = useState<Row[]>([]);
  const [academicYears, setAcademicYears] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [schoolId, setSchoolId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [description, setDescription] = useState("");
  const [subjectStatus, setSubjectStatus] = useState("ACTIVE");
  const [role, setRole] = useState("");

  const canCreateSubject = canManageRecord(role, "subject", "create");
  const canUpdateSubject = canManageRecord(role, "subject", "update");
  const canDeleteSubject = canManageRecord(role, "subject", "delete");

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const loadData = async (overrides: Record<string, string> = {}) => {
    try {
      const nextSchoolId = overrides.schoolId ?? schoolId;
      const nextAcademicYearId = overrides.academicYearId ?? academicYearId;
      const nextStatus = overrides.status ?? status;
      const nextSearch = overrides.search ?? search;

      const params = new URLSearchParams();
      if (nextSchoolId) params?.set("school_id", nextSchoolId);
      if (nextAcademicYearId) params?.set("academic_year_id", nextAcademicYearId);
      if (nextStatus) params?.set("status", nextStatus);
      if (nextSearch.trim()) params?.set("search", nextSearch.trim());

      const [schoolsRes, yearsRes, subjectsRes] = await Promise.all([
        fetch("/api/schools"),
        fetch("/api/academic-years?include_all=true"),
        fetch(`/api/subjects${params?.toString() ? `?${params?.toString()}` : ""}`),
      ]);

      const [schoolsData, yearsData, subjectsData] = await Promise.all([
        schoolsRes.json(),
        yearsRes.json(),
        subjectsRes.json(),
      ]);

      setSchools(Array.isArray(schoolsData) ? schoolsData : []);
      setAcademicYears(Array.isArray(yearsData) ? yearsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("erpUser");
      setRole(stored ? JSON.parse(stored)?.role || "" : "");
    } catch {
      setRole("");
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setSubjectName("");
    setSubjectCode("");
    setDescription("");
    setSubjectStatus("ACTIVE");
  };

  const saveSubject = async () => {
    if (!schoolId || !academicYearId || academicYearId === "all" || !subjectName.trim()) {
      toast.error("School/College, academic year, and subject name are required");
      return;
    }

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId,
          academic_year_id: academicYearId,
          subject_name: subjectName.trim(),
          subject_code: subjectCode.trim() || null,
          description: description.trim() || null,
          status: subjectStatus,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save subject");
      }

      toast.success("Subject saved");
      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save subject");
    }
  };

  const viewSubject = (subject: Row) => {
    alert([
      `Subject: ${subject.subject_name || "-"}`,
      `Code: ${subject.subject_code || "-"}`,
      `School/College: ${subject.school_name || getSchoolName(subject.school_id)}`,
      `Academic Year: ${subject.academic_year || "-"}`,
      `Status: ${subject.status || "ACTIVE"}`,
      `Description: ${subject.description || "-"}`,
    ].join("\n"));
  };

  const editSubject = async (subject: Row) => {
    const nextName = prompt("Update subject name", subject.subject_name || "");
    if (!nextName?.trim()) return;

    const nextCode = prompt("Update subject code", subject.subject_code || "") ?? "";
    const nextDescription = prompt("Update description", subject.description || "") ?? "";
    const nextStatus = prompt("Status: ACTIVE or INACTIVE", subject.status || "ACTIVE") ?? "ACTIVE";

    try {
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: nextName.trim(),
          subject_code: nextCode.trim() || null,
          description: nextDescription.trim() || null,
          status: nextStatus.trim().toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update subject");
      }

      toast.success("Subject updated");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update subject");
    }
  };

  const formatDependencyMessage = (payload: Row | null) => {
    const dependencies = Array.isArray(payload?.dependencies)
      ? payload.dependencies.map((item: Row) => `${item.dependency}: ${item.count}`).join(", ")
      : "";

    return dependencies
      ? `${payload?.error || "Cannot delete subject"} Dependencies: ${dependencies}`
      : payload?.error || "Failed to delete subject";
  };

  const deleteSubject = async (subject: Row) => {
    if (!confirm(`Delete subject ${subject.subject_name}?`)) return;

    try {
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(formatDependencyMessage(payload));
      }

      setSubjects((current) => current.filter((row) => row.id !== subject.id));
      setSelectedIds((current) => current.filter((id) => id !== subject.id));
      toast.success("Subject deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subject");
    }
  };

  const bulkStatus = async (nextStatus: "ACTIVE" | "INACTIVE") => {
    if (!selectedIds.length) {
      toast.error("Select at least one subject");
      return;
    }

    try {
      for (const subjectId of selectedIds) {
        const subject = subjects.find((row) => row.id === subjectId);
        if (!subject) continue;

        const response = await fetch(`/api/subjects/${subjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_name: subject.subject_name,
            subject_code: subject.subject_code,
            description: subject.description,
            status: nextStatus,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Bulk update failed");
        }
      }

      toast.success(`Selected subjects marked ${nextStatus.toLowerCase()}`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk update failed");
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) {
      toast.error("Select at least one subject");
      return;
    }
    if (!confirm(`Delete ${selectedIds.length} selected subject(s)?`)) return;

    try {
      for (const subjectId of selectedIds) {
        const response = await fetch(`/api/subjects/${subjectId}`, {
          method: "DELETE",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(formatDependencyMessage(payload));
        }
      }

      setSubjects((current) => current.filter((row) => !selectedSet.has(row.id)));
      setSelectedIds([]);
      toast.success("Selected subjects deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk delete failed");
      await loadData();
    }
  };

  const getSchoolName = (id: number) => {
    const school = schools.find((item) => Number(item.id) === Number(id));
    return school?.school_name || "-";
  };

  const getYearName = (id: number) => {
    const year = academicYears.find((item) => Number(item.id) === Number(id));
    return year?.academic_year || "-";
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === subjects.length ? [] : subjects.map((subject) => subject.id)
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-black md:text-5xl">Subjects Management</h1>
          <p className="mt-2 text-slate-500">
            Create and manage school/college-owned subjects by academic year.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">Create Subject</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <select
              className="rounded-xl border p-4"
              value={schoolId}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSchoolId(nextValue);
                loadData({ schoolId: nextValue });
              }}
            >
              <option value="">{role === "SUPER_ADMIN" ? "All Schools/Colleges" : "Select School/College"}</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.school_name}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border p-4"
              value={academicYearId}
              onChange={(event) => {
                const nextValue = event.target.value;
                setAcademicYearId(nextValue);
                loadData({ academicYearId: nextValue });
              }}
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.academic_year}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border p-4"
              value={subjectStatus}
              onChange={(event) => setSubjectStatus(event.target.value)}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <input
              className="rounded-xl border p-4"
              placeholder="Subject Name *"
              value={subjectName}
              onChange={(event) => setSubjectName(event.target.value)}
            />

            <input
              className="rounded-xl border p-4"
              placeholder="Subject Code"
              value={subjectCode}
              onChange={(event) => setSubjectCode(event.target.value)}
            />

            <input
              className="rounded-xl border p-4"
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {canCreateSubject && (
            <button
              type="button"
              onClick={saveSubject}
              className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700"
            >
              Save Subject
            </button>
          )}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Existing Subjects</h2>
              <p className="text-sm text-slate-500">
                {subjects.length} subject(s) in the current filter.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canUpdateSubject && (
                <>
                  <button type="button" onClick={() => bulkStatus("ACTIVE")} className="rounded-lg border px-4 py-2 font-bold">
                    Activate
                  </button>
                  <button type="button" onClick={() => bulkStatus("INACTIVE")} className="rounded-lg border px-4 py-2 font-bold">
                    Deactivate
                  </button>
                </>
              )}
              {canDeleteSubject && (
                <button type="button" onClick={bulkDelete} className="rounded-lg border border-red-300 px-4 py-2 font-bold text-red-700">
                  Delete Selected
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-4">
            <input
              className="rounded-xl border p-4"
              placeholder="Search subject name or code"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-xl border p-4"
              value={status}
              onChange={(event) => {
                const nextValue = event.target.value;
                setStatus(nextValue);
                loadData({ status: nextValue });
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => loadData()} className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                loadData({ search: "", status: "" });
              }}
              className="rounded-xl border px-6 py-3 font-bold"
            >
              Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-4 text-left">
                    <input type="checkbox" checked={subjects.length > 0 && selectedIds.length === subjects.length} onChange={toggleAll} />
                  </th>
                  <th className="p-4 text-left">School/College</th>
                  <th className="p-4 text-left">Academic Year</th>
                  <th className="p-4 text-left">Subject Name</th>
                  <th className="p-4 text-left">Subject Code</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedSet.has(subject.id)} onChange={() => toggleSelected(subject.id)} />
                    </td>
                    <td className="p-4">{subject.school_name || getSchoolName(subject.school_id)}</td>
                    <td className="p-4">{subject.academic_year || getYearName(subject.academic_year_id)}</td>
                    <td className="p-4 font-semibold">{subject.subject_name}</td>
                    <td className="p-4">{subject.subject_code || "-"}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${subject.status === "INACTIVE" ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {subject.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => viewSubject(subject)} className="rounded-lg bg-blue-600 px-3 py-1 text-white">
                          View
                        </button>
                        {canUpdateSubject && (
                          <button type="button" onClick={() => editSubject(subject)} className="rounded-lg bg-green-600 px-3 py-1 text-white">
                            Edit
                          </button>
                        )}
                        {canDeleteSubject && (
                          <button type="button" onClick={() => deleteSubject(subject)} className="rounded-lg bg-red-600 px-3 py-1 text-white">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!subjects.length && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No subjects found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
