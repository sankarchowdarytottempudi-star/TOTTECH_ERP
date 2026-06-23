"use client";

import Link from "next/link";
import Layout from "@/components/Layout";

const cards = [
  ["Staff Master", "/hrms/staff-directory", "Employee records and workforce master."],
  ["Salary Management", "/hrms/payroll", "Salary structures, monthly runs, and pay slips."],
  ["Leave Management", "/hrms/leave-management", "Leave allocation, requests, and approvals."],
  ["Loss Of Pay (LOP)", "/hrms/lop", "Absence-based LOP tracking and deduction."],
  ["Increment Management", "/hrms/increments", "Increment requests and approval flow."],
  ["Pay Slip Generation", "/hrms/payslips", "Payroll slips and printable salary evidence."],
  ["Approval Workflow", "/hrms/approvals", "Multi-level HR approval and audit trail."],
  ["Provident Fund (PF)", "/hrms/pf", "Guidance-only PF compliance reference and employee PF identifiers."],
];

export default function HRMSPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">HR Command Center</h1>
          <p className="mt-1 text-sm text-slate-600">
            Staff master, salary, leave, LOP, increment, payslip, and approval workflows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map(([title, href, description]) => (
            <Link key={title} href={href} className="tt-card tt-card-pad block transition hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-xl font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
