"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import StudentBacklogSection, {
  createBacklogRow,
} from "@/components/student/StudentBacklogSection";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialStudent = {
  school_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  dob: "",
  phone: "",
  email: "",
  blood_group: "",
  religion: "",
  caste: "",
  mother_tongue: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  mandal: "",
  district: "",
  state: "",
  country: "",
  postal_code: "",
  landmark: "",
  father_name: "",
  mother_name: "",
  father_phone: "",
  mother_phone: "",
  guardian_alternative_mobile: "",
  emergency_contact_number: "",
  emergency_contact_name: "",
  emergency_relationship: "",
  has_previous_school: "No",
  previous_school_details: "",
  previous_academic_performance: "",
  has_backlogs: "No",
  backlogs: [] as any[],
  has_academic_gap: "No",
  academic_gap_from_year: "",
  academic_gap_to_year: "",
  academic_gap_duration: "",
  academic_gap_reason: "",
  current_class_id: "",
  current_section_id: "",
};

export default function StudentsPage() {
  const router = useRouter();
  const [school, setSchool] =
    useState<any>(null);
  const [student, setStudent] =
    useState(initialStudent);
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
  const [
    dobCertificate,
    setDobCertificate,
  ] = useState<File | null>(null);
  const hasAcademicGap =
    student.has_academic_gap === "Yes";
  const hasPreviousSchool =
    student.has_previous_school === "Yes";
  const hasBacklogs =
    student.has_backlogs === "Yes";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!hasAcademicGap) {
      setStudent((previous) => {
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

    const fromMatch = student.academic_gap_from_year.match(
      /(\d{4})/
    );
    const toMatch = student.academic_gap_to_year.match(
      /(\d{4})/
    );

    if (fromMatch && toMatch) {
      const fromYear = Number(fromMatch[1]);
      const toYear = Number(toMatch[1]);
      const gapYears = Math.max(0, toYear - fromYear - 1);
      const duration =
        gapYears <= 0
          ? "No academic gap"
          : `${gapYears} Academic Year${gapYears === 1 ? "" : "s"}`;

      if (duration !== student.academic_gap_duration) {
        setStudent((previous) => ({
          ...previous,
          academic_gap_duration: duration,
        }));
      }
    }
  }, [
    hasAcademicGap,
    student.academic_gap_from_year,
    student.academic_gap_to_year,
  ]);

  const loadData = async () => {
    try {
      const [
        data,
        roster,
        subjectRows,
        examRows,
      ] =
        await Promise.all([
          apiJson<any>(
            "/api/my-school"
          ),
          apiJson<any>("/api/roster"),
          apiJson<any[]>("/api/subjects"),
          apiJson<any[]>("/api/exams"),
        ]);

      setSchool(data);
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
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
      setExams(
        Array.isArray(examRows)
          ? examRows
          : []
      );
      setStudent((previous) => ({
        ...previous,
        school_id: data?.id || "",
      }));
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load school/college"
        )
      );
    }
  };

  const updateField = (
    key: keyof typeof initialStudent,
    value: string
  ) => {
    setStudent((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "current_class_id"
        ? {
            current_section_id: "",
          }
        : {}),
    }));
  };

  const filteredSections =
    sections.filter(
      (section) =>
        !student.current_class_id ||
        Number(section.class_id) ===
          Number(student.current_class_id)
    );

  const saveStudent = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      Object.entries(student).forEach(
        ([key, value]) => {
          formData.append(
            key,
            Array.isArray(value)
              ? JSON.stringify(value)
              : String(value ?? "")
          );
        }
      );

      if (dobCertificate) {
        formData.append(
          "dob_certificate",
          dobCertificate
        );
      }

      await apiJson("/api/students", {
        method: "POST",
        body: formData,
      });

      notify.success(
        "Student saved successfully"
      );
      router.push("/students/list");
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save student"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Student Admission
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a school/college-linked student record for the selected academic year.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <h2 className="mb-3 text-lg font-black">
            School/College Information
          </h2>
          <input
            value={
              school?.school_name || ""
            }
            disabled
            className="input bg-slate-100"
          />
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
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 xl:col-span-3">
              <p className="text-sm font-black text-slate-950">
                Admission and roll numbers are generated automatically.
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                Admission number is mandatory and will be generated on save using the school/college code and current year, for example KVS-AD-123/26. Enrollment number is optional for users and will also be generated as KVS-EN-123/26. Roll number is assigned after save by alphabetical first name order in the selected class and section.
              </p>
            </div>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Gender *
              </span>
              <select
                className="input"
                value={student.gender}
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
              required
              value={student.first_name}
              onChange={(value) =>
                updateField(
                  "first_name",
                  value
                )
              }
            />
            <Field
              label="Middle Name"
              value={student.middle_name}
              onChange={(value) =>
                updateField(
                  "middle_name",
                  value
                )
              }
            />
            <Field
              label="Last Name"
              required
              value={student.last_name}
              onChange={(value) =>
                updateField(
                  "last_name",
                  value
                )
              }
            />
            <Field
              label="Date of Birth"
              required
              type="date"
              value={student.dob}
              onChange={(value) =>
                updateField(
                  "dob",
                  value
                )
              }
            />
            <Field
              label="Phone Number"
              required
              value={student.phone}
              onChange={(value) =>
                updateField(
                  "phone",
                  value
                )
              }
            />
            <Field
              label="Student Email (Optional)"
              value={student.email}
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
                    value={student.blood_group}
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
                  value={student.religion}
                  onChange={(value) =>
                    updateField("religion", value)
                  }
                />
                <Field
                  label="Caste"
                  value={student.caste}
                  onChange={(value) =>
                    updateField("caste", value)
                  }
                />
                <Field
                  label="Mother Tongue"
                  value={student.mother_tongue}
                  onChange={(value) =>
                    updateField("mother_tongue", value)
                  }
                />
              </div>
            </div>
            <Field
              label="Address Line 1"
              required
              value={student.address_line_1}
              onChange={(value) =>
                updateField(
                  "address_line_1",
                  value
                )
              }
            />
            <div className="lg:col-span-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Address Information (Optional)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Address Line 2"
                  value={student.address_line_2}
                  onChange={(value) =>
                    updateField("address_line_2", value)
                  }
                />
                <Field
                  label="City / Village"
                  value={student.city}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                />
                <Field
                  label="Mandal / Taluk"
                  value={student.mandal}
                  onChange={(value) =>
                    updateField("mandal", value)
                  }
                />
                <Field
                  label="District"
                  value={student.district}
                  onChange={(value) =>
                    updateField("district", value)
                  }
                />
                <Field
                  label="State"
                  value={student.state}
                  onChange={(value) =>
                    updateField("state", value)
                  }
                />
                <Field
                  label="Country"
                  value={student.country}
                  onChange={(value) =>
                    updateField("country", value)
                  }
                />
                <Field
                  label="Postal Code"
                  value={student.postal_code}
                  onChange={(value) =>
                    updateField("postal_code", value)
                  }
                />
                <Field
                  label="Landmark"
                  value={student.landmark}
                  onChange={(value) =>
                    updateField("landmark", value)
                  }
                />
              </div>
            </div>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                DOB Certificate *
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="input"
                onChange={(event) =>
                  setDobCertificate(
                    event.target.files?.[0] ||
                      null
                  )
                }
              />
            </label>
            <Field
              label="Father Name"
              required
              value={student.father_name}
              onChange={(value) =>
                updateField(
                  "father_name",
                  value
                )
              }
            />
            <Field
              label="Mother Name"
              required
              value={student.mother_name}
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
                  required
                  value={student.father_phone}
                  onChange={(value) =>
                    updateField("father_phone", value)
                  }
                />
                <Field
                  label="Mother Phone"
                  value={student.mother_phone}
                  onChange={(value) =>
                    updateField("mother_phone", value)
                  }
                />
                <Field
                  label="Guardian Alternative Mobile (Optional)"
                  value={student.guardian_alternative_mobile}
                  onChange={(value) =>
                    updateField(
                      "guardian_alternative_mobile",
                      value
                    )
                  }
                />
                <Field
                  label="Emergency Contact Number (Optional)"
                  value={student.emergency_contact_number}
                  onChange={(value) =>
                    updateField(
                      "emergency_contact_number",
                      value
                    )
                  }
                />
                <Field
                  label="Emergency Contact Name"
                  value={student.emergency_contact_name}
                  onChange={(value) =>
                    updateField("emergency_contact_name", value)
                  }
                />
                <Field
                  label="Relationship"
                  value={student.emergency_relationship}
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
                    value={student.has_previous_school}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField("has_previous_school", value);
                      if (value === "No") {
                        updateField("previous_school_details", "");
                        updateField("previous_academic_performance", "");
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
                      value={student.previous_school_details}
                      onChange={(value) =>
                        updateField("previous_school_details", value)
                      }
                    />
                    <Field
                      label="Previous Academic Performance (Optional)"
                      value={student.previous_academic_performance}
                      onChange={(value) =>
                        updateField("previous_academic_performance", value)
                      }
                    />
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-600 md:col-span-2 xl:col-span-2">
                    No previous school/college selected. Previous school/college details will be stored as NULL.
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
                    value={student.has_academic_gap}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField(
                        "has_academic_gap",
                        value
                      );

                      if (value === "No") {
                        setStudent((previous) => ({
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
                      value={student.academic_gap_from_year}
                      onChange={(value) =>
                        updateField("academic_gap_from_year", value)
                      }
                    />
                    <Field
                      label="Gap To Academic Year (Optional)"
                      value={student.academic_gap_to_year}
                      onChange={(value) =>
                        updateField("academic_gap_to_year", value)
                      }
                    />
                    <Field
                      label="Gap Duration"
                      value={student.academic_gap_duration}
                      readOnly
                      onChange={(value) =>
                        updateField("academic_gap_duration", value)
                      }
                    />
                    <Field
                      label="Gap Reason (Optional)"
                      value={student.academic_gap_reason}
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                  Backlog Information (Optional)
                </h3>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Student backlog tracking
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Has Backlogs?
                  </span>
                  <select
                    className="input"
                    value={student.has_backlogs}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField("has_backlogs", value);
                      if (value === "No") {
                        setStudent((previous) => ({
                          ...previous,
                          backlogs: [],
                        }));
                      } else {
                        setStudent((previous) => ({
                          ...previous,
                          backlogs:
                            Array.isArray(previous.backlogs) &&
                            previous.backlogs.length
                              ? previous.backlogs
                              : [createBacklogRow()],
                        }));
                      }
                    }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
                <div className="md:col-span-2 xl:col-span-2" />
              </div>

              <div className="mt-5">
                <StudentBacklogSection
                  enabled={hasBacklogs}
                  rows={
                    Array.isArray(student.backlogs)
                      ? student.backlogs
                      : []
                  }
                  onRowsChange={(rows) =>
                    setStudent((previous) => ({
                      ...previous,
                      backlogs: rows,
                    }))
                  }
                  subjects={subjects}
                  exams={exams}
                />
              </div>
            </div>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Class *
              </span>
              <select
                className="input"
                value={
                  student.current_class_id
                }
                onChange={(event) =>
                  updateField(
                    "current_class_id",
                    event.target.value
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
                Section *
              </span>
              <select
                className="input"
                value={
                  student.current_section_id
                }
                onChange={(event) =>
                  updateField(
                    "current_section_id",
                    event.target.value
                  )
                }
                disabled={
                  !student.current_class_id
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
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-700">
                Roll Number
              </p>
              <p className="mt-2 text-sm font-black text-slate-950">
                Auto-generated after save
              </p>
            </div>
          </div>

          <button
            onClick={saveStudent}
            disabled={saving}
            className="tt-button mt-6 inline-flex items-center gap-2"
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : "Save Student"}
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
  required = false,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
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
