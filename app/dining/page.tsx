"use client";

import {
  CalendarDays,
  CheckCircle,
  Utensils,
} from "lucide-react";
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

const mealTypes = [
  "BREAKFAST",
  "LUNCH",
  "SNACKS",
  "DINNER",
];

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const initialPlan = {
  kind: "meal_plan",
  plan_name: "",
  meal_type: "LUNCH",
  price: "",
};

const initialAttendance = {
  kind: "attendance",
  class_id: "",
  section_id: "",
  student_id: "",
  meal_type: "LUNCH",
  attendance_date: new Date()
    .toISOString()
    .slice(0, 10),
  status: "PRESENT",
  remarks: "",
};

const initialMenu = {
  kind: "weekly_menu",
  week_start: new Date()
    .toISOString()
    .slice(0, 10),
  day_of_week: "MONDAY",
  meal_type: "LUNCH",
  menu_items: "",
  nutrition_notes: "",
};

export default function DiningPage() {
  const [students, setStudents] =
    useState<any[]>([]);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [studentSearch, setStudentSearch] =
    useState("");
  const [mealPlans, setMealPlans] =
    useState<any[]>([]);
  const [attendance, setAttendance] =
    useState<any[]>([]);
  const [menus, setMenus] =
    useState<any[]>([]);
  const [planForm, setPlanForm] =
    useState(initialPlan);
  const [
    attendanceForm,
    setAttendanceForm,
  ] = useState(initialAttendance);
  const [menuForm, setMenuForm] =
    useState(initialMenu);
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
        diningPayload,
        roster,
      ] = await Promise.all([
        apiJson<any>("/api/dining"),
        apiJson<any>("/api/roster"),
      ]);

      setMealPlans(
        diningPayload.mealPlans || []
      );
      setAttendance(
        diningPayload.diningAttendance ||
          []
      );
      setMenus(
        diningPayload.weeklyMenus || []
      );
      setStudents(
        Array.isArray(roster.students)
          ? roster.students
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
          "Failed to load dining"
        )
      );
    }
  };

  const saveDining = async (
    payload: Record<string, unknown>,
    success: string
  ) => {
    try {
      await apiJson("/api/dining", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      notify.success(success);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save dining data"
        )
      );
    }
  };

  const canCreateMealPlan =
    canManageRecord(
      role,
      "meal_plan",
      "create"
    );
  const canUpdateMealPlan =
    canManageRecord(
      role,
      "meal_plan",
      "update"
    );
  const canDeleteMealPlan =
    canManageRecord(
      role,
      "meal_plan",
      "delete"
    );
  const canCreateMenu =
    canManageRecord(
      role,
      "dining_menu",
      "create"
    );
  const canUpdateMenu =
    canManageRecord(
      role,
      "dining_menu",
      "update"
    );
  const canDeleteMenu =
    canManageRecord(
      role,
      "dining_menu",
      "delete"
    );

  const updateDining = async (
    payload: Record<string, unknown>,
    message: string
  ) => {
    try {
      await apiJson("/api/dining", {
        method: "PATCH",
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
          "Failed to update dining record"
        )
      );
    }
  };

  const deleteDining = async (
    kind: string,
    id: number
  ) => {
    if (
      !confirm(
        `Delete this ${kind.replaceAll("_", " ")}?`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/dining?kind=${kind}&id=${id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Dining record deleted"
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete dining record"
        )
      );
    }
  };

  const editMealPlan = (
    plan: any
  ) => {
    const planName = prompt(
      "Meal plan name",
      plan.plan_name || ""
    );

    if (!planName) {
      return;
    }

    void updateDining(
      {
        ...plan,
        kind: "meal_plan",
        id: plan.id,
        plan_name: planName,
      },
      "Meal plan updated"
    );
  };

  const editMenu = (
    menu: any
  ) => {
    const menuItems = prompt(
      "Menu items, comma separated",
      Array.isArray(
        menu.menu_items
      )
        ? menu.menu_items.join(
            ", "
          )
        : String(
            menu.menu_items ||
              ""
          )
    );

    if (!menuItems) {
      return;
    }

    void updateDining(
      {
        ...menu,
        kind: "weekly_menu",
        id: menu.id,
        menu_items: menuItems,
      },
      "Menu updated"
    );
  };

  const nameForStudent = (
    row: any
  ) =>
    [
      row.first_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    `Student ${row.student_id || row.id}`;

  const filteredSections =
    sections.filter(
      (section) =>
        !attendanceForm.class_id ||
        Number(section.class_id) ===
          Number(attendanceForm.class_id)
    );

  const filteredStudents =
    students.filter((student) => {
      const classMatches =
        !attendanceForm.class_id ||
        Number(student.class_id) ===
          Number(
            attendanceForm.class_id
          );
      const sectionMatches =
        !attendanceForm.section_id ||
        Number(student.section_id) ===
          Number(
            attendanceForm.section_id
          );
      const text = `
        ${nameForStudent(student)}
        ${student.admission_number || ""}
        ${student.enrollment_number || ""}
        ${student.phone || ""}
      `.toLowerCase();

      return (
        classMatches &&
        sectionMatches &&
        text.includes(
          studentSearch.toLowerCase()
        )
      );
    });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Dining Operations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Meal plans, meal attendance, and weekly menus for the selected school/college year.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <Utensils size={20} />
              <h2 className="text-xl font-black">
                Meal Plan
              </h2>
            </div>
            <div className="space-y-3">
              <Input
                label="Plan Name"
                value={planForm.plan_name}
                onChange={(value) =>
                  setPlanForm({
                    ...planForm,
                    plan_name: value,
                  })
                }
              />
              <Select
                label="Meal"
                value={planForm.meal_type}
                onChange={(value) =>
                  setPlanForm({
                    ...planForm,
                    meal_type: value,
                  })
                }
                options={mealTypes}
              />
              <Input
                label="Price"
                value={planForm.price}
                onChange={(value) =>
                  setPlanForm({
                    ...planForm,
                    price: value,
                  })
                }
              />
              {canCreateMealPlan && (
                <button
                onClick={() =>
                  saveDining(
                    planForm,
                    "Meal plan created"
                  )
                }
                className="tt-button w-full"
              >
                Add Meal Plan
                </button>
              )}
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              <h2 className="text-xl font-black">
                Meal Attendance
              </h2>
            </div>
            <div className="space-y-3">
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Class
                </span>
                <select
                  className="input"
                  value={
                    attendanceForm.class_id
                  }
                  onChange={(event) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      class_id:
                        event.target.value,
                      section_id: "",
                      student_id: "",
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
                    attendanceForm.section_id
                  }
                  disabled={
                    !attendanceForm.class_id
                  }
                  onChange={(event) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      section_id:
                        event.target.value,
                      student_id: "",
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
                label="Search Student"
                value={studentSearch}
                onChange={setStudentSearch}
              />
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Student
                </span>
                <select
                  className="input"
                  value={
                    attendanceForm.student_id
                  }
                  onChange={(event) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      student_id:
                        event.target.value,
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
                        {nameForStudent(
                          student
                        )}
                        {student.class_name
                          ? ` - ${student.class_name}${student.section_name ? ` ${student.section_name}` : ""}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </label>
              <Select
                label="Meal"
                value={
                  attendanceForm.meal_type
                }
                onChange={(value) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    meal_type: value,
                  })
                }
                options={mealTypes}
              />
              <Input
                label="Date"
                type="date"
                value={
                  attendanceForm.attendance_date
                }
                onChange={(value) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    attendance_date:
                      value,
                  })
                }
              />
              <Select
                label="Status"
                value={
                  attendanceForm.status
                }
                onChange={(value) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    status: value,
                  })
                }
                options={[
                  "PRESENT",
                  "ABSENT",
                  "SKIPPED",
                ]}
              />
              {canCreateMenu && (
                <button
                  onClick={() =>
                    saveDining(
                      attendanceForm,
                      "Meal attendance recorded"
                    )
                  }
                  className="tt-button w-full"
                >
                  Record Attendance
                </button>
              )}
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={20} />
              <h2 className="text-xl font-black">
                Weekly Menu
              </h2>
            </div>
            <div className="space-y-3">
              <Input
                label="Week Start"
                type="date"
                value={menuForm.week_start}
                onChange={(value) =>
                  setMenuForm({
                    ...menuForm,
                    week_start: value,
                  })
                }
              />
              <Select
                label="Day"
                value={menuForm.day_of_week}
                onChange={(value) =>
                  setMenuForm({
                    ...menuForm,
                    day_of_week: value,
                  })
                }
                options={days}
              />
              <Select
                label="Meal"
                value={menuForm.meal_type}
                onChange={(value) =>
                  setMenuForm({
                    ...menuForm,
                    meal_type: value,
                  })
                }
                options={mealTypes}
              />
              <Input
                label="Menu Items"
                value={menuForm.menu_items}
                onChange={(value) =>
                  setMenuForm({
                    ...menuForm,
                    menu_items: value,
                  })
                }
              />
              {canCreateMenu && (
                <button
                onClick={() =>
                  saveDining(
                    menuForm,
                    "Weekly menu added"
                  )
                }
                className="tt-button w-full"
              >
                Add Menu
                </button>
              )}
            </div>
          </section>
        </div>

        <section className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Menu Calendar
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {menus.map((menu) => (
              <article
                key={menu.id}
                className="
                  min-h-[150px]
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black">
                      {menu.day_of_week}
                    </h3>
                    <p className="text-sm font-semibold text-amber-700">
                      {menu.meal_type}
                    </p>
                  </div>
                  <span className="tt-badge">
                    {menu.week_start
                      ? new Date(
                          menu.week_start
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-700">
                  {Array.isArray(
                    menu.menu_items
                  )
                    ? menu.menu_items.join(
                        ", "
                      )
                    : String(
                        menu.menu_items ||
                          "-"
                      )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {canUpdateMenu && (
                    <button
                      type="button"
                      onClick={() =>
                        editMenu(menu)
                      }
                      className="tt-button-secondary px-3 py-2 text-xs"
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteMenu && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteDining(
                          "weekly_menu",
                          menu.id
                        )
                      }
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="
            grid
            gap-4
            xl:grid-cols-2
          "
        >
          <div className="tt-card tt-card-pad">
            <h2 className="mb-4 text-xl font-black">
              Meal Plans
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {mealPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <h3 className="truncate font-black">
                    {plan.plan_name}
                  </h3>
                  <p className="text-sm text-amber-700">
                    {plan.meal_type} · ₹
                    {Number(
                      plan.price || 0
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {canUpdateMealPlan && (
                      <button
                        type="button"
                        onClick={() =>
                          editMealPlan(
                            plan
                          )
                        }
                        className="tt-button-secondary px-3 py-2 text-xs"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteMealPlan && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteDining(
                            "meal_plan",
                            plan.id
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tt-card tt-card-pad">
            <h2 className="mb-4 text-xl font-black">
              Recent Meal Attendance
            </h2>
            <div className="grid gap-3">
              {attendance
                .slice(0, 8)
                .map((row) => (
                  <div
                    key={row.id}
                    className="
                      grid
                      gap-3
                      rounded-lg
                      border
                      border-slate-200
                      p-4
                      md:grid-cols-5
                    "
                  >
                    <strong className="truncate">
                      {nameForStudent(row)}
                    </strong>
                    <span className="truncate">
                      {row.class_name ||
                        "-"}
                      {row.section_name
                        ? ` ${row.section_name}`
                        : ""}
                    </span>
                    <span className="truncate">
                      {row.meal_type}
                    </span>
                    <span className="truncate">
                      {row.attendance_date
                        ? new Date(
                            row.attendance_date
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                    <span className="tt-badge">
                      {row.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
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
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
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
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
