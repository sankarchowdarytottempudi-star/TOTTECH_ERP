"use client";

import {
  Eye,
  Edit,
  FileText,
  Plus,
  Printer,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import {
  printBrandedDocument,
  printMetaGrid,
} from "@/lib/client/print";
import { notify } from "@/lib/notify";

type Invoice = {
  id: number;
  invoice_number?: string | null;
  student_id?: number | null;
  academic_year_id?: number | null;
  class_id?: number | null;
  section_id?: number | null;
  student_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  due_date?: string | null;
  total_amount?: string | number | null;
  paid_amount?: string | number | null;
  balance_amount?: string | number | null;
  status?: string | null;
  billing_scope?: string | null;
  billing_period?: string | null;
  installment_count?: number | null;
  line_items?: DetailRow[];
  installments?: DetailRow[];
  payments?: DetailRow[];
};

type InvoiceDetail = {
  invoice?: Invoice;
  line_items?: DetailRow[];
  installments?: DetailRow[];
  payments?: DetailRow[];
};

type DetailRow = Record<
  string,
  string | number | boolean | null | undefined
>;

type RosterStudent = {
  id: number | string;
  class_id?: number | string | null;
  section_id?: number | string | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  admission_number?: string | null;
  phone?: string | null;
};

type RosterClass = {
  id: number | string;
  class_name?: string | null;
};

type RosterSection = {
  id: number | string;
  class_id?: number | string | null;
  section_name?: string | null;
};

type FeeCategory = {
  id: number | string;
  fee_name?: string | null;
  amount?: string | number | null;
};

type RosterPayload = {
  students?: RosterStudent[];
  classes?: RosterClass[];
  sections?: RosterSection[];
};

type AcademicYearOption = {
  id: number | string;
  academic_year?: string | null;
  is_selected?: boolean | null;
};

type InvoiceSearchFilters = {
  class_id: string;
  section_id: string;
  academic_year_id: string;
  student_id: string;
};

const initialInvoiceSearchFilters: InvoiceSearchFilters =
  {
    class_id: "",
    section_id: "",
    academic_year_id: "",
    student_id: "",
  };

type InvoicePayload = {
  invoices?: Invoice[];
};

const initialForm = {
  billing_scope: "STUDENT",
  class_id: "",
  section_id: "",
  student_id: "",
  due_date: "",
  installment_mode: "SINGLE",
  installment_count: "1",
};

const initialEditForm = {
  invoice_date: "",
  due_date: "",
  total_amount: "",
  status: "PENDING",
};

export default function InvoicesPage() {
  const [students, setStudents] =
    useState<RosterStudent[]>([]);
  const [classes, setClasses] =
    useState<RosterClass[]>([]);
  const [sections, setSections] =
    useState<RosterSection[]>([]);
  const [categories, setCategories] =
    useState<FeeCategory[]>([]);
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);
  const [academicYears, setAcademicYears] =
    useState<AcademicYearOption[]>([]);
  const [form, setForm] =
    useState(initialForm);
  const [categoryIds, setCategoryIds] =
    useState<string[]>([]);
  const [studentSearch, setStudentSearch] =
    useState("");
  const [
    invoiceSearchFilters,
    setInvoiceSearchFilters,
  ] = useState<InvoiceSearchFilters>(
    initialInvoiceSearchFilters
  );
  const [saving, setSaving] =
    useState(false);
  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState<InvoiceDetail | null>(
    null
  );
  const [
    editingInvoice,
    setEditingInvoice,
  ] = useState<Invoice | null>(null);
  const [editForm, setEditForm] =
    useState(initialEditForm);
  const [actionBusy, setActionBusy] =
    useState<number | null>(null);

  async function loadData() {
    try {
      const [
        roster,
        categoryRows,
        invoicePayload,
        yearPayload,
      ] = await Promise.all([
        apiJson<RosterPayload>("/api/roster"),
        apiJson<FeeCategory[]>(
          "/api/fee-categories"
        ),
        apiJson<InvoicePayload>(
          "/api/finance/invoices"
        ),
        apiJson<AcademicYearOption[]>(
          "/api/academic-years?include_all=true"
        ),
      ]);

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
      setCategories(
        Array.isArray(categoryRows)
          ? categoryRows
          : []
      );
      setInvoices(
        invoicePayload.invoices || []
      );
      setAcademicYears(
        Array.isArray(yearPayload)
          ? yearPayload
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load invoices"
        )
      );
    }
  }

  useEffect(() => {
    void Promise.resolve().then(
      loadData
    );
  }, []);

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        Number(section.class_id) ===
          Number(form.class_id)
    );

  const filteredStudents =
    useMemo(
      () =>
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
            ${student.first_name || ""}
            ${student.last_name || ""}
            ${student.name || ""}
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
        }),
      [
        students,
        form.class_id,
        form.section_id,
        studentSearch,
      ]
    );

  const selectedAmount =
    categories
      .filter((category) =>
        categoryIds.includes(
          String(category.id)
        )
      )
      .reduce(
        (sum, category) =>
          sum +
          Number(
            category.amount || 0
          ),
        0
      );
  const invoiceSearchSections =
    sections.filter(
      (section) =>
        !invoiceSearchFilters.class_id ||
        Number(section.class_id) ===
          Number(
            invoiceSearchFilters.class_id
          )
    );

  const invoiceSearchStudents =
    students.filter((student) => {
      const classMatches =
        !invoiceSearchFilters.class_id ||
        Number(student.class_id) ===
          Number(
            invoiceSearchFilters.class_id
          );
      const sectionMatches =
        !invoiceSearchFilters.section_id ||
        Number(student.section_id) ===
          Number(
            invoiceSearchFilters.section_id
          );

      return (
        classMatches && sectionMatches
      );
    });

  const invoiceSearchFilterCount =
    Object.values(
      invoiceSearchFilters
    ).filter(Boolean).length;
  const canSearchInvoices =
    invoiceSearchFilterCount >= 3;

  const filteredInvoices =
    useMemo(
      () =>
        canSearchInvoices
          ? invoices.filter((invoice) => {
              const matchesClass =
                !invoiceSearchFilters.class_id ||
                String(invoice.class_id) ===
                  invoiceSearchFilters.class_id;
              const matchesSection =
                !invoiceSearchFilters.section_id ||
                String(
                  invoice.section_id
                ) ===
                  invoiceSearchFilters.section_id;
              const matchesYear =
                !invoiceSearchFilters.academic_year_id ||
                invoiceSearchFilters.academic_year_id ===
                  "all" ||
                String(
                  invoice.academic_year_id ??
                    ""
                ) ===
                  invoiceSearchFilters.academic_year_id;
              const matchesStudent =
                !invoiceSearchFilters.student_id ||
                String(
                  invoice.student_id
                ) ===
                  invoiceSearchFilters.student_id;

              return (
                matchesClass &&
                matchesSection &&
                matchesYear &&
                matchesStudent
              );
            })
          : [],
      [
        invoices,
        invoiceSearchFilters,
        canSearchInvoices,
      ]
    );

  const targetCount =
    form.billing_scope ===
    "CLASS_SECTION"
      ? filteredStudents.length
      : form.student_id
      ? 1
      : 0;

  const toggleCategory = (
    id: string
  ) => {
    setCategoryIds((previous) =>
      previous.includes(id)
        ? previous.filter(
            (item) => item !== id
          )
        : [...previous, id]
    );
  };

  const generateInvoice = async () => {
    try {
      setSaving(true);
      await apiJson(
        "/api/finance/invoices",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            billing_scope:
              form.billing_scope,
            class_id:
              form.class_id || null,
            section_id:
              form.section_id || null,
            student_ids:
              form.billing_scope ===
              "STUDENT"
                ? [form.student_id]
                : [],
            fee_category_ids:
              categoryIds,
            due_date:
              form.due_date || null,
            installment_mode:
              form.installment_mode,
            installment_count:
              form.installment_count,
          }),
        }
      );

      notify.success(
        "Invoice generated"
      );
      setForm(initialForm);
      setCategoryIds([]);
      setStudentSearch("");
      setInvoiceSearchFilters(
        initialInvoiceSearchFilters
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to generate invoice"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const openInvoice = async (
    invoice: Invoice
  ) => {
    try {
      setActionBusy(invoice.id);
      const detail =
        await apiJson<InvoiceDetail>(
          `/api/finance/invoices/${invoice.id}`
        );
      setSelectedInvoice(detail);
      setEditingInvoice(null);
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to open invoice"
        )
      );
    } finally {
      setActionBusy(null);
    }
  };

  const startEditInvoice = (
    invoice: Invoice
  ) => {
    setSelectedInvoice(null);
    setEditingInvoice(invoice);
    setEditForm({
      invoice_date: "",
      due_date: invoice.due_date
        ? String(invoice.due_date).slice(
            0,
            10
          )
        : "",
      total_amount: String(
        invoice.total_amount || 0
      ),
      status:
        invoice.status || "PENDING",
    });
  };

  const saveInvoice = async () => {
    if (!editingInvoice) {
      return;
    }

    try {
      setActionBusy(
        editingInvoice.id
      );
      await apiJson(
        `/api/finance/invoices/${editingInvoice.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            editForm
          ),
        }
      );

      notify.success(
        "Invoice updated"
      );
      setEditingInvoice(null);
      setEditForm(initialEditForm);
      await loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to update invoice"
        )
      );
    } finally {
      setActionBusy(null);
    }
  };

  const deleteInvoice = async (
    invoice: Invoice
  ) => {
    if (
      !confirm(
        `Delete invoice ${invoice.invoice_number || invoice.id}? Paid invoices cannot be deleted.`
      )
    ) {
      return;
    }

    try {
      setActionBusy(invoice.id);
      await apiJson(
        `/api/finance/invoices/${invoice.id}`,
        {
          method: "DELETE",
        }
      );

      notify.success(
        "Invoice deleted"
      );
      setSelectedInvoice(null);
      setEditingInvoice(null);
      await loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete invoice"
        )
      );
    } finally {
      setActionBusy(null);
    }
  };

  const printInvoice = async (
    invoice: Invoice
  ) => {
    try {
      setActionBusy(invoice.id);
      const detail =
        await apiJson<InvoiceDetail>(
          `/api/finance/invoices/${invoice.id}`
        );

      if (!detail.invoice) {
        throw new Error(
          "Invoice details are missing."
        );
      }

      printInvoiceDocument(detail);
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to print invoice"
        )
      );
    } finally {
      setActionBusy(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Generate student, class, and section invoices with fee structures and installment parts.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Generate Invoice
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Invoice For"
              value={form.billing_scope}
              onChange={(value) =>
                setForm({
                  ...form,
                  billing_scope: value,
                  student_id: "",
                })
              }
            >
              <option value="STUDENT">
                One Student
              </option>
              <option value="CLASS_SECTION">
                Class / Section
              </option>
            </Select>
            <Select
              label="Class"
              value={form.class_id}
              onChange={(value) =>
                setForm({
                  ...form,
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
            </Select>
            <Select
              label="Section"
              value={form.section_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  section_id: value,
                  student_id: "",
                })
              }
              disabled={!form.class_id}
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
              label="Due Date"
              type="date"
              min={todayInput()}
              value={form.due_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  due_date: value,
                })
              }
            />
            {form.billing_scope ===
              "STUDENT" && (
              <>
                <Input
                  label="Search Student"
                  value={studentSearch}
                  onChange={
                    setStudentSearch
                  }
                />
                <Select
                  label="Student"
                  value={form.student_id}
                  onChange={(value) =>
                    setForm({
                      ...form,
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
                        {student.first_name ||
                          student.name ||
                          `Student ${student.id}`}
                        {student.last_name
                          ? ` ${student.last_name}`
                          : ""}
                        {student.admission_number
                          ? ` - ${student.admission_number}`
                          : ""}
                      </option>
                    )
                  )}
                </Select>
              </>
            )}
            <Select
              label="Payment Parts"
              value={form.installment_mode}
              onChange={(value) =>
                setForm({
                  ...form,
                  installment_mode: value,
                  installment_count:
                    value === "SINGLE"
                      ? "1"
                      : "3",
                })
              }
            >
              <option value="SINGLE">
                Single Invoice
              </option>
              <option value="MONTHLY">
                Monthly Parts
              </option>
              <option value="QUARTERLY">
                Quarterly Parts
              </option>
            </Select>
            {form.installment_mode !==
              "SINGLE" && (
              <Input
                label="Number of Parts"
                value={
                  form.installment_count
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    installment_count:
                      value,
                  })
                }
              />
            )}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <input
                  type="checkbox"
                  checked={categoryIds.includes(
                    String(category.id)
                  )}
                  onChange={() =>
                    toggleCategory(
                      String(category.id)
                    )
                  }
                  className="mt-1"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-950">
                    {category.fee_name}
                  </span>
                  <span className="block text-sm text-amber-700">
                    Rs.{" "}
                    {Number(
                      category.amount || 0
                    )}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 text-sm text-slate-700">
              <strong className="text-slate-950">
                {targetCount}
              </strong>{" "}
              invoice target(s), selected fee total{" "}
              <strong className="text-slate-950">
                Rs. {selectedAmount}
              </strong>
            </div>
            <button
              onClick={generateInvoice}
              disabled={saving}
              className="tt-button inline-flex items-center justify-center gap-2"
            >
              <Plus size={17} />
              {saving
                ? "Generating..."
                : "Generate"}
            </button>
          </div>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Generated Invoices
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Search invoices by selecting any three fields: class, section, academic year, and student name.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setInvoiceSearchFilters(
                  initialInvoiceSearchFilters
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700"
            >
              Clear Filters
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Class"
              value={
                invoiceSearchFilters.class_id
              }
              onChange={(value) =>
                setInvoiceSearchFilters(
                  (previous) => ({
                    ...previous,
                    class_id: value,
                    section_id: "",
                    student_id: "",
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
                  {item.class_name ||
                    `Class ${item.id}`}
                </option>
              ))}
            </Select>
            <Select
              label="Section"
              value={
                invoiceSearchFilters.section_id
              }
              onChange={(value) =>
                setInvoiceSearchFilters(
                  (previous) => ({
                    ...previous,
                    section_id: value,
                    student_id: "",
                  })
                )
              }
              disabled={
                !invoiceSearchFilters.class_id
              }
            >
              <option value="">
                Select Section
              </option>
              {invoiceSearchSections.map(
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
              label="Academic Year"
              value={
                invoiceSearchFilters.academic_year_id
              }
              onChange={(value) =>
                setInvoiceSearchFilters(
                  (previous) => ({
                    ...previous,
                    academic_year_id:
                      value,
                  })
                )
              }
            >
              <option value="">
                Select Academic Year
              </option>
              {academicYears.map((year) => (
                <option
                  key={year.id}
                  value={year.id}
                >
                  {year.academic_year ||
                    `Year ${year.id}`}
                </option>
              ))}
            </Select>
            <Select
              label="Student Name"
              value={
                invoiceSearchFilters.student_id
              }
              onChange={(value) =>
                setInvoiceSearchFilters(
                  (previous) => ({
                    ...previous,
                    student_id: value,
                  })
                )
              }
            >
              <option value="">
                Select Student
              </option>
              {invoiceSearchStudents.map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.first_name ||
                      student.name ||
                      `Student ${student.id}`}
                    {student.last_name
                      ? ` ${student.last_name}`
                      : ""}
                    {student.admission_number
                      ? ` - ${student.admission_number}`
                      : ""}
                  </option>
                )
              )}
            </Select>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            {canSearchInvoices ? (
              <>
                Showing{" "}
                <span className="text-slate-950">
                  {filteredInvoices.length}
                </span>{" "}
                of{" "}
                <span className="text-slate-950">
                  {invoices.length}
                </span>{" "}
                generated invoices
              </>
            ) : (
              <>
                Select at least{" "}
                <span className="text-slate-950">
                  {Math.max(
                    0,
                    3 -
                      invoiceSearchFilterCount
                  )}
                </span>{" "}
                more filter
                {3 -
                  invoiceSearchFilterCount ===
                1
                  ? ""
                  : "s"}{" "}
                to search invoices.
              </>
            )}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredInvoices.map((invoice) => (
            <article
              key={invoice.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {invoice.invoice_number ||
                      `Invoice ${invoice.id}`}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {invoice.student_name ||
                      `Student ${invoice.student_id || "-"}`}
                  </p>
                </div>
                <FileText
                  size={22}
                  className="shrink-0 text-slate-950"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Class"
                  value={`${invoice.class_name || "-"}${invoice.section_name ? ` ${invoice.section_name}` : ""}`}
                />
                <Info
                  label="Parts"
                  value={`${invoice.billing_period || "SINGLE"} · ${invoice.installment_count || 1}`}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <Info
                  label="Total"
                  value={`Rs. ${Number(
                    invoice.total_amount || 0
                  )}`}
                />
                <Info
                  label="Paid"
                  value={`Rs. ${Number(
                    invoice.paid_amount || 0
                  )}`}
                />
                <Info
                  label="Balance"
                  value={`Rs. ${Number(
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

              <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4">
                <button
                  onClick={() =>
                    openInvoice(invoice)
                  }
                  disabled={
                    actionBusy ===
                    invoice.id
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-bold text-white"
                >
                  <Eye size={15} />
                  View
                </button>
                <button
                  onClick={() =>
                    printInvoice(invoice)
                  }
                  disabled={
                    actionBusy ===
                    invoice.id
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-900"
                >
                  <Printer size={15} />
                  Print
                </button>
                <button
                  onClick={() =>
                    startEditInvoice(
                      invoice
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-950"
                >
                  <Edit size={15} />
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteInvoice(
                      invoice
                    )
                  }
                  disabled={
                    actionBusy ===
                    invoice.id
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!filteredInvoices.length ? (
            <div className="tt-card tt-card-pad md:col-span-2 xl:col-span-3">
              <p className="font-bold text-slate-600">
                No invoices match the current search.
              </p>
            </div>
          ) : null}
        </div>

        {editingInvoice ? (
          <section className="tt-card tt-card-pad">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                  Edit Invoice
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingInvoice.invoice_number ||
                    `Invoice ${editingInvoice.id}`}
                </h2>
              </div>
              <button
                onClick={() =>
                  setEditingInvoice(null)
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
                aria-label="Close invoice editor"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Input
                label="Due Date"
                type="date"
                min={todayInput()}
                value={
                  editForm.due_date
                }
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    due_date: value,
                  })
                }
              />
              <Input
                label="Total Amount"
                value={
                  editForm.total_amount
                }
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    total_amount: value,
                  })
                }
              />
              <Select
                label="Status"
                value={editForm.status}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    status: value,
                  })
                }
              >
                <option value="PENDING">
                  Pending
                </option>
                <option value="PARTIAL">
                  Partial
                </option>
                <option value="PAID">
                  Paid
                </option>
                <option value="CANCELLED">
                  Cancelled
                </option>
              </Select>
            </div>

            <button
              onClick={saveInvoice}
              disabled={
                actionBusy ===
                editingInvoice.id
              }
              className="tt-button mt-5 inline-flex items-center gap-2"
            >
              <Save size={17} />
              {actionBusy ===
              editingInvoice.id
                ? "Saving..."
                : "Save Invoice"}
            </button>
          </section>
        ) : null}

        {selectedInvoice?.invoice ? (
          <InvoiceDetails
            detail={selectedInvoice}
            onClose={() =>
              setSelectedInvoice(null)
            }
          />
        ) : null}
      </div>
    </Layout>
  );
}

function InvoiceDetails({
  detail,
  onClose,
}: {
  detail: InvoiceDetail;
  onClose: () => void;
}) {
  const invoice =
    detail.invoice!;
  const lineItems =
    detail.line_items || [];
  const installments =
    detail.installments || [];
  const payments =
    detail.payments || [];

  return (
    <section className="tt-card tt-card-pad">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">
            Invoice Details
          </p>
          <h2 className="truncate text-2xl font-black text-slate-950">
            {invoice.invoice_number ||
              `Invoice ${invoice.id}`}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {invoice.student_name ||
              `Student ${invoice.student_id || "-"}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
          aria-label="Close invoice details"
        >
          <X size={18} />
        </button>
      </div>

      <button
        onClick={() =>
          printInvoiceDocument(detail)
        }
        className="mb-5 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-900"
      >
        <Printer size={16} />
        Print Invoice
      </button>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Info
          label="Total"
          value={`Rs. ${Number(invoice.total_amount || 0)}`}
        />
        <Info
          label="Paid"
          value={`Rs. ${Number(invoice.paid_amount || 0)}`}
        />
        <Info
          label="Balance"
          value={`Rs. ${Number(invoice.balance_amount || 0)}`}
        />
        <Info
          label="Status"
          value={invoice.status || "PENDING"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <DetailList
          title="Fee Items"
          rows={lineItems}
          empty="No fee line items recorded."
          render={(row) =>
            `${row.fee_name || "Fee"} - Rs. ${Number(row.amount || 0)}`
          }
        />
        <DetailList
          title="Installments"
          rows={installments}
          empty="No installment parts recorded."
          render={(row) =>
            `${row.part_label || `Part ${row.part_number}`} - Rs. ${Number(row.balance_amount || 0)} due`
          }
        />
        <DetailList
          title="Payments"
          rows={payments}
          empty="No payments collected yet."
          render={(row) =>
            `${row.receipt_number || "Payment"} - Rs. ${Number(row.amount || 0)}`
          }
        />
      </div>
    </section>
  );
}

async function printInvoiceDocument(
  detail: InvoiceDetail
) {
  const invoice = detail.invoice!;
  const lineItems =
    detail.line_items || [];
  const installments =
    detail.installments || [];
  const payments =
    detail.payments || [];
  const lineRows = lineItems
    .map(
      (row) =>
        `<tr><td>${escapeHtml(String(row.fee_name || "Fee"))}</td><td>Rs. ${Number(row.amount || 0)}</td></tr>`
    )
    .join("");
  const installmentRows =
    installments
      .map(
        (row) =>
          `<tr><td>${escapeHtml(String(row.part_label || `Part ${row.part_number}`))}</td><td>${formatPrintDate(row.due_date)}</td><td>Rs. ${Number(row.amount || 0)}</td><td>Rs. ${Number(row.balance_amount || 0)}</td><td>${escapeHtml(String(row.status || "-"))}</td></tr>`
      )
      .join("");
  const paymentRows = payments
    .map(
      (row) =>
        `<tr><td>${escapeHtml(String(row.receipt_number || "Payment"))}</td><td>${formatPrintDate(row.payment_date || row.created_at)}</td><td>Rs. ${Number(row.amount || 0)}</td><td>${escapeHtml(String(row.payment_method || "-"))}</td></tr>`
    )
    .join("");
  const invoiceNumber =
    invoice.invoice_number ||
    `Invoice ${invoice.id}`;
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/invoice/${encodeURIComponent(String(invoiceNumber))}`
      : "";

  await printBrandedDocument({
    title: "Fee Invoice",
    subtitle:
      "Invoice particulars, installments, payments and current balance.",
    documentLabel: "Invoice",
    pageSize: "half",
    metaHtml: printMetaGrid([
      {
        label: "Invoice",
        value: invoiceNumber,
      },
      {
        label: "Student",
        value:
          invoice.student_name ||
          invoice.student_id ||
          "-",
      },
      {
        label: "Class / Section",
        value:
          `${invoice.class_name || "-"} ${invoice.section_name || ""}`.trim(),
      },
      {
        label: "Due Date",
        value: formatPrintDate(invoice.due_date),
      },
    ]),
    bodyHtml: `
      <div class="summary">
        <div>Total<br><strong>Rs. ${Number(invoice.total_amount || 0)}</strong></div>
        <div>Paid<br><strong>Rs. ${Number(invoice.paid_amount || 0)}</strong></div>
        <div>Balance<br><strong>Rs. ${Number(invoice.balance_amount || 0)}</strong></div>
        <div>Status<br><strong>${escapeHtml(String(invoice.status || "PENDING"))}</strong></div>
      </div>
      <h3 class="print-section-title">Fee Items</h3>
      <table><thead><tr><th>Fee</th><th>Amount</th></tr></thead><tbody>${lineRows || "<tr><td colspan='2'>No fee line items.</td></tr>"}</tbody></table>
      <h3 class="print-section-title">Installments</h3>
      <table><thead><tr><th>Part</th><th>Due Date</th><th>Amount</th><th>Balance</th><th>Status</th></tr></thead><tbody>${installmentRows || "<tr><td colspan='5'>No installments.</td></tr>"}</tbody></table>
      <h3 class="print-section-title">Payments / Receipts</h3>
      <table><thead><tr><th>Receipt</th><th>Date</th><th>Amount</th><th>Method</th></tr></thead><tbody>${paymentRows || "<tr><td colspan='4'>No payments collected.</td></tr>"}</tbody></table>
	      <p class="sign">Authorized Signature</p>
	    `,
    verificationUrl,
    barcodeValue: String(invoiceNumber),
    popupError:
      "Allow popups to print this document.",
  });
}

function formatPrintDate(value: unknown) {
  if (!value) {
    return "-";
  }

  return new Date(
    String(value)
  ).toLocaleDateString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printStyles() {
  return `<style>body{font-family:Arial,sans-serif;margin:32px;color:#111827}h1{border-bottom:2px solid #111827;padding-bottom:12px}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:16px 0}.totals{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}.totals div{border:1px solid #d1d5db;border-radius:8px;padding:12px}table{width:100%;border-collapse:collapse;margin:10px 0 22px}th,td{border:1px solid #d1d5db;padding:10px;text-align:left;vertical-align:top}th{background:#f3f4f6;text-transform:uppercase;font-size:12px}@media print{body{margin:18mm}}</style>`;
}

function printHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    notify.error("Allow popups to print this document.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function DetailList({
  title,
  rows,
  empty,
  render,
}: {
  title: string;
  rows: DetailRow[];
  empty: string;
  render: (row: DetailRow) => string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-black uppercase text-slate-700">
        {title}
      </h3>
      <div className="mt-3 space-y-2">
        {rows.length ? (
          rows.map((row, index) => (
            <div
              key={String(
                row.id ?? index
              )}
              className="rounded-lg bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {render(row)}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            {empty}
          </p>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        min={min}
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function todayInput() {
  return new Date()
    .toISOString()
    .slice(0, 10);
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
  children: ReactNode;
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
