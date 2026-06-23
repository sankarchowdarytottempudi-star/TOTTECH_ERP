"use client";

import {
  CheckCircle,
  Clock,
  Save,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Status =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE_APPROVED"
  | "MEDICAL_LEAVE"
  | "DUTY_LEAVE";

type ClassRow = {
  id: number | string;
  class_name?: string | null;
};

type SectionRow = {
  id: number | string;
  class_id?: number | string | null;
  section_name?: string | null;
};

type StudentRow = {
  id: number | string;
  admission_number?: string | null;
  enrollment_number?: string | null;
  roll_number?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  class_id?: number | string | null;
  section_id?: number | string | null;
  class_name?: string | null;
  section_name?: string | null;
};

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  students?: StudentRow[];
};

type AttendanceRow = {
  id: number;
  student_id?: number | null;
  status?: string | null;
  remarks?: string | null;
};

type AttendancePayload = {
  attendance?: AttendanceRow[];
};

type Draft = {
  status: Status;
  remarks: string;
};

const today = () =>
  new Date()
    .toISOString()
    .slice(0, 10);

const statuses: {
  value: Status;
  label: string;
}[] = [
  {
    value: "PRESENT",
    label: "Present",
  },
  {
    value: "ABSENT",
    label: "Absent",
  },
  {
    value: "LATE",
    label: "Late",
  },
  {
    value: "HALF_DAY",
    label: "Half Day",
  },
  {
    value: "LEAVE_APPROVED",
    label: "Leave Approved",
  },
  {
    value: "MEDICAL_LEAVE",
    label: "Medical Leave",
  },
  {
    value: "DUTY_LEAVE",
    label: "Duty Leave",
  },
];

const studentName = (
  student: StudentRow
) =>
  [
    student.first_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ") ||
  student.name ||
  `Student #${student.id}`;

const normalizeStatus = (
  value?: string | null
): Status =>
  value === "ABSENT" || value === "LATE" || value === "HALF_DAY" || value === "LEAVE_APPROVED" || value === "MEDICAL_LEAVE" || value === "DUTY_LEAVE"
    ? value
    : "PRESENT";

const queryFor = (
  values: Record<string, string>
) => {
  const params =
    new URLSearchParams();

  Object.entries(values).forEach(
    ([key, value]) => {
      if (value) {
        params?.set(key, value);
      }
    }
  );

  const query = params?.toString();
  return query ? `?${query}` : "";
};

export default function StudentAttendancePage() {
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [
    attendanceRows,
    setAttendanceRows,
  ] = useState<AttendanceRow[]>([]);
  const [classId, setClassId] =
    useState("");
  const [sectionId, setSectionId] =
    useState("");
  const [
    attendanceDate,
    setAttendanceDate,
  ] = useState(today());
  const todayDate = today();
  const [drafts, setDrafts] =
    useState<Record<string, Draft>>({});
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  const selectedClassName =
    classes.find(
      (item) =>
        String(item.id) === classId
    )?.class_name || "Select class";
  const selectedSectionName =
    sections.find(
      (item) =>
        String(item.id) === sectionId
    )?.section_name || "Select section";

  const loadRoster = async () => {
    try {
      setLoading(true);
      const roster =
        await apiJson<RosterPayload>(
          `/api/roster${queryFor({
            class_id: classId,
            section_id: sectionId,
          })}`
        );

      setClasses(
        Array.isArray(roster.classes)
          ? roster.classes
          : []
      );
      setSections(
        Array.isArray(roster.sections)
          ? roster.sections
          : []
      );
      setStudents(
        classId && sectionId
          ? Array.isArray(
              roster.students
            )
            ? roster.students
            : []
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load class roster."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    if (!classId || !sectionId) {
      setAttendanceRows([]);
      return;
    }

    try {
      const payload =
        await apiJson<AttendancePayload>(
          `/api/attendance${queryFor({
            class_id: classId,
            section_id: sectionId,
            date: attendanceDate,
          })}`
        );

      setAttendanceRows(
        Array.isArray(payload.attendance)
          ? payload.attendance
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load attendance records."
        )
      );
    }
  };

  useEffect(() => {
    loadRoster();
  }, [classId, sectionId]);

  useEffect(() => {
    loadAttendance();
  }, [
    classId,
    sectionId,
    attendanceDate,
  ]);

  useEffect(() => {
    const existing =
      new Map<string, AttendanceRow>();

    attendanceRows.forEach((row) => {
      if (row.student_id) {
        existing.set(
          String(row.student_id),
          row
        );
      }
    });

    setDrafts((previous) => {
      const next: Record<
        string,
        Draft
      > = {};

      students.forEach((student) => {
        const key = String(student.id);
        const row =
          existing.get(key);

        next[key] = {
          status: normalizeStatus(
            row?.status ??
              previous[key]?.status
          ),
          remarks:
            row?.remarks ??
            previous[key]?.remarks ??
            "",
        };
      });

      return next;
    });
  }, [students, attendanceRows]);

  const counts = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        const status =
          drafts[String(student.id)]
            ?.status || "PRESENT";
        acc[status] =
          (acc[status] || 0) + 1;
        return acc;
      },
      {
        PRESENT: 0,
        ABSENT: 0,
        LATE: 0,
      } as Record<Status, number>
    );
  }, [students, drafts]);

  const updateDraft = (
    studentId: number | string,
    patch: Partial<Draft>
  ) => {
    const key = String(studentId);
    setDrafts((current) => ({
      ...current,
      [key]: {
        status:
          current[key]?.status ??
          "PRESENT",
        remarks:
          current[key]?.remarks ??
          "",
        ...patch,
      },
    }));
  };

  const markAll = (status: Status) => {
    setDrafts((current) => {
      const next: Record<
        string,
        Draft
      > = {};

      students.forEach((student) => {
        const key = String(student.id);
        next[key] = {
          status,
          remarks:
            current[key]?.remarks ??
            "",
        };
      });

      return next;
    });
  };

  const saveAttendance = async () => {
    if (!classId || !sectionId) {
      notify.error(
        "Select class and section before saving attendance."
      );
      return;
    }

    if (students.length === 0) {
      notify.error(
        "No students found for the selected class and section."
      );
      return;
    }

    try {
      setSaving(true);
      await apiJson("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          records: students.map(
            (student) => {
              const draft =
                drafts[
                  String(student.id)
                ];

              return {
                student_id:
                  Number(student.id),
                class_id:
                  Number(classId),
                section_id:
                  Number(sectionId),
                attendance_date:
                  attendanceDate,
                status:
                  draft?.status ||
                  "PRESENT",
                remarks:
                  draft?.remarks || "",
              };
            }
          ),
        }),
      });

      notify.success(
        "Student attendance saved."
      );
      await loadAttendance();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save attendance."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-dark-hero rounded-2xl bg-slate-950 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="tt-dark-accent text-xs font-bold uppercase tracking-[0.18em]">
                Attendance Operations
              </p>
              <h1 className="tt-dark-title mt-2 text-3xl font-black md:text-4xl">
                Student Attendance
              </h1>
              <p className="tt-dark-copy mt-2 max-w-2xl text-sm">
                Select a class and section, mark each student as present, absent, or late, add remarks, then save the full day in one action.
              </p>
            </div>

            <button
              type="button"
              onClick={saveAttendance}
              disabled={
                saving ||
                !classId ||
                !sectionId ||
                students.length === 0
              }
              className="tt-dark-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-black shadow-sm transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving
                ? "Saving..."
                : "Save Attendance"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-500">
                Attendance Date
              </span>
              <input
                type="date"
                value={attendanceDate}
                min={todayDate}
                max={todayDate}
                onChange={(event) =>
                  setAttendanceDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-500">
                Allowed Date
              </span>
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {todayDate}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-500">
                Class
              </span>
              <select
                value={classId}
                onChange={(event) => {
                  setClassId(
                    event.target.value
                  );
                  setSectionId("");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="">
                  Select Class
                </option>
                {classes.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.class_name ||
                      `Class ${item.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-500">
                Section
              </span>
              <select
                value={sectionId}
                onChange={(event) =>
                  setSectionId(
                    event.target.value
                  )
                }
                disabled={!classId}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-950 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  Select Section
                </option>
                {sections
                  .filter(
                    (item) =>
                      !classId ||
                      String(
                        item.class_id
                      ) === classId
                  )
                  .map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.section_name ||
                        `Section ${item.id}`}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <MetricCard
            label="Roster"
            value={students.length}
            detail={`${selectedClassName} / ${selectedSectionName}`}
            icon={
              <Users className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Present"
            value={counts.PRESENT}
            detail="Ready for class"
            icon={
              <UserCheck className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Absent"
            value={counts.ABSENT}
            detail="Needs follow-up"
            icon={
              <UserX className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Late"
            value={counts.LATE}
            detail="Track arrival"
            icon={
              <Clock className="h-5 w-5" />
            }
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Bulk Attendance Controls
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Mark everyone first, then adjust individual students before saving.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {statuses.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    markAll(item.value)
                  }
                  disabled={
                    students.length === 0
                  }
                  className="min-h-11 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark All {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {!classId || !sectionId ? (
          <EmptyState
            title="Select class and section"
            message="Attendance can only be taken after choosing the class and section."
          />
        ) : loading ? (
          <EmptyState
            title="Loading roster"
            message="Getting students for the selected class and section."
          />
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            message="No active students are assigned to this class and section yet."
          />
        ) : (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {students.map((student) => {
              const key = String(student.id);
              const draft =
                drafts[key] || {
                  status: "PRESENT",
                  remarks: "",
                };

              return (
                <article
                  key={student.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black text-slate-950">
                            {studentName(
                              student
                            )}
                          </h3>
                          <p className="text-sm font-semibold text-amber-700">
                            Admission{" "}
                            {student.admission_number ||
                              "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <InfoBlock
                          label="Class"
                          value={
                            student.class_name ||
                            selectedClassName
                          }
                        />
                        <InfoBlock
                          label="Section"
                          value={
                            student.section_name ||
                            selectedSectionName
                          }
                        />
                        <InfoBlock
                          label="Roll No"
                          value={
                            student.roll_number ||
                            "-"
                          }
                        />
                        <InfoBlock
                          label="Phone"
                          value={
                            student.phone ||
                            "-"
                          }
                        />
                      </div>
                    </div>

                    <div className="grid shrink-0 grid-cols-3 gap-2 sm:w-[300px]">
                      {statuses.map(
                        (item) => (
                          <label
                            key={item.value}
                            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-xs font-black transition ${
                              draft.status ===
                              item.value
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-950"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value={item.value}
                              checked={
                                draft.status ===
                                item.value
                              }
                              onChange={() =>
                                updateDraft(
                                  student.id,
                                  {
                                    status:
                                      item.value,
                                  }
                                )
                              }
                              className="sr-only"
                            />
                            {item.label}
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <label className="mt-4 block space-y-2">
                    <span className="text-xs font-black uppercase text-slate-500">
                      Comments
                    </span>
                    <input
                      type="text"
                      value={
                        draft.remarks
                      }
                      onChange={(event) =>
                        updateDraft(
                          student.id,
                          {
                            remarks:
                              event.target
                                .value,
                          }
                        )
                      }
                      placeholder="Optional remark for parent, class teacher, or admin"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white"
                    />
                  </label>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </Layout>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-slate-500">
            {label}
          </p>
          <div className="mt-2 text-3xl font-black text-slate-950">
            {value}
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-slate-500">
            {detail}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-black text-slate-950">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
        {message}
      </p>
    </section>
  );
}
