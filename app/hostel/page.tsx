"use client";

import {
  BedDouble,
  Building2,
  Home,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Hostel = {
  id: number;
  hostel_name?: string | null;
  hostel_type?: string | null;
  warden_name?: string | null;
  warden_phone?: string | null;
};

type Allocation = {
  id: number;
  hostel_name?: string | null;
  hostel_type?: string | null;
  admission_number?: string | null;
  enrollment_number?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  bed_number?: string | null;
  allocation_date?: string | null;
};

type RosterStudent = {
  id: number;
  admission_number?: string | null;
  enrollment_number?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  class_id?: number | null;
  section_id?: number | null;
  class_name?: string | null;
  section_name?: string | null;
};

const initialHostelForm = {
  hostel_name: "",
  hostel_type: "BOYS",
  warden_name: "",
  warden_phone: "",
};

const initialAssignmentForm = {
  hostel_id: "",
  class_id: "",
  section_id: "",
  student_id: "",
  room_number: "",
  bed_number: "",
  allocation_date: new Date()
    .toISOString()
    .slice(0, 10),
};

const fullName = (
  row: Partial<RosterStudent | Allocation>
) =>
  [
    row.first_name,
    row.middle_name,
    row.last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Unnamed Student";

export default function HostelPage() {
  const [hostels, setHostels] =
    useState<Hostel[]>([]);
  const [allocations, setAllocations] =
    useState<Allocation[]>([]);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [students, setStudents] =
    useState<RosterStudent[]>([]);
  const [hostelForm, setHostelForm] =
    useState(initialHostelForm);
  const [
    assignmentForm,
    setAssignmentForm,
  ] = useState(initialAssignmentForm);
  const [loading, setLoading] =
    useState(true);
  const [role, setRole] =
    useState("");

  useEffect(() => {
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

    loadData();
  }, []);

  const canCreateHostel =
    canManageRecord(
      role,
      "hostel",
      "create"
    );
  const canUpdateHostel =
    canManageRecord(
      role,
      "hostel",
      "update"
    );
  const canDeleteHostel =
    canManageRecord(
      role,
      "hostel",
      "delete"
    );

  const loadData = async () => {
    try {
      setLoading(true);
      const [hostelPayload, roster] =
        await Promise.all([
          apiJson<any>("/api/hostels"),
          apiJson<any>("/api/roster"),
        ]);

      setHostels(
        Array.isArray(
          hostelPayload.hostels
        )
          ? hostelPayload.hostels
          : Array.isArray(hostelPayload)
            ? hostelPayload
            : []
      );
      setAllocations(
        Array.isArray(
          hostelPayload.allocations
        )
          ? hostelPayload.allocations
          : []
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
        Array.isArray(roster.students)
          ? roster.students
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load hostel operations"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = useMemo(
    () =>
      sections.filter(
        (section) =>
          !assignmentForm.class_id ||
          Number(section.class_id) ===
            Number(
              assignmentForm.class_id
            )
      ),
    [sections, assignmentForm.class_id]
  );

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const classMatches =
          !assignmentForm.class_id ||
          Number(student.class_id) ===
            Number(
              assignmentForm.class_id
            );
        const sectionMatches =
          !assignmentForm.section_id ||
          Number(student.section_id) ===
            Number(
              assignmentForm.section_id
            );

        return (
          classMatches &&
          sectionMatches
        );
      }),
    [
      students,
      assignmentForm.class_id,
      assignmentForm.section_id,
    ]
  );

  const saveHostel = async () => {
    try {
      await apiJson("/api/hostels", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          hostelForm
        ),
      });

      notify.success(
        "Hostel created"
      );
      setHostelForm(
        initialHostelForm
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create hostel"
        )
      );
    }
  };

  const assignHostel = async () => {
    try {
      await apiJson("/api/hostels", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...assignmentForm,
          kind: "assignment",
        }),
      });

      notify.success(
        "Hostel assigned to student"
      );
      setAssignmentForm(
        initialAssignmentForm
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to assign hostel"
        )
      );
    }
  };

  const editHostel = async (
    hostel: Hostel
  ) => {
    const hostelName = prompt(
      "Hostel name",
      hostel.hostel_name || ""
    );

    if (!hostelName) {
      return;
    }

    try {
      await apiJson("/api/hostels", {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...hostel,
          id: hostel.id,
          hostel_name:
            hostelName,
        }),
      });
      notify.success(
        "Hostel updated"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update hostel"
        )
      );
    }
  };

  const deleteHostel = async (
    hostel: Hostel
  ) => {
    if (
      !confirm(
        `Delete ${hostel.hostel_name}? Assignments and hostel history for this hostel will also be removed.`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/hostels?id=${hostel.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Hostel deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete hostel"
        )
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Hostel Operations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create hostels, view existing hostels, and assign hostel accommodation by class, section, and student.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <section className="tt-card tt-card-pad xl:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Building2
                size={20}
                className="text-amber-700"
              />
              <h2 className="text-xl font-black">
                Create Hostel
              </h2>
            </div>

            <div className="space-y-3">
              <Input
                label="Hostel Name"
                value={
                  hostelForm.hostel_name
                }
                onChange={(value) =>
                  setHostelForm({
                    ...hostelForm,
                    hostel_name: value,
                  })
                }
              />
              <Select
                label="Hostel Type"
                value={
                  hostelForm.hostel_type
                }
                onChange={(value) =>
                  setHostelForm({
                    ...hostelForm,
                    hostel_type: value,
                  })
                }
                options={[
                  "BOYS",
                  "GIRLS",
                  "STAFF",
                  "GENERAL",
                ]}
              />
              <Input
                label="Warden Name"
                value={
                  hostelForm.warden_name
                }
                onChange={(value) =>
                  setHostelForm({
                    ...hostelForm,
                    warden_name: value,
                  })
                }
              />
              <Input
                label="Warden Phone"
                value={
                  hostelForm.warden_phone
                }
                onChange={(value) =>
                  setHostelForm({
                    ...hostelForm,
                    warden_phone: value,
                  })
                }
              />
              {canCreateHostel && (
                <button
                  type="button"
                  onClick={saveHostel}
                  className="tt-button w-full"
                >
                  Create Hostel
                </button>
              )}
            </div>
          </section>

          <section className="tt-card tt-card-pad xl:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <BedDouble
                size={20}
                className="text-amber-700"
              />
              <h2 className="text-xl font-black">
                Assign Hostel
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <NativeSelect
                label="Hostel"
                value={
                  assignmentForm.hostel_id
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    hostel_id: value,
                  })
                }
              >
                <option value="">
                  Select Hostel
                </option>
                {hostels.map((hostel) => (
                  <option
                    key={hostel.id}
                    value={hostel.id}
                  >
                    {hostel.hostel_name}{" "}
                    {hostel.hostel_type
                      ? `(${hostel.hostel_type})`
                      : ""}
                  </option>
                ))}
              </NativeSelect>

              <NativeSelect
                label="Class"
                value={
                  assignmentForm.class_id
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    class_id: value,
                    section_id: "",
                    student_id: "",
                  })
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
              </NativeSelect>

              <NativeSelect
                label="Section"
                value={
                  assignmentForm.section_id
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    section_id: value,
                    student_id: "",
                  })
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
              </NativeSelect>

              <NativeSelect
                label="Student"
                value={
                  assignmentForm.student_id
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    student_id: value,
                  })
                }
              >
                <option value="">
                  Select Student
                </option>
                {filteredStudents.map(
                  (student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {fullName(student)}{" "}
                      {student.admission_number
                        ? `- ${student.admission_number}`
                        : ""}
                    </option>
                  )
                )}
              </NativeSelect>

              <Input
                label="Room Number"
                value={
                  assignmentForm.room_number
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    room_number: value,
                  })
                }
              />
              <Input
                label="Bed Number"
                value={
                  assignmentForm.bed_number
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    bed_number: value,
                  })
                }
              />
              <Input
                label="Allocation Date"
                type="date"
                value={
                  assignmentForm.allocation_date
                }
                onChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    allocation_date: value,
                  })
                }
              />
            </div>

            {canCreateHostel && (
              <button
                type="button"
                onClick={assignHostel}
                className="tt-button mt-4"
              >
                Assign Hostel
              </button>
            )}
          </section>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex items-center gap-2">
            <Home
              size={20}
              className="text-amber-700"
            />
            <h2 className="text-xl font-black">
              Existing Hostels
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-slate-600">
              Loading hostels...
            </p>
          ) : hostels.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hostels created yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {hostels.map((hostel) => (
                <article
                  key={hostel.id}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-slate-950">
                        {hostel.hostel_name ||
                          "Unnamed Hostel"}
                      </h3>
                      <p className="text-sm font-semibold text-amber-700">
                        {hostel.hostel_type ||
                          "GENERAL"}
                      </p>
                    </div>
                    <span className="rounded-lg bg-slate-950 px-3 py-1 text-xs font-bold text-amber-100">
                      #{hostel.id}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm">
                    <Info
                      label="Warden"
                      value={
                        hostel.warden_name ||
                        "-"
                      }
                    />
                    <Info
                      label="Phone"
                      value={
                        hostel.warden_phone ||
                        "-"
                      }
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {canUpdateHostel && (
                      <button
                        type="button"
                        onClick={() =>
                          editHostel(
                            hostel
                          )
                        }
                        className="tt-button-secondary px-4 py-2 text-sm"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteHostel && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteHostel(
                            hostel
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex items-center gap-2">
            <Users
              size={20}
              className="text-amber-700"
            />
            <h2 className="text-xl font-black">
              Recent Hostel Assignments
            </h2>
          </div>

          {allocations.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hostel assignments recorded yet.
            </p>
          ) : (
            <div className="grid gap-3">
              {allocations.map(
                (allocation) => (
                  <article
                    key={allocation.id}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.3fr_1fr_1fr]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">
                        {fullName(
                          allocation
                        )}
                      </p>
                      <p className="truncate text-sm font-semibold text-amber-700">
                        Admission{" "}
                        {allocation.admission_number ||
                          "-"}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-slate-950">
                        {allocation.class_name ||
                          "-"}{" "}
                        /{" "}
                        {allocation.section_name ||
                          "-"}
                      </p>
                      <p className="text-slate-600">
                        Bed{" "}
                        {allocation.bed_number ||
                          "-"}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-slate-950">
                        {allocation.hostel_name ||
                          "Hostel"}
                      </p>
                      <p className="text-slate-600">
                        {allocation.allocation_date
                          ? new Date(
                              allocation.allocation_date
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="input mt-1"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <NativeSelect
      label={label}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </NativeSelect>
  );
}

function NativeSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="input mt-1"
      >
        {children}
      </select>
    </label>
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
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="truncate font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}
