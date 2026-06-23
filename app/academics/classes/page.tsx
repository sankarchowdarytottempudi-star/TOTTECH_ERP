"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";

export default function ClassesPage() {

  const [schools, setSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeClass, setActiveClass] =
    useState<any | null>(null);
  const [classPerformance, setClassPerformance] =
    useState<{
      top: any[];
      bottom: any[];
      total: number;
      averages?: {
        marks: number;
        attendance: number;
        homework: number;
        combined: number;
      };
    } | null>(null);
  const [classPanelMode, setClassPanelMode] =
    useState<"view" | "sections" | null>(
      null
    );
  const [newSectionName, setNewSectionName] =
    useState("");

  const [schoolId, setSchoolId] =
    useState("all");

  const [className, setClassName] =
    useState("");
  const [role, setRole] =
    useState("");

  useEffect(() => {
    const querySchoolId =
      new URLSearchParams(
        window.location.search
      ).get("school_id") || "";

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

    const initialize =
      async () => {
        try {
          const current =
            await fetch(
              "/api/my-school"
            ).then((response) =>
              response.json()
            );
          const nextSchoolId =
            querySchoolId ||
            (current?.is_all_schools
              ? "all"
              : current?.id
                ? String(current.id)
                : "all");

          setSchoolId(nextSchoolId);
          await loadData(nextSchoolId);
        } catch (error) {
          console.error(error);
          await loadData(
            querySchoolId || "all"
          );
        }
      };

    initialize();
  }, []);

  const loadData = async (
    nextSchoolId = schoolId
  ) => {

    try {
      const schoolFilter =
        nextSchoolId &&
        nextSchoolId !== "all"
          ? `?school_id=${encodeURIComponent(
              nextSchoolId
            )}`
          : "";

      const schoolsRes =
        await fetch("/api/schools");

      const classesRes =
        await fetch(
          `/api/classes${schoolFilter}`
        );

      const sectionsRes =
        await fetch(
          `/api/sections${schoolFilter}`
        );
      const studentsRes =
        await fetch("/api/students");

      setSchools(
        await schoolsRes.json()
      );

      setClasses(
        await classesRes.json()
      );

      setSections(
        await sectionsRes.json()
      );
      setStudents(
        await studentsRes.json()
      );

    } catch (error) {

      console.error(error);

    }

  };

  const saveClass = async () => {

    if (
      !schoolId ||
      schoolId === "all" ||
      !className
    ) {
      toast.error(
        "Please select one school/college and enter class name"
      );
      return;
    }

    try {

      const response =
        await fetch(
          "/api/classes",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              school_id:
                schoolId,

              class_name:
                className,
            }),
          }
        );

      if (response.ok) {

        toast.success(
        "Class Created Successfully"
        );

        setClassName("");

        loadData(schoolId);

      } else {

        toast.error(
          "Failed To Create Class"
        );

      }

    } catch (error) {

      console.error(error);

    }

  };

  const getSchoolName = (
    schoolId: number
  ) => {

    const school =
      schools.find(
        (s) =>
          s.id === schoolId
      );

    return school
      ? school.school_name
      : "-";

  };

  const getSectionCount = (
    classId: number
  ) => {

    return sections.filter(
      (s) =>
        s.class_id === classId
    ).length;

  };

  const studentName = (
    student: any
  ) =>
    student.student_name ||
    student.name ||
    [student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ") ||
    `Student ${student.id}`;

  const getClassSections = (
    item: any
  ) =>
    sections.filter(
      (section) =>
        Number(section.class_id) ===
        Number(item.id)
    );

  const getClassStudents = (
    item: any
  ) =>
    students.filter((student) => {
      const studentSchoolId =
        Number(student.school_id);
      const studentClassId =
        Number(
          student.current_class_id ??
            student.class_id
        );

      return (
        studentSchoolId ===
          Number(item.school_id) &&
        studentClassId ===
          Number(item.id)
      );
    });

  const openClassPanel = (
    item: any,
    mode: "view" | "sections"
  ) => {
    setActiveClass(item);
    setClassPanelMode(mode);
    setClassPerformance(null);
    setNewSectionName("");
    fetch(
      `/api/classes/performance?class_id=${encodeURIComponent(item.id)}`
    )
      .then((response) =>
        response.ok ? response.json() : null
      )
      .then((payload) => {
        if (payload) {
          setClassPerformance(payload);
        }
      })
      .catch(console.error);
  };

  const addSectionToClass =
    async () => {
      if (
        !activeClass ||
        !newSectionName.trim()
      ) {
        toast.error(
          "Enter a section name before saving."
        );
        return;
      }

      try {
        const response =
          await fetch(
            "/api/sections",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                school_id:
                  activeClass.school_id,
                class_id:
                  activeClass.id,
                section_name:
                  newSectionName.trim(),
              }),
            }
          );
        const payload =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            payload?.error ||
              "Failed to create section"
          );
        }

        toast.success(
          "Section added to class"
        );
        setNewSectionName("");
        await loadData(schoolId);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create section"
        );
      }
    };

  const canCreateClass =
    canManageRecord(
      role,
      "class",
      "create"
    );
  const canUpdateClass =
    canManageRecord(
      role,
      "class",
      "update"
    );
  const canDeleteClass =
    canManageRecord(
      role,
      "class",
      "delete"
    );

  const editClass = async (
    item: any
  ) => {
    const nextName = prompt(
      "Update class name",
      item.class_name || ""
    );

    if (!nextName) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/classes/${item.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              class_name: nextName,
              class_teacher_id:
                item.class_teacher_id ||
                null,
            }),
          }
        );
      const payload =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ||
            "Failed to update class"
        );
      }

      toast.success("Class updated");
      loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update class"
      );
    }
  };

  const deleteClass = async (
    item: any
  ) => {
    if (
      !confirm(
        `Delete class ${item.class_name}?`
      )
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/classes/${item.id}`,
          {
            method: "DELETE",
          }
        );
      const payload =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ||
            "Failed to delete class"
        );
      }

      toast.success("Class deleted");
      loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete class"
      );
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h1 className="text-5xl font-black">
            Classes Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage school/college classes and sections
          </p>

        </div>

        {/* ADD CLASS */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Add Class
          </h2>

          <div className="grid lg:grid-cols-2 gap-4">

            <select
              value={schoolId}
              onChange={(e) => {
                const nextValue =
                  e.target.value;
                setSchoolId(nextValue);
                loadData(nextValue);
              }}
              className="
                border
                p-4
                rounded-xl
              "
            >

              <option value="">
                {role ===
                "SUPER_ADMIN"
                  ? "All Schools/Colleges"
                  : "Select School/College"}
              </option>
              {role ===
                "SUPER_ADMIN" && (
                <option value="all">
                  All Schools/Colleges
                </option>
              )}

              {schools.map(
                (school) => (

                  <option
                    key={school.id}
                    value={school.id}
                  >
                    {
                      school.school_name
                    }
                  </option>

                )
              )}

            </select>

            <input
              value={className}
              onChange={(e) =>
                setClassName(
                  e.target.value
                )
              }
              className="
                border
                p-4
                rounded-xl
              "
              placeholder="
                Example:
                Nursery,
                LKG,
                UKG,
                Grade 1,
                Grade 2
              "
            />

          </div>

          {canCreateClass && (
            <button
              onClick={saveClass}
            className="
              mt-6
              px-8
              py-3
              bg-blue-600
              text-white
              rounded-xl
            "
          >
            Save Class
            </button>
          )}

        </div>

        {/* CLASS LIST */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-3xl font-bold mb-6">
            Existing Classes
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-4">
                    School/College
                  </th>

                  <th className="text-left py-4">
                    Class
                  </th>

                  <th className="text-left py-4">
                    Sections
                  </th>

                  <th className="text-left py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {classes.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b"
                    >

                      <td className="py-4">
                        {getSchoolName(
                          item.school_id
                        )}
                      </td>

                      <td className="py-4 font-semibold">
                        {
                          item.class_name
                        }
                      </td>

                      <td className="py-4">
                        {
                          getSectionCount(
                            item.id
                          )
                        }
                      </td>

                      <td className="py-4">

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openClassPanel(
                                item,
                                "view"
                              )
                            }
                            className="rounded-lg bg-blue-600 px-3 py-1 text-white"
                          >
                            View
                          </button>

                          {canUpdateClass && (
                            <button
                              type="button"
                              onClick={() =>
                                editClass(
                                  item
                                )
                              }
                              className="rounded-lg bg-green-600 px-3 py-1 text-white"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              openClassPanel(
                                item,
                                "sections"
                              )
                            }
                            className="rounded-lg bg-purple-600 px-3 py-1 text-white"
                          >
                            Sections
                          </button>

                          {canDeleteClass && (
                            <button
                              type="button"
                              onClick={() =>
                                deleteClass(
                                  item
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-1 text-white"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {activeClass && (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                  Class 360
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {activeClass.class_name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Created under {getSchoolName(Number(activeClass.school_id))}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveClass(null);
                  setClassPanelMode(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-500">
                  School/College
                </p>
                <p className="mt-2 text-xl font-black">
                  {getSchoolName(Number(activeClass.school_id))}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-500">
                  Sections
                </p>
                <p className="mt-2 text-4xl font-black">
                  {getClassSections(activeClass).length}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-500">
                  Assigned Students
                </p>
                <p className="mt-2 text-4xl font-black">
                  {getClassStudents(activeClass).length}
                </p>
              </div>
            </div>

            {classPerformance?.total !== undefined && (
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-amber-50 p-5">
                  <p className="text-xs font-black uppercase text-amber-700">
                    Top 3 Count
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {classPerformance.top.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-5">
                  <p className="text-xs font-black uppercase text-rose-700">
                    Least 3 Count
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {classPerformance.bottom.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase text-slate-500">
                    Average Combined Score
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {classPerformance.averages?.combined || 0}%
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase text-slate-500">
                    Students
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {classPerformance.total}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <PerformerPanel
                title="Top 3 Performers"
                rows={
                  classPerformance?.top || []
                }
              />
              <PerformerPanel
                title="Least 3 Performers"
                rows={
                  classPerformance?.bottom || []
                }
              />
            </div>

            {classPanelMode === "sections" && (
              <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-xl font-black">
                  Add Section To This Class
                </h3>
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <input
                    value={newSectionName}
                    onChange={(event) =>
                      setNewSectionName(
                        event.target.value
                      )
                    }
                    className="min-h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm font-semibold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    placeholder="Example: A, B, C"
                  />
                  <button
                    type="button"
                    onClick={addSectionToClass}
                    className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white"
                  >
                    Add Section
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-xl font-black">
                  Sections
                </h3>
                <div className="mt-4 space-y-3">
                  {getClassSections(activeClass).map(
                    (section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                      >
                        <div>
                          <p className="font-black">
                            Section {section.section_name}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            Students: {
                              students.filter(
                                (student) =>
                                  Number(
                                    student.current_section_id ??
                                      student.section_id
                                  ) ===
                                  Number(section.id)
                              ).length
                            }
                          </p>
                        </div>
                        <a
                          href={`/academics/sections?school_id=${activeClass.school_id}&class_id=${activeClass.id}`}
                          className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-900"
                        >
                          Open
                        </a>
                      </div>
                    )
                  )}
                  {!getClassSections(activeClass).length && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                      No sections have been created for this class yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-xl font-black">
                  Students
                </h3>
                <div className="mt-4 space-y-3">
                  {getClassStudents(activeClass).map(
                    (student) => (
                      <a
                        key={student.id}
                        href={`/students/${student.id}`}
                        className="block rounded-xl bg-slate-50 p-4 transition hover:bg-amber-50"
                      >
                        <p className="font-black text-slate-950">
                          {studentName(student)}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          Admission: {student.admission_number || "-"} | Section: {student.section_name || "-"}
                        </p>
                      </a>
                    )
                  )}
                  {!getClassStudents(activeClass).length && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                      No students are assigned to this class yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </Layout>

  );

}

function PerformerPanel({
  title,
  rows,
}: {
  title: string;
  rows: any[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-xl font-black">
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <a
            key={row.id}
            href={`/students/${row.id}`}
            className="block rounded-xl bg-slate-50 p-4 transition hover:bg-amber-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-black text-slate-950">
                  {row.student_name}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {[
                    row.admission_number,
                    row.class_name,
                    row.section_name,
                  ]
                    .filter(Boolean)
                    .join(" • ") || "-"}
                </p>
              </div>
              <span className="rounded-lg bg-slate-950 px-3 py-1 text-sm font-black text-white">
                {Number(row.combined_score || 0)}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold text-slate-600">
              <span>
                Marks {Number(row.marks_percent || 0)}%
              </span>
              <span>
                Att. {Number(row.attendance_percent || 0)}%
              </span>
              <span>
                HW {Number(row.homework_percent || 0)}%
              </span>
            </div>
          </a>
        ))}
        {!rows.length && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            No performance records are available for this class yet.
          </p>
        )}
      </div>
    </div>
  );
}
