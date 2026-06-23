"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  Calculator,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Landmark,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";
import { formatMoney } from "@/lib/hrms/pf";

type PfProfile = {
  id: number;
  employee_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  department?: string | null;
  designation?: string | null;
  mobile?: string | null;
  pf_number?: string | null;
  uan_number?: string | null;
  pf_joining_date?: string | null;
  pf_status?: string | null;
  pf_applicable?: boolean | null;
  eps_applicable?: boolean | null;
  pf_exit_date?: string | null;
  basic_salary?: number | string | null;
  da?: number | string | null;
  pf_wage?: number | string | null;
  voluntary_pf_percent?: number | string | null;
  employer_pf_percent?: number | string | null;
  employee_pf?: number;
  employer_pf?: number;
  eps?: number;
  edli?: number;
};

type PfLedger = {
  id: number;
  employee_name?: string | null;
  employee_id?: string | null;
  payroll_batch?: string | null;
  period_label?: string | null;
  uan_number?: string | null;
  pf_member_id?: string | null;
  pf_wage?: number;
  employee_pf?: number;
  employer_pf?: number;
  eps?: number;
  edli?: number;
  filed_status?: string | null;
};

type PfDashboard = {
  context?: {
    selectedSchool?: { id?: number | null; school_name?: string | null; school_code?: string | null } | null;
    selectedAcademicYear?: { id?: number | null; academic_year?: string | null } | null;
    allSchools?: boolean;
    allYears?: boolean;
  };
  summary?: {
    totalPfEmployees?: number;
    pfWages?: number;
    employeeContribution?: number;
    employerContribution?: number;
    pendingFiling?: number;
    filedMonths?: number;
    eps?: number;
    edli?: number;
    pfWagesText?: string;
    employeeContributionText?: string;
    employerContributionText?: string;
    epsText?: string;
    edliText?: string;
  };
  pfProfiles?: PfProfile[];
  pfLedgers?: PfLedger[];
};

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const epfoLinks = [
  {
    label: "Open EPFO Portal",
    href: "https://unifiedportal-emp.epfindia.gov.in/epfo/",
  },
  {
    label: "Employer Services",
    href: "https://unifiedportal-emp.epfindia.gov.in/",
  },
  {
    label: "Member Passbook",
    href: "https://passbook.epfindia.gov.in/",
  },
  {
    label: "UAN Services",
    href: "https://unifiedportal-mem.epfindia.gov.in/",
  },
  {
    label: "EPFO Circulars",
    href: "https://www.epfindia.gov.in/site_en/Circulars.php",
  },
];

const reportCards = [
  {
    title: "PF Register",
    description: "Employee-wise PF profile and contribution register.",
    icon: Users,
  },
  {
    title: "Employee PF Statement",
    description: "Employee-level PF details and deductions.",
    icon: FileText,
  },
  {
    title: "Monthly PF Summary",
    description: "School/College-wise monthly PF summary and filing readiness.",
    icon: Calculator,
  },
  {
    title: "Employer Contribution Summary",
    description: "Employer contribution and EPS/EDLI split.",
    icon: BadgeIndianRupee,
  },
];

export default function ProvidentFundPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dashboard, setDashboard] = useState<PfDashboard>({});
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [staffFilter, setStaffFilter] = useState("");
  const [preview, setPreview] = useState<Record<string, any> | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(String(currentMonth).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [payrollBatch, setPayrollBatch] = useState("");
  const [form, setForm] = useState({
    pf_member_id: "",
    uan_number: "",
    pf_applicable: true,
    eps_applicable: true,
    pf_joining_date: "",
    pf_exit_date: "",
    basic_salary: "",
    da: "",
    pf_wage: "",
    voluntary_pf_percent: "",
    employer_pf_percent: "12",
    pf_status: "ACTIVE",
  });

  const selectedProfile = useMemo(
    () =>
      dashboard.pfProfiles?.find(
        (item) => item.id === selectedStaffId
      ) || dashboard.pfProfiles?.[0] || null,
    [dashboard.pfProfiles, selectedStaffId]
  );

  const filteredProfiles = useMemo(() => {
    const q = staffFilter.trim().toLowerCase();
    if (!q) {
      return dashboard.pfProfiles || [];
    }
    return (dashboard.pfProfiles || []).filter((profile) => {
      const haystack = [
        profile.employee_id,
        `${profile.first_name || ""} ${profile.last_name || ""}`,
        profile.department,
        profile.designation,
        profile.uan_number,
        profile.pf_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [dashboard.pfProfiles, staffFilter]);

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!selectedProfile) return;
    setSelectedStaffId(selectedProfile.id);
    setForm({
      pf_member_id: selectedProfile.pf_number || "",
      uan_number: selectedProfile.uan_number || "",
      pf_applicable: selectedProfile.pf_applicable ?? true,
      eps_applicable: selectedProfile.eps_applicable ?? true,
      pf_joining_date: selectedProfile.pf_joining_date
        ? String(selectedProfile.pf_joining_date).slice(0, 10)
        : "",
      pf_exit_date: selectedProfile.pf_exit_date
        ? String(selectedProfile.pf_exit_date).slice(0, 10)
        : "",
      basic_salary: String(selectedProfile.basic_salary ?? ""),
      da: String(selectedProfile.da ?? ""),
      pf_wage: String(selectedProfile.pf_wage ?? ""),
      voluntary_pf_percent: String(selectedProfile.voluntary_pf_percent ?? ""),
      employer_pf_percent: String(selectedProfile.employer_pf_percent ?? 12),
      pf_status: selectedProfile.pf_status || "ACTIVE",
    });
  }, [selectedProfile?.id]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const payload = await apiJson<PfDashboard>("/api/hrms/pf");
      setDashboard(payload);
      const first = payload.pfProfiles?.[0];
      if (first && !selectedStaffId) {
        setSelectedStaffId(first.id);
      }
    } catch (error) {
      notify.error(errorMessage(error, "Unable to load PF workspace"));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!selectedStaffId) {
      notify.error("Select a staff member first.");
      return;
    }

    try {
      setSaving(true);
      await apiJson("/api/hrms/pf", {
        method: "POST",
        body: JSON.stringify({
          action: "save-profile",
          staff_id: selectedStaffId,
          ...form,
        }),
      });
      notify.success("PF profile saved successfully.");
      await loadDashboard();
    } catch (error) {
      notify.error(errorMessage(error, "Unable to save PF profile"));
    } finally {
      setSaving(false);
    }
  };

  const openEpfo = async (href: string, label: string) => {
    try {
      setOpening(true);
      await apiJson("/api/hrms/pf/portal", {
        method: "POST",
        body: JSON.stringify({ action: "open", label }),
      });
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (error) {
      notify.error(errorMessage(error, "Unable to log PF portal access"));
      window.open(href, "_blank", "noopener,noreferrer");
    } finally {
      setOpening(false);
    }
  };

  const previewEcr = async () => {
    try {
      setGenerating(true);
      const payload = await apiJson<Record<string, any>>("/api/hrms/pf/ecr", {
        method: "POST",
        body: JSON.stringify({
          payroll_month: Number(selectedMonth),
          payroll_year: Number(selectedYear),
          payroll_batch: payrollBatch || undefined,
        }),
      });
      setPreview(payload);
      notify.success("PF ECR preview generated.");
      await loadDashboard();
    } catch (error) {
      notify.error(errorMessage(error, "Unable to generate PF ECR"));
    } finally {
      setGenerating(false);
    }
  };

  const downloadUrl = (format: "txt" | "xlsx" | "pdf") => {
    const params = new URLSearchParams();
    params?.set("format", format);
    params?.set("month", selectedMonth);
    params?.set("payroll_year", selectedYear);
    if (dashboard.context?.selectedSchool?.id) {
      params?.set("school_id", String(dashboard.context.selectedSchool.id));
    }
    if (dashboard.context?.selectedAcademicYear?.id) {
      params?.set(
        "academic_year_id",
        String(dashboard.context.selectedAcademicYear.id)
      );
    }
    if (payrollBatch.trim()) {
      params?.set("payroll_batch", payrollBatch.trim());
    }
    return `/api/hrms/pf/ecr?${params?.toString()}`;
  };

  const summary = dashboard.summary || {};

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-dark-hero rounded-[8px] border border-amber-300/60 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">
            Provident Fund (PF) Compliance
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-white">
                Provident Fund (PF) Compliance
              </h1>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/80">
                Employee Provident Fund (EPF) regulations are governed by the Employees&apos; Provident Fund Organisation (EPFO), Government of India. Contribution rates, wage ceilings, withdrawal rules, pension benefits, and compliance requirements may change based on Government notifications. For the latest and legally valid information, please refer to the official EPFO portal.
              </p>
            </div>
            <div className="rounded-[8px] border border-amber-300/60 bg-amber-300/10 px-4 py-3 text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/90">
                PF Dashboard
              </p>
              <p className="text-3xl font-black text-white">
                {summary.totalPfEmployees || 0}
              </p>
              <p className="text-xs font-semibold text-white/80">
                Employees under PF profile
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-900">
                Important Notice
              </p>
              <p className="mt-1 text-sm font-medium text-amber-900/90">
                PF regulations are managed by the Government of India and are subject to change without prior notice. Always verify compliance decisions directly through the official EPFO portal.
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["Total PF Employees", summary.totalPfEmployees || 0],
            ["PF Wages", summary.pfWagesText || formatMoney(summary.pfWages || 0)],
            ["Employee Contribution", summary.employeeContributionText || formatMoney(summary.employeeContribution || 0)],
            ["Employer Contribution", summary.employerContributionText || formatMoney(summary.employerContribution || 0)],
            ["Pending Filing", summary.pendingFiling || 0],
            ["Filed Months", summary.filedMonths || 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="tt-card tt-card-pad">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                {label}
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {String(value)}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="tt-card tt-card-pad space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Employee PF Profile
                </h2>
                <p className="text-sm text-slate-600">
                  Update PF, EPS, wage, and UAN details for the selected staff record.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void loadDashboard()}
                  className="tt-btn-outline inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={saving}
                  className="tt-btn inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save PF Profile"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                  PF Employee Search
                </span>
                <div className="flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-3 py-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    value={staffFilter}
                    onChange={(event) => setStaffFilter(event.target.value)}
                    placeholder="Search by name, PF number, UAN..."
                    className="w-full border-none bg-transparent text-sm outline-none"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                  Select Employee
                </span>
                <select
                  value={selectedStaffId || ""}
                  onChange={(event) => setSelectedStaffId(Number(event.target.value) || null)}
                  className="tt-input w-full"
                >
                  <option value="">Select staff</option>
                  {filteredProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.employee_id || `Staff #${profile.id}`}{" "}
                      {profile.department ? `• ${profile.department}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["PF Member ID", "pf_member_id"],
                ["UAN Number", "uan_number"],
                ["PF Joining Date", "pf_joining_date"],
                ["PF Exit Date", "pf_exit_date"],
                ["Basic Salary", "basic_salary"],
                ["DA", "da"],
                ["PF Wage", "pf_wage"],
                ["Voluntary PF %", "voluntary_pf_percent"],
                ["Employer PF %", "employer_pf_percent"],
              ].map(([label, key]) => (
                <label key={String(key)} className="space-y-2">
                  <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                    {label}
                  </span>
                  <input
                    type={String(key).includes("date") ? "date" : "text"}
                    value={(form as Record<string, string | boolean>)[key] as string}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={String(label)}
                    className="tt-input w-full"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                  PF Applicable
                </span>
                <select
                  value={form.pf_applicable ? "yes" : "no"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pf_applicable: event.target.value === "yes",
                    }))
                  }
                  className="tt-input w-full"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                  EPS Applicable
                </span>
                <select
                  value={form.eps_applicable ? "yes" : "no"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      eps_applicable: event.target.value === "yes",
                    }))
                  }
                  className="tt-input w-full"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                  PF Status
                </span>
                <input
                  value={form.pf_status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pf_status: event.target.value,
                    }))
                  }
                  className="tt-input w-full"
                />
              </label>
            </div>

            <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Refer to EPFO for current contribution rules.
            </div>
          </div>

          <div className="space-y-4">
            <div className="tt-card tt-card-pad">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Official EPFO Guidance
                  </h2>
                  <p className="text-sm text-slate-600">
                    TOTTECH ONE stores PF details and ECR ledgers, but filing decisions remain under official EPFO rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="tt-card tt-card-pad">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Monthly ECR Controls
                  </h2>
                  <p className="text-sm text-slate-600">
                    Generate the monthly PF ledger and export TXT, Excel, or PDF summary files.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-700">
                    Month
                  </span>
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="tt-input w-full"
                  >
                    {Array.from({ length: 12 }, (_, index) => {
                      const value = String(index + 1).padStart(2, "0");
                      return (
                        <option key={value} value={value}>
                          {new Date(2024, index, 1).toLocaleDateString("en-IN", {
                            month: "long",
                          })}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-700">
                    Year
                  </span>
                  <input
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                    className="tt-input w-full"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-700">
                    Payroll Batch
                  </span>
                  <input
                    value={payrollBatch}
                    onChange={(event) => setPayrollBatch(event.target.value)}
                    placeholder="Optional batch name"
                    className="tt-input w-full"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void previewEcr()}
                  disabled={generating}
                  className="tt-btn inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Calculator className="h-4 w-4" />
                  {generating ? "Generating..." : "Preview ECR"}
                </button>
                <a href={downloadUrl("txt")} className="tt-btn-outline inline-flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download TXT
                </a>
                <a href={downloadUrl("xlsx")} className="tt-btn-outline inline-flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Download Excel
                </a>
                <a href={downloadUrl("pdf")} className="tt-btn-outline inline-flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Download PDF Summary
                </a>
              </div>

              {preview ? (
                <div className="mt-5 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                    ECR Preview
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Payroll Batch: <span className="font-black text-slate-950">{String(preview.payroll_batch || payrollBatch || "-")}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Employees Processed: <span className="font-black text-slate-950">{preview.employees_processed || preview.summary?.totalPfEmployees || 0}</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="tt-card tt-card-pad space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  PF Register
                </h2>
                <p className="text-sm text-slate-600">
                  Employee-wise PF register and contribution details.
                </p>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Latest {dashboard.pfProfiles?.length || 0} records
              </p>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Employee", "UAN", "PF Member ID", "PF Wage", "Employee PF", "Employer PF", "Status"].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.12em] text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(dashboard.pfProfiles || []).map((profile) => {
                    const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.employee_id || `Staff #${profile.id}`;
                    const total = Number(profile.pf_wage || 0);
                    return (
                      <tr
                        key={profile.id}
                        onClick={() => setSelectedStaffId(profile.id)}
                        className={`cursor-pointer ${selectedStaffId === profile.id ? "bg-amber-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">{name}</td>
                        <td className="px-4 py-3 text-slate-600">{profile.uan_number || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{profile.pf_number || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">₹{formatMoney(total)}</td>
                        <td className="px-4 py-3 text-slate-600">₹{formatMoney(profile.employee_pf || 0)}</td>
                        <td className="px-4 py-3 text-slate-600">₹{formatMoney(profile.employer_pf || 0)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-amber-800">
                            {profile.pf_status || "ACTIVE"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!dashboard.pfProfiles?.length ? (
                <div className="border-t border-slate-200 p-4 text-sm text-slate-600">
                  No PF profiles found for the selected school/college and academic year.
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="tt-card tt-card-pad">
              <h2 className="text-lg font-black text-slate-950">Employee PF Statement</h2>
              <p className="mt-1 text-sm text-slate-600">Selected employee contribution snapshot.</p>
              {selectedProfile ? (
                <div className="mt-4 space-y-2 rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm">
                  <p className="font-black text-slate-950">{[selectedProfile.first_name, selectedProfile.last_name].filter(Boolean).join(" ") || selectedProfile.employee_id}</p>
                  <p>Department: {selectedProfile.department || "-"}</p>
                  <p>Designation: {selectedProfile.designation || "-"}</p>
                  <p>PF Wage: ₹{formatMoney(selectedProfile.pf_wage || 0)}</p>
                  <p>Employee PF: ₹{formatMoney(selectedProfile.employee_pf || 0)}</p>
                  <p>Employer PF: ₹{formatMoney(selectedProfile.employer_pf || 0)}</p>
                  <p>EPS: ₹{formatMoney(selectedProfile.eps || 0)}</p>
                  <p>EDLI: ₹{formatMoney(selectedProfile.edli || 0)}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-[8px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                  Select a staff member to view the PF statement.
                </div>
              )}
            </div>

            <div className="tt-card tt-card-pad">
              <h2 className="text-lg font-black text-slate-950">Employer Contribution Summary</h2>
              <p className="mt-1 text-sm text-slate-600">Monthly filing and employer contribution readiness.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">EPS</p>
                  <p className="mt-2 text-xl font-black text-slate-950">₹{formatMoney(summary.eps || 0)}</p>
                </div>
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">EDLI</p>
                  <p className="mt-2 text-xl font-black text-slate-950">₹{formatMoney(summary.edli || 0)}</p>
                </div>
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Filing Status</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {summary.pendingFiling ? `${summary.pendingFiling} records pending filing.` : "All generated PF months are filed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">EPFO Actions</h2>
              <p className="text-sm text-slate-600">Official portal shortcuts and filing guidance.</p>
            </div>
            {opening ? (
              <p className="text-xs font-semibold text-slate-500">Logging PF portal activity...</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {epfoLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => void openEpfo(link.href, link.label)}
                className="tt-btn-outline inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {link.label}
              </button>
            ))}
          </div>

          <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            EPFO rules and filing formats are governed by the Government of India and may change periodically. Please verify generated ECR before submission.
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="tt-card tt-card-pad">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600">{card.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}

