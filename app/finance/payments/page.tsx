"use client";

import {
  Printer,
  ReceiptIndianRupee,
  Save,
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
  total_amount?: string | number | null;
  paid_amount?: string | number | null;
  balance_amount?: string | number | null;
  status?: string | null;
  installments?: any[];
  line_items?: any[];
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

type AcademicYearOption = {
  id: number | string;
  academic_year?: string | null;
  is_selected?: boolean | null;
};

type FeeSearchFilters = {
  class_id: string;
  section_id: string;
  academic_year_id: string;
  student_name: string;
};

const initialFeeSearchFilters: FeeSearchFilters = {
  class_id: "",
  section_id: "",
  academic_year_id: "",
  student_name: "",
};

function todayInput() {
  const date = new Date();
  date.setMinutes(
    date.getMinutes() -
      date.getTimezoneOffset()
  );
  return date
    .toISOString()
    .slice(0, 10);
}

const initialForm = {
  invoice_id: "",
  installment_id: "",
  amount: "",
  payment_method: "CASH",
  payment_date: todayInput(),
  reference_number: "",
  remarks: "",
};

export default function PaymentsPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);
  const [payments, setPayments] =
    useState<any[]>([]);
  const [classes, setClasses] =
    useState<RosterOption[]>([]);
  const [sections, setSections] =
    useState<RosterOption[]>([]);
  const [students, setStudents] =
    useState<RosterOption[]>([]);
  const [academicYears, setAcademicYears] =
    useState<AcademicYearOption[]>([]);
  const [classId, setClassId] =
    useState("");
  const [sectionId, setSectionId] =
    useState("");
  const [studentId, setStudentId] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [
    collectedFeeFilters,
    setCollectedFeeFilters,
  ] = useState<FeeSearchFilters>(
    initialFeeSearchFilters
  );
  const [form, setForm] =
    useState(initialForm);
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        invoicePayload,
        paymentPayload,
        rosterPayload,
        yearPayload,
      ] = await Promise.all([
        apiJson<any>(
          "/api/finance/invoices"
        ),
        apiJson<any>(
          "/api/finance/payments"
        ),
        apiJson<any>("/api/roster"),
        apiJson<AcademicYearOption[]>(
          "/api/academic-years?include_all=true"
        ),
      ]);

      setInvoices(
        invoicePayload.invoices || []
      );
      setPayments(
        paymentPayload.payments || []
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
      setAcademicYears(
        Array.isArray(yearPayload)
          ? yearPayload
          : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load payments"
        )
      );
    }
  };

  const selectedInvoice =
    invoices.find(
      (invoice) =>
        String(invoice.id) ===
        form.invoice_id
    ) || null;
  const installments =
    Array.isArray(
      selectedInvoice?.installments
    )
      ? selectedInvoice.installments
      : [];
  const openInstallments =
    installments.filter(
      (item) =>
        Number(
          item.balance_amount || 0
        ) > 0 ||
        String(item.status) !== "PAID"
    );

  const filteredInvoices =
    useMemo(
      () =>
        invoices.filter((invoice) => {
          const text = `
            ${invoice.invoice_number || ""}
            ${invoice.student_name || ""}
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
  const collectedVisibleSections =
    sections.filter(
      (section) =>
        !collectedFeeFilters.class_id ||
        String(section.class_id) ===
          collectedFeeFilters.class_id
    );
  const collectedFilterCount =
    Object.values(
      collectedFeeFilters
    ).filter(Boolean).length;
  const canSearchCollectedFees =
    collectedFilterCount >= 3;
  const filteredPayments =
    useMemo(
      () =>
        canSearchCollectedFees
          ? payments.filter((payment) => {
          const matchesClass =
            !collectedFeeFilters.class_id ||
            String(payment.class_id) ===
              collectedFeeFilters.class_id;
          const matchesSection =
            !collectedFeeFilters.section_id ||
            String(payment.section_id) ===
              collectedFeeFilters.section_id;
          const matchesYear =
            !collectedFeeFilters.academic_year_id ||
            collectedFeeFilters.academic_year_id ===
              "all" ||
            String(
              payment.academic_year_id ?? ""
            ) ===
              collectedFeeFilters.academic_year_id;
          const matchesStudent =
            !collectedFeeFilters.student_name ||
            String(payment.student_name || "")
              .toLowerCase()
              .includes(
                collectedFeeFilters.student_name
                  .trim()
                  .toLowerCase()
              );

          return (
            matchesClass &&
            matchesSection &&
            matchesYear &&
            matchesStudent
          );
        })
          : [],
      [
        payments,
        collectedFeeFilters,
        canSearchCollectedFees,
      ]
    );

  const recordPayment = async () => {
    const invoiceForPrint =
      selectedInvoice;

    try {
      setSaving(true);
      const result = await apiJson<any>(
        "/api/finance/payments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      notify.success(
        "Payment recorded"
      );

      const payment =
        result?.payment || null;
      const invoice =
        result?.invoice && invoiceForPrint
          ? {
              ...invoiceForPrint,
              ...result.invoice,
            }
          : result?.invoice ||
            invoiceForPrint;

      if (payment && invoice) {
        printFeeCollectionReceipt(
          payment,
          invoice
        );
      }

      setForm(initialForm);
      setSearch("");
      setCollectedFeeFilters(
        initialFeeSearchFilters
      );
      loadData();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to record payment"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Fee Payments
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Record paid invoices, partial payments, and installment collections.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <h2 className="mb-4 text-xl font-black">
            Record Payment
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Class"
              value={classId}
              onChange={(value) => {
                setClassId(value);
                setSectionId("");
                setStudentId("");
                setForm({
                  ...form,
                  invoice_id: "",
                  installment_id: "",
                  amount: "",
                });
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
                setForm({
                  ...form,
                  invoice_id: "",
                  installment_id: "",
                  amount: "",
                });
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
              onChange={(value) => {
                setStudentId(value);
                setForm({
                  ...form,
                  invoice_id: "",
                  installment_id: "",
                  amount: "",
                });
              }}
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
            <Input
              label="Search Invoice to Collect"
              value={search}
              onChange={setSearch}
            />
            <Select
              label="Invoice"
              value={form.invoice_id}
              onChange={(value) =>
                setForm({
                  ...form,
                  invoice_id: value,
                  installment_id: "",
                  amount: "",
                })
              }
            >
              <option value="">
                Select Invoice
              </option>
              {filteredInvoices.map(
                (invoice) => (
                  <option
                    key={invoice.id}
                    value={invoice.id}
                  >
                    {invoice.invoice_number ||
                      `Invoice ${invoice.id}`}
                    {" - "}
                    {invoice.student_name ||
                      "Student"}
                    {" - Rs. "}
                    {Number(
                      invoice.balance_amount ||
                        0
                    )}
                  </option>
                )
              )}
            </Select>
            <Select
              label="Installment"
              value={form.installment_id}
              onChange={(value) => {
                const installment =
                  openInstallments.find(
                    (item) =>
                      String(item.id) ===
                      value
                  );
                setForm({
                  ...form,
                  installment_id: value,
                  amount: installment
                    ? String(
                        installment.balance_amount ||
                          installment.amount ||
                          ""
                      )
                    : form.amount,
                });
              }}
              disabled={!form.invoice_id}
            >
              <option value="">
                Auto / invoice balance
              </option>
              {openInstallments.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.part_label ||
                      `Part ${item.part_number}`}
                    {" - due "}
                    {item.due_date
                      ? new Date(
                          item.due_date
                        ).toLocaleDateString()
                      : "-"}
                    {" - Rs. "}
                    {Number(
                      item.balance_amount ||
                        0
                    )}
                  </option>
                )
              )}
            </Select>
            <Input
              label="Amount"
              value={form.amount}
              onChange={(value) =>
                setForm({
                  ...form,
                  amount: value,
                })
              }
            />
            <Input
              label="Payment Date"
              type="date"
              min={todayInput()}
              value={form.payment_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  payment_date: value,
                })
              }
            />
            <Select
              label="Method"
              value={form.payment_method}
              onChange={(value) =>
                setForm({
                  ...form,
                  payment_method: value,
                })
              }
            >
              <option value="CASH">
                Cash
              </option>
              <option value="UPI">
                UPI
              </option>
              <option value="CARD">
                Card
              </option>
              <option value="BANK_TRANSFER">
                Bank Transfer
              </option>
              <option value="CHEQUE">
                Cheque
              </option>
            </Select>
            <Input
              label="Reference Number"
              value={
                form.reference_number
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  reference_number:
                    value,
                })
              }
            />
            <Input
              label="Remarks"
              value={form.remarks}
              onChange={(value) =>
                setForm({
                  ...form,
                  remarks: value,
                })
              }
            />
          </div>

          {selectedInvoice && (
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <strong className="text-slate-950">
                {selectedInvoice.student_name ||
                  "Student"}
              </strong>{" "}
              has an invoice balance of{" "}
              <strong className="text-slate-950">
                Rs.{" "}
                {Number(
                  selectedInvoice.balance_amount ||
                    0
                )}
              </strong>{" "}
              for{" "}
              {selectedInvoice.class_name ||
                "-"}
              {selectedInvoice.section_name
                ? ` ${selectedInvoice.section_name}`
                : ""}.
            </div>
          )}

          <button
            onClick={recordPayment}
            disabled={saving}
            className="tt-button mt-5 inline-flex items-center gap-2"
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : "Record Payment"}
          </button>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Collected Fees
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Search receipts by selecting any three fields: class, section, academic year, and student name.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setCollectedFeeFilters(
                  initialFeeSearchFilters
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700"
            >
              Clear Filters
            </button>
          </div>
          <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Class"
              value={
                collectedFeeFilters.class_id
              }
              onChange={(value) =>
                setCollectedFeeFilters(
                  (previous) => ({
                    ...previous,
                    class_id: value,
                    section_id: "",
                    student_name: "",
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
                collectedFeeFilters.section_id
              }
              onChange={(value) =>
                setCollectedFeeFilters(
                  (previous) => ({
                    ...previous,
                    section_id: value,
                    student_name: "",
                  })
                )
              }
              disabled={
                !collectedFeeFilters.class_id
              }
            >
              <option value="">
                Select Section
              </option>
              {collectedVisibleSections.map(
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
                collectedFeeFilters.academic_year_id
              }
              onChange={(value) =>
                setCollectedFeeFilters(
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
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Student Name
              </span>
              <input
                className="input"
                value={
                  collectedFeeFilters.student_name
                }
                onChange={(event) =>
                  setCollectedFeeFilters(
                    (previous) => ({
                      ...previous,
                      student_name:
                        event.target.value,
                    })
                  )
                }
                placeholder="Search student by name"
              />
            </label>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            {canSearchCollectedFees ? (
              <>
                Showing{" "}
                <span className="text-slate-950">
                  {filteredPayments.length}
                </span>{" "}
                of{" "}
                <span className="text-slate-950">
                  {payments.length}
                </span>{" "}
                collected fee records
              </>
            ) : (
              <>
                Select at least{" "}
                <span className="text-slate-950">
                  {Math.max(
                    0,
                    3 -
                      collectedFilterCount
                  )}
                </span>{" "}
                more filter
                {3 -
                  collectedFilterCount ===
                1
                  ? ""
                  : "s"}{" "}
                to search collected fees.
              </>
            )}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPayments.map((payment) => (
            <article
              key={payment.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ReceiptIndianRupee
                    size={20}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {payment.receipt_number ||
                      `Receipt ${payment.id}`}
                  </h2>
                  <p className="truncate text-sm font-semibold text-amber-700">
                    {payment.invoice_number ||
                      "Invoice"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Student"
                  value={
                    payment.student_name ||
                    "-"
                  }
                />
                <Info
                  label="Amount"
                  value={`Rs. ${Number(
                    payment.amount || 0
                  )}`}
                />
                <Info
                  label="Method"
                  value={
                    payment.payment_method ||
                    "-"
                  }
                />
                <Info
                  label="Date"
                  value={
                    payment.payment_date
                      ? new Date(
                          payment.payment_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
              <button
                onClick={() => {
                  const invoice =
                    invoices.find(
                      (item) =>
                        Number(item.id) ===
                        Number(payment.invoice_id)
                    ) || null;
                  printFeeCollectionReceipt(
                    payment,
                    invoice
                  );
                }}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-black text-amber-900"
              >
                <Printer size={16} />
                Print Fee Particulars
              </button>
            </article>
          ))}
          {!filteredPayments.length ? (
            <div className="tt-card tt-card-pad md:col-span-2 xl:col-span-3">
              <p className="font-bold text-slate-600">
                No collected fee records match the selected filters.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

async function printFeeCollectionReceipt(
  payment: any,
  invoice: Invoice | null
) {
  const lineItems =
    Array.isArray(invoice?.line_items)
      ? invoice?.line_items || []
      : [];
  const installments =
    Array.isArray(invoice?.installments)
      ? invoice?.installments || []
      : [];
  const paidInstallmentId =
    payment?.metadata?.installment_id ||
    payment?.installment_id;
  const paidInstallment =
    installments.find(
      (item) =>
        paidInstallmentId &&
        Number(item.id) ===
          Number(paidInstallmentId)
    ) || null;
  const lineRows = lineItems
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(String(item.fee_name || "Fee"))}</td>
          <td class="right">Rs. ${Number(item.amount || 0)}</td>
        </tr>
      `
    )
    .join("");
  const installmentRows = installments
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(String(item.part_label || `Part ${item.part_number || ""}`))}</td>
          <td>${formatDate(item.due_date)}</td>
          <td class="right">Rs. ${Number(item.amount || 0)}</td>
          <td class="right">Rs. ${Number(item.paid_amount || 0)}</td>
          <td class="right">Rs. ${Number(item.balance_amount || 0)}</td>
          <td>${escapeHtml(String(item.status || "-"))}</td>
        </tr>
      `
    )
    .join("");
  const receiptNumber =
    payment?.receipt_number ||
    `Payment ${payment?.id || ""}`;
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/receipt/${encodeURIComponent(String(receiptNumber))}`
      : "";

  await printBrandedDocument({
    title: "Fee Collection Receipt",
    subtitle: "Paid fee particulars with invoice and installment breakup.",
    documentLabel: "Fee Receipt",
    pageSize: "half",
    metaHtml: printMetaGrid([
      {
        label: "Receipt",
        value: receiptNumber,
      },
      {
        label: "Invoice",
        value:
          payment?.invoice_number ||
          invoice?.invoice_number ||
          invoice?.id ||
          "-",
      },
      {
        label: "Student",
        value:
          payment?.student_name ||
          invoice?.student_name ||
          "-",
      },
      {
        label: "Class / Section",
        value:
          [
            payment?.class_name ||
              invoice?.class_name,
            payment?.section_name ||
              invoice?.section_name,
          ]
            .filter(Boolean)
            .join(" ") || "-",
      },
      {
        label: "Payment Date",
        value: formatDate(
          payment?.payment_date ||
            payment?.created_at
        ),
      },
      {
        label: "Method",
        value: payment?.payment_method || "-",
      },
      {
        label: "Reference",
        value:
          payment?.reference_number || "-",
      },
      {
        label: "Collected Amount",
        value: `Rs. ${Number(payment?.amount || 0)}`,
      },
    ]),
    bodyHtml: `
        ${
          paidInstallment
            ? `<div class="print-notice"><strong>Paid Part:</strong> ${escapeHtml(String(paidInstallment.part_label || `Part ${paidInstallment.part_number || ""}`))} | Balance after part update: Rs. ${Number(paidInstallment.balance_amount || 0)}</div>`
            : ""
        }
        <h3 class="print-section-title">Fee Particulars</h3>
        <table>
          <thead><tr><th>Particular</th><th class="right">Amount</th></tr></thead>
          <tbody>${lineRows || "<tr><td colspan='2'>Fee particulars are not attached to this invoice.</td></tr>"}</tbody>
        </table>
        <h3 class="print-section-title">Installment Particulars</h3>
        <table>
          <thead><tr><th>Part</th><th>Due Date</th><th class="right">Amount</th><th class="right">Paid</th><th class="right">Balance</th><th>Status</th></tr></thead>
          <tbody>${installmentRows || "<tr><td colspan='6'>No installment parts recorded.</td></tr>"}</tbody>
        </table>
        <div class="summary">
          <div>Total Invoice<br><strong>Rs. ${Number(invoice?.total_amount || 0)}</strong></div>
          <div>Paid Till Now<br><strong>Rs. ${Number(invoice?.paid_amount || 0)}</strong></div>
          <div>Balance<br><strong>Rs. ${Number(invoice?.balance_amount || 0)}</strong></div>
          <div>Status<br><strong>${escapeHtml(String(invoice?.status || "-"))}</strong></div>
        </div>
        <p class="sign">Authorized Signature</p>
	    `,
    verificationUrl,
    barcodeValue: String(receiptNumber),
    popupError:
      "Allow popups to print fee particulars.",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value?: string | number | Date | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
}

function printStyles() {
  return `<style>body{font-family:Arial,sans-serif;margin:32px;color:#111827}.header{border-bottom:2px solid #111827;padding-bottom:12px;margin-bottom:16px}.header h1{margin:0}.header p{margin:4px 0 0;color:#4b5563}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:16px 0}.meta div,.summary div{border:1px solid #d1d5db;border-radius:8px;padding:10px}.meta span{display:block;font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:800}.meta strong{display:block;margin-top:3px}.notice{border:1px solid #f3c96b;background:#fff8e6;border-radius:8px;padding:12px;margin:16px 0}h2{font-size:16px;margin-top:22px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #d1d5db;padding:9px;text-align:left;vertical-align:top}th{background:#f3f4f6;text-transform:uppercase;font-size:12px}.right{text-align:right}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}.sign{margin-top:70px;text-align:right;font-weight:800}@media print{body{margin:18mm}.summary{grid-template-columns:repeat(2,1fr)}}</style>`;
}

function printHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    notify.error("Allow popups to print fee particulars.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
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
