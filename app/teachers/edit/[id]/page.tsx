"use client";

import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type TeacherForm = {
  id?: number;
  employee_id?: string | null;
  staff_type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  alternative_mobile?: string | null;
  emergency_contact_number?: string | null;
  emergency_contact_person?: string | null;
  relationship?: string | null;
  email?: string | null;
  qualification?: string | null;
  experience_years?: number | string | null;
  joining_date?: string | null;
  department?: string | null;
  designation?: string | null;
  subject_specialization?: string | null;
  salary?: number | string | null;
  address?: string | null;
  class_id?: number | string | null;
  section_id?: number | string | null;
  assignment_type?: string | null;
  current_address?: Record<string, string>;
  permanent_address?: Record<string, string>;
  same_as_current_address?: boolean;
  classes_handling?: string[];
  sections_handling?: string[];
  employment_history?: Array<Record<string, string>>;
  salary_history?: Record<string, string>;
  documents?: Record<string, string>;
  qualifications?: Array<Record<string, string>>;
  certifications?: Array<Record<string, string>>;
  teacher_notes?: Array<Record<string, string>>;
  performance_notes?: Record<string, string>;
};

const fields: Array<
  keyof TeacherForm
> = [
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
  "salary",
  "address",
];

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

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] =
    useState<TeacherForm>({});
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const [data, roster] =
        await Promise.all([
          apiJson<any>(
            `/api/teachers/${params?.id}`
          ),
          apiJson<any>("/api/roster"),
        ]);

      const documentMap = Array.isArray(data.teacher?.documents)
        ? Object.fromEntries(
            (data.teacher.documents as Array<any>).map((item: any) => [
              item.type || item.label,
              item.url || item.name || "",
            ])
          )
        : data.teacher?.documents || {};

      setForm({
        ...data.teacher,
        staff_type: data.teacher?.staff_type || "Teaching",
        current_address:
          data.teacher?.current_address ||
          {},
        permanent_address:
          data.teacher?.permanent_address ||
          {},
        same_as_current_address:
          false,
        employment_history:
          Array.isArray(
            data.teacher?.employment_history
          ) &&
          data.teacher?.employment_history.length
            ? data.teacher.employment_history
            : [{}],
        salary_history:
          data.teacher?.salary_history ||
          {},
        documents: documentMap,
        qualifications:
          Array.isArray(data.teacher?.qualifications) &&
          data.teacher.qualifications.length
            ? data.teacher.qualifications
            : [{}],
        certifications:
          Array.isArray(data.teacher?.certifications) &&
          data.teacher.certifications.length
            ? data.teacher.certifications
            : [{}],
        teacher_notes:
          Array.isArray(data.teacher?.teacher_notes) &&
          data.teacher.teacher_notes.length
            ? data.teacher.teacher_notes
            : [{}],
        performance_notes:
          data.teacher?.performance_notes ||
          {},
        classes_handling:
          Array.isArray(data.teacher?.classes_handling)
            ? data.teacher.classes_handling
            : [],
        sections_handling:
          Array.isArray(data.teacher?.sections_handling)
            ? data.teacher.sections_handling
            : [],
      });
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
          "Failed to load teacher"
        )
      );
    }
  };

  const updateTeacher = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          key === "current_address" ||
          key === "permanent_address" ||
          key === "employment_history" ||
          key === "salary_history" ||
          key === "documents" ||
          key === "qualifications" ||
          key === "certifications" ||
          key === "teacher_notes" ||
          key === "performance_notes"
        ) {
          data.append(key, JSON.stringify(value || {}));
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

      Object.entries(form.documents || {}).forEach(([key, value]) => {
        const fileInput = document.querySelector<HTMLInputElement>(
          `input[name="${key}"]`
        );
        const file = fileInput?.files?.[0];
        if (file) {
          data.append(key, file);
        } else if (value) {
          data.append(`${key}_existing`, value);
        }
      });

      ["qualifications", "certifications", "teacher_notes"].forEach((key) => {
        const inputs = Array.from(
          document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            `[data-teacher-field="${key}"]`
          )
        );
        inputs.forEach((input) => {
          if ((input as HTMLInputElement).files?.length) {
            const file = (input as HTMLInputElement).files?.[0];
            if (file) {
              data.append(input.name, file);
            }
          }
        });
      });

      await apiJson(`/api/teachers/${params?.id}`, {
        method: "PUT",
        body: data,
      });

      notify.success(
        "Teacher updated"
      );
      router.push("/teachers");
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update teacher"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Edit Teacher
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Update faculty profile data for the selected school/college and academic year.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {fields.map((field) => (
              <label
                key={field}
                className="min-w-0"
              >
                <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                  {field.replaceAll(
                    "_",
                    " "
                  )}
                </span>
                <input
                  className="input"
                  value={String(form[field] ?? "")}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        [field]:
                          event.target.value,
                      })
                    )
                  }
                  />
              </label>
            ))}
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Staff Type
              </span>
              <select
                className="input"
                value={form.staff_type || "Teaching"}
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
                    classes_handling:
                      event.target.value === "Teaching"
                        ? previous.classes_handling || []
                        : [],
                    sections_handling:
                      event.target.value === "Teaching"
                        ? previous.sections_handling || []
                        : [],
                  }))
                }
              >
                {staffTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {String(form.staff_type || "Teaching") === "Teaching" ? (
              <>
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Designation
                  </span>
                  <select
                    className="input"
                    value={form.designation || ""}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        designation: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select Designation</option>
                    {teachingDesignations.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0 xl:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Subject Specialization
                  </span>
                  <select
                    className="input min-h-[140px]"
                    multiple
                    value={(form.subject_specialization || "").split(",").map((item) => item.trim()).filter(Boolean)}
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
                    Classes Handling
                  </span>
                  <select
                    className="input min-h-[140px]"
                    multiple
                    value={form.classes_handling || []}
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
                    Sections Handling
                  </span>
                  <select
                    className="input min-h-[140px]"
                    multiple
                    value={form.sections_handling || []}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        sections_handling: Array.from(event.target.selectedOptions).map((option) => option.value),
                      }))
                    }
                  >
                    {filteredSections.map((item) => (
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
                    Department
                  </span>
                  <select
                    className="input"
                    value={form.department || ""}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        department: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select Department</option>
                    {nonTeachingDepartments.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Designation
                  </span>
                  <select
                    className="input"
                    value={form.designation || ""}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        designation: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select Designation</option>
                    {nonTeachingDesignations.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h3 className="text-lg font-black text-slate-950">Current Address (Optional)</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {addressFields.map((field) => (
                  <label key={`current-${field}`} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <input
                      className="input"
                      value={form.current_address?.[field] || ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          current_address: {
                            ...(previous.current_address || {}),
                            [field]: event.target.value,
                          },
                          permanent_address:
                            previous.same_as_current_address
                              ? {
                                  ...(previous.current_address || {}),
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
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-950">Permanent Address (Optional)</h3>
                <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form.same_as_current_address)}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        same_as_current_address: event.target.checked,
                        permanent_address: event.target.checked
                          ? { ...(previous.current_address || {}) }
                          : previous.permanent_address,
                      }))
                    }
                  />
                  Same As Current Address
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
                      value={form.permanent_address?.[field] || ""}
                      disabled={Boolean(form.same_as_current_address)}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          permanent_address: {
                            ...(previous.permanent_address || {}),
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h3 className="text-lg font-black text-slate-950">Employment History (Optional)</h3>
              <div className="space-y-4">
                {(form.employment_history || [{}]).map((entry, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {[
                        "previous_school_name",
                        "school_address",
                        "school_type",
                        "board",
                        "designation",
                        "subject_handled",
                        "joining_date",
                        "relieving_date",
                        "reason_for_leaving",
                      ].map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                            {field.replaceAll("_", " ")}
                          </span>
                          <input
                            className="input"
                            value={entry[field] || ""}
                            onChange={(event) =>
                              setForm((previous) => ({
                                ...previous,
                                employment_history: (previous.employment_history || [{}]).map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, [field]: event.target.value }
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
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h3 className="text-lg font-black text-slate-950">Salary History (Optional)</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {["previous_gross_salary", "previous_net_salary", "last_drawn_salary"].map((field) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
                      {field.replaceAll("_", " ")}
                    </span>
                    <input
                      className="input"
                      value={form.salary_history?.[field] || ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          salary_history: {
                            ...(previous.salary_history || {}),
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h3 className="text-lg font-black text-slate-950">Document Uploads (Optional)</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {documentFields.map(([field, label]) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
                    <input
                      type="file"
                      name={field}
                      className="input"
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          documents: {
                            ...(previous.documents || {}),
                            [field]: event.target.files?.[0]?.name || "",
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">Educational Qualifications (Optional)</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      qualifications: [...(previous.qualifications || []), {}],
                    }))
                  }
                >
                  Add Qualification
                </button>
              </div>
              <div className="space-y-4">
                {(form.qualifications || [{}]).map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {qualificationFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">{field.replaceAll("_", " ")}</span>
                          {field === "certificate_upload" ? (
                            <input
                              type="file"
                              name={`qualification_${index}_certificate`}
                              data-teacher-field="qualifications"
                              className="input"
                            />
                          ) : (
                            <input
                              className="input"
                              value={item[field] || ""}
                              onChange={(event) =>
                                setForm((previous) => ({
                                  ...previous,
                                  qualifications: (previous.qualifications || [{}]).map((row, rowIndex) =>
                                    rowIndex === index ? { ...row, [field]: event.target.value } : row
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
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">Professional Certifications (Optional)</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      certifications: [...(previous.certifications || []), {}],
                    }))
                  }
                >
                  Add Certification
                </button>
              </div>
              <div className="space-y-4">
                {(form.certifications || [{}]).map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {certificationFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">{field.replaceAll("_", " ")}</span>
                          {field === "certificate_upload" ? (
                            <input
                              type="file"
                              name={`certification_${index}_certificate`}
                              data-teacher-field="certifications"
                              className="input"
                            />
                          ) : (
                            <input
                              className="input"
                              value={item[field] || ""}
                              onChange={(event) =>
                                setForm((previous) => ({
                                  ...previous,
                                  certifications: (previous.certifications || [{}]).map((row, rowIndex) =>
                                    rowIndex === index ? { ...row, [field]: event.target.value } : row
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
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">Teacher Notes (Optional)</h3>
                <button
                  type="button"
                  className="tt-button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      teacher_notes: [...(previous.teacher_notes || []), {}],
                    }))
                  }
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-4">
                {(form.teacher_notes || [{}]).map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {teacherNoteFields.map((field) => (
                        <label key={`${index}-${field}`} className="min-w-0">
                          <span className="mb-1 block text-sm font-bold capitalize text-slate-700">{field.replaceAll("_", " ")}</span>
                          <textarea
                            className="input min-h-[96px]"
                            value={item[field] || ""}
                            onChange={(event) =>
                              setForm((previous) => ({
                                ...previous,
                                teacher_notes: (previous.teacher_notes || [{}]).map((row, rowIndex) =>
                                  rowIndex === index ? { ...row, [field]: event.target.value } : row
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
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h3 className="text-lg font-black text-slate-950">Performance Notes (Optional)</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {performanceNoteFields.map((field) => (
                  <label key={field} className="min-w-0">
                    <span className="mb-1 block text-sm font-bold capitalize text-slate-700">{field.replaceAll("_", " ")}</span>
                    <textarea
                      className="input min-h-[96px]"
                      value={form.performance_notes?.[field] || ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          performance_notes: {
                            ...(previous.performance_notes || {}),
                            [field]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Class Assignment
              </span>
              <select
                className="input"
                value={
                  form.class_id ?? ""
                }
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
                  No Class
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
                Section Assignment
              </span>
              <select
                className="input"
                value={
                  form.section_id ?? ""
                }
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
                  No Section
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
                Assignment Type
              </span>
              <select
                className="input"
                value={
                  form.assignment_type ||
                  "CLASS_TEACHER"
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
                  Class Teacher
                </option>
                <option value="SUBJECT_TEACHER">
                  Subject Teacher
                </option>
                <option value="MENTOR">
                  Mentor
                </option>
                <option value="SUPERVISOR">
                  Supervisor
                </option>
              </select>
            </label>
          </div>

          <button
            onClick={updateTeacher}
            disabled={saving}
            className="tt-button mt-6 inline-flex items-center gap-2"
          >
            <Save size={17} />
            {saving
              ? "Updating..."
              : "Update Teacher"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
