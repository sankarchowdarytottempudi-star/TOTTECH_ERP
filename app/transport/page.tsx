"use client";

import {
  Bus,
  MapPinned,
  Route,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

const initialVehicle = {
  kind: "vehicle",
  vehicle_number: "",
  vehicle_type: "",
  capacity: "",
  driver_name: "",
  driver_phone: "",
};

const initialRoute = {
  kind: "route",
  route_name: "",
  vehicle_number: "",
  driver_name: "",
  driver_phone: "",
};

const initialAssignment = {
  kind: "assignment",
  assigned_to_type: "STUDENT",
  class_id: "",
  section_id: "",
  student_id: "",
  teacher_id: "",
  route_id: "",
  pickup_point: "",
  drop_point: "",
};

export default function TransportPage() {
  const [vehicles, setVehicles] =
    useState<any[]>([]);
  const [routes, setRoutes] =
    useState<any[]>([]);
  const [assignments, setAssignments] =
    useState<any[]>([]);
  const [students, setStudents] =
    useState<any[]>([]);
  const [teachers, setTeachers] =
    useState<any[]>([]);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [personSearch, setPersonSearch] =
    useState("");
  const [vehicle, setVehicle] =
    useState(initialVehicle);
  const [route, setRoute] =
    useState(initialRoute);
  const [
    assignment,
    setAssignment,
  ] = useState(initialAssignment);
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

  const loadData = async () => {
    try {
      const [
        transport,
        roster,
      ] = await Promise.all([
        apiJson<any>("/api/transport"),
        apiJson<any>("/api/roster"),
      ]);

      setVehicles(
        transport.vehicles || []
      );
      setRoutes(transport.routes || []);
      setAssignments(
        transport.assignments || []
      );
      setStudents(
        Array.isArray(roster.students)
          ? roster.students
          : []
      );
      setTeachers(
        Array.isArray(roster.teachers)
          ? roster.teachers
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
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load transport"
        )
      );
    }
  };

  const save = async (
    payload: Record<string, unknown>,
    message: string
  ) => {
    try {
      await apiJson("/api/transport", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      notify.success(message);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save transport"
        )
      );
    }
  };

  const canCreateTransport =
    canManageRecord(
      role,
      "transport",
      "create"
    );
  const canUpdateTransport =
    canManageRecord(
      role,
      "transport",
      "update"
    );
  const canDeleteTransport =
    canManageRecord(
      role,
      "transport",
      "delete"
    );

  const updateTransport = async (
    payload: Record<string, unknown>
  ) => {
    try {
      await apiJson("/api/transport", {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });
      notify.success(
        "Transport updated"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update transport"
        )
      );
    }
  };

  const deleteTransport = async (
    kind: string,
    id: number
  ) => {
    if (
      !confirm(
        `Delete this ${kind.replaceAll("_", " ")} record?`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/transport?kind=${kind}&id=${id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Transport record deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete transport"
        )
      );
    }
  };

  const editVehicle = (
    item: any
  ) => {
    const vehicleNumber = prompt(
      "Vehicle number",
      item.vehicle_number || ""
    );

    if (!vehicleNumber) {
      return;
    }

    void updateTransport({
      ...item,
      kind: "vehicle",
      id: item.id,
      vehicle_number:
        vehicleNumber,
    });
  };

  const editRoute = (
    item: any
  ) => {
    const routeName = prompt(
      "Route name",
      item.route_name || ""
    );

    if (!routeName) {
      return;
    }

    void updateTransport({
      ...item,
      kind: "route",
      id: item.id,
      route_name: routeName,
    });
  };

  const studentName = (
    row: any
  ) =>
    [
      row.first_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    `Student ${row.student_id || row.id}`;

  const teacherName = (
    row: any
  ) =>
    [
      row.teacher_first_name ??
        row.first_name,
      row.teacher_last_name ??
        row.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    `Teacher ${row.teacher_id || row.id}`;

  const filteredSections =
    sections.filter(
      (section) =>
        !assignment.class_id ||
        Number(section.class_id) ===
          Number(assignment.class_id)
    );

  const filteredStudents =
    students.filter((student) => {
      const classMatches =
        !assignment.class_id ||
        Number(student.class_id) ===
          Number(assignment.class_id);
      const sectionMatches =
        !assignment.section_id ||
        Number(student.section_id) ===
          Number(assignment.section_id);
      const text = `
        ${studentName(student)}
        ${student.admission_number || ""}
        ${student.phone || ""}
      `.toLowerCase();

      return (
        classMatches &&
        sectionMatches &&
        text.includes(
          personSearch.toLowerCase()
        )
      );
    });

  const filteredTeachers =
    teachers.filter((teacher) => {
      const assignments =
        Array.isArray(
          teacher.assignments
        )
          ? teacher.assignments
          : [];
      const classMatches =
        !assignment.class_id ||
        assignments.some(
          (item: any) =>
            Number(item.class_id) ===
            Number(assignment.class_id)
        );
      const sectionMatches =
        !assignment.section_id ||
        assignments.some(
          (item: any) =>
            Number(item.section_id) ===
            Number(assignment.section_id)
        );
      const text = `
        ${teacherName(teacher)}
        ${teacher.employee_id || ""}
        ${teacher.phone || ""}
      `.toLowerCase();

      return (
        classMatches &&
        sectionMatches &&
        text.includes(
          personSearch.toLowerCase()
        )
      );
    });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Transport Operations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Vehicles, routes, and student transport assignments.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <Bus size={20} />
              <h2 className="text-xl font-black">
                Add Vehicle
              </h2>
            </div>
            <div className="space-y-3">
              {[
                "vehicle_number",
                "vehicle_type",
                "capacity",
                "driver_name",
                "driver_phone",
              ].map((key) => (
                <Input
                  key={key}
                  label={key.replaceAll(
                    "_",
                    " "
                  )}
                  value={
                    vehicle[
                      key as keyof typeof vehicle
                    ]
                  }
                  onChange={(value) =>
                    setVehicle(
                      (previous) => ({
                        ...previous,
                        [key]: value,
                      })
                    )
                  }
                />
              ))}
              {canCreateTransport && (
                <button
                className="tt-button w-full"
                onClick={() =>
                  save(
                    vehicle,
                    "Vehicle added"
                  )
                }
              >
                Add Vehicle
                </button>
              )}
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <Route size={20} />
              <h2 className="text-xl font-black">
                Create Route
              </h2>
            </div>
            <div className="space-y-3">
              {[
                "route_name",
                "vehicle_number",
                "driver_name",
                "driver_phone",
              ].map((key) => (
                <Input
                  key={key}
                  label={key.replaceAll(
                    "_",
                    " "
                  )}
                  value={
                    route[
                      key as keyof typeof route
                    ]
                  }
                  onChange={(value) =>
                    setRoute(
                      (previous) => ({
                        ...previous,
                        [key]: value,
                      })
                    )
                  }
                />
              ))}
              {canCreateTransport && (
                <button
                className="tt-button w-full"
                onClick={() =>
                  save(
                    route,
                    "Route created"
                  )
                }
              >
                Create Route
                </button>
              )}
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <UserPlus size={20} />
              <h2 className="text-xl font-black">
                Assign Transport
              </h2>
            </div>
            <div className="space-y-3">
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Assign To
                </span>
                <select
                  className="input"
                  value={
                    assignment.assigned_to_type
                  }
                  onChange={(event) =>
                    setAssignment({
                      ...assignment,
                      assigned_to_type:
                        event.target.value,
                      student_id: "",
                      teacher_id: "",
                    })
                  }
                >
                  <option value="STUDENT">
                    Student
                  </option>
                  <option value="TEACHER">
                    Teacher / Staff
                  </option>
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Class
                </span>
                <select
                  className="input"
                  value={
                    assignment.class_id
                  }
                  onChange={(event) =>
                    setAssignment({
                      ...assignment,
                      class_id:
                        event.target.value,
                      section_id: "",
                      student_id: "",
                      teacher_id: "",
                    })
                  }
                >
                  <option value="">
                    All Classes
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
                    assignment.section_id
                  }
                  disabled={
                    !assignment.class_id
                  }
                  onChange={(event) =>
                    setAssignment({
                      ...assignment,
                      section_id:
                        event.target.value,
                      student_id: "",
                      teacher_id: "",
                    })
                  }
                >
                  <option value="">
                    All Sections
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
              <Input
                label="search person"
                value={personSearch}
                onChange={setPersonSearch}
              />
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  {assignment.assigned_to_type ===
                  "TEACHER"
                    ? "Teacher / Staff"
                    : "Student"}
                </span>
                <select
                  className="input"
                  value={
                    assignment.assigned_to_type ===
                    "TEACHER"
                      ? assignment.teacher_id
                      : assignment.student_id
                  }
                  onChange={(event) =>
                    setAssignment({
                      ...assignment,
                      student_id:
                        assignment.assigned_to_type ===
                        "STUDENT"
                          ? event.target.value
                          : "",
                      teacher_id:
                        assignment.assigned_to_type ===
                        "TEACHER"
                          ? event.target.value
                          : "",
                    })
                  }
                >
                  <option value="">
                    Select{" "}
                    {assignment.assigned_to_type ===
                    "TEACHER"
                      ? "Teacher"
                      : "Student"}
                  </option>
                  {(assignment.assigned_to_type ===
                  "TEACHER"
                    ? filteredTeachers
                    : filteredStudents
                  ).map((person) => (
                    <option
                      key={person.id}
                      value={person.id}
                    >
                      {assignment.assigned_to_type ===
                      "TEACHER"
                        ? teacherName(person)
                        : studentName(person)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Route
                </span>
                <select
                  className="input"
                  value={
                    assignment.route_id
                  }
                  onChange={(event) =>
                    setAssignment({
                      ...assignment,
                      route_id:
                        event.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Route
                  </option>
                  {routes.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.route_name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="pickup point"
                value={
                  assignment.pickup_point
                }
                onChange={(value) =>
                  setAssignment({
                    ...assignment,
                    pickup_point: value,
                  })
                }
              />
              <Input
                label="drop point"
                value={
                  assignment.drop_point
                }
                onChange={(value) =>
                  setAssignment({
                    ...assignment,
                    drop_point: value,
                  })
                }
              />
              {canCreateTransport && (
                <button
                className="tt-button w-full"
                onClick={() =>
                  save(
                    assignment,
                    "Transport assigned"
                  )
                }
              >
                Assign{" "}
                {assignment.assigned_to_type ===
                "TEACHER"
                  ? "Teacher"
                  : "Student"}
                </button>
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ListSection
            title="Vehicles"
            icon={<Bus size={20} />}
          >
            {vehicles.map((item) => (
              <MiniCard
                key={item.id}
                title={item.vehicle_number}
                subtitle={
                  item.vehicle_type ||
                  "Vehicle"
                }
                meta={`${item.driver_name || "-"} · ${item.driver_phone || "-"}`}
                actions={
                  <>
                    {canUpdateTransport && (
                      <button
                        type="button"
                        onClick={() =>
                          editVehicle(
                            item
                          )
                        }
                        className="tt-button-secondary px-3 py-2 text-xs"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteTransport && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteTransport(
                            "vehicle",
                            item.id
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </>
                }
              />
            ))}
          </ListSection>

          <ListSection
            title="Routes"
            icon={<MapPinned size={20} />}
          >
            {routes.map((item) => (
              <MiniCard
                key={item.id}
                title={item.route_name}
                subtitle={
                  item.vehicle_number ||
                  "No vehicle"
                }
                meta={`${item.driver_name || "-"} · ${item.driver_phone || "-"}`}
                actions={
                  <>
                    {canUpdateTransport && (
                      <button
                        type="button"
                        onClick={() =>
                          editRoute(item)
                        }
                        className="tt-button-secondary px-3 py-2 text-xs"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteTransport && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteTransport(
                            "route",
                            item.id
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </>
                }
              />
            ))}
          </ListSection>

          <ListSection
            title="Assignments"
            icon={<UserPlus size={20} />}
          >
            {assignments.map((item) => (
              <MiniCard
                key={item.id}
                title={
                  item.assigned_to_type ===
                  "TEACHER"
                    ? teacherName(item)
                    : studentName(item)
                }
                subtitle={
                  item.route_name ||
                  "No route"
                }
                meta={`${item.assigned_to_type || "STUDENT"} · ${item.pickup_point || "-"} -> ${item.drop_point || "-"}`}
                actions={
                  canDeleteTransport ? (
                    <button
                      type="button"
                      onClick={() =>
                        deleteTransport(
                          "assignment",
                          item.id
                        )
                      }
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                    >
                      Delete
                    </button>
                  ) : null
                }
              />
            ))}
          </ListSection>
        </div>
      </div>
    </Layout>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold capitalize text-slate-700">
        {label}
      </span>
      <input
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function ListSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="tt-card tt-card-pad">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-black">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function MiniCard({
  title,
  subtitle,
  meta,
  actions,
}: {
  title: string;
  subtitle: string;
  meta: string;
  actions?: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="truncate font-black">
        {title || "-"}
      </h3>
      <p className="truncate text-sm font-semibold text-amber-700">
        {subtitle || "-"}
      </p>
      <p className="mt-2 truncate text-sm text-slate-600">
        {meta || "-"}
      </p>
      {actions ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions}
        </div>
      ) : null}
    </article>
  );
}
