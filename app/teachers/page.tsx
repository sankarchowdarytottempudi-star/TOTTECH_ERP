"use client";

import {
  Edit,
  Eye,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import { useLanguage } from "@/components/LanguageProvider";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";
import { translateLabel } from "@/lib/i18n";

type Teacher = {
  id: number;
  employee_id?: string | null;
  staff_type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  department?: string | null;
  designation?: string | null;
  subject_specialization?: string | null;
  classes_handling?: any[] | null;
  sections_handling?: any[] | null;
  phone?: string | null;
  email?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  selected_academic_year?: string | null;
  performance_percent?: number | string | null;
  attendance_percent?: number | string | null;
  homework_completion_percent?: number | string | null;
  exam_performance_percent?: number | string | null;
  student_outcome_percent?: number | string | null;
};

type Address = {
  house_number: string;
  street: string;
  area: string;
  village_city: string;
  mandal: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
};

type EmploymentEntry = {
  previous_school_name: string;
  school_address: string;
  school_type: string;
  board: string;
  designation: string;
  subject_handled: string;
  joining_date: string;
  relieving_date: string;
  reason_for_leaving: string;
};

type SalaryHistory = {
  previous_gross_salary: string;
  previous_net_salary: string;
  last_drawn_salary: string;
};

type DocumentUploads = {
  resume: string;
  experience_certificates: string;
  relieving_letter: string;
  previous_pay_slip: string;
  aadhaar: string;
  pan: string;
  qualification_certificates: string;
  tet_certificates: string;
};

type QualificationEntry = {
  qualification: string;
  specialization: string;
  university: string;
  college: string;
  board_university_type: string;
  year_of_passing: string;
  percentage_cgpa: string;
  grade: string;
  certificate_upload: string;
};

type CertificationEntry = {
  certification_name: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  certificate_upload: string;
};

type TeacherNoteEntry = {
  note_type: string;
  note_date: string;
  added_by: string;
  visibility: string;
  notes: string;
};

type PerformanceNotes = {
  achievements: string;
  awards: string;
  parent_feedback: string;
  improvement_areas: string;
  disciplinary_notes: string;
};

const emptyAddress = (): Address => ({
  house_number: "",
  street: "",
  area: "",
  village_city: "",
  mandal: "",
  district: "",
  state: "",
  country: "India",
  pincode: "",
});

const emptyEmploymentEntry = (): EmploymentEntry => ({
  previous_school_name: "",
  school_address: "",
  school_type: "",
  board: "",
  designation: "",
  subject_handled: "",
  joining_date: "",
  relieving_date: "",
  reason_for_leaving: "",
});

const emptySalaryHistory = (): SalaryHistory => ({
  previous_gross_salary: "",
  previous_net_salary: "",
  last_drawn_salary: "",
});

const emptyDocuments = (): DocumentUploads => ({
  resume: "",
  experience_certificates: "",
  relieving_letter: "",
  previous_pay_slip: "",
  aadhaar: "",
  pan: "",
  qualification_certificates: "",
  tet_certificates: "",
});

const emptyQualification = (): QualificationEntry => ({
  qualification: "",
  specialization: "",
  university: "",
  college: "",
  board_university_type: "",
  year_of_passing: "",
  percentage_cgpa: "",
  grade: "",
  certificate_upload: "",
});

const emptyCertification = (): CertificationEntry => ({
  certification_name: "",
  issuing_authority: "",
  issue_date: "",
  expiry_date: "",
  certificate_upload: "",
});

const emptyTeacherNote = (): TeacherNoteEntry => ({
  note_type: "PRIVATE",
  note_date: "",
  added_by: "",
  visibility: "PRIVATE",
  notes: "",
});

const emptyPerformanceNotes = (): PerformanceNotes => ({
  achievements: "",
  awards: "",
  parent_feedback: "",
  improvement_areas: "",
  disciplinary_notes: "",
});

const initialTeacher = {
  employee_id: "",
  staff_type: "Teaching",
  first_name: "",
  last_name: "",
  phone: "",
  whatsapp_number: "",
  alternative_mobile: "",
  emergency_contact_number: "",
  emergency_contact_person: "",
  relationship: "",
  email: "",
  department: "",
  designation: "",
  subject_specialization: "",
  qualification: "",
  experience_years: "",
  class_id: "",
  section_id: "",
  subject_id: "",
  assignment_type: "CLASS_TEACHER",
  current_address: emptyAddress(),
  permanent_address: emptyAddress(),
  same_as_current_address: false,
  classes_handling: [] as string[],
  sections_handling: [] as string[],
  employment_history: [emptyEmploymentEntry()],
  salary_history: emptySalaryHistory(),
  documents: emptyDocuments(),
  qualifications: [emptyQualification()],
  certifications: [emptyCertification()],
  teacher_notes: [emptyTeacherNote()],
  performance_notes: emptyPerformanceNotes(),
};

const profileFields = [
  "employee_id",
  "staff_type",
  "first_name",
  "last_name",
  "phone",
  "whatsapp_number",
  "alternative_mobile",
  "emergency_contact_number",
  "emergency_contact_person",
  "relationship",
  "email",
  "qualification",
  "experience_years",
] as const;

const requiredProfileFields = new Set([
  "first_name",
  "last_name",
  "phone",
  "email",
  "staff_type",
]);

const fullName = (teacher: Teacher) =>
  [
    teacher.first_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Unnamed Teacher";

const percentValue = (
  value?: number | string | null
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(
        0,
        Math.min(100, Math.round(parsed))
      )
    : 0;
};

const teacherPerformanceSummary = (
  teacher: Teacher
) => {
  const performance =
    percentValue(
      teacher.performance_percent
    ) ||
    Math.round(
      percentValue(
        teacher.attendance_percent
      ) * 0.3 +
        percentValue(
          teacher.homework_completion_percent
        ) * 0.3 +
        percentValue(
          teacher.exam_performance_percent
        ) * 0.2 +
        percentValue(
          teacher.student_outcome_percent
        ) * 0.2
    );

  return {
    performance,
    attendance: percentValue(
      teacher.attendance_percent
    ),
    homework: percentValue(
      teacher.homework_completion_percent
    ),
    results: percentValue(
      teacher.exam_performance_percent ||
        teacher.student_outcome_percent
    ),
  };
};

const addressFields = [
  "house_number",
  "street",
  "area",
  "village_city",
  "mandal",
  "district",
  "state",
  "country",
  "pincode",
] as const;

const documentFields = [
  ["resume", "Resume"],
  ["experience_certificates", "Experience Certificates"],
  ["relieving_letter", "Relieving Letter"],
  ["previous_pay_slip", "Previous Pay Slip"],
  ["aadhaar", "Aadhaar"],
  ["pan", "PAN"],
  ["qualification_certificates", "Qualification Certificates"],
  ["tet_certificates", "TET Certificates"],
] as const;

const qualificationFields = [
  "qualification",
  "specialization",
  "university",
  "college",
  "board_university_type",
  "year_of_passing",
  "percentage_cgpa",
  "grade",
  "certificate_upload",
] as const;

const certificationFields = [
  "certification_name",
  "issuing_authority",
  "issue_date",
  "expiry_date",
  "certificate_upload",
] as const;

const teacherNoteFields = [
  "note_type",
  "note_date",
  "added_by",
  "visibility",
  "notes",
] as const;

const performanceNoteFields = [
  "achievements",
  "awards",
  "parent_feedback",
  "improvement_areas",
  "disciplinary_notes",
] as const;

const staffTypeOptions = [
  "Teaching",
  "Non-Teaching",
] as const;

const teachingDesignations = [
  "Principal",
  "Vice Principal",
  "Head Master",
  "Teacher",
  "Senior Teacher",
  "Lecturer",
  "PET",
  "Music Teacher",
  "Dance Teacher",
  "Drawing Teacher",
  "Computer Teacher",
];

const nonTeachingDepartments = [
  "Administration",
  "Finance",
  "Transport",
  "Hostel",
  "Dining",
  "Library",
  "IT",
  "Security",
  "Maintenance",
];

const nonTeachingDesignations = [
  "Accountant",
  "Receptionist",
  "Clerk",
  "Librarian",
  "Lab Assistant",
  "Bus Driver",
  "Bus Attender",
  "Hostel Warden",
  "Assistant Warden",
  "Dining Manager",
  "Security Guard",
  "IT Administrator",
  "School/College Incharge",
  "Academic Incharge",
  "Transport Incharge",
  "Hostel Incharge",
  "Dining Incharge",
  "Operations Incharge",
];

const subjectSpecializations = [
  "Telugu",
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Economics",
  "Computer Science",
];

const fileFieldGroups = [
  "documents",
  "qualifications",
  "certifications",
] as const;

function formToPayload(form: typeof initialTeacher) {
  return {
    ...form,
    current_address: form.current_address,
    permanent_address: form.permanent_address,
    classes_handling: form.classes_handling,
    sections_handling: form.sections_handling,
    employment_history: form.employment_history,
    salary_history: form.salary_history,
    documents: form.documents,
    qualifications: form.qualifications,
    certifications: form.certifications,
    teacher_notes: form.teacher_notes,
    performance_notes: form.performance_notes,
  };
}

export default function TeachersPage() {
  const { language } = useLanguage();
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);
  const [search, setSearch] =
    useState("");
  const [showCreate, setShowCreate] =
    useState(false);
  const [form, setForm] =
    useState(initialTeacher);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [subjects, setSubjects] =
    useState<any[]>([]);
  const [filters, setFilters] =
    useState({
      staff_type: "",
      class_id: "",
      section_id: "",
      subject_id: "",
    });
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (
    nextFilters = filters
  ) => {
    try {
      setLoading(true);
      const teacherQuery =
        new URLSearchParams();
      Object.entries(nextFilters).forEach(
        ([key, value]) => {
          if (value) {
            teacherQuery.set(key, value);
          }
        }
      );
      const [rows, roster] =
        await Promise.all([
          apiJson<Teacher[]>(
            `/api/teachers${teacherQuery.toString() ? `?${teacherQuery.toString()}` : ""}`
          ),
          apiJson<any>("/api/roster"),
        ]);
      setTeachers(
        Array.isArray(rows) ? rows : []
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
      setSubjects(
        Array.isArray(roster.subjects)
          ? roster.subjects
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load teachers"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const createTeacher = async () => {
    try {
      setSaving(true);
      const payload = formToPayload(form);
      const data = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (
          key === "documents" ||
          key === "current_address" ||
          key === "permanent_address" ||
          key === "employment_history" ||
          key === "salary_history" ||
          key === "qualifications" ||
          key === "certifications" ||
          key === "teacher_notes" ||
          key === "performance_notes"
        ) {
          data.append(key, JSON.stringify(value));
          return;
        }

        if (typeof value === "boolean") {
          data.append(key, value ? "true" : "false");
          return;
        }

        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
          return;
        }

        data.append(key, String(value ?? ""));
      });

      Object.entries(payload.documents || {}).forEach(
        ([key, value]) => {
          const fileInput = document.querySelector<HTMLInputElement>(
            `input[name="${key}"]`
          );
          const file = fileInput?.files?.[0];
          if (file) {
            data.append(key, file);
          } else if (typeof value === "string" && value) {
            data.append(`${key}_existing`, value);
          }
        }
      );

      ["qualifications", "certifications"].forEach((group) => {
        const inputs = Array.from(
          document.querySelectorAll<HTMLInputElement>(
            `input[type="file"][data-teacher-group="${group}"]`
          )
        );
        inputs.forEach((input) => {
          const file = input.files?.[0];
          if (file) {
            data.append(input.name || group, file);
          }
        });
      });

      await apiJson("/api/teachers", {
        method: "POST",
        body: data,
      });

      notify.success(
        tt("teacherSaved", "Teacher saved")
      );
      setForm(initialTeacher);
      setShowCreate(false);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save teacher"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteTeacher = async (
    teacher: Teacher
  ) => {
    if (
      !confirm(
        `${tt("delete", "Delete")} ${fullName(teacher)} permanently? This will remove the teacher from the database.`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/teachers/${teacher.id}`,
        {
          method: "DELETE",
        }
      );

      notify.success(
        tt("teacherDeleted", "Teacher deleted from database")
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete teacher"
        )
      );
    }
  };

  const filtered = useMemo(
    () =>
      teachers.filter((teacher) => {
        const text = `
          ${teacher.employee_id || ""}
          ${teacher.staff_type || ""}
          ${fullName(teacher)}
          ${teacher.phone || ""}
          ${teacher.email || ""}
          ${teacher.department || ""}
          ${teacher.designation || ""}
          ${teacher.class_name || ""}
          ${teacher.section_name || ""}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );
      }),
    [teachers, search]
  );

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );
  const filteredFilterSections =
    sections.filter(
      (section) =>
        !filters.class_id ||
        Number(section.class_id) ===
          Number(filters.class_id)
    );

  const tt = (key: string, fallback: string) =>
    translateLabel(language, key, fallback);

  return (
    <Layout>
      <div className="space-y-6">
        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="min-w-0">
            <h1 className="text-3xl font-black md:text-4xl">
              {tt("teachers", "Teachers")}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {tt("facultyManagementCenter", "Faculty Management Center")}
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreate(
                (value) => !value
              )
            }
            className="tt-button inline-flex items-center justify-center gap-2"
          >
            <Plus size={17} />
            {tt("addTeacher", "Add Teacher")}
          </button>
        </div>

        {showCreate && (
          <div className="tt-card tt-card-pad">
            <h2 className="mb-4 text-xl font-black">
              {tt("createTeacher", "Create Teacher")}
            </h2>
            <div
              className="
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-4
              "
            >
              {profileFields.map((key) => (
                <label
                  key={key}
                  className="min-w-0"
                >
                  <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                    {key.replaceAll(
                      "_",
                      " "
                    )}
                    {requiredProfileFields.has(key) ? " *" : ""}
                  </span>
                  <input
                    className="input"
                    value={String(form[key as keyof typeof form] ?? "")}
                    onChange={(event) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          [key]:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </label>
              ))}
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {tt("staffType", "Staff Type")}
                </span>
                <select
                  className="input"
                  value={form.staff_type}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      staff_type: event.target.value,
                      department:
                        event.target.value === "Teaching"
                          ? ""
                          : previous.department,
                      designation: "",
                      subject_specialization:
                        event.target.value === "Teaching"
                          ? previous.subject_specialization
                          : "",
                      classes_handling: event.target.value === "Teaching" ? previous.classes_handling : [],
                      sections_handling: event.target.value === "Teaching" ? previous.sections_handling : [],
                    }))
                  }
                >
                  {staffTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {tt(option === "Teaching" ? "teaching" : "nonTeaching", option)}
                    </option>
                  ))}
                </select>
              </label>
              {form.staff_type === "Teaching" ? (
                <>
                  <label className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("designation", "Designation")}
                    </span>
                    <select
                      className="input"
                      value={form.designation}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          designation: event.target.value,
                        }))
                      }
                    >
                      <option value="">{tt("selectDesignation", "Select Designation")}</option>
                      {teachingDesignations.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-0 md:col-span-2 xl:col-span-2">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("subjectSpecialization", "Subject Specialization")}
                    </span>
                    <select
                      className="input min-h-[140px]"
                      multiple
                      value={(form.subject_specialization || "").split(",").filter(Boolean)}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          subject_specialization: Array.from(event.target.selectedOptions).map((option) => option.value).join(", "),
                        }))
                      }
                    >
                      {subjectSpecializations.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("classesHandling", "Classes Handling")}
                    </span>
                    <select
                      className="input min-h-[140px]"
                      multiple
                      value={form.classes_handling}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          classes_handling: Array.from(event.target.selectedOptions).map((option) => option.value),
                        }))
                      }
                    >
                      {classes.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {item.class_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("sectionsHandling", "Sections Handling")}
                    </span>
                    <select
                      className="input min-h-[140px]"
                      multiple
                      value={form.sections_handling}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          sections_handling: Array.from(event.target.selectedOptions).map((option) => option.value),
                        }))
                      }
                    >
                      {sections
                        .filter((section) => !form.class_id || Number(section.class_id) === Number(form.class_id))
                        .map((item) => (
                          <option key={item.id} value={String(item.id)}>
                            {item.section_name}
                          </option>
                        ))}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("department", "Department")}
                    </span>
                    <select
                      className="input"
                      value={form.department}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          department: event.target.value,
                        }))
                      }
                    >
                      <option value="">{tt("selectDepartment", "Select Department")}</option>
                      {nonTeachingDepartments.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {tt("designation", "Designation")}
                    </span>
                    <select
                      className="input"
                      value={form.designation}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          designation: event.target.value,
                        }))
                      }
                    >
                      <option value="">{tt("selectDesignation", "Select Designation")}</option>
                      {nonTeachingDesignations.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {tt("class", "Class")}
                </span>
                <select
                  className="input"
                  value={form.class_id}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        class_id:
                          event.target.value,
                        section_id: "",
                      })
                    )
                  }
                >
                  <option value="">
                    {tt("selectClass", "Select Class")}
                  </option>
                  {classes.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {tt("subject", "Subject")}
                </span>
                <select
                  className="input"
                  value={form.subject_id}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        subject_id:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="">
                    {tt("selectSubject", "Select Subject")}
                  </option>
                  {subjects.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.subject_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {tt("section", "Section")}
                </span>
                <select
                  className="input"
                  value={form.section_id}
                  disabled={!form.class_id}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        section_id:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="">
                    {tt("selectSection", "Select Section")}
                  </option>
                  {filteredSections.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.section_name}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {tt("assignmentType", "Assignment Type")}
                </span>
                <select
                  className="input"
                  value={
                    form.assignment_type
                  }
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        assignment_type:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="CLASS_TEACHER">
                    {tt("classTeacher", "Class Teacher")}
                  </option>
                  <option value="SUBJECT_TEACHER">
                    {tt("subjectTeacher", "Subject Teacher")}
                  </option>
                  <option value="MENTOR">
                    {tt("mentor", "Mentor")}
                  </option>
                  <option value="SUPERVISOR">
                    {tt("supervisor", "Supervisor")}
                  </option>
                </select>
              </label>
            </div>
            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-black text-slate-950">
                {tt("currentAddressOptional", "Current Address (Optional)")}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {addressFields.map((field) => (
                  <label key={`current-${field}`} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <input
                      className="input"
                      value={form.current_address[field]}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          current_address: {
                            ...previous.current_address,
                            [field]: event.target.value,
                          },
                          permanent_address: previous.same_as_current_address
                            ? {
                                ...previous.current_address,
                                [field]: event.target.value,
                              }
                            : previous.permanent_address,
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">
                  {tt("permanentAddressOptional", "Permanent Address (Optional)")}
                </h3>
                <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.same_as_current_address}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        same_as_current_address: event.target.checked,
                        permanent_address: event.target.checked
                          ? { ...previous.current_address }
                          : previous.permanent_address,
                      }))
                    }
                  />
                  {tt("sameAsCurrentAddress", "Same As Current Address")}
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {addressFields.map((field) => (
                  <label key={`permanent-${field}`} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <input
                      className="input"
                      value={form.permanent_address[field]}
                      disabled={form.same_as_current_address}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          permanent_address: {
                            ...previous.permanent_address,
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">
                  {tt("employmentHistoryOptional", "Employment History (Optional)")}
                </h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      employment_history: [
                        ...previous.employment_history,
                        emptyEmploymentEntry(),
                      ],
                    }))
                  }
                >
                  {tt("addHistory", "Add History")}
                </button>
              </div>
              <div className="space-y-4">
                {form.employment_history.map((entry, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-bold text-slate-950">{tt("previousSchoolCollege", "Previous School/College")} {index + 1}</p>
                      {form.employment_history.length > 1 ? (
                        <button
                          type="button"
                          className="text-sm font-bold text-red-700"
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              employment_history: previous.employment_history.filter((_, itemIndex) => itemIndex !== index),
                            }))
                          }
                        >
                          {tt("remove", "Remove")}
                        </button>
                      ) : null}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {Object.keys(entry).map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                            {field.replaceAll("_", " ")}
                          </span>
                          <input
                            className="input"
                            value={entry[field as keyof EmploymentEntry]}
                            onChange={(event) =>
                              setForm((previous) => ({
                                ...previous,
                                employment_history: previous.employment_history.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        [field]: event.target.value,
                                      }
                                    : item
                                ),
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-black text-slate-950">
                {tt("salaryHistoryOptional", "Salary History (Optional)")}
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.keys(form.salary_history).map((field) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <input
                      className="input"
                      value={form.salary_history[field as keyof SalaryHistory]}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          salary_history: {
                            ...previous.salary_history,
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500">
                {tt("salaryHistoryVisibility", "Salary history is visible only to OWNER, SUPER ADMIN, and HR.")}
              </p>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">{tt("educationalQualificationsOptional", "Educational Qualifications (Optional)")}</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      qualifications: [...previous.qualifications, emptyQualification()],
                    }))
                  }
                >
                  {tt("addQualification", "Add Qualification")}
                </button>
              </div>
              <div className="space-y-4">
                {form.qualifications.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {qualificationFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                            {field.replaceAll("_", " ")}
                          </span>
                          {field === "certificate_upload" ? (
                            <input
                              type="file"
                              name={`qualification_${index}_certificate_upload`}
                              data-teacher-group="qualifications"
                              className="input"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                setForm((previous) => ({
                                  ...previous,
                                  qualifications: previous.qualifications.map((row, rowIndex) =>
                                    rowIndex === index
                                      ? { ...row, certificate_upload: file ? file.name : "" }
                                      : row
                                  ),
                                }));
                              }}
                            />
                          ) : (
                            <input
                              className="input"
                              value={item[field as keyof QualificationEntry]}
                              onChange={(event) =>
                                setForm((previous) => ({
                                  ...previous,
                                  qualifications: previous.qualifications.map((row, rowIndex) =>
                                    rowIndex === index
                                      ? { ...row, [field]: event.target.value }
                                      : row
                                  ),
                                }))
                              }
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">{tt("professionalCertificationsOptional", "Professional Certifications (Optional)")}</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      certifications: [...previous.certifications, emptyCertification()],
                    }))
                  }
                >
                  {tt("addCertification", "Add Certification")}
                </button>
              </div>
              <div className="space-y-4">
                {form.certifications.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {certificationFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                            {field.replaceAll("_", " ")}
                          </span>
                          {field === "certificate_upload" ? (
                            <input
                              type="file"
                              name={`certification_${index}_certificate_upload`}
                              data-teacher-group="certifications"
                              className="input"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                setForm((previous) => ({
                                  ...previous,
                                  certifications: previous.certifications.map((row, rowIndex) =>
                                    rowIndex === index
                                      ? { ...row, certificate_upload: file ? file.name : "" }
                                      : row
                                  ),
                                }));
                              }}
                            />
                          ) : (
                            <input
                              className="input"
                              value={item[field as keyof CertificationEntry]}
                              onChange={(event) =>
                                setForm((previous) => ({
                                  ...previous,
                                  certifications: previous.certifications.map((row, rowIndex) =>
                                    rowIndex === index
                                      ? { ...row, [field]: event.target.value }
                                      : row
                                  ),
                                }))
                              }
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">{tt("teacherNotesOptional", "Teacher Notes (Optional)")}</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      teacher_notes: [...previous.teacher_notes, emptyTeacherNote()],
                    }))
                  }
                >
                  {tt("addNote", "Add Note")}
                </button>
              </div>
              <div className="space-y-4">
                {form.teacher_notes.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {teacherNoteFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                            {field.replaceAll("_", " ")}
                          </span>
                          <textarea
                            className="input min-h-[96px]"
                            value={item[field as keyof TeacherNoteEntry]}
                            onChange={(event) =>
                              setForm((previous) => ({
                                ...previous,
                                teacher_notes: previous.teacher_notes.map((row, rowIndex) =>
                                  rowIndex === index
                                    ? { ...row, [field]: event.target.value }
                                    : row
                                ),
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-black text-slate-950">{tt("performanceNotesOptional", "Performance Notes (Optional)")}</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {performanceNoteFields.map((field) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <textarea
                      className="input min-h-[96px]"
                      value={form.performance_notes[field]}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          performance_notes: {
                            ...previous.performance_notes,
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-black text-slate-950">
                {tt("documentUploadsOptional", "Document Uploads (Optional)")}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {documentFields.map(([field, label]) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">
                      {label}
                    </span>
                    <input
                      type="file"
                      name={field}
                      className="input"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setForm((previous) => ({
                          ...previous,
                          documents: {
                            ...previous.documents,
                            [field]: file ? file.name : "",
                          },
                        }));
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={createTeacher}
              disabled={saving}
              className="tt-button mt-5"
            >
              {saving
                ? tt("saving", "Saving...")
                : tt("saveTeacher", "Save Teacher")}
            </button>
          </div>
        )}

        <div className="tt-card tt-card-pad space-y-4">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={tt("searchTeacher", "Search teacher, employee id, department, phone...")}
            className="input"
            />
          <div className="grid gap-3 md:grid-cols-4">
            <select
              className="input"
              value={filters.staff_type || ""}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  staff_type: event.target.value,
                }))
              }
            >
              <option value="">{tt("allStaffTypes", "All Staff Types")}</option>
              {staffTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={filters.class_id}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  class_id:
                    event.target.value,
                  section_id: "",
                }))
              }
            >
              <option value="">{tt("allClasses", "All Classes")}</option>
              {classes.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.class_name}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={filters.section_id}
              disabled={!filters.class_id}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  section_id:
                    event.target.value,
                }))
              }
            >
              <option value="">{tt("allSections", "All Sections")}</option>
              {filteredFilterSections.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.section_name}
                  </option>
                )
              )}
            </select>
            <select
              className="input"
              value={filters.subject_id}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  subject_id:
                    event.target.value,
                }))
              }
            >
              <option value="">{tt("allSubjects", "All Subjects")}</option>
              {subjects.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.subject_name}
                </option>
              ))}
            </select>
            <button
              className="tt-button"
              onClick={() =>
                loadData(filters)
              }
            >
              {tt("applyFilters", "Apply Filters")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="tt-card tt-card-pad">
            {tt("loadingTeachers", "Loading teachers...")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="tt-card tt-card-pad">
            {tt("noTeachersFound", "No teachers found for the selected school/college and academic year.")}
          </div>
        ) : (
          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {filtered.map((teacher) => (
              <article
                key={teacher.id}
                className="
                  tt-card
                  tt-card-pad
                  flex
                  min-h-[240px]
                  flex-col
                  justify-between
                  gap-5
                "
              >
                <div className="space-y-4">
                  {(() => {
                    const summary =
                      teacherPerformanceSummary(
                        teacher
                      );

                    return (
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                            {tt("performance", "Performance")}
                          </p>
                          <p className="text-2xl font-black text-slate-950">
                            {summary.performance}%
                          </p>
                        </div>
                        <div className="text-right text-[11px] font-bold text-slate-500">
                          <p>
                            {tt("attendance", "Attendance")} {summary.attendance}%
                          </p>
                          <p>
                            {tt("homework", "Homework")} {summary.homework}%
                          </p>
                          <p>
                            {tt("studentResults", "Student Results")} {summary.results}%
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className="
                        grid
                        h-11
                        w-11
                        shrink-0
                        place-items-center
                        rounded-lg
                        border
                        border-amber-300/70
                        bg-slate-950
                        shadow-sm
                        text-amber-100
                      "
                      aria-hidden="true"
                    >
                      <UserRound
                        size={20}
                        strokeWidth={2.4}
                        className="text-amber-100"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-950">
                        {fullName(teacher)}
                      </h2>
                      <p className="truncate text-sm font-semibold text-amber-700">
                        {teacher.employee_id ||
                          tt("noEmployeeId", "No employee ID")}
                      </p>
                      <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                        {teacher.staff_type || tt("teaching", "Teaching")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric
                      label={tt("performance", "Performance")}
                      value={
                        teacher.performance_percent
                      }
                    />
                    <Metric
                      label={tt("attendance", "Attendance")}
                      value={
                        teacher.attendance_percent
                      }
                    />
                    <Metric
                      label={tt("homework", "Homework")}
                      value={
                        teacher.homework_completion_percent
                      }
                    />
                    <Metric
                      label={tt("examOutcome", "Exam Outcome")}
                      value={
                        teacher.exam_performance_percent
                      }
                    />
                    <Info
                      label={tt("department", "Department")}
                      value={
                        teacher.department ||
                        "-"
                      }
                    />
                    <Info
                      label={tt("designation", "Designation")}
                      value={
                        teacher.designation ||
                        "-"
                      }
                    />
                    <Info
                      label={tt("academicYear", "Academic Year")}
                      value={
                        teacher.selected_academic_year ||
                        "Unassigned"
                      }
                    />
                    <Info
                      label={tt("class", "Class")}
                      value={
                        teacher.class_name ||
                        "-"
                      }
                    />
                    <Info
                      label={tt("section", "Section")}
                      value={
                        teacher.section_name ||
                        "-"
                      }
                    />
                    <Info
                      label={tt("email", "Email")}
                      value={
                        teacher.email || "-"
                      }
                    />
                  </div>

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                      rounded-lg
                      bg-slate-50
                      px-3
                      py-2
                      text-sm
                      text-slate-700
                    "
                  >
                    <Phone
                      size={15}
                      className="shrink-0"
                    />
                    <span className="truncate">
                      {teacher.phone ||
                        tt("noPhoneNumber", "No phone number")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <ActionLink
                    href={`/teachers/${teacher.id}`}
                    label={tt("view", "View")}
                    icon={<Eye size={15} />}
                  />
                  <ActionLink
                    href={`/teachers/edit/${teacher.id}`}
                    label={tt("edit", "Edit")}
                    icon={<Edit size={15} />}
                  />
                  <button
                    onClick={() =>
                      deleteTeacher(
                        teacher
                      )
                    }
                    className="
                      flex
                      min-w-0
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-3
                      py-2.5
                      text-sm
                      font-bold
                      text-red-700
                    "
                  >
                    <Trash2 size={15} />
                    <span className="truncate">
                      {tt("delete", "Delete")}
                    </span>
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
      <p className="text-xs font-bold uppercase text-slate-500">
        {label}
      </p>
      <p className="truncate font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value?: number | string | null;
}) {
  const number =
    Number(value ?? 0) || 0;

  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950">
        {number}%
      </p>
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
      className="
        flex
        min-w-0
        items-center
        justify-center
        gap-1.5
        rounded-lg
        bg-slate-950
        px-3
        py-2.5
        text-sm
        font-bold
        text-white
      "
    >
      {icon}
      <span className="truncate">
        {label}
      </span>
    </Link>
  );
}
