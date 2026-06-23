"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";

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

type Payment = {
  id: number;
  receipt_number?: string | null;
  invoice_number?: string | null;
  student_name?: string | null;
  class_name?: string | null;
  section_name?: string | null;
  amount?: string | number | null;
  payment_method?: string | null;
  payment_date?: string | null;
  created_at?: string | null;
  reference_number?: string | null;
};

type SchoolOption = {
  id: number;
  school_name?: string | null;
  school_code?: string | null;
};

type AcademicYearOption = {
  id: number;
  academic_year?: string | null;
};

type ClassOption = {
  id: number;
  class_name?: string | null;
};

type SectionOption = {
  id: number;
  section_name?: string | null;
};

export default function ReceiptsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [schools, setSchools] =
    useState<SchoolOption[]>([]);
  const [academicYears, setAcademicYears] =
    useState<AcademicYearOption[]>([]);
  const [classes, setClasses] =
    useState<ClassOption[]>([]);
  const [sections, setSections] =
    useState<SectionOption[]>([]);
  const [filters, setFilters] =
    useState({
      student_name: "",
      class_id: "",
      section_id: "",
      school_id: "",
      academic_year_id: "",
    });

  useEffect(() => {
    const load = async () => {
      try {
        const query = new URLSearchParams();
        if (filters.student_name) query.set("student_name", filters.student_name);
        if (filters.class_id) query.set("class_id", filters.class_id);
        if (filters.section_id) query.set("section_id", filters.section_id);
        if (filters.school_id) query.set("school_id", filters.school_id);
        if (filters.academic_year_id) query.set("academic_year_id", filters.academic_year_id);
        const [payload, roster, academicContext] = await Promise.all([
          apiJson<{ payments?: Payment[] }>(`/api/finance/payments${query.toString() ? `?${query.toString()}` : ""}`),
          apiJson<any>("/api/roster"),
          apiJson<any>("/api/enterprise/academic-year-context"),
        ]);
        setPayments(
          payload.payments || []
        );
        setSchools(Array.isArray(roster.schools) ? roster.schools : []);
        setClasses(Array.isArray(roster.classes) ? roster.classes : []);
        setSections(Array.isArray(roster.sections) ? roster.sections : []);
        setAcademicYears(Array.isArray(academicContext?.academicYears) ? academicContext.academicYears : []);
      } catch (error) {
        notify.error(
          errorMessage(
            error,
            "Failed to load receipts"
          )
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (filters.student_name) query.set("student_name", filters.student_name);
        if (filters.class_id) query.set("class_id", filters.class_id);
        if (filters.section_id) query.set("section_id", filters.section_id);
        if (filters.school_id) query.set("school_id", filters.school_id);
        if (filters.academic_year_id) query.set("academic_year_id", filters.academic_year_id);
        const payload = await apiJson<{ payments?: Payment[] }>(`/api/finance/payments${query.toString() ? `?${query.toString()}` : ""}`);
        setPayments(payload.payments || []);
      } catch (error) {
        notify.error(errorMessage(error, "Failed to load receipts"));
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Paid Receipts
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Print payment receipts from real fee collection records.
          </p>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">Student Name</span>
              <input
                className="input"
                value={filters.student_name}
                onChange={(event) => setFilters((previous) => ({ ...previous, student_name: event.target.value }))}
                placeholder="Search student name"
              />
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">Class</span>
              <select
                className="input"
                value={filters.class_id}
                onChange={(event) => setFilters((previous) => ({ ...previous, class_id: event.target.value, section_id: "" }))}
              >
                <option value="">All Classes</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>{item.class_name || `Class ${item.id}`}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">Section</span>
              <select
                className="input"
                value={filters.section_id}
                onChange={(event) => setFilters((previous) => ({ ...previous, section_id: event.target.value }))}
                disabled={!filters.class_id}
              >
                <option value="">All Sections</option>
                {sections.filter((section) => !filters.class_id || String((section as any).class_id) === filters.class_id).map((item) => (
                  <option key={item.id} value={item.id}>{item.section_name || `Section ${item.id}`}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">School/College</span>
              <select
                className="input"
                value={filters.school_id}
                onChange={(event) => setFilters((previous) => ({ ...previous, school_id: event.target.value }))}
              >
                <option value="">All Schools/Colleges</option>
                {schools.map((item) => (
                  <option key={item.id} value={item.id}>{item.school_name || item.school_code || `School ${item.id}`}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">Academic Year</span>
              <select
                className="input"
                value={filters.academic_year_id}
                onChange={(event) => setFilters((previous) => ({ ...previous, academic_year_id: event.target.value }))}
              >
                <option value="">All Years</option>
                {academicYears.map((item) => (
                  <option key={item.id} value={item.id}>{item.academic_year || `Year ${item.id}`}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          {loading ? (
            <p className="text-sm font-semibold text-slate-600">
              Loading receipts...
            </p>
          ) : payments.length === 0 ? (
            <p className="text-sm font-semibold text-slate-600">
              No paid receipts found for the selected school/college and academic year.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">
                      Receipt
                    </th>
                    <th className="py-3 pr-4">
                      Invoice
                    </th>
                    <th className="py-3 pr-4">
                      Student
                    </th>
                    <th className="py-3 pr-4">
                      Amount
                    </th>
                    <th className="py-3 pr-4">
                      Method
                    </th>
                    <th className="py-3 pr-4">
                      Date
                    </th>
                    <th className="py-3 pr-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-3 pr-4 font-black text-slate-950">
                        {payment.receipt_number ||
                          `Receipt ${payment.id}`}
                      </td>
                      <td className="py-3 pr-4">
                        {payment.invoice_number ||
                          "-"}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-slate-950">
                          {payment.student_name ||
                            "-"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {[
                            payment.class_name,
                            payment.section_name,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                            "-"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-black">
                        Rs.{" "}
                        {Number(
                          payment.amount || 0
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {payment.payment_method ||
                          "-"}
                      </td>
                      <td className="py-3 pr-4">
                        {formatDate(
                          payment.payment_date ||
                            payment.created_at
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() =>
                            printReceipt(
                              payment
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-900"
                        >
                          <Printer size={15} />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

async function printReceipt(payment: Payment) {
  const receiptNumber =
    payment.receipt_number ||
    `Receipt ${payment.id}`;
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/receipt/${encodeURIComponent(String(receiptNumber))}`
      : "";

  await printBrandedDocument({
    title: "Fee Payment Receipt",
    subtitle:
      "Official payment acknowledgement generated from TOTTECH ONE.",
    documentLabel: "Paid Receipt",
    pageSize: "half",
    metaHtml: printMetaGrid([
      {
        label: "Receipt",
        value: receiptNumber,
      },
      {
        label: "Invoice",
        value: payment.invoice_number || "-",
      },
      {
        label: "Student",
        value: payment.student_name || "-",
      },
      {
        label: "Class / Section",
        value:
          [
            payment.class_name,
            payment.section_name,
          ]
            .filter(Boolean)
            .join(" ") || "-",
      },
      {
        label: "Amount Paid",
        value: `Rs. ${Number(payment.amount || 0)}`,
      },
      {
        label: "Payment Method",
        value: payment.payment_method || "-",
      },
      {
        label: "Reference",
        value: payment.reference_number || "-",
      },
      {
        label: "Date",
        value: formatDate(
          payment.payment_date ||
            payment.created_at
        ),
      },
    ]),
    bodyHtml: `
      <div class="print-panel">
        <h3 class="print-section-title">Receipt Confirmation</h3>
        <p>This receipt confirms that the above amount has been collected against the linked school/college invoice.</p>
      </div>
	      <p class="sign">Authorized Signature</p>
	    `,
    verificationUrl,
    barcodeValue: String(receiptNumber),
    popupError:
      "Allow popups to print this receipt.",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
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
  return `<style>body{font-family:Arial,sans-serif;margin:32px;color:#111827}h1{border-bottom:2px solid #111827;padding-bottom:12px}.receipt{border:1px solid #d1d5db;border-radius:10px;padding:18px;margin-top:20px;line-height:1.8}.sign{margin-top:80px;text-align:right;font-weight:800}@media print{body{margin:18mm}}</style>`;
}

function printHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    notify.error("Allow popups to print this receipt.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
