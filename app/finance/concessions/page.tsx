"use client";

import {
  Check,
  IndianRupee,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Concession = {
  id: number;
  student_id?: number | null;
  invoice_id?: number | null;
  fee_category_id?: number | null;
  requested_amount?: string | number | null;
  approved_amount?: string | number | null;
  reason?: string | null;
  status?: string | null;
  requested_at?: string | null;
  student_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  invoice_number?: string | null;
};

const initialForm = {
  class_id: "",
  section_id: "",
  student_id: "",
  invoice_id: "",
  fee_category_id: "",
  requested_amount: "",
  reason: "",
};

export default function ConcessionsPage() {
  const [concessions, setConcessions] =
    useState<Concession[]>([]);
  const [students, setStudents] =
    useState<any[]>([]);
  const [classes, setClasses] =
    useState<any[]>([]);
  const [sections, setSections] =
    useState<any[]>([]);
  const [invoices, setInvoices] =
    useState<any[]>([]);
  const [categories, setCategories] =
    useState<any[]>([]);
  const [form, setForm] =
    useState(initialForm);
  const [studentSearch, setStudentSearch] =
    useState("");
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        concessionsPayload,
        roster,
        invoicePayload,
        categoryRows,
      ] = await Promise.all([
        apiJson<any>("/api/concessions"),
        apiJson<any>("/api/roster"),
        apiJson<any>(
          "/api/finance/invoices"
        ),
        apiJson<any[]>(
          "/api/fee-categories"
        ),
      ]);

      setConcessions(
        concessionsPayload.concessions ||
          []
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
      setInvoices(
        invoicePayload.invoices || []
      );
      setCategories(
        Array.isArray(categoryRows)
          ? categoryRows
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load concessions"
        )
      );
    }
  };

  const createConcession = async () => {
    try {
      setSaving(true);
      await apiJson("/api/concessions", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      notify.success(
        "Concession request created"
      );
      setForm(initialForm);
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to create concession"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const decide = async (
    concession: Concession,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await apiJson(
        `/api/concessions/${concession.id}/approval`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
            approved_amount:
              status === "APPROVED"
                ? concession.requested_amount
                : 0,
            comments:
              status.toLowerCase(),
          }),
        }
      );

      notify.success(
        `Concession ${status.toLowerCase()}`
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update concession"
        )
      );
    }
  };

  const studentName = (
    id?: number | null
  ) => {
    const student = students.find(
      (item) => item.id === id
    );
    return (
      [
        student?.first_name,
        student?.last_name,
      ]
        .filter(Boolean)
      .join(" ") || `Student ${id || "-"}`
    );
  };

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  const filteredStudents =
    students.filter((student) => {
      const classMatches =
        !form.class_id ||
        Number(student.class_id) ===
          Number(form.class_id);
      const sectionMatches =
        !form.section_id ||
        Number(student.section_id) ===
          Number(form.section_id);
      const text = `
        ${studentName(student.id)}
        ${student.admission_number || ""}
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

  const filteredInvoices =
    invoices.filter(
      (invoice) =>
        !form.student_id ||
        Number(invoice.student_id) ===
          Number(form.student_id)
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Fee Concessions
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create, approve, reject, and audit concession requests.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Create Concession Request
          </h2>
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-5
            "
          >
            <Select
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  class_id: value,
                  section_id: "",
                  student_id: "",
                  invoice_id: "",
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
            </Select>
            <Select
              label="Section"
              value={form.section_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  section_id: value,
                  student_id: "",
                  invoice_id: "",
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
            </Select>
            <Input
              label="Search Student"
              value={studentSearch}
              onChange={setStudentSearch}
            />
            <Select
              label="Student"
              value={form.student_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  student_id: value,
                  invoice_id: "",
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
                    {studentName(student.id)}
                    {student.admission_number
                      ? ` - ${student.admission_number}`
                      : ""}
                  </option>
                )
              )}
            </Select>
            <Select
              label="Invoice"
              value={form.invoice_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  invoice_id: value,
                })
              }
            >
              <option value="">
                Optional
              </option>
              {filteredInvoices.map((invoice) => (
                <option
                  key={invoice.id}
                  value={invoice.id}
                >
                  {invoice.invoice_number ||
                    `Invoice ${invoice.id}`}
                </option>
              ))}
            </Select>
            <Select
              label="Fee Category"
              value={form.fee_category_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  fee_category_id: value,
                })
              }
            >
              <option value="">
                Optional
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.fee_name}
                </option>
              ))}
            </Select>
            <Input
              label="Amount"
              value={
                form.requested_amount
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  requested_amount:
                    value,
                })
              }
            />
            <Input
              label="Reason"
              value={form.reason}
              onChange={(value) =>
                setForm({
                  ...form,
                  reason: value,
                })
              }
            />
          </div>
          <button
            onClick={createConcession}
            disabled={saving}
            className="tt-button mt-5 inline-flex items-center gap-2"
          >
            <IndianRupee size={17} />
            {saving
              ? "Creating..."
              : "Create Request"}
          </button>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {concessions.map(
            (concession) => (
              <article
                key={concession.id}
                className="tt-card tt-card-pad"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black">
                      {concession.student_name ||
                        studentName(
                          concession.student_id
                        )}
                    </h2>
                    <p className="text-sm font-semibold text-amber-700">
                      {concession.class_name ||
                        "-"}
                      {concession.section_name
                        ? ` ${concession.section_name}`
                        : ""}{" "}
                      · Request #{concession.id}
                    </p>
                  </div>
                  <span className="tt-badge">
                    {concession.status ||
                      "PENDING"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info
                    label="Requested"
                    value={`₹${Number(
                      concession.requested_amount ||
                        0
                    )}`}
                  />
                  <Info
                    label="Approved"
                    value={`₹${Number(
                      concession.approved_amount ||
                        0
                    )}`}
                  />
                </div>

                <p className="mt-4 min-h-10 text-sm text-slate-600">
                  {concession.reason ||
                    "No reason recorded"}
                </p>

                {concession.status ===
                  "PENDING" && (
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        decide(
                          concession,
                          "APPROVED"
                        )
                      }
                      className="tt-button inline-flex items-center justify-center gap-2"
                    >
                      <Check size={15} />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        decide(
                          concession,
                          "REJECTED"
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-red-700
                      "
                    >
                      <X size={15} />
                      Reject
                    </button>
                  </div>
                )}
              </article>
            )
          )}
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
      <span className="mb-1 block text-sm font-bold text-slate-700">
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

function Select({
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
