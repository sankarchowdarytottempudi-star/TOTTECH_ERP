"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Invoice = {
  id: number;
  invoice_number?: string | null;
  student_id?: number | null;
  class_id?: number | null;
  section_id?: number | null;
  student_name?: string | null;
  admission_number?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  due_date?: string | null;
  total_amount?: string | number | null;
  paid_amount?: string | number | null;
  balance_amount?: string | number | null;
  status?: string | null;
};

type RosterOption = {
  id: number;
  class_id?: number | null;
  section_id?: number | null;
  class_name?: string | null;
  section_name?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  admission_number?: string | null;
};

export default function PendingFeesPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);
  const [classes, setClasses] =
    useState<RosterOption[]>([]);
  const [sections, setSections] =
    useState<RosterOption[]>([]);
  const [students, setStudents] =
    useState<RosterOption[]>([]);
  const [classId, setClassId] =
    useState("");
  const [sectionId, setSectionId] =
    useState("");
  const [studentId, setStudentId] =
    useState("");
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const [
        payload,
        rosterPayload,
      ] = await Promise.all([
        apiJson<any>(
          "/api/finance/invoices"
        ),
        apiJson<any>("/api/roster"),
      ]);
      setInvoices(
        payload.invoices || []
      );
      setClasses(
        rosterPayload.classes || []
      );
      setSections(
        rosterPayload.sections || []
      );
      setStudents(
        rosterPayload.students || []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load pending fees"
        )
      );
    }
  };

  const pending = useMemo(
    () =>
      invoices
        .filter(
          (invoice) =>
            Number(
              invoice.balance_amount || 0
            ) > 0 ||
            String(
              invoice.status || ""
            ).toUpperCase() ===
              "PENDING"
        )
        .filter((invoice) => {
          const text = `
            ${invoice.invoice_number || ""}
            ${invoice.student_name || ""}
            ${invoice.admission_number || ""}
            ${invoice.class_name || ""}
            ${invoice.section_name || ""}
            ${invoice.status || ""}
          `.toLowerCase();

          const matchesSearch =
            text.includes(
              search.toLowerCase()
            );
          const matchesClass =
            !classId ||
            String(invoice.class_id) ===
              classId;
          const matchesSection =
            !sectionId ||
            String(invoice.section_id) ===
              sectionId;
          const matchesStudent =
            !studentId ||
            String(invoice.student_id) ===
              studentId;

          return (
            matchesSearch &&
            matchesClass &&
            matchesSection &&
            matchesStudent
          );
        }),
    [
      invoices,
      search,
      classId,
      sectionId,
      studentId,
    ]
  );

  const visibleSections =
    sections.filter(
      (section) =>
        !classId ||
        String(section.class_id) ===
          classId
    );
  const visibleStudents =
    students.filter(
      (student) =>
        (!classId ||
          String(student.class_id) ===
            classId) &&
        (!sectionId ||
          String(
            student.section_id
          ) === sectionId)
    );

  const totalPending = pending.reduce(
    (sum, invoice) =>
      sum +
      Number(
        invoice.balance_amount || 0
      ),
    0
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Pending Fees
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Outstanding invoice balances for follow-up and recovery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="tt-card tt-card-pad">
            <p className="text-sm font-bold text-slate-500">
              Pending Invoices
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {pending.length}
            </h2>
          </div>
          <div className="tt-card tt-card-pad md:col-span-2">
            <p className="text-sm font-bold text-slate-500">
              Pending Amount
            </p>
            <h2 className="mt-2 text-3xl font-black">
              ₹{totalPending}
            </h2>
          </div>
        </div>

        <div className="tt-card tt-card-pad">
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <Select
              label="Class"
              value={classId}
              onChange={(value) => {
                setClassId(value);
                setSectionId("");
                setStudentId("");
              }}
            >
              <option value="">
                All Classes
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
            </Select>
            <Select
              label="Section"
              value={sectionId}
              onChange={(value) => {
                setSectionId(value);
                setStudentId("");
              }}
              disabled={!classId}
            >
              <option value="">
                All Sections
              </option>
              {visibleSections.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.section_name ||
                      `Section ${item.id}`}
                  </option>
                )
              )}
            </Select>
            <Select
              label="Student"
              value={studentId}
              onChange={setStudentId}
            >
              <option value="">
                All Students
              </option>
              {visibleStudents.map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name ||
                      `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
                      `Student ${student.id}`}
                    {student.admission_number
                      ? ` (${student.admission_number})`
                      : ""}
                  </option>
                )
              )}
            </Select>
          </div>
          <input
            className="input"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search pending invoice or student..."
          />
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {pending.map((invoice) => (
            <article
              key={invoice.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-lg
                    bg-amber-50
                    text-amber-800
                  "
                >
                  <AlertTriangle size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {invoice.student_name ||
                      `Student ${invoice.student_id || "-"}`}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {invoice.invoice_number ||
                      `Invoice ${invoice.id}`}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm xl:grid-cols-4">
                <Info
                  label="Class"
                  value={
                    [
                      invoice.class_name,
                      invoice.section_name,
                    ]
                      .filter(Boolean)
                      .join(" ") || "-"
                  }
                />
                <Info
                  label="Total"
                  value={`₹${Number(
                    invoice.total_amount || 0
                  )}`}
                />
                <Info
                  label="Paid"
                  value={`₹${Number(
                    invoice.paid_amount || 0
                  )}`}
                />
                <Info
                  label="Balance"
                  value={`₹${Number(
                    invoice.balance_amount || 0
                  )}`}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="tt-badge">
                  {invoice.status ||
                    "PENDING"}
                </span>
                <span className="truncate text-sm text-slate-600">
                  Due{" "}
                  {invoice.due_date
                    ? new Date(
                        invoice.due_date
                      ).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        className="input"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
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
