"use client";

import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import StudentBacklogSection from "@/components/student/StudentBacklogSection";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type StudentForm = {
  id?: number;
  enrollment_number?: string | null;
  admission_number?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  blood_group?: string | null;
  religion?: string | null;
  caste?: string | null;
  mother_tongue?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  father_phone?: string | null;
  mother_phone?: string | null;
  guardian_alternative_mobile?: string | null;
  emergency_contact_name?: string | null;
  emergency_relationship?: string | null;
  roll_number?: string | null;
  has_previous_school?: string | boolean | null;
  previous_school_details?: string | null;
  previous_academic_performance?: string | null;
  has_backlogs?: string | boolean | null;
  backlogs?: any[] | null;
  has_academic_gap?: string | boolean | null;
  academic_gap_from_year?: string | null;
  academic_gap_to_year?: string | null;
  academic_gap_duration?: string | null;
  academic_gap_reason?: string | null;
  current_class_id?: number | null;
  current_section_id?: number | null;
};

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] =
    useState<StudentForm>({});
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [subjects, setSubjects] =
    useState<any[]>([]);
  const [exams, setExams] =
    useState<any[]>([]);
  const [saving, setSaving] =
    useState(false);
  const hasAcademicGap =
    String(form.has_academic_gap || "")
      .toLowerCase() === "yes" ||
    String(form.has_academic_gap || "")
      .toLowerCase() === "true";
  const hasPreviousSchool =
    String(form.has_previous_school || "")
      .toLowerCase() === "yes" ||
    String(form.has_previous_school || "")
      .toLowerCase() === "true";
  const hasBacklogs =
    String(form.has_backlogs || "")
      .toLowerCase() === "yes" ||
    String(form.has_backlogs || "")
      .toLowerCase() === "true";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!hasAcademicGap) {
      setForm((previous) => {
        const gapFieldsCleared =
          previous.academic_gap_from_year ||
          previous.academic_gap_to_year ||
          previous.academic_gap_duration ||
          previous.academic_gap_reason;

        if (!gapFieldsCleared) {
          return previous;
        }

        return {
          ...previous,
          academic_gap_from_year: "",
          academic_gap_to_year: "",
          academic_gap_duration: "",
          academic_gap_reason: "",
        };
      });
      return;
    }

    const fromMatch = String(form.academic_gap_from_year || "").match(/(\d{4})/);
    const toMatch = String(form.academic_gap_to_year || "").match(/(\d{4})/);

    if (fromMatch && toMatch) {
      const fromYear = Number(fromMatch[1]);
      const toYear = Number(toMatch[1]);
      const gapYears = Math.max(0, toYear - fromYear - 1);
      const duration = gapYears <= 0 ? "No academic gap" : `${gapYears} Academic Year${gapYears === 1 ? "" : "s"}`;
      if (duration !== form.academic_gap_duration) {
        setForm((previous) => ({
          ...previous,
          academic_gap_duration: duration,
        }));
      }
    }
  }, [
    hasAcademicGap,
    form.academic_gap_from_year,
    form.academic_gap_to_year,
    form.academic_gap_duration,
  ]);

  const loadData = async () => {
    try {
      const [
        studentPayload,
        classRows,
        sectionRows,
        subjectRows,
        examRows,
      ] = await Promise.all([
        apiJson<any>(
          `/api/students/${params?.id}`
        ),
        apiJson<any[]>("/api/classes"),
        apiJson<any[]>("/api/sections"),
        apiJson<any[]>("/api/subjects"),
        apiJson<any[]>("/api/exams"),
      ]);

      setForm(
        studentPayload.student ??
          studentPayload
      );
      setClasses(
        Array.isArray(classRows)
          ? classRows
          : []
      );
      setSections(
        Array.isArray(sectionRows)
          ? sectionRows
          : []
      );
      setSubjects(
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
      setExams(
        Array.isArray(examRows)
          ? examRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load student"
        )
      );
    }
  };

  const updateField = (
    key: keyof StudentForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]:
        key.includes("_id") &&
        value
          ? Number(value)
          : value,
    }));
  };

  const updateStudent = async () => {
    try {
      setSaving(true);
      await apiJson(
        `/api/students/${params?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      notify.success(
        "Student updated"
      );
      router.push("/students/list");
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update student"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredSections =
    sections.filter(
      (section) =>
        !form.current_class_id ||
        Number(section.class_id) ===
          Number(form.current_class_id)
    );

  const hasBacklogRows =
    String(form.has_backlogs || "")
      .toLowerCase() === "yes" ||
    String(form.has_backlogs || "")
      .toLowerCase() === "true";

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Edit Student
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Update the student profile for the selected school/college and academic year.
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
            <Field
              label="Enrollment Number"
              value={
                form.enrollment_number ||
                ""
              }
              onChange={(value) =>
                updateField(
                  "enrollment_number",
                  value
                )
              }
            />
            <Field
              label="Admission Number"
              value={
                form.admission_number ||
                ""
              }
              onChange={(value) =>
                updateField(
                  "admission_number",
                  value
                )
              }
            />
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Gender
              </span>
              <select
                className="input"
                value={form.gender || ""}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select Gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
              </select>
            </label>
            <Field
              label="First Name"
              value={form.first_name || ""}
              onChange={(value) =>
                updateField(
                  "first_name",
                  value
                )
              }
            />
            <Field
              label="Middle Name"
              value={
                form.middle_name || ""
              }
              onChange={(value) =>
                updateField(
                  "middle_name",
                  value
                )
              }
            />
            <Field
              label="Last Name"
              value={form.last_name || ""}
              onChange={(value) =>
                updateField(
                  "last_name",
                  value
                )
              }
            />
            <Field
              label="Phone"
              value={form.phone || ""}
              onChange={(value) =>
                updateField(
                  "phone",
                  value
                )
              }
            />
            <Field
              label="Email"
              value={form.email || ""}
              onChange={(value) =>
                updateField(
                  "email",
                  value
                )
              }
            />
            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Personal Information (Optional)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Blood Group
                  </span>
                  <select
                    className="input"
                    value={form.blood_group || ""}
                    onChange={(event) =>
                      updateField("blood_group", event.target.value)
                    }
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </label>
                <Field
                  label="Religion"
                  value={form.religion || ""}
                  onChange={(value) =>
                    updateField("religion", value)
                  }
                />
                <Field
                  label="Caste"
                  value={form.caste || ""}
                  onChange={(value) =>
                    updateField("caste", value)
                  }
                />
                <Field
                  label="Mother Tongue"
                  value={form.mother_tongue || ""}
                  onChange={(value) =>
                    updateField("mother_tongue", value)
                  }
                />
              </div>
            </div>
            <Field
              label="Father Name"
              value={form.father_name || ""}
              onChange={(value) =>
                updateField(
                  "father_name",
                  value
                )
              }
            />
            <Field
              label="Mother Name"
              value={
                form.mother_name || ""
              }
              onChange={(value) =>
                updateField(
                  "mother_name",
                  value
                )
              }
            />
            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Parent Details
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Father Phone"
                  value={form.father_phone || ""}
                  onChange={(value) =>
                    updateField("father_phone", value)
                  }
                />
                <Field
                  label="Mother Phone"
                  value={form.mother_phone || ""}
                  onChange={(value) =>
                    updateField("mother_phone", value)
                  }
                />
                <Field
                  label="Guardian Alternative Mobile (Optional)"
                  value={form.guardian_alternative_mobile || ""}
                  onChange={(value) =>
                    updateField(
                      "guardian_alternative_mobile",
                      value
                    )
                  }
                />
                <Field
                  label="Emergency Contact Name"
                  value={form.emergency_contact_name || ""}
                  onChange={(value) =>
                    updateField("emergency_contact_name", value)
                  }
                />
                <Field
                  label="Relationship"
                  value={form.emergency_relationship || ""}
                  onChange={(value) =>
                    updateField("emergency_relationship", value)
                  }
                />
              </div>
            </div>

            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Previous School/College Information (Optional)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Has Previous School/College?
                  </span>
                  <select
                    className="input"
                    value={hasPreviousSchool ? "Yes" : "No"}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField("has_previous_school", value);
                      if (value === "No") {
                        setForm((previous) => ({
                          ...previous,
                          previous_school_details: "",
                          previous_academic_performance: "",
                        }));
                      }
                    }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
                {hasPreviousSchool ? (
                  <>
                    <Field
                      label="Previous School/College (Name & Address) (Optional)"
                      type="textarea"
                      value={form.previous_school_details || ""}
                      onChange={(value) =>
                        updateField("previous_school_details", value)
                      }
                    />
                    <Field
                      label="Previous Academic Performance (Optional)"
                      value={form.previous_academic_performance || ""}
                      onChange={(value) =>
                        updateField("previous_academic_performance", value)
                      }
                    />
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-600 md:col-span-2 xl:col-span-2">
                    No previous school/college selected. Previous school/college details will be saved as NULL.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Academic Gap Information (Optional)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Has Academic Gap
                  </span>
                  <select
                    className="input"
                    value={String(form.has_academic_gap || "No")}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField("has_academic_gap", value);
                      if (value === "No") {
                        setForm((previous) => ({
                          ...previous,
                          academic_gap_from_year: "",
                          academic_gap_to_year: "",
                          academic_gap_duration: "",
                          academic_gap_reason: "",
                        }));
                      }
                    }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
                {hasAcademicGap ? (
                  <>
                    <Field
                      label="Gap From Academic Year (Optional)"
                      value={form.academic_gap_from_year || ""}
                      onChange={(value) =>
                        updateField("academic_gap_from_year", value)
                      }
                    />
                    <Field
                      label="Gap To Academic Year (Optional)"
                      value={form.academic_gap_to_year || ""}
                      onChange={(value) =>
                        updateField("academic_gap_to_year", value)
                      }
                    />
                    <Field
                      label="Gap Duration"
                      value={form.academic_gap_duration || ""}
                      readOnly
                      onChange={(value) =>
                        updateField("academic_gap_duration", value)
                      }
                    />
                    <Field
                      label="Gap Reason (Optional)"
                      value={form.academic_gap_reason || ""}
                      onChange={(value) =>
                        updateField("academic_gap_reason", value)
                      }
                    />
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-600 md:col-span-2 xl:col-span-2">
                    No academic gap selected. Gap fields stay hidden and will be saved as NULL.
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Backlog Information (Optional)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Has Backlogs?
                  </span>
                  <select
                    className="input"
                    value={String(form.has_backlogs || "No")}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm((previous) => ({
                        ...previous,
                        has_backlogs: value,
                        backlogs: value === "No" ? [] : (
                          Array.isArray(previous.backlogs) && previous.backlogs.length
                            ? previous.backlogs
                            : [{
                                subject_id: "",
                                exam_id: "",
                                backlog_status: "Pending",
                                backlog_reason: "",
                                cleared_date: "",
                                remarks: "",
                              }]
                        ),
                      }));
                    }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
              </div>
              <div className="mt-5">
                <StudentBacklogSection
                  enabled={hasBacklogRows}
                  rows={
                    Array.isArray(form.backlogs)
                      ? form.backlogs
                      : []
                  }
                  onRowsChange={(rows) =>
                    setForm((previous) => ({
                      ...previous,
                      backlogs: rows,
                    }))
                  }
                  subjects={subjects}
                  exams={exams}
                />
              </div>
            </div>
            <Field
              label="Roll Number"
              value={
                form.roll_number || ""
              }
              onChange={(value) =>
                updateField(
                  "roll_number",
                  value
                )
              }
            />
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Class
              </span>
              <select
                className="input"
                value={
                  form.current_class_id ||
                  ""
                }
                onChange={(event) =>
                  setForm(
                    (previous) => ({
                      ...previous,
                      current_class_id:
                        event.target.value
                          ? Number(
                              event.target
                                .value
                            )
                          : null,
                      current_section_id:
                        null,
                    })
                  )
                }
              >
                <option value="">
                  Select Class
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
                Section
              </span>
              <select
                className="input"
                value={
                  form.current_section_id ||
                  ""
                }
                onChange={(event) =>
                  updateField(
                    "current_section_id",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select Section
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
          </div>

          <button
            onClick={updateStudent}
            disabled={saving}
            className="tt-button mt-6 inline-flex items-center gap-2"
          >
            <Save size={17} />
            {saving
              ? "Updating..."
              : "Update Student"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      {type === "textarea" ? (
        <textarea
          className="input min-h-[112px]"
          value={value}
          readOnly={readOnly}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      ) : (
        <input
          type={type}
          className="input"
          value={value}
          readOnly={readOnly}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      )}
    </label>
  );
}
