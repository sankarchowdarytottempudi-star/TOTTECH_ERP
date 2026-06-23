"use client";

import {
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useParams } from "next/navigation";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type ModuleData = Record<string, any>;

const moduleLabels: Record<string, string> = {
  "staff-directory": "Staff Master",
  "leave-management": "Leave Management",
  lop: "Loss Of Pay (LOP)",
  payroll: "Salary Management",
  increments: "Increment Management",
  payslips: "Pay Slip Generation",
  approvals: "Approval Workflow",
  pf: "Provident Fund (PF)",
};

const initialStaff = {
  id: "",
  staff_type: "Teaching",
  staff_category: "",
  sub_category: "",
  first_name: "",
  last_name: "",
  department: "",
  designation: "",
  class_assignment: "",
  section_assignment: "",
  subject_assignment: "",
  assignment_type: "",
  is_class_teacher: false,
  teaching_experience: "",
  qualification: "",
  teacher_gap_history: "",
  experience_years: "",
  experience_gap: "",
  previous_school: "",
  previous_organization: "",
  reporting_manager: "",
  work_location: "",
  joining_date: "",
  mobile: "",
  alternate_mobile: "",
  whatsapp_number: "",
  email: "",
  address: "",
  pan: "",
  aadhaar: "",
  employee_number: "",
  salary_details: "",
  bank_details: "",
  salary_structure_id: "",
  pf_number: "",
  uan_number: "",
  pf_joining_date: "",
  pf_status: "Active",
};

const nonTeachingSubCategories = [
  "Accountant",
  "Receptionist",
  "Warden",
  "Transport Incharge",
  "Bus Driver",
  "Cleaner",
  "Security Guard",
  "Office Assistant",
  "Librarian",
  "Lab Assistant",
  "IT Administrator",
  "System Administrator",
  "HR Executive",
  "Admin Executive",
  "Store Keeper",
  "Hostel Warden",
  "Mess Manager",
  "Nurse",
  "Attender",
  "Other",
];

function staffRowToForm(row: any) {
  return {
    ...initialStaff,
    id: String(row.id || ""),
    staff_type: row.staff_type === "Non-Teaching" ? "Non-Teaching" : "Teaching",
    staff_category: row.staff_category || "",
    sub_category: row.sub_category || "",
    first_name: row.first_name || "",
    last_name: row.last_name || "",
    department: row.department || "",
    designation: row.designation || "",
    class_assignment: row.class_assignment || "",
    section_assignment: row.section_assignment || "",
    subject_assignment: row.subject_assignment || "",
    assignment_type: row.assignment_type || "",
    is_class_teacher: row.is_class_teacher === true,
    teaching_experience: row.teaching_experience || "",
    qualification: row.qualification || "",
    teacher_gap_history: row.teacher_gap_history || "",
    experience_years: String(row.experience_years || ""),
    experience_gap: row.experience_gap || "",
    previous_school: row.previous_school || "",
    previous_organization: row.previous_organization || "",
    reporting_manager: row.reporting_manager || "",
    work_location: row.work_location || "",
    joining_date: row.joining_date ? String(row.joining_date).slice(0, 10) : "",
    mobile: row.mobile || "",
    alternate_mobile: row.alternate_mobile || "",
    whatsapp_number: row.whatsapp_number || "",
    email: row.email || "",
    address: row.address || "",
    pan: row.pan || "",
    aadhaar: row.aadhaar || "",
    employee_number: row.employee_number || "",
    salary_details: row.salary_details || "",
    bank_details:
      typeof row.bank_details === "string"
        ? row.bank_details
        : row.bank_details?.details
          ? String(row.bank_details.details)
        : row.bank_details
          ? JSON.stringify(row.bank_details)
          : "",
    salary_structure_id: String(row.salary_structure_id || ""),
    pf_number: row.pf_number || "",
    uan_number: row.uan_number || "",
    pf_joining_date: row.pf_joining_date
      ? String(row.pf_joining_date).slice(0, 10)
      : "",
    pf_status: row.pf_status || "Active",
  };
}

const initialCategory = {
  id: "",
  category_name: "",
  category_code: "",
  leaves_per_year: "",
  max_consecutive_days: "3",
};

const initialLeaveRequest = {
  staff_id: "",
  leave_category_id: "",
  from_date: "",
  to_date: "",
  reason: "",
};

const initialStructure = {
  id: "",
  structure_name: "",
  basic: "",
  hra: "",
  da: "",
  special_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  other_allowances: "",
  pf: "",
  esi: "",
  professional_tax: "",
  income_tax: "",
  other_deductions: "",
  gross_salary: "",
  net_salary: "",
};

const initialAssignment = {
  staff_id: "",
  salary_structure_id: "",
  current_salary: "",
  effective_from: "",
};

const initialIncrement = {
  staff_id: "",
  current_salary: "",
  requested_percentage: "",
  requested_amount: "",
  requested_salary: "",
  reason: "",
};

export default function HRMSModulePage() {
  const params = useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const title =
    moduleLabels[moduleKey] || "HRMS Module";
  const [data, setData] = useState<ModuleData>({});
  const [school, setSchool] =
    useState<any>(null);
  const [years, setYears] = useState<any[]>([]);
  const [schoolId, setSchoolId] =
    useState<string>("");
  const [academicYearId, setAcademicYearId] =
    useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [selectedStaff, setSelectedStaff] =
    useState<any>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<any>(null);
  const [selectedStructure, setSelectedStructure] =
    useState<any>(null);
  const [staffForm, setStaffForm] = useState(
    initialStaff
  );
  const [categoryForm, setCategoryForm] = useState(
    initialCategory
  );
  const [leaveRequestForm, setLeaveRequestForm] =
    useState(initialLeaveRequest);
  const [structureForm, setStructureForm] = useState(
    initialStructure
  );
  const [assignmentForm, setAssignmentForm] =
    useState(initialAssignment);
  const [incrementForm, setIncrementForm] =
    useState(initialIncrement);
  const [selectedRun, setSelectedRun] =
    useState<any>(null);
  const isTeachingStaff =
    staffForm.staff_type !== "Non-Teaching";

  useEffect(() => {
    void loadMeta();
  }, []);

  useEffect(() => {
    void loadData();
  }, [moduleKey, schoolId, academicYearId, search]);

  const loadMeta = async () => {
    try {
      const [schoolData, yearData] =
        await Promise.all([
          apiJson<any>("/api/my-school"),
          apiJson<any>(
            "/api/academic-years?include_all=true"
          ),
        ]);
      setSchool(schoolData);
      setYears(
        Array.isArray(yearData)
          ? yearData.filter((row) => row?.id && row.id !== "all")
          : []
      );
      setSchoolId(
        String(
          schoolData?.id || ""
        )
      );
      const selectedYear = Array.isArray(
        yearData
      )
        ? yearData.find(
            (row: any) =>
              row?.is_selected &&
              row?.id !== "all"
          )
        : null;
      if (selectedYear?.id) {
        setAcademicYearId(String(selectedYear.id));
      } else if (Array.isArray(yearData) && yearData[0]?.id && yearData[0].id !== "all") {
        setAcademicYearId(String(yearData[0].id));
      }
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load HR context"
        )
      );
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (schoolId) q.set("school_id", schoolId);
      if (academicYearId)
        q.set("academic_year_id", academicYearId);
      if (search) q.set("q", search);
      const result = await apiJson<ModuleData>(
        `/api/hrms/${moduleKey}${
          q.toString() ? `?${q}` : ""
        }`
      );
      setData(result || {});
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load HR module"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const save = async (
    payload: Record<string, unknown>
  ) => {
    try {
      setSaving(true);
      await apiJson(`/api/hrms/${moduleKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_id: schoolId,
          academic_year_id: academicYearId,
          ...payload,
        }),
      });
      notify.success("Saved successfully");
      await loadData();
      return true;
    } catch (error) {
      notify.error(
        errorMessage(error, "Save failed")
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const onStaffSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.id = selectedStaff?.id || "";
    const ok = await save(payload);
    if (ok) {
      setSelectedStaff(null);
      setStaffForm(initialStaff);
      event.currentTarget.reset();
    }
  };

  const onCategorySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.id = selectedCategory?.id || "";
    payload.action = selectedCategory?.id
      ? "update-category"
      : "create-category";
    const ok = await save(payload);
    if (ok) {
      setSelectedCategory(null);
      setCategoryForm(initialCategory);
      event.currentTarget.reset();
    }
  };

  const onLeaveRequestSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.action = "submit-request";
    const ok = await save(payload);
    if (ok) {
      setLeaveRequestForm(
        initialLeaveRequest
      );
      event.currentTarget.reset();
    }
  };

  const onStructureSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.id = selectedStructure?.id || "";
    payload.action = selectedStructure?.id
      ? "update-structure"
      : "create-structure";
    const ok = await save(payload);
    if (ok) {
      setSelectedStructure(null);
      setStructureForm(initialStructure);
      event.currentTarget.reset();
    }
  };

  const onAssignmentSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.action = "create-assignment";
    const ok = await save(payload);
    if (ok) {
      setAssignmentForm(initialAssignment);
      event.currentTarget.reset();
    }
  };

  const onIncrementSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = new FormData(
      event.currentTarget
    );
    const payload = Object.fromEntries(
      form.entries()
    );
    payload.action = "create-request";
    const ok = await save(payload);
    if (ok) {
      setIncrementForm(initialIncrement);
      event.currentTarget.reset();
    }
  };

  const approveRequest = async (
    moduleAction: string,
    id: number,
    extra: Record<string, unknown> = {}
  ) => {
    await save({
      action: moduleAction,
      id,
      ...extra,
    });
  };

  const pageCounts = useMemo(
    () => data?.counts || {},
    [data]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Operational HR workflow for the selected school/college and academic year.
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="tt-btn-outline inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="tt-card tt-card-pad grid gap-4 md:grid-cols-4">
          <label className="space-y-1">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              School/College
            </span>
            <select
              className="input"
              value={schoolId}
              onChange={(event) =>
                setSchoolId(event.target.value)
              }
            >
              <option value="">
                Select school/college
              </option>
              <option value={school?.id || ""}>
                {school?.school_name || "Current school/college"}
              </option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Academic Year
            </span>
            <select
              className="input"
              value={academicYearId}
              onChange={(event) =>
                setAcademicYearId(
                  event.target.value
                )
              }
            >
              <option value="">
                Current year
              </option>
              {years.map((year) => (
                <option
                  key={year.id}
                  value={year.id}
                >
                  {year.academic_year}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Search
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="input border-0 px-0 focus:ring-0"
                placeholder="Search within this module..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <CardStat
            label="Total Records"
            value={pageCounts.total ?? pageCounts.pending ?? pageCounts.generated ?? 0}
          />
          <CardStat
            label="Active / Approved"
            value={pageCounts.active ?? pageCounts.approved ?? 0}
          />
          <CardStat
            label="Pending"
            value={pageCounts.pending ?? 0}
          />
          <CardStat
            label="Saved Items"
            value={
              loading ? "..." : "Live"
            }
          />
        </div>

        {moduleKey === "staff-directory" && (
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={onStaffSubmit}
              className="tt-card tt-card-pad space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">
                  {selectedStaff ? "Edit Staff" : "Create Staff"}
                </h2>
                {selectedStaff && (
                  <button
                    type="button"
                    className="text-sm font-bold text-slate-500"
                    onClick={() => {
                      setSelectedStaff(null);
                      setStaffForm(initialStaff);
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  name="staff_type"
                  label="Staff Type"
                  value={staffForm.staff_type}
                  options={["Teaching", "Non-Teaching"]}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      staff_type: value,
                      ...(value === "Non-Teaching"
                        ? {
                            class_assignment: "",
                            section_assignment: "",
                            subject_assignment: "",
                            assignment_type: "",
                            is_class_teacher: false,
                            teaching_experience: "",
                            teacher_gap_history: "",
                            previous_school: "",
                          }
                        : {
                            staff_category: "",
                            sub_category: "",
                            reporting_manager: "",
                            work_location: "",
                            joining_date: "",
                            salary_details: "",
                            previous_organization: "",
                          }),
                    }))
                  }
                />
                <Field
                  name="first_name"
                  label="First Name"
                  value={staffForm.first_name}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      first_name: value,
                    }))
                  }
                />
                <Field
                  name="last_name"
                  label="Last Name"
                  value={staffForm.last_name}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      last_name: value,
                    }))
                  }
                />
                <Field
                  name="mobile"
                  label="Mobile"
                  value={staffForm.mobile}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      mobile: value,
                    }))
                  }
                />
                <Field
                  name="alternate_mobile"
                  label="Alternate Mobile"
                  value={staffForm.alternate_mobile}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      alternate_mobile: value,
                    }))
                  }
                />
                <Field
                  name="whatsapp_number"
                  label="WhatsApp Number"
                  value={staffForm.whatsapp_number}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      whatsapp_number: value,
                    }))
                  }
                />
                <Field
                  name="email"
                  label="Email"
                  value={staffForm.email}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                />
                <Field
                  name="employee_number"
                  label="Employee Number"
                  value={staffForm.employee_number}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      employee_number: value,
                    }))
                  }
                />
              </div>
              {isTeachingStaff ? (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-indigo-950">
                      Teaching Assignment
                    </h3>
                    <p className="mt-1 text-xs font-medium text-indigo-900/70">
                      Academic fields are shown only for teaching staff.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      name="department"
                      label="Department"
                      value={staffForm.department}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                    />
                    <Field
                      name="class_assignment"
                      label="Class Assignment"
                      value={staffForm.class_assignment}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          class_assignment: value,
                        }))
                      }
                    />
                    <Field
                      name="section_assignment"
                      label="Section Assignment"
                      value={staffForm.section_assignment}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          section_assignment: value,
                        }))
                      }
                    />
                    <Field
                      name="subject_assignment"
                      label="Subject Assignment"
                      value={staffForm.subject_assignment}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          subject_assignment: value,
                        }))
                      }
                    />
                    <Field
                      name="assignment_type"
                      label="Assignment Type"
                      value={staffForm.assignment_type}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          assignment_type: value,
                        }))
                      }
                    />
                    <Field
                      name="teaching_experience"
                      label="Teaching Experience"
                      value={staffForm.teaching_experience}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          teaching_experience: value,
                        }))
                      }
                    />
                    <Field
                      name="previous_school"
                      label="Previous School/College"
                      value={staffForm.previous_school}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          previous_school: value,
                        }))
                      }
                    />
                    <Field
                      name="qualification"
                      label="Educational Qualification"
                      value={staffForm.qualification}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          qualification: value,
                        }))
                      }
                    />
                    <label className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-white px-3 py-3 text-sm font-bold text-slate-800">
                      <input
                        name="is_class_teacher"
                        type="checkbox"
                        checked={staffForm.is_class_teacher}
                        onChange={(event) =>
                          setStaffForm((prev) => ({
                            ...prev,
                            is_class_teacher:
                              event.target.checked,
                          }))
                        }
                      />
                      Class Teacher
                    </label>
                    <div>
                      <p className="mb-1 text-sm font-bold text-slate-700">
                        Academic Year
                      </p>
                      <div className="input flex items-center bg-white text-slate-700">
                        {years.find(
                          (year) =>
                            String(year.id) === academicYearId
                        )?.name ||
                          years.find(
                            (year) =>
                              String(year.id) === academicYearId
                          )?.academic_year ||
                          "Selected academic year"}
                      </div>
                    </div>
                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-sm font-bold text-slate-700">
                        Teacher Gap History
                      </span>
                      <textarea
                        name="teacher_gap_history"
                        className="input min-h-[80px]"
                        value={staffForm.teacher_gap_history}
                        onChange={(event) =>
                          setStaffForm((prev) => ({
                            ...prev,
                            teacher_gap_history:
                              event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-amber-950">
                      Non-Teaching Work Profile
                    </h3>
                    <p className="mt-1 text-xs font-medium text-amber-900/75">
                      Academic assignment fields are hidden for non-teaching staff.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      name="staff_category"
                      label="Staff Category"
                      value={staffForm.staff_category}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          staff_category: value,
                        }))
                      }
                    />
                    <SelectField
                      name="sub_category"
                      label="Sub Category"
                      value={staffForm.sub_category}
                      options={nonTeachingSubCategories}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          sub_category: value,
                        }))
                      }
                    />
                    <Field
                      name="designation"
                      label="Designation"
                      value={staffForm.designation}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          designation: value,
                        }))
                      }
                    />
                    <Field
                      name="reporting_manager"
                      label="Reporting Manager"
                      value={staffForm.reporting_manager}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          reporting_manager: value,
                        }))
                      }
                    />
                    <Field
                      name="work_location"
                      label="Work Location"
                      value={staffForm.work_location}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          work_location: value,
                        }))
                      }
                    />
                    <Field
                      name="joining_date"
                      label="Joining Date"
                      type="date"
                      value={staffForm.joining_date}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          joining_date: value,
                        }))
                      }
                    />
                    <Field
                      name="experience_years"
                      label="Experience"
                      value={staffForm.experience_years}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          experience_years: value,
                        }))
                      }
                    />
                    <Field
                      name="previous_organization"
                      label="Previous Organization"
                      value={staffForm.previous_organization}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          previous_organization: value,
                        }))
                      }
                    />
                    <Field
                      name="salary_structure_id"
                      label="Salary Structure ID"
                      value={staffForm.salary_structure_id}
                      onChange={(value) =>
                        setStaffForm((prev) => ({
                          ...prev,
                          salary_structure_id: value,
                        }))
                      }
                    />
                    <label className="block">
                      <span className="mb-1 block text-sm font-bold text-slate-700">
                        Salary Details
                      </span>
                      <textarea
                        name="salary_details"
                        className="input min-h-[80px]"
                        value={staffForm.salary_details}
                        onChange={(event) =>
                          setStaffForm((prev) => ({
                            ...prev,
                            salary_details:
                              event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-sm font-bold text-slate-700">
                        Bank Details
                      </span>
                      <textarea
                        name="bank_details"
                        className="input min-h-[80px]"
                        placeholder="Bank name, account number, IFSC, branch"
                        value={
                          staffForm.bank_details
                        }
                        onChange={(event) =>
                          setStaffForm((prev) => ({
                            ...prev,
                            bank_details:
                              event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">
                      Provident Fund (PF) Details
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Reference only. TOTTECH ONE does not calculate statutory PF compliance.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-amber-900">
                    Refer to EPFO
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    name="pf_number"
                    label="PF Number"
                    value={staffForm.pf_number}
                    onChange={(value) =>
                      setStaffForm((prev) => ({
                        ...prev,
                        pf_number: value,
                      }))
                    }
                  />
                  <Field
                    name="uan_number"
                    label="UAN Number"
                    value={staffForm.uan_number}
                    onChange={(value) =>
                      setStaffForm((prev) => ({
                        ...prev,
                        uan_number: value,
                      }))
                    }
                  />
                  <Field
                    name="pf_joining_date"
                    label="Date of Joining PF"
                    type="date"
                    value={staffForm.pf_joining_date}
                    onChange={(value) =>
                      setStaffForm((prev) => ({
                        ...prev,
                        pf_joining_date: value,
                      }))
                    }
                  />
                  <Field
                    name="pf_status"
                    label="PF Status"
                    value={staffForm.pf_status}
                    onChange={(value) =>
                      setStaffForm((prev) => ({
                        ...prev,
                        pf_status: value,
                      }))
                    }
                  />
                </div>
              </div>
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Address
                </span>
                <textarea
                  name="address"
                  className="input min-h-[90px]"
                  value={staffForm.address}
                  onChange={(event) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  name="pan"
                  label="PAN"
                  value={staffForm.pan}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      pan: value,
                    }))
                  }
                />
                <Field
                  name="aadhaar"
                  label="Aadhaar"
                  value={staffForm.aadhaar}
                  onChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      aadhaar: value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="tt-btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {selectedStaff ? "Update Staff" : "Create Staff"}
                </button>
                <button
                  type="button"
                  className="tt-btn-outline"
                  onClick={() => {
                    setSelectedStaff(null);
                    setStaffForm(initialStaff);
                  }}
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="tt-card tt-card-pad">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-black">
                  Staff Directory
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Latest 50 records
                </p>
              </div>
              <div className="hidden md:block">
                <Table
                  rows={data.records || []}
	                  columns={[
	                    "Employee ID",
	                    "Name",
	                    "Staff Type",
	                    "Department",
	                    "Designation",
	                    "Mobile",
                    "PF / UAN",
                    "Status",
                  ]}
                >
                  {(row: any) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3 text-sm font-bold">
                        {row.employee_id}
                      </td>
	                      <td className="px-3 py-3 text-sm">
	                        {[
	                          row.first_name,
                          row.last_name,
                        ]
                          .filter(Boolean)
	                          .join(" ") || "-"}
	                      </td>
	                      <td className="px-3 py-3 text-sm">
	                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black">
	                          {row.staff_type || "Teaching"}
	                        </span>
	                        {row.sub_category && (
	                          <p className="mt-1 text-xs text-slate-500">
	                            {row.sub_category}
	                          </p>
	                        )}
	                      </td>
	                      <td className="px-3 py-3 text-sm">
	                        {row.department || "-"}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {row.designation || "-"}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {row.mobile || "-"}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <div className="space-y-1">
                          <p className="font-bold">
                            {row.pf_number || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {row.uan_number || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black">
                          {row.is_active === false
                            ? "INACTIVE"
                            : "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="tt-btn-outline text-xs"
	                            onClick={() => {
	                              setSelectedStaff(row);
	                              setStaffForm(staffRowToForm(row));
	                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="tt-btn-danger text-xs"
                            onClick={() =>
                              save({
                                action: "delete",
                                id: row.id,
                              })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {(data.records || []).map((row: any) => (
                  <article
                    key={row.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Employee ID
                        </p>
                        <p className="mt-1 break-words text-sm font-black text-slate-950">
                          {row.employee_id}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black">
                        {row.is_active === false
                          ? "INACTIVE"
                          : "ACTIVE"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Name
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                          {[
                            row.first_name,
                            row.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ") || "-"}
                        </p>
                      </div>
	                      <div>
	                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
	                          Staff Type
	                        </p>
	                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
	                          {row.staff_type || "Teaching"}
	                        </p>
	                      </div>
	                      <div>
	                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
	                          Department
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                          {row.department || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Designation
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                          {row.designation || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Mobile
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                          {row.mobile || "-"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                          PF / UAN
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                          {row.pf_number || "-"}
                        </p>
                        <p className="mt-1 break-words text-xs text-slate-500">
                          {row.uan_number || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="tt-btn-outline text-xs"
	                        onClick={() => {
	                          setSelectedStaff(row);
	                          setStaffForm(staffRowToForm(row));
	                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="tt-btn-danger text-xs"
                        onClick={() =>
                          save({
                            action: "delete",
                            id: row.id,
                          })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {moduleKey === "leave-management" && (
          <section className="grid gap-6 xl:grid-cols-3">
            <form
              onSubmit={onCategorySubmit}
              className="tt-card tt-card-pad space-y-4"
            >
              <h2 className="text-lg font-black">
                Leave Categories
              </h2>
              {selectedCategory && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                  Editing category #{selectedCategory.id}
                </div>
              )}
              <Field
                name="category_name"
                label="Category Name"
                value={categoryForm.category_name}
                onChange={(value) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    category_name: value,
                  }))
                }
              />
              <Field
                name="category_code"
                label="Category Code"
                value={categoryForm.category_code}
                onChange={(value) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    category_code: value,
                  }))
                }
              />
              <Field
                name="leaves_per_year"
                label="Leaves Per Year"
                value={categoryForm.leaves_per_year}
                onChange={(value) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    leaves_per_year: value,
                  }))
                }
              />
              <Field
                name="max_consecutive_days"
                label="Max Consecutive Days"
                value={categoryForm.max_consecutive_days}
                onChange={(value) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    max_consecutive_days: value,
                  }))
                }
              />
              <button
                type="submit"
                disabled={saving}
                className="tt-btn-primary w-full"
              >
                {selectedCategory ? "Update Category" : "Save Category"}
              </button>
              <Table
                rows={data.categories || []}
                columns={[
                  "Name",
                  "Code",
                  "Year",
                  "Approval",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm font-bold">
                      {row.category_name}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.category_code || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.leaves_per_year || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.requires_approval
                        ? "Yes"
                        : "No"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button"
                          className="tt-btn-outline text-xs"
                          onClick={() => {
                            setSelectedCategory(row);
                            setCategoryForm({
                              id: String(row.id),
                              category_name:
                                row.category_name || "",
                              category_code:
                                row.category_code || "",
                              leaves_per_year:
                                String(
                                  row.leaves_per_year ||
                                    ""
                                ),
                              max_consecutive_days:
                                String(
                                  row.max_consecutive_days ||
                                    3
                                ),
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button"
                          className="tt-btn-danger text-xs"
                          onClick={() =>
                            save({
                              action: "delete-category",
                              id: row.id,
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Table>
            </form>

            <form
              onSubmit={onLeaveRequestSubmit}
              className="tt-card tt-card-pad space-y-4"
            >
              <h2 className="text-lg font-black">
                Leave Request
              </h2>
              <Field
                name="staff_id"
                label="Staff ID"
                value={leaveRequestForm.staff_id}
                onChange={(value) =>
                  setLeaveRequestForm((prev) => ({
                    ...prev,
                    staff_id: value,
                  }))
                }
              />
              <Field
                name="leave_category_id"
                label="Category ID"
                value={leaveRequestForm.leave_category_id}
                onChange={(value) =>
                  setLeaveRequestForm((prev) => ({
                    ...prev,
                    leave_category_id: value,
                  }))
                }
              />
              <Field
                name="from_date"
                label="From Date"
                type="date"
                value={leaveRequestForm.from_date}
                onChange={(value) =>
                  setLeaveRequestForm((prev) => ({
                    ...prev,
                    from_date: value,
                  }))
                }
              />
              <Field
                name="to_date"
                label="To Date"
                type="date"
                value={leaveRequestForm.to_date}
                onChange={(value) =>
                  setLeaveRequestForm((prev) => ({
                    ...prev,
                    to_date: value,
                  }))
                }
              />
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Reason
                </span>
                <textarea
                  name="reason"
                  className="input min-h-[100px]"
                  value={leaveRequestForm.reason}
                  onChange={(event) =>
                    setLeaveRequestForm((prev) => ({
                      ...prev,
                      reason: event.target.value,
                    }))
                  }
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="tt-btn-primary w-full"
              >
                Submit Leave
              </button>
            </form>

            <div className="tt-card tt-card-pad space-y-4 xl:col-span-1">
              <h2 className="text-lg font-black">
                Leave Balances & Requests
              </h2>
              <Table
                rows={data.balances || []}
                columns={[
                  "Staff",
                  "Category",
                  "Allocated",
                  "Used",
                  "Balance",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm">
                      {row.staff_id || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.leave_category_id || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.allocated_days || 0}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.used_days || 0}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.balance_days || 0}
                    </td>
                  </tr>
                )}
              </Table>

              <Table
                rows={data.requests || []}
                columns={[
                  "Request",
                  "From",
                  "To",
                  "Status",
                  "Actions",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm">
                      #{row.id}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.from_date?.slice?.(0, 10) ||
                        "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.to_date?.slice?.(0, 10) ||
                        "-"}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.status}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button"
                          className="tt-btn-outline text-xs"
                          onClick={() =>
                            approveRequest(
                              "approve-request",
                              row.id
                            )
                          }
                        >
                          Approve
                        </button>
                        <button type="button"
                          className="tt-btn-danger text-xs"
                          onClick={() =>
                            approveRequest(
                              "reject-request",
                              row.id
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </section>
        )}

        {moduleKey === "lop" && (
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="tt-card tt-card-pad space-y-4">
              <h2 className="text-lg font-black">
                Generate LOP
              </h2>
              <p className="text-sm text-slate-600">
                LOP is generated from absent attendance rows and can flow into payroll.
              </p>
              <button type="button"
                disabled={saving}
                className="tt-btn-primary w-full"
                onClick={() =>
                  save({
                    action: "generate",
                    reason:
                      "Absent without approved leave",
                    days_lost: 1,
                    amount: 0,
                  })
                }
              >
                Generate From Absent Attendance
              </button>
              <Table
                rows={data.teacherAttendance || []}
                columns={[
                  "Teacher",
                  "Date",
                  "Status",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm">
                      {row.teacher_id || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.attendance_date?.slice?.(0, 10) ||
                        "-"}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.status}
                    </td>
                  </tr>
                )}
              </Table>
            </div>

            <div className="tt-card tt-card-pad">
              <h2 className="text-lg font-black">
                LOP Ledger
              </h2>
              <Table
                rows={data.entries || []}
                columns={[
                  "Staff",
                  "Date",
                  "Days Lost",
                  "Amount",
                  "Status",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm">
                      {row.staff_id || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.attendance_date?.slice?.(0, 10) ||
                        "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.days_lost || 0}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.amount || 0}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.status}
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </section>
        )}

        {moduleKey === "payroll" && (
          <section className="grid gap-6 xl:grid-cols-2">
            <form
              onSubmit={onStructureSubmit}
              className="tt-card tt-card-pad space-y-4"
            >
              <h2 className="text-lg font-black">
                Salary Structure Master
              </h2>
              {selectedStructure && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                  Editing structure #{selectedStructure.id}
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  name="structure_name"
                  label="Structure Name"
                  value={structureForm.structure_name}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      structure_name: value,
                    }))
                  }
                />
                <Field
                  name="basic"
                  label="Basic"
                  value={structureForm.basic}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      basic: value,
                    }))
                  }
                />
                <Field
                  name="hra"
                  label="HRA"
                  value={structureForm.hra}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      hra: value,
                    }))
                  }
                />
                <Field
                  name="da"
                  label="DA"
                  value={structureForm.da}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      da: value,
                    }))
                  }
                />
                <Field
                  name="gross_salary"
                  label="Gross Salary"
                  value={structureForm.gross_salary}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      gross_salary: value,
                    }))
                  }
                />
                <Field
                  name="net_salary"
                  label="Net Salary"
                  value={structureForm.net_salary}
                  onChange={(value) =>
                    setStructureForm((prev) => ({
                      ...prev,
                      net_salary: value,
                    }))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="tt-btn-primary w-full"
              >
                {selectedStructure ? "Update Structure" : "Save Structure"}
              </button>
              <Table
                rows={data.structures || []}
                columns={[
                  "Name",
                  "Gross",
                  "Net",
                  "Status",
                  "Actions",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm font-bold">
                      {row.structure_name}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.gross_salary || 0}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.net_salary || 0}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.is_active === false
                        ? "INACTIVE"
                        : "ACTIVE"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button"
                          className="tt-btn-outline text-xs"
                          onClick={() => {
                            setSelectedStructure(row);
                            setStructureForm({
                              id: String(row.id),
                              structure_name:
                                row.structure_name || "",
                              basic: String(row.basic || ""),
                              hra: String(row.hra || ""),
                              da: String(row.da || ""),
                              special_allowance: String(
                                row.special_allowance ||
                                  ""
                              ),
                              transport_allowance: String(
                                row.transport_allowance ||
                                  ""
                              ),
                              medical_allowance: String(
                                row.medical_allowance ||
                                  ""
                              ),
                              other_allowances: String(
                                row.other_allowances ||
                                  ""
                              ),
                              pf: String(row.pf || ""),
                              esi: String(row.esi || ""),
                              professional_tax: String(
                                row.professional_tax ||
                                  ""
                              ),
                              income_tax: String(
                                row.income_tax || ""
                              ),
                              other_deductions: String(
                                row.other_deductions ||
                                  ""
                              ),
                              gross_salary: String(
                                row.gross_salary || ""
                              ),
                              net_salary: String(
                                row.net_salary || ""
                              ),
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button"
                          className="tt-btn-danger text-xs"
                          onClick={() =>
                            save({
                              action: "delete-structure",
                              id: row.id,
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Table>
            </form>

            <div className="space-y-6">
              <form
                onSubmit={onAssignmentSubmit}
                className="tt-card tt-card-pad space-y-4"
              >
                <h2 className="text-lg font-black">
                  Employee Salary Assignment
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    name="staff_id"
                    label="Staff ID"
                    value={assignmentForm.staff_id}
                    onChange={(value) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        staff_id: value,
                      }))
                    }
                  />
                  <Field
                    name="salary_structure_id"
                    label="Structure ID"
                    value={assignmentForm.salary_structure_id}
                    onChange={(value) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        salary_structure_id: value,
                      }))
                    }
                  />
                  <Field
                    name="current_salary"
                    label="Current Salary"
                    value={assignmentForm.current_salary}
                    onChange={(value) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        current_salary: value,
                      }))
                    }
                  />
                  <Field
                    name="effective_from"
                    label="Effective From"
                    type="date"
                    value={assignmentForm.effective_from}
                    onChange={(value) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        effective_from: value,
                      }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="tt-btn-primary w-full"
                >
                  Assign Salary
                </button>
              </form>

              <div className="tt-card tt-card-pad">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">
                    Payroll Runs & Pay Slips
                  </h2>
                  <button type="button"
                    className="tt-btn-outline text-xs"
                    onClick={() =>
                      save({
                        action: "generate-run",
                        payroll_month:
                          new Date().getMonth() + 1,
                        payroll_year:
                          new Date().getFullYear(),
                      })
                    }
                  >
                    Generate Monthly Payroll
                  </button>
                </div>
                <Table
                  rows={data.runs || []}
                  columns={[
                    "Month",
                    "Year",
                    "Gross",
                    "Net",
                    "Status",
                    "Actions",
                  ]}
                >
                  {(row: any) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3 text-sm">
                        {row.payroll_month}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {row.payroll_year}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {row.total_gross || 0}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {row.total_net || 0}
                      </td>
                      <td className="px-3 py-3 text-sm font-black">
                        {row.status}
                      </td>
                      <td className="px-3 py-3">
                        <button type="button"
                          className="tt-btn-outline text-xs"
                          onClick={() => {
                            setSelectedRun(row);
                            notify.success(
                              `Run #${row.id} selected`
                            );
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )}
                </Table>
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Recent Pay Slips
                  </h3>
                  <Table
                    rows={data.slips || []}
                    columns={[
                      "Slip",
                      "Staff",
                      "Gross",
                      "Net",
                      "Status",
                    ]}
                  >
                    {(row: any) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-3 py-3 text-sm font-bold">
                          #{row.id}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {row.staff_id || "-"}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {row.gross_salary || 0}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {row.net_salary || 0}
                        </td>
                        <td className="px-3 py-3 text-sm font-black">
                          {row.status}
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
              </div>
            </div>
          </section>
        )}

        {moduleKey === "increments" && (
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <form
              onSubmit={onIncrementSubmit}
              className="tt-card tt-card-pad space-y-4"
            >
              <h2 className="text-lg font-black">
                Increment Request
              </h2>
              <Field
                name="staff_id"
                label="Staff ID"
                value={incrementForm.staff_id}
                onChange={(value) =>
                  setIncrementForm((prev) => ({
                    ...prev,
                    staff_id: value,
                  }))
                }
              />
              <Field
                name="current_salary"
                label="Current Salary"
                value={incrementForm.current_salary}
                onChange={(value) =>
                  setIncrementForm((prev) => ({
                    ...prev,
                    current_salary: value,
                  }))
                }
              />
              <Field
                name="requested_percentage"
                label="Requested %"
                value={incrementForm.requested_percentage}
                onChange={(value) =>
                  setIncrementForm((prev) => ({
                    ...prev,
                    requested_percentage: value,
                  }))
                }
              />
              <Field
                name="requested_amount"
                label="Requested Amount"
                value={incrementForm.requested_amount}
                onChange={(value) =>
                  setIncrementForm((prev) => ({
                    ...prev,
                    requested_amount: value,
                  }))
                }
              />
              <Field
                name="requested_salary"
                label="Requested Salary"
                value={incrementForm.requested_salary}
                onChange={(value) =>
                  setIncrementForm((prev) => ({
                    ...prev,
                    requested_salary: value,
                  }))
                }
              />
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Reason
                </span>
                <textarea
                  name="reason"
                  className="input min-h-[100px]"
                  value={incrementForm.reason}
                  onChange={(event) =>
                    setIncrementForm((prev) => ({
                      ...prev,
                      reason: event.target.value,
                    }))
                  }
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="tt-btn-primary w-full"
              >
                Submit Increment
              </button>
            </form>

            <div className="tt-card tt-card-pad">
              <h2 className="text-lg font-black">
                Increment Queue
              </h2>
              <Table
                rows={data.requests || []}
                columns={[
                  "Staff",
                  "Current",
                  "Requested",
                  "Status",
                  "Actions",
                ]}
              >
                {(row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 text-sm">
                      {row.staff_id || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.current_salary || 0}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {row.requested_salary || 0}
                    </td>
                    <td className="px-3 py-3 text-sm font-black">
                      {row.status}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button"
                          className="tt-btn-outline text-xs"
                          onClick={() =>
                            approveRequest(
                              "approve-request",
                              row.id,
                              {
                                final_salary:
                                  row.requested_salary,
                              }
                            )
                          }
                        >
                          Approve
                        </button>
                        <button type="button"
                          className="tt-btn-danger text-xs"
                          onClick={() =>
                            approveRequest(
                              "reject-request",
                              row.id
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </section>
        )}

        {moduleKey === "payslips" && (
          <section className="tt-card tt-card-pad space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">
                  Pay Slips
                </h2>
                <p className="text-sm text-slate-600">
                  Generate payroll runs from Salary Management and distribute slips.
                </p>
              </div>
              <button
                type="button"
                className="tt-btn-primary"
                onClick={() =>
                  save({
                    action: "generate",
                    payroll_run_id:
                      selectedRun?.id || data.runs?.[0]?.id,
                  })
                }
              >
                Generate Slips
              </button>
            </div>
            {selectedRun && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
                Selected payroll run #{selectedRun.id} for {selectedRun.payroll_month}/{selectedRun.payroll_year}
              </div>
            )}
            <Table
              rows={data.slips || []}
              columns={[
                "Slip",
                "Staff",
                "Run",
                "Gross",
                "Net",
                "Status",
              ]}
            >
              {(row: any) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-3 text-sm font-bold">
                    #{row.id}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {row.staff_id || "-"}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {row.payroll_run_id || "-"}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {row.gross_salary || 0}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {row.net_salary || 0}
                  </td>
                  <td className="px-3 py-3 text-sm font-black">
                    {row.status}
                  </td>
                </tr>
              )}
            </Table>
          </section>
        )}

        {moduleKey === "approvals" && (
          <section className="tt-card tt-card-pad space-y-4">
            <h2 className="text-lg font-black">
              Unified Approval Center
            </h2>
            <Table
              rows={data.records || []}
              columns={[
                "Module",
                "Label",
                "Status",
                "Actions",
              ]}
            >
              {(row: any) => (
                <tr key={`${row.module_key}-${row.id}`} className="border-t">
                  <td className="px-3 py-3 text-sm font-bold">
                    {row.module_key}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {row.label}
                  </td>
                  <td className="px-3 py-3 text-sm font-black">
                    {row.status}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button"
                        className="tt-btn-outline text-xs"
                        onClick={() =>
                          approveRequest(
                            "approve",
                            row.id,
                            {
                              module_key:
                                row.module_key,
                            }
                          )
                        }
                      >
                        Approve
                      </button>
                      <button type="button"
                        className="tt-btn-danger text-xs"
                        onClick={() =>
                          approveRequest(
                            "reject",
                            row.id,
                            {
                              module_key:
                                row.module_key,
                            }
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </Table>
          </section>
        )}

        {loading && (
          <div className="tt-card tt-card-pad text-sm font-semibold text-slate-500">
            Loading HR records...
          </div>
        )}
      </div>
    </Layout>
  );
}

function CardStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        name={name}
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Table({
  rows,
  columns,
  children,
}: {
  rows: any[];
  columns: string[];
  children: (row: any) => React.ReactNode;
}) {
  if (!rows?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No records yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-3 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(children)}</tbody>
      </table>
    </div>
  );
}
