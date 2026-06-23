"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";

export default function SectionsPage() {

  const [schools, setSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeSection, setActiveSection] =
    useState<any | null>(null);
  const [sectionPanelMode, setSectionPanelMode] =
    useState<"view" | "students" | null>(
      null
    );
  const [assignStudentId, setAssignStudentId] =
    useState("");

  const [schoolId, setSchoolId] =
    useState("");

  const [classId, setClassId] =
    useState("");

  const [sectionName, setSectionName] =
    useState("");
  const [role, setRole] =
    useState("");

  useEffect(() => {
    const query =
      new URLSearchParams(
        window.location.search
      );
    const querySchoolId =
      query.get("school_id") || "";
    const queryClassId =
      query.get("class_id") || "";

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

    if (querySchoolId) {
      setSchoolId(querySchoolId);
    }

    if (queryClassId) {
      setClassId(queryClassId);
    }

    loadData(querySchoolId || schoolId);
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

  const saveSection = async () => {

    if (
      !schoolId ||
      !classId ||
      !sectionName
    ) {

      toast.error(
        "Please fill all required fields"
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
                schoolId,

              class_id:
                classId,

              section_name:
                sectionName,
            }),
          }
        );

      if (response.ok) {

        toast.success(
          "Section Created Successfully"
        );

        setSectionName("");

        loadData();

      } else {

        const payload =
          await response
            .json()
            .catch(() => null);

        toast.error(
          payload?.error ||
            "Failed To Create Section"
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

  const getClassName = (
    classId: number
  ) => {

    const cls =
      classes.find(
        (c) =>
          c.id === classId
      );

    return cls
      ? cls.class_name
      : "-";

  };

  const getStudentCount = (
    sectionId: number
  ) => {

    return students.filter((s) => {
      const currentSectionId =
        Number(
          s.current_section_id ??
            s.section_id
        );

      return (
        currentSectionId ===
        Number(sectionId)
      );
    }).length;

  };

  const displayedSections =
    classId
      ? sections.filter(
          (section) =>
            Number(section.class_id) ===
            Number(classId)
        )
      : sections;

  const studentName = (
    student: any
  ) =>
    student.student_name ||
    student.name ||
    [student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ") ||
    `Student ${student.id}`;

  const getSectionStudents = (
    section: any
  ) =>
    students.filter((student) => {
      const studentSchoolId =
        Number(student.school_id);
      const studentSectionId =
        Number(
          student.current_section_id ??
            student.section_id
        );

      return (
        studentSchoolId ===
          Number(section.school_id) &&
        studentSectionId ===
          Number(section.id)
      );
    });

  const getAssignableStudents = (
    section: any
  ) =>
    students.filter((student) => {
      const studentSchoolId =
        Number(student.school_id);
      const studentClassId =
        Number(
          student.current_class_id ??
            student.class_id
        );
      const studentSectionId =
        Number(
          student.current_section_id ??
            student.section_id
        );

      return (
        studentSchoolId ===
          Number(section.school_id) &&
        studentSectionId !==
          Number(section.id) &&
        (!studentClassId ||
          studentClassId ===
            Number(section.class_id))
      );
    });

  const openSectionPanel = (
    section: any,
    mode: "view" | "students"
  ) => {
    setActiveSection(section);
    setSectionPanelMode(mode);
    setAssignStudentId("");
  };

  const assignStudentToSection =
    async () => {
      if (
        !activeSection ||
        !assignStudentId
      ) {
        toast.error(
          "Select a student to assign."
        );
        return;
      }

      try {
        const response =
          await fetch(
            `/api/sections/${activeSection.id}/students`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                student_ids: [
                  Number(assignStudentId),
                ],
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
              "Failed to assign student"
          );
        }

        toast.success(
          "Student assigned to section"
        );
        setAssignStudentId("");
        await loadData(schoolId);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to assign student"
        );
      }
    };

  const canCreateSection =
    canManageRecord(
      role,
      "section",
      "create"
    );
  const canUpdateSection =
    canManageRecord(
      role,
      "section",
      "update"
    );
  const canDeleteSection =
    canManageRecord(
      role,
      "section",
      "delete"
    );

  const editSection = async (
    section: any
  ) => {
    const nextName = prompt(
      "Update section name",
      section.section_name || ""
    );

    if (!nextName) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/sections/${section.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              section_name:
                nextName,
              class_id:
                section.class_id,
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
            "Failed to update section"
        );
      }

      toast.success(
        "Section updated"
      );
      loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update section"
      );
    }
  };

  const deleteSection = async (
    section: any
  ) => {
    if (
      !confirm(
        `Delete section ${section.section_name}?`
      )
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/sections/${section.id}`,
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
            "Failed to delete section"
        );
      }

      toast.success(
        "Section deleted"
      );
      loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete section"
      );
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h1 className="text-5xl font-black">
            Sections Management
          </h1>

          <p className="text-slate-500 mt-2">
            School/College → Class → Section Hierarchy
          </p>

        </div>

        {/* ADD SECTION */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Add Section
          </h2>

          <div className="grid lg:grid-cols-3 gap-4">

            <select
              value={schoolId}
              onChange={(e) => {
                const nextValue =
                  e.target.value;
                setSchoolId(nextValue);
                setClassId("");
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

              {schools.map(
                (school) => (

                  <option
                    key={school.id}
                    value={school.id}
                  >
                    {school.school_name}
                  </option>

                )
              )}

            </select>

            <select
              value={classId}
              onChange={(e) =>
                setClassId(
                  e.target.value
                )
              }
              className="
                border
                p-4
                rounded-xl
              "
            >

              <option value="">
                Select Class
              </option>

              {classes.map(
                (cls) => (

                  <option
                    key={cls.id}
                    value={cls.id}
                  >
                    {cls.class_name}
                  </option>

                )
              )}

            </select>

            <input
              value={sectionName}
              onChange={(e) =>
                setSectionName(
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
                A, B, C
              "
            />

          </div>

          {canCreateSection && (
            <button
              onClick={saveSection}
            className="
              mt-6
              px-8
              py-3
              bg-blue-600
              text-white
              rounded-xl
            "
          >
            Save Section
            </button>
          )}

        </div>

        {/* EXISTING SECTIONS */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-3xl font-bold mb-6">
            Existing Sections
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-4">
                    ID
                  </th>

                  <th className="text-left py-4">
                    School/College
                  </th>

                  <th className="text-left py-4">
                    Class
                  </th>

                  <th className="text-left py-4">
                    Section
                  </th>

                  <th className="text-left py-4">
                    Students
                  </th>

                  <th className="text-left py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {displayedSections.map(
                  (section) => (

                    <tr
                      key={section.id}
                      className="border-b"
                    >

                      <td className="py-4">
                        {section.id}
                      </td>

                      <td className="py-4">
                        {getSchoolName(
                          section.school_id
                        )}
                      </td>

                      <td className="py-4">
                        {getClassName(
                          section.class_id
                        )}
                      </td>

                      <td className="py-4 font-semibold">
                        {
                          section.section_name
                        }
                      </td>

                      <td className="py-4">
                        {
                          getStudentCount(
                            section.id
                          )
                        }
                      </td>

                      <td className="py-4">

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openSectionPanel(
                                section,
                                "view"
                              )
                            }
                            className="rounded-lg bg-blue-600 px-3 py-1 text-white"
                          >
                            View
                          </button>

                          {canUpdateSection && (
                            <button
                              type="button"
                              onClick={() =>
                                editSection(
                                  section
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
                              openSectionPanel(
                                section,
                                "students"
                              )
                            }
                            className="rounded-lg bg-purple-600 px-3 py-1 text-white"
                          >
                            Students
                          </button>

                          {canDeleteSection && (
                            <button
                              type="button"
                              onClick={() =>
                                deleteSection(
                                  section
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

                {!displayedSections.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center font-semibold text-slate-500"
                    >
                      No sections found for the selected school/college/class.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {activeSection && (
          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                  Section 360
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {getClassName(
                    activeSection.class_id
                  )}{" "}
                  -{" "}
                  {
                    activeSection.section_name
                  }
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {getSchoolName(
                    activeSection.school_id
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSection(null);
                  setSectionPanelMode(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  School/College
                </p>
                <p className="mt-2 break-words text-lg font-black text-slate-950">
                  {getSchoolName(
                    activeSection.school_id
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Class
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {getClassName(
                    activeSection.class_id
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Section
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {
                    activeSection.section_name
                  }
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase text-amber-700">
                  Assigned Students
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {
                    getSectionStudents(
                      activeSection
                    ).length
                  }
                </p>
              </div>
            </div>

            {sectionPanelMode ===
              "students" &&
              canUpdateSection && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-lg font-black text-slate-950">
                    Assign Student To Section
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                    <select
                      value={assignStudentId}
                      onChange={(event) =>
                        setAssignStudentId(
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-amber-200 bg-white p-3 font-semibold text-slate-950"
                    >
                      <option value="">
                        Select student from this school/college/class
                      </option>
                      {getAssignableStudents(
                        activeSection
                      ).map((student) => (
                        <option
                          key={student.id}
                          value={student.id}
                        >
                          {studentName(
                            student
                          )}{" "}
                          {student.admission_number
                            ? `- ${student.admission_number}`
                            : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={
                        assignStudentToSection
                      }
                      className="rounded-xl bg-slate-950 px-5 py-3 font-black text-white"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}

            <div className="mt-6">
              <h3 className="text-lg font-black text-slate-950">
                Students In This Section
              </h3>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {getSectionStudents(
                  activeSection
                ).map((student) => (
                  <a
                    key={student.id}
                    href={`/students/${student.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <p className="font-black text-slate-950">
                      {studentName(
                        student
                      )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-amber-700">
                      {student.admission_number ||
                        student.enrollment_number ||
                        `Student ${student.id}`}
                    </p>
                  </a>
                ))}

                {!getSectionStudents(
                  activeSection
                ).length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 font-semibold text-slate-600">
                    No students are assigned to this section yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </Layout>

  );

}
