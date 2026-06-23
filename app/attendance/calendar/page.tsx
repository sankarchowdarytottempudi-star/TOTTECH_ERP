"use client";

import {
  CalendarDays,
  Clock,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import Link from "next/link";
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
  | "LATE";

type ClassRow = {
  id: number | string;
  class_name?: string | null;
};

type SectionRow = {
  id: number | string;
  class_id?: number | string | null;
  section_name?: string | null;
};

type AttendanceRow = {
  id: number;
  student_id?: number | null;
  attendance_date?: string | null;
  status?: string | null;
  remarks?: string | null;
  student_name?: string | null;
  admission_number?: string | null;
  enrollment_number?: string | null;
  roll_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
};

type SummaryRow = {
  attendance_date?: string | null;
  status?: string | null;
  count?: number;
};

type AttendancePayload = {
  attendance?: AttendanceRow[];
  summary?: SummaryRow[];
};

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
};

type DayCell = {
  date: string;
  day: number;
  weekday: string;
};

const weekdays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const statusOrder: {
  key: Status;
  label: string;
}[] = [
  {
    key: "PRESENT",
    label: "Present",
  },
  {
    key: "ABSENT",
    label: "Absent",
  },
  {
    key: "LATE",
    label: "Late",
  },
];

const currentMonth = () =>
  new Date()
    .toISOString()
    .slice(0, 7);

const today = () =>
  new Date()
    .toISOString()
    .slice(0, 10);

const normalizeStatus = (
  value?: string | null
): Status =>
  value === "ABSENT" || value === "LATE"
    ? value
    : "PRESENT";

const dateKey = (
  value?: string | null
) =>
  value ? value.slice(0, 10) : "";

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

const buildCalendar = (
  month: string
) => {
  const [year, monthIndex] = month
    .split("-")
    .map(Number);
  const first = new Date(
    Date.UTC(year, monthIndex - 1, 1)
  );
  const daysInMonth =
    new Date(
      Date.UTC(year, monthIndex, 0)
    ).getUTCDate();
  const blanks = Array.from(
    { length: first.getUTCDay() },
    () => null
  );
  const days = Array.from(
    { length: daysInMonth },
    (_, index): DayCell => {
      const day = index + 1;
      const date = `${month}-${String(day).padStart(2, "0")}`;
      const value = new Date(
        Date.UTC(
          year,
          monthIndex - 1,
          day
        )
      );

      return {
        date,
        day,
        weekday:
          weekdays[
            value.getUTCDay()
          ],
      };
    }
  );

  return [...blanks, ...days];
};

export default function AttendanceCalendarPage() {
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [classId, setClassId] =
    useState("");
  const [sectionId, setSectionId] =
    useState("");
  const [month, setMonth] =
    useState(currentMonth());
  const [
    selectedDate,
    setSelectedDate,
  ] = useState(today());
  const [attendance, setAttendance] =
    useState<AttendanceRow[]>([]);
  const [summary, setSummary] =
    useState<SummaryRow[]>([]);
  const [loading, setLoading] =
    useState(true);

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
      const roster =
        await apiJson<RosterPayload>(
          `/api/roster${queryFor({
            class_id: classId,
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
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load class filters."
        )
      );
    }
  };

  const loadCalendar = async () => {
    if (!classId || !sectionId) {
      setAttendance([]);
      setSummary([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const payload =
        await apiJson<AttendancePayload>(
          `/api/attendance${queryFor({
            class_id: classId,
            section_id: sectionId,
            month,
          })}`
        );

      setAttendance(
        Array.isArray(payload.attendance)
          ? payload.attendance
          : []
      );
      setSummary(
        Array.isArray(payload.summary)
          ? payload.summary
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load attendance calendar."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [classId]);

  useEffect(() => {
    loadCalendar();
  }, [classId, sectionId, month]);

  useEffect(() => {
    const defaultDate =
      month === today().slice(0, 7)
        ? today()
        : `${month}-01`;
    setSelectedDate(defaultDate);
  }, [month]);

  const calendar =
    useMemo(
      () => buildCalendar(month),
      [month]
    );

  const summaryByDate =
    useMemo(() => {
      const map = new Map<
        string,
        Record<Status, number>
      >();

      summary.forEach((row) => {
        const key = dateKey(
          row.attendance_date
        );

        if (!key) {
          return;
        }

        const current =
          map.get(key) || {
            PRESENT: 0,
            ABSENT: 0,
            LATE: 0,
          };
        const status =
          normalizeStatus(row.status);
        current[status] +=
          Number(row.count) || 0;
        map.set(key, current);
      });

      return map;
    }, [summary]);

  const recordsForSelected =
    useMemo(
      () =>
        attendance.filter(
          (row) =>
            dateKey(
              row.attendance_date
            ) === selectedDate
        ),
      [attendance, selectedDate]
    );

  const grouped =
    useMemo(() => {
      const groups: Record<
        Status,
        AttendanceRow[]
      > = {
        PRESENT: [],
        ABSENT: [],
        LATE: [],
      };

      recordsForSelected.forEach(
        (row) => {
          groups[
            normalizeStatus(row.status)
          ].push(row);
        }
      );

      return groups;
    }, [recordsForSelected]);

  const monthTotals =
    useMemo(() => {
      return summary.reduce(
        (acc, row) => {
          const status =
            normalizeStatus(row.status);
          acc[status] +=
            Number(row.count) || 0;
          return acc;
        },
        {
          PRESENT: 0,
          ABSENT: 0,
          LATE: 0,
        } as Record<Status, number>
      );
    }, [summary]);

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-dark-hero rounded-2xl bg-slate-950 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="tt-dark-accent text-xs font-bold uppercase tracking-[0.18em]">
                Attendance Calendar
              </p>
              <h1 className="tt-dark-title mt-2 text-3xl font-black md:text-4xl">
                Class Attendance Calendar
              </h1>
              <p className="tt-dark-copy mt-2 max-w-2xl text-sm">
                Review each day by class and section, then open a day to see who was present, absent, or late.
              </p>
            </div>

            <Link
              href="/attendance/students"
              className="tt-dark-button inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-300 px-5 py-3 text-sm font-black shadow-sm transition hover:bg-amber-200"
            >
              Take Attendance
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-500">
                Month
              </span>
              <input
                type="month"
                value={month}
                onChange={(event) =>
                  setMonth(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

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
            label="Context"
            value={selectedClassName}
            detail={selectedSectionName}
            icon={
              <Users className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Present"
            value={monthTotals.PRESENT}
            detail="Month total"
            icon={
              <UserCheck className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Absent"
            value={monthTotals.ABSENT}
            detail="Month total"
            icon={
              <UserX className="h-5 w-5" />
            }
          />
          <MetricCard
            label="Late"
            value={monthTotals.LATE}
            detail="Month total"
            icon={
              <Clock className="h-5 w-5" />
            }
          />
        </section>

        {!classId || !sectionId ? (
          <EmptyState
            title="Select class and section"
            message="Choose both filters to load daily attendance counts."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    {month} Attendance
                  </h2>
                  <p className="text-sm text-slate-500">
                    Click a day card to see student names by status.
                  </p>
                </div>

                {loading && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-500">
                    Loading
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase text-slate-400">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {calendar.map(
                  (cell, index) => {
                    if (!cell) {
                      return (
                        <div
                          key={`blank-${index}`}
                          className="hidden rounded-xl border border-transparent lg:block"
                        />
                      );
                    }

                    const counts =
                      summaryByDate.get(
                        cell.date
                      ) || {
                        PRESENT: 0,
                        ABSENT: 0,
                        LATE: 0,
                      };
                    const total =
                      counts.PRESENT +
                      counts.ABSENT +
                      counts.LATE;
                    const selected =
                      selectedDate ===
                      cell.date;

                    return (
                      <button
                        key={cell.date}
                        type="button"
                        onClick={() =>
                          setSelectedDate(
                            cell.date
                          )
                        }
                        className={`min-h-[158px] rounded-2xl border p-3 text-left transition ${
                          selected
                            ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                            : "border-slate-200 bg-white text-slate-950 hover:border-slate-950"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`text-xs font-black uppercase ${
                                selected
                                  ? "text-amber-300"
                                  : "text-slate-500"
                              }`}
                            >
                              {cell.weekday}
                            </p>
                            <div className="mt-1 text-2xl font-black">
                              {cell.day}
                            </div>
                          </div>
                          <CalendarDays className="h-5 w-5 shrink-0 text-amber-400" />
                        </div>

                        {total === 0 ? (
                          <p
                            className={`mt-6 text-sm font-semibold ${
                              selected
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            No records
                          </p>
                        ) : (
                          <div className="mt-4 space-y-2 text-xs font-black">
                            <CountLine
                              label="Present"
                              value={
                                counts.PRESENT
                              }
                              selected={
                                selected
                              }
                            />
                            <CountLine
                              label="Absent"
                              value={
                                counts.ABSENT
                              }
                              selected={
                                selected
                              }
                            />
                            <CountLine
                              label="Late"
                              value={
                                counts.LATE
                              }
                              selected={
                                selected
                              }
                            />
                          </div>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
              <div className="mb-5">
                <p className="text-xs font-black uppercase text-slate-500">
                  Day Drilldown
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  {selectedDate}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {recordsForSelected.length} student records
                </p>
              </div>

              {recordsForSelected.length ===
              0 ? (
                <EmptyState
                  title="No attendance saved"
                  message="Open Student Attendance to save this day for the selected class and section."
                />
              ) : (
                <div className="space-y-4">
                  {statusOrder.map(
                    (status) => (
                      <StatusList
                        key={status.key}
                        title={status.label}
                        rows={
                          grouped[
                            status.key
                          ]
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </div>
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
  value: string | number;
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
          <div className="mt-2 truncate text-2xl font-black text-slate-950">
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

function CountLine({
  label,
  value,
  selected,
}: {
  label: string;
  value: number;
  selected: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-2 py-1 ${
        selected
          ? "bg-white/10 text-white"
          : "bg-slate-50 text-slate-700"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusList({
  title,
  rows,
}: {
  title: string;
  rows: AttendanceRow[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">
          {title}
        </h3>
        <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-black text-white">
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No students in this group.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">
                    {row.student_name ||
                      `Student #${row.student_id}`}
                  </p>
                  <p className="text-xs font-semibold text-amber-700">
                    Admission{" "}
                    {row.admission_number ||
                      row.enrollment_number ||
                      "-"}
                  </p>
                </div>
                <p className="shrink-0 text-xs font-black text-slate-500">
                  Roll {row.roll_number || "-"}
                </p>
              </div>

              {row.remarks && (
                <p className="mt-2 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600">
                  {row.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
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
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
        {message}
      </p>
    </section>
  );
}
