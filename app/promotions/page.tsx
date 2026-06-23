"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "@/components/Layout";

type Option = {
  id: number;
  school_name?: string;
  academic_year?: string;
  class_name?: string;
  class_id?: number;
  section_name?: string;
};

type Student = {
  id: number;
  admission_number?: string;
  enrollment_number?: string;
  student_name?: string;
  class_id?: number;
  section_id?: number;
  class_name?: string;
  section_name?: string;
  academic_year?: string;
  status?: string;
  backlog_count?: number;
  pending_backlogs_count?: number;
};

type Teacher = {
  id: number;
  employee_id?: string;
  teacher_name?: string;
  designation?: string;
  department?: string;
  current_academic_year_id?: number;
  current_academic_year?: string;
  assignment_count?: number;
  target_assignment_count?: number;
  last_rollover_at?: string;
  last_rollover_action?: string;
};

type TeacherRolloverHistory = {
  id: number;
  teacher_name?: string;
  action?: string;
  status?: string;
  source_academic_year?: string;
  target_academic_year?: string;
  source_assignment_count?: number;
  target_assignment_count?: number;
  created_at?: string;
};

type Workflow = {
  id: number;
  approval_status?: string;
  source_academic_year?: string;
  target_academic_year?: string;
  student_count?: number;
};

type AcademicYearRollover = {
  id: number;
  school_name?: string;
  source_academic_year?: string;
  target_academic_year?: string;
  status?: string;
  created_at?: string;
  executed_at?: string;
};

type PromotionReports = {
  promotionSummary?: {
    promoted_students?: number | string;
    approved_promotions?: number | string;
  };
  dropoutSummary?: {
    dropout_students?: number | string;
  };
};

type RolloverPreview = {
  canExecute?: boolean;
  sourceCounts?: Record<string, number>;
  targetCountsBefore?: Record<string, number>;
  targetCountsAfter?: Record<string, number>;
  copiedCounts?: Record<string, number>;
  validationErrors?: string[];
};

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200";

const buttonClass =
  "rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45";

export default function PromotionPage() {
  const [schools, setSchools] =
    useState<Option[]>([]);
  const [academicYears, setAcademicYears] =
    useState<Option[]>([]);
  const [classes, setClasses] =
    useState<Option[]>([]);
  const [sections, setSections] =
    useState<Option[]>([]);
  const [students, setStudents] =
    useState<Student[]>([]);
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);
  const [
    teacherRolloverHistory,
    setTeacherRolloverHistory,
  ] = useState<TeacherRolloverHistory[]>(
    []
  );
  const [workflows, setWorkflows] =
    useState<Workflow[]>([]);
  const [reports, setReports] =
    useState<PromotionReports>({});
  const [
    academicYearRollovers,
    setAcademicYearRollovers,
  ] = useState<AcademicYearRollover[]>(
    []
  );

  const [filters, setFilters] =
    useState({
      school_id: "",
      source_academic_year_id: "",
      target_academic_year_id: "",
      from_class_id: "",
      from_section_id: "",
      to_class_id: "",
      to_section_id: "",
      student_id: "",
      status: "ACTIVE",
    });

  const [selectedStudents, setSelectedStudents] =
    useState<number[]>([]);
  const [dropout, setDropout] =
    useState({
      student_id: "",
      dropout_category: "TRANSFER",
      dropout_date: new Date()
        .toISOString()
        .slice(0, 10),
      dropout_reason: "",
      remarks: "",
    });
  const [teacherRollover, setTeacherRollover] =
    useState({
      action: "CONTINUE",
      teacher_ids: [] as number[],
      remarks: "",
    });
  const [rolloverPreview, setRolloverPreview] =
    useState<RolloverPreview | null>(null);
  const [rolloverBusy, setRolloverBusy] =
    useState(false);
  const [rollbackBusy, setRollbackBusy] =
    useState(false);
  const [rolloverEntities, setRolloverEntities] =
    useState([
      "students",
      "classes",
      "sections",
      "subjects",
      "teacher_assignments",
      "timetable",
      "exams",
      "exam_schedule",
      "question_papers",
      "homework",
      "transport",
      "dining",
      "hostel",
    ]);

  const selectedCount =
    selectedStudents.length;
  const selectedWithPendingBacklogs =
    students.filter(
      (student) =>
        selectedStudents.includes(
          Number(student.id)
        ) &&
        Number(
          student.pending_backlogs_count ||
            0
        ) > 0
    );
  const candidatesReady =
    [
      filters.school_id,
      filters.source_academic_year_id,
      filters.from_class_id,
      filters.from_section_id,
      filters.student_id,
    ].filter(Boolean).length >= 2;

  const loadCandidates = async (
    nextFilters = filters
  ) => {
    const params =
      new URLSearchParams();

    Object.entries(nextFilters).forEach(
      ([key, value]) => {
        if (value) {
          params?.set(key, value);
        }
      }
    );

    const response = await fetch(
      `/api/promotions/candidates?${params?.toString()}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to load promotion candidates."
      );
    }

    setSchools(data.schools || []);
    setAcademicYears(
      data.academicYears || []
    );
    setClasses(data.classes || []);
    setSections(data.sections || []);
    setStudents(data.students || []);

    const visibleIds = new Set(
      (data.students || []).map(
        (student: Student) =>
          Number(student.id)
      )
    );
    setSelectedStudents((current) =>
      current.filter((id) =>
        visibleIds.has(id)
      )
    );
  };

  const loadTeachers = async (
    nextFilters = filters
  ) => {
    const params =
      new URLSearchParams();

    if (nextFilters.school_id) {
      params?.set(
        "school_id",
        nextFilters.school_id
      );
    }

    if (
      nextFilters.source_academic_year_id
    ) {
      params?.set(
        "source_academic_year_id",
        nextFilters.source_academic_year_id
      );
    }

    if (
      nextFilters.target_academic_year_id
    ) {
      params?.set(
        "target_academic_year_id",
        nextFilters.target_academic_year_id
      );
    }

    const response = await fetch(
      `/api/promotions/teacher-rollover?${params?.toString()}`
    );
    const data = await response.json();

    if (response.ok) {
      setTeachers(data.teachers || []);
      setTeacherRolloverHistory(
        data.history || []
      );
    }
  };

  const loadWorkflows = async () => {
    const response = await fetch(
      "/api/promotions"
    );
    const data = await response.json();

    if (response.ok) {
      setWorkflows(data.workflows || []);
    }
  };

  const loadReports = async (
    nextFilters = filters
  ) => {
    const params =
      new URLSearchParams();

    if (nextFilters.school_id) {
      params?.set(
        "school_id",
        nextFilters.school_id
      );
    }

    if (
      nextFilters.target_academic_year_id ||
      nextFilters.source_academic_year_id
    ) {
      params?.set(
        "academic_year_id",
        nextFilters.target_academic_year_id ||
          nextFilters.source_academic_year_id
      );
    }

    const response = await fetch(
      `/api/promotions/reports?${params?.toString()}`
    );
    const data = await response.json();

    if (response.ok) {
      setReports(data);
    }
  };

  const loadAcademicYearRollovers =
    async (nextFilters = filters) => {
      const params =
        new URLSearchParams();

      if (nextFilters.school_id) {
        params?.set("school_id", nextFilters.school_id);
      }

      if (
        nextFilters.source_academic_year_id ||
        nextFilters.target_academic_year_id
      ) {
        params?.set(
          "academic_year_id",
          nextFilters.target_academic_year_id ||
            nextFilters.source_academic_year_id
        );
      }

      const response = await fetch(
        `/api/academic-year-rollover?${params?.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        setAcademicYearRollovers(
          Array.isArray(data.rollovers)
            ? data.rollovers
            : []
        );
      }
    };

  const refresh = async (
    nextFilters = filters
  ) => {
    await Promise.all([
      loadCandidates(nextFilters),
      loadTeachers(nextFilters),
      loadWorkflows(),
      loadReports(nextFilters),
      loadAcademicYearRollovers(nextFilters),
    ]);
  };

  useEffect(() => {
    void Promise.resolve().then(() =>
      refresh().catch((error) =>
        toast.error(error.message)
      )
    );
    // The first load is intentionally one-shot; filter changes call refresh through updateFilter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = (
    key: keyof typeof filters,
    value: string
  ) => {
    const next = {
      ...filters,
      [key]: value,
      ...(key === "school_id"
        ? {
            from_class_id: "",
            from_section_id: "",
            to_class_id: "",
            to_section_id: "",
            student_id: "",
          }
        : {}),
      ...(key === "from_class_id"
        ? {
            from_section_id: "",
            student_id: "",
          }
        : {}),
      ...(key === "to_class_id"
        ? {
            to_section_id: "",
          }
        : {}),
    };

    setFilters(next);
    refresh(next).catch((error) =>
      toast.error(error.message)
    );
  };

  const toggleStudent = (
    id: number
  ) => {
    setSelectedStudents((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  const selectAllVisible = () => {
    setSelectedStudents(
      students.map((student) =>
        Number(student.id)
      )
    );
  };

  const selectAllTeachers = () => {
    setTeacherRollover(
      (current) => ({
        ...current,
        teacher_ids: teachers.map(
          (teacher) => Number(teacher.id)
        ),
      })
    );
  };

  const clearTeacherSelection = () => {
    setTeacherRollover(
      (current) => ({
        ...current,
        teacher_ids: [],
      })
    );
  };

  const createWorkflow = async () => {
    if (
      !filters.school_id ||
      !filters.source_academic_year_id ||
      !filters.target_academic_year_id ||
      !filters.to_class_id
    ) {
      toast.error(
        "School/College, source year, target year, and target class are required."
      );
      return;
    }

    const response = await fetch(
      "/api/promotions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          school_id:
            filters.school_id,
          source_academic_year_id:
            filters.source_academic_year_id,
          target_academic_year_id:
            filters.target_academic_year_id,
          from_class_id:
            filters.from_class_id ||
            null,
          from_section_id:
            filters.from_section_id ||
            null,
          to_class_id:
            filters.to_class_id,
          to_section_id:
            filters.to_section_id ||
            null,
          student_ids:
            selectedStudents.length
              ? selectedStudents
              : undefined,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data?.error ||
          "Promotion preview failed."
      );
      return;
    }

    toast.success(
      "Promotion workflow created for approval."
    );
    setSelectedStudents([]);
    await refresh();
  };

  const approveWorkflow = async (
    id: number
  ) => {
    const response = await fetch(
      `/api/promotions/${id}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          decision: "APPROVE",
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data?.error ||
          "Approval failed."
      );
      return;
    }

    toast.success(
      "Promotion workflow approved."
    );
    await loadWorkflows();
  };

  const executeWorkflow = async (
    id: number
  ) => {
    const response = await fetch(
      `/api/promotions/${id}/execute`,
      {
        method: "POST",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data?.error ||
          "Promotion execution failed."
      );
      return;
    }

    toast.success(
      `Promotion executed for ${data.executed || 0} students.`
    );
    await refresh();
  };

  const markDropout = async () => {
    if (!dropout.student_id) {
      toast.error(
        "Select a student before marking dropout."
      );
      return;
    }

    const response = await fetch(
      "/api/promotions/dropouts",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...dropout,
          dropout_academic_year_id:
            filters.source_academic_year_id,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data?.error ||
          "Dropout update failed."
      );
      return;
    }

    toast.success(
      "Student marked as dropout."
    );
    setDropout({
      student_id: "",
      dropout_category: "TRANSFER",
      dropout_date: new Date()
        .toISOString()
        .slice(0, 10),
      dropout_reason: "",
      remarks: "",
    });
    await refresh();
  };

  const runTeacherRollover =
    async () => {
      if (
        !filters.school_id ||
        !filters.source_academic_year_id ||
        !filters.target_academic_year_id ||
        !teacherRollover.teacher_ids.length
      ) {
        toast.error(
          "School/College, years, and at least one teacher are required."
        );
        return;
      }

      const response = await fetch(
        "/api/promotions/teacher-rollover",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            school_id:
              filters.school_id,
            source_academic_year_id:
              filters.source_academic_year_id,
            target_academic_year_id:
              filters.target_academic_year_id,
            action:
              teacherRollover.action,
            teacher_ids:
              teacherRollover.teacher_ids,
            remarks:
              teacherRollover.remarks,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data?.error ||
            "Teacher rollover failed."
        );
        return;
      }

      toast.success(
        `Teacher rollover completed for ${data.processed || 0} teachers. ${data.assignmentsCopied || 0} assignment(s) copied.`
      );
      setTeacherRollover({
        action: "CONTINUE",
        teacher_ids: [],
        remarks: "",
      });
      await refresh();
    };

  const toggleRolloverEntity = (
    entity: string
  ) => {
    setRolloverEntities((current) =>
      current.includes(entity)
        ? current.filter(
            (item) => item !== entity
          )
        : [...current, entity]
    );
  };

  const runAcademicYearRollover =
    async (
      action: "PREVIEW" | "EXECUTE"
    ) => {
      if (
        !filters.school_id ||
        !filters.source_academic_year_id ||
        !filters.target_academic_year_id
      ) {
        toast.error(
          "School/College, source year, and target year are required."
        );
        return;
      }

      setRolloverBusy(true);

      try {
        const response = await fetch(
          "/api/academic-year-rollover",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              school_id:
                filters.school_id,
              source_academic_year_id:
                filters.source_academic_year_id,
              target_academic_year_id:
                filters.target_academic_year_id,
              action,
              entities:
                rolloverEntities,
            }),
          }
        );
        const data =
          await response.json();

        if (!response.ok) {
          toast.error(
            data?.error ||
              "Academic year rollover failed."
          );
          setRolloverPreview(data);
          return;
        }

        setRolloverPreview(data);
        toast.success(
          action === "PREVIEW"
            ? "Rollover preview ready."
            : "Academic year rollover executed."
        );

        if (action === "EXECUTE") {
          await refresh();
        }
      } finally {
        setRolloverBusy(false);
      }
    };

  const rollbackAcademicYearRollover =
    async (rolloverId: number) => {
      if (!rolloverId) {
        toast.error("Select a rollover to rollback.");
        return;
      }

      setRollbackBusy(true);

      try {
        const response = await fetch(
          "/api/academic-year-rollover",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              rollover_id: rolloverId,
            }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data?.error ||
              "Academic year rollback failed."
          );
          return;
        }

        toast.success(
          `Academic year rollover #${rolloverId} rolled back.`
        );
        await refresh();
      } finally {
        setRollbackBusy(false);
      }
    };

  const rolloverEntityOptions = [
    {
      value: "students",
      label:
        "Student Carry-forward",
    },
    {
      value: "classes",
      label: "Classes",
    },
    {
      value: "sections",
      label: "Sections",
    },
    {
      value: "subjects",
      label: "Subjects",
    },
    {
      value:
        "teacher_assignments",
      label:
        "Teacher Assignments",
    },
    {
      value: "timetable",
      label: "Timetable",
    },
    {
      value: "exams",
      label: "Exams",
    },
    {
      value: "exam_schedule",
      label:
        "Exam Schedule",
    },
    {
      value: "question_papers",
      label:
        "Question Papers",
    },
    {
      value: "homework",
      label: "Homework",
    },
    {
      value: "transport",
      label: "Transport",
    },
    {
      value: "dining",
      label: "Dining",
    },
    {
      value: "hostel",
      label: "Hostel",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-amber-300 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
            Academic Year Engine
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Promotion Center
          </h1>
          <p className="mt-2 max-w-4xl text-sm font-semibold text-white/75">
            Preview, approve, and execute student promotions without overwriting history. Manage dropouts, teacher rollovers, and academic-year transition analytics from one command center.
          </p>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5">
          <SelectField
            label="School/College"
            value={filters.school_id}
            onChange={(value) =>
              updateFilter(
                "school_id",
                value
              )
            }
            options={schools.map(
              (school) => ({
                value: school.id,
                label:
                  school.school_name ||
                  `School ${school.id}`,
              })
            )}
          />
          <SelectField
            label="Academic Year From"
            value={
              filters.source_academic_year_id
            }
            onChange={(value) =>
              updateFilter(
                "source_academic_year_id",
                value
              )
            }
            options={academicYears.map(
              (year) => ({
                value: year.id,
                label:
                  year.academic_year ||
                  `Year ${year.id}`,
              })
            )}
          />
          <SelectField
            label="Academic Year To"
            value={
              filters.target_academic_year_id
            }
            onChange={(value) =>
              updateFilter(
                "target_academic_year_id",
                value
              )
            }
            options={academicYears.map(
              (year) => ({
                value: year.id,
                label:
                  year.academic_year ||
                  `Year ${year.id}`,
              })
            )}
          />
          <SelectField
            label="From Class"
            value={filters.from_class_id}
            onChange={(value) =>
              updateFilter(
                "from_class_id",
                value
              )
            }
            options={classes.map(
              (item) => ({
                value: item.id,
                label:
                  item.class_name ||
                  `Class ${item.id}`,
              })
            )}
          />
          <SelectField
            label="From Section"
            value={filters.from_section_id}
            onChange={(value) =>
              updateFilter(
                "from_section_id",
                value
              )
            }
            options={sections.map(
              (item) => ({
                value: item.id,
                label:
                  item.section_name ||
                  `Section ${item.id}`,
              })
            )}
          />
          <SelectField
            label="Student"
            value={filters.student_id}
            onChange={(value) =>
              updateFilter(
                "student_id",
                value
              )
            }
            options={students.map(
              (student) => ({
                value: student.id,
                label:
                  student.student_name ||
                  `Student ${student.id}`,
              })
            )}
          />
          <SelectField
            label="Target Class"
            value={filters.to_class_id}
            onChange={(value) =>
              updateFilter(
                "to_class_id",
                value
              )
            }
            options={classes.map(
              (item) => ({
                value: item.id,
                label:
                  item.class_name ||
                  `Class ${item.id}`,
              })
            )}
          />
          <SelectField
            label="Target Section"
            value={filters.to_section_id}
            onChange={(value) =>
              updateFilter(
                "to_section_id",
                value
              )
            }
            options={sections
              .filter(
                (item) =>
                  !filters.to_class_id ||
                  Number(
                    item.class_id
                  ) ===
                    Number(
                      filters.to_class_id
                    )
              )
              .map((item) => ({
                value: item.id,
                label:
                  item.section_name ||
                  `Section ${item.id}`,
              }))}
          />
          <div className="xl:col-span-2">
            <label className="text-xs font-black uppercase text-slate-500">
              Status
            </label>
            <select
              className={fieldClass}
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value
                )
              }
            >
              <option value="ACTIVE">
                Active
              </option>
              <option value="DROPOUT">
                Dropout
              </option>
              <option value="ALL">
                All
              </option>
            </select>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Kpi
            label="Promoted Students"
            value={
              reports.promotionSummary
                ?.promoted_students || 0
            }
          />
          <Kpi
            label="Dropout Students"
            value={
              reports.dropoutSummary
                ?.dropout_students || 0
            }
          />
          <Kpi
            label="Promotion %"
            value={
              students.length
                ? `${Math.round((Number(reports.promotionSummary?.promoted_students || 0) / students.length) * 100)}%`
                : "0%"
            }
          />
          <Kpi
            label="Dropout %"
            value={
              students.length
                ? `${Math.round((Number(reports.dropoutSummary?.dropout_students || 0) / students.length) * 100)}%`
                : "0%"
            }
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                Academic Year Rollover Wizard
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Preview, validate, approve, execute
              </h2>
              <p className="mt-1 max-w-4xl text-sm font-semibold text-slate-600">
                Copy setup and active operational assignments into the target academic year without overwriting historical records. Marks stay historical; student class advancement should use the promotion workflow below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={buttonClass}
                disabled={rolloverBusy}
                onClick={() =>
                  runAcademicYearRollover(
                    "PREVIEW"
                  )
                }
              >
                Preview Rollover
              </button>
              <button
                className={buttonClass}
                disabled={
                  rolloverBusy ||
                  !rolloverPreview ||
                  rolloverPreview.canExecute ===
                    false
                }
                onClick={() =>
                  runAcademicYearRollover(
                    "EXECUTE"
                  )
                }
              >
                Execute Rollover
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {rolloverEntityOptions.map(
              (entity) => (
                <label
                  key={entity.value}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-black text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={rolloverEntities.includes(
                      entity.value
                    )}
                    onChange={() =>
                      toggleRolloverEntity(
                        entity.value
                      )
                    }
                  />
                  {entity.label}
                </label>
              )
            )}
          </div>

          {rolloverPreview && (
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase text-amber-800">
                  Source Counts
                </p>
                <CountGrid
                  counts={
                    rolloverPreview.sourceCounts ||
                    {}
                  }
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-600">
                  Target Before
                </p>
                <CountGrid
                  counts={
                    rolloverPreview.targetCountsBefore ||
                    {}
                  }
                />
              </div>
              <div className="rounded-xl border border-amber-300 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase text-amber-300">
                  Result
                </p>
                <CountGrid
                  counts={
                    rolloverPreview.copiedCounts ||
                    rolloverPreview.targetCountsAfter ||
                    {}
                  }
                  dark
                />
              </div>
              {!!rolloverPreview.validationErrors?.length && (
                <div className="xl:col-span-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
                  {rolloverPreview.validationErrors.map(
                    (
                      error: string,
                      index: number
                    ) => (
                      <p key={index}>
                        {error}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">
                  Student Candidates
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Select any two filters to load eligible students.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={buttonClass}
                  disabled={
                    !students.length
                  }
                  onClick={selectAllVisible}
                >
                  Select Visible
                </button>
                <button
                  className={buttonClass}
                  disabled={
                    !candidatesReady ||
                    !filters.to_class_id
                  }
                  onClick={createWorkflow}
                >
                  Preview Promotion
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              {selectedWithPendingBacklogs.length ? (
                <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                  {selectedWithPendingBacklogs.length} selected student{selectedWithPendingBacklogs.length === 1 ? "" : "s"} have uncleared backlogs. Promotion can continue, but please review backlog status before executing.
                </div>
              ) : null}
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-slate-500">
                    <th className="py-3">
                      Select
                    </th>
                    <th>Admission No</th>
                    <th>Student</th>
                    <th>Current Class</th>
                    <th>Current Section</th>
                    <th>Academic Year</th>
                    <th>Status</th>
                    <th>Backlogs</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(
                    (student) => (
                      <tr
                        key={student.id}
                        className="border-b"
                      >
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(
                              Number(
                                student.id
                              )
                            )}
                            onChange={() =>
                              toggleStudent(
                                Number(
                                  student.id
                                )
                              )
                            }
                          />
                        </td>
                        <td className="font-semibold">
                          {student.admission_number ||
                            student.enrollment_number ||
                            "-"}
                        </td>
                        <td className="font-black text-slate-950">
                          {student.student_name ||
                            `Student ${student.id}`}
                        </td>
                        <td>
                          {student.class_name ||
                            "-"}
                        </td>
                        <td>
                          {student.section_name ||
                            "-"}
                        </td>
                        <td>
                          {student.academic_year ||
                            "-"}
                        </td>
                        <td>
                          {student.status ||
                            "ACTIVE"}
                        </td>
                        <td>
                          {Number(
                            student.pending_backlogs_count ||
                              0
                          ) > 0 ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
                              {student.pending_backlogs_count} Pending
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900">
                              Clear
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {!students.length && (
                <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                  {candidatesReady
                    ? "No students match the selected filters."
                    : "Select at least two filters to display students."}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
              Preview: {selectedCount || students.length} students will move to the target academic year. Selected rows are used first; if none are selected, the matching filter result is treated as a bulk promotion.
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black">
                Dropout Management
              </h2>
              <div className="mt-4 space-y-3">
                <SelectField
                  label="Student"
                  value={dropout.student_id}
                  onChange={(value) =>
                    setDropout({
                      ...dropout,
                      student_id: value,
                    })
                  }
                  options={students.map(
                    (student) => ({
                      value: student.id,
                      label:
                        student.student_name ||
                        `Student ${student.id}`,
                    })
                  )}
                />
                <SelectField
                  label="Category"
                  value={
                    dropout.dropout_category
                  }
                  onChange={(value) =>
                    setDropout({
                      ...dropout,
                      dropout_category:
                        value,
                    })
                  }
                  options={[
                    "TRANSFER",
                    "DISCONTINUED",
                    "FINANCIAL",
                    "MIGRATION",
                    "MEDICAL",
                    "OTHER",
                  ].map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
                <input
                  className={fieldClass}
                  type="date"
                  value={
                    dropout.dropout_date
                  }
                  onChange={(event) =>
                    setDropout({
                      ...dropout,
                      dropout_date:
                        event.target.value,
                    })
                  }
                />
                <textarea
                  className={fieldClass}
                  placeholder="Reason and remarks"
                  value={
                    dropout.dropout_reason
                  }
                  onChange={(event) =>
                    setDropout({
                      ...dropout,
                      dropout_reason:
                        event.target.value,
                    })
                  }
                />
                <button
                  className={buttonClass}
                  onClick={markDropout}
                >
                  Mark as Dropout
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    Teacher Academic-Year Rollover
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Move teachers from the source academic year into the target academic year while preserving old-year assignments and history.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
                  Selected: {teacherRollover.teacher_ids.length}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <SelectField
                  label="Action"
                  value={
                    teacherRollover.action
                  }
                  onChange={(value) =>
                    setTeacherRollover({
                      ...teacherRollover,
                      action: value,
                    })
                  }
                  options={[
                    {
                      value: "CONTINUE",
                      label:
                        "Continue into Target Year",
                    },
                    {
                      value: "TRANSFER",
                      label:
                        "Transfer into Target Year",
                    },
                    {
                      value: "DEACTIVATE",
                      label:
                        "Deactivate after Source Year",
                    },
                  ]}
                />
                <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 md:grid-cols-3">
                  <div>
                    <span className="block text-xs uppercase text-slate-500">
                      Teachers Available
                    </span>
                    <span className="text-lg text-slate-950">
                      {teachers.length}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-slate-500">
                      Source Assignments
                    </span>
                    <span className="text-lg text-slate-950">
                      {teachers.reduce(
                        (sum, teacher) =>
                          sum +
                          Number(
                            teacher.assignment_count ||
                              0
                          ),
                        0
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-slate-500">
                      Already in Target
                    </span>
                    <span className="text-lg text-slate-950">
                      {teachers.reduce(
                        (sum, teacher) =>
                          sum +
                          Number(
                            teacher.target_assignment_count ||
                              0
                          ),
                        0
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-800"
                    onClick={selectAllTeachers}
                    disabled={!teachers.length}
                  >
                    Select All Teachers
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-800"
                    onClick={clearTeacherSelection}
                    disabled={
                      !teacherRollover.teacher_ids.length
                    }
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 p-3">
                  {teachers.map(
                    (teacher) => (
                      <label
                        key={teacher.id}
                        className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm font-bold"
                      >
                        <span>
                          {teacher.teacher_name ||
                            `Teacher ${teacher.id}`}
                          <span className="block text-xs text-slate-500">
                            Current year: {teacher.current_academic_year || "Unassigned"}
                          </span>
                          <span className="block text-xs text-slate-500">
                            Source assignments: {teacher.assignment_count || 0} | Target assignments: {teacher.target_assignment_count || 0}
                          </span>
                          {teacher.last_rollover_at ? (
                            <span className="block text-xs text-amber-700">
                              Last rollover: {teacher.last_rollover_action || "-"} on {new Date(teacher.last_rollover_at).toLocaleDateString()}
                            </span>
                          ) : null}
                          {teacher.department ||
                          teacher.designation ? (
                            <span className="block text-xs text-slate-500">
                              {[teacher.department, teacher.designation].filter(Boolean).join(" / ")}
                            </span>
                          ) : null}
                        </span>
                        <input
                          type="checkbox"
                          checked={teacherRollover.teacher_ids.includes(
                            teacher.id
                          )}
                          onChange={() =>
                            setTeacherRollover(
                              (current) => ({
                                ...current,
                                teacher_ids:
                                  current.teacher_ids.includes(
                                    teacher.id
                                  )
                                    ? current.teacher_ids.filter(
                                        (id) =>
                                          id !==
                                          teacher.id
                                      )
                                    : [
                                        ...current.teacher_ids,
                                        teacher.id,
                                      ],
                              })
                            )
                          }
                        />
                      </label>
                    )
                  )}
                  {!teachers.length && (
                    <p className="text-sm font-semibold text-slate-500">
                      No teachers match the selected school/college/year.
                    </p>
                  )}
                </div>
                <button
                  className={buttonClass}
                  onClick={runTeacherRollover}
                >
                  Run Teacher Rollover
                </button>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-black text-slate-950">
                    Recent Teacher Rollovers
                  </p>
                  <div className="mt-2 max-h-44 overflow-y-auto space-y-2">
                    {teacherRolloverHistory.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm"
                        >
                          <span className="block text-sm font-black text-slate-950">
                            {item.teacher_name || `Teacher ${item.id}`} - {item.action || "-"}
                          </span>
                          <span>
                            {item.source_academic_year || "-"} to {item.target_academic_year || "-"} | Source assignments: {item.source_assignment_count || 0} | Target assignments: {item.target_assignment_count || 0}
                          </span>
                        </div>
                      )
                    )}
                    {!teacherRolloverHistory.length ? (
                      <p className="text-sm font-semibold text-slate-500">
                        No teacher rollover history for this school/college/year pair yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">
            Promotion Workflows
          </h2>
          <div className="mt-4 grid gap-3">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Workflow #{workflow.id} - {workflow.approval_status}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {workflow.source_academic_year || "-"} to {workflow.target_academic_year || "-"} | Students: {workflow.student_count || 0}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={buttonClass}
                    disabled={
                      workflow.approval_status !==
                      "PENDING"
                    }
                    onClick={() =>
                      approveWorkflow(
                        workflow.id
                      )
                    }
                  >
                    Approve
                  </button>
                  <button
                    className={buttonClass}
                    disabled={
                      workflow.approval_status !==
                      "APPROVED"
                    }
                    onClick={() =>
                      executeWorkflow(
                        workflow.id
                      )
                    }
                  >
                    Execute
                  </button>
                </div>
              </div>
            ))}
            {!workflows.length && (
              <div className="rounded-xl bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                No promotion workflows yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                Academic Year Closure
              </p>
              <h2 className="text-2xl font-black">
                Rollover History and Rollback
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Copy the next year setup, then reverse an executed rollover if the new year needs to be rebuilt.
              </p>
            </div>
            <button
              className={buttonClass}
              disabled={rolloverBusy || rollbackBusy}
              onClick={() =>
                runAcademicYearRollover("PREVIEW")
              }
            >
              Preview Closure
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Kpi
              label="Executed Rollovers"
              value={academicYearRollovers.filter(
                (item) =>
                  String(item.status || "").toUpperCase() ===
                  "EXECUTED"
              ).length}
            />
            <Kpi
              label="Rolled Back"
              value={academicYearRollovers.filter(
                (item) =>
                  String(item.status || "").toUpperCase() ===
                  "ROLLED_BACK"
              ).length}
            />
            <Kpi
              label="Preview Ready"
              value={rolloverPreview?.canExecute ? "Yes" : "No"}
            />
          </div>

          <div className="mt-4 space-y-3">
            {academicYearRollovers.map((rollover) => (
              <div
                key={rollover.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Rollover #{rollover.id} - {rollover.status || "-"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {rollover.school_name || "School/College"} | {rollover.source_academic_year || "-"} → {rollover.target_academic_year || "-"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {rollover.executed_at
                      ? `Executed: ${new Date(
                          rollover.executed_at
                        ).toLocaleString()}`
                      : `Created: ${new Date(
                          rollover.created_at || ""
                        ).toLocaleString()}`}
                  </p>
                </div>
                <button
                  className={buttonClass}
                  disabled={
                    rollbackBusy ||
                    String(rollover.status || "").toUpperCase() !==
                      "EXECUTED"
                  }
                  onClick={() =>
                    rollbackAcademicYearRollover(
                      rollover.id
                    )
                  }
                >
                  Rollback
                </button>
              </div>
            ))}
            {!academicYearRollovers.length && (
              <div className="rounded-xl bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                No academic year closures have been executed yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: number | string;
    label: string;
  }>;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">
        {label}
      </span>
      <select
        className={fieldClass}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="">
          Select {label}
        </option>
        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-4xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function CountGrid({
  counts,
  dark = false,
}: {
  counts: Record<string, number>;
  dark?: boolean;
}) {
  const entries =
    Object.entries(counts || {}).filter(
      ([, value]) =>
        typeof value === "number"
    );

  if (!entries.length) {
    return (
      <p
        className={
          dark
            ? "mt-3 text-sm font-bold text-white/80"
            : "mt-3 text-sm font-bold text-slate-600"
        }
      >
        No counts available yet.
      </p>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className={
            dark
              ? "rounded-lg bg-white/10 p-2"
              : "rounded-lg bg-white/80 p-2"
          }
        >
          <p
            className={
              dark
                ? "text-[10px] font-black uppercase text-amber-200"
                : "text-[10px] font-black uppercase text-slate-500"
            }
          >
            {key
              .replace(
                /([A-Z])/g,
                " $1"
              )
              .replace(/_/g, " ")}
          </p>
          <p
            className={
              dark
                ? "text-lg font-black text-white"
                : "text-lg font-black text-slate-950"
            }
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
