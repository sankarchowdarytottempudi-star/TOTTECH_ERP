"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeIndianRupee,
  Building2,
  CreditCard,
  FileText,
  Landmark,
  Pill,
  Receipt,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Wallet,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  ClickableBarChart,
  DashboardCard,
  OperationalPanel,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";

type Row = Record<string, unknown>;

type Payload = {
  revenue?: Row;
  cashByMode?: Row[];
  revenueTrend?: Row[];
  revenueByDepartment?: Row[];
  revenueByDoctor?: Row[];
  revenueByService?: Row[];
  collectionTrend?: Row[];
  invoices?: Row[];
  payments?: Row[];
  pendingDues?: Row[];
  refunds?: Row[];
  claims?: Row[];
  prescriptionQueue?: Row[];
  assets?: Row[];
  assetAlerts?: Row[];
  auditEvents?: Row[];
};

const money = (value: unknown) => {
  const parsed = Number(value || 0);
  return `Rs. ${Number.isFinite(parsed) ? parsed.toLocaleString("en-IN") : "0"}`;
};

const count = (value: unknown) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed.toLocaleString("en-IN") : "0";
};

const asChartRows = (rows: Row[] = []) =>
  rows.map((row) => ({
    label: String(row.label || "-"),
    value: Number(row.value || 0),
    href: String(row.href || "/clinical-services/finance"),
  }));

export default function ClinicalFinancePage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/clinical/enterprise-command-center", {
      cache: "no-store",
    });

    if (response.ok) {
      setData(await response.json());
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const revenue = data?.revenue || {};
  const cashByMode = useMemo(() => data?.cashByMode || [], [data]);
  const cash = cashByMode.find((row) => /cash/i.test(String(row.label || "")))?.value || 0;
  const upi = cashByMode.find((row) => /upi/i.test(String(row.label || "")))?.value || 0;
  const card = cashByMode.find((row) => /card|credit|debit/i.test(String(row.label || "")))?.value || 0;

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Enterprise Revenue & Finance Command Center
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Revenue, Collections & Recovery
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/90">
            Live invoices, payments, pending balances, refunds, claims,
            collections by mode, revenue trends, asset exposure and audit
            events are loaded from hospital transactions for the selected
            tenant, hospital and branch.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            icon={BadgeIndianRupee}
            title="Today's Revenue"
            value={money(revenue.today_revenue)}
            drillDownUrl="/clinical-services/finance?range=today"
            caption="Invoices generated today"
            loading={loading}
            refresh={load}
          />
          <DashboardCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={money(revenue.monthly_revenue)}
            drillDownUrl="/clinical-services/finance?range=month"
            caption="Current month invoice exposure"
            loading={loading}
            refresh={load}
          />
          <DashboardCard
            icon={Wallet}
            title="Outstanding Amount"
            value={money(revenue.outstanding_amount)}
            drillDownUrl="/clinical-services/finance?view=pending-dues"
            caption="Patient and payer balances"
            loading={loading}
            refresh={load}
          />
          <DashboardCard
            icon={AlertTriangle}
            title="Pending Payments"
            value={count(revenue.pending_payments)}
            drillDownUrl="/clinical-services/finance?view=pending-payments"
            caption="Invoices requiring collection"
            loading={loading}
            refresh={load}
          />
          <DashboardCard
            icon={Receipt}
            title="Collection Efficiency"
            value={`${Number(revenue.collection_efficiency || 0).toLocaleString("en-IN")}%`}
            drillDownUrl="/clinical-services/finance?view=collections"
            caption="Collected versus invoiced"
            loading={loading}
            refresh={load}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            icon={Landmark}
            title="Cash Collections"
            value={money(cash)}
            drillDownUrl="/clinical-services/finance?payment_mode=cash"
            caption="Today's cash receipts"
            loading={loading}
          />
          <DashboardCard
            icon={CreditCard}
            title="UPI Collections"
            value={money(upi)}
            drillDownUrl="/clinical-services/finance?payment_mode=upi"
            caption="Today's UPI receipts"
            loading={loading}
          />
          <DashboardCard
            icon={CreditCard}
            title="Card Collections"
            value={money(card)}
            drillDownUrl="/clinical-services/finance?payment_mode=card"
            caption="Today's card receipts"
            loading={loading}
          />
          <DashboardCard
            icon={ShieldCheck}
            title="Insurance Pending Claims"
            value={count(data?.claims?.filter((row) => !["SETTLED", "REJECTED"].includes(String(row.status || ""))).length)}
            drillDownUrl="/clinical-services/finance/claims"
            caption="Claims needing action"
            loading={loading}
          />
          <DashboardCard
            icon={FileText}
            title="Refund History"
            value={count(data?.refunds?.length)}
            drillDownUrl="/clinical-services/finance?view=refunds"
            caption="Refund requests and approvals"
            loading={loading}
          />
        </section>

        <QuickActionsPanel
          actions={[
            { label: "Create Invoice", href: "/clinical-services/finance/revenue-cycle", icon: Receipt },
            { label: "Collect Payment", href: "/clinical-services/finance?view=payments", icon: Wallet },
            { label: "Review Claims", href: "/clinical-services/finance/claims", icon: ShieldCheck },
            { label: "Open Audit Trail", href: "/clinical-services/security/audit", icon: FileText },
          ]}
        />

        <section className="grid gap-6 xl:grid-cols-2">
          <ClickableBarChart
            title="Daily Revenue Trend"
            rows={asChartRows(data?.revenueTrend)}
            empty="No revenue posted in the selected period."
          />
          <ClickableBarChart
            title="Collection Trend"
            rows={asChartRows(data?.collectionTrend)}
            empty="No payments posted in the selected period."
          />
          <ClickableBarChart
            title="Revenue by Department"
            rows={asChartRows(data?.revenueByDepartment)}
            empty="No department-level revenue yet."
          />
          <ClickableBarChart
            title="Revenue by Service"
            rows={asChartRows(data?.revenueByService)}
            empty="No service revenue yet."
          />
          <ClickableBarChart
            title="Revenue by Doctor/User"
            rows={asChartRows(data?.revenueByDoctor)}
            empty="No doctor/user revenue attribution yet."
          />
          <ClickableBarChart
            title="Collections by Mode"
            rows={asChartRows(data?.cashByMode)}
            empty="No collections posted today."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <OperationalPanel
            eyebrow="Revenue Drilldown"
            title="Invoice List"
            rows={data?.invoices || []}
            empty="No invoices generated yet."
            primary={(row) => `${row.invoice_number || "Invoice"} - ${money(row.total)}`}
            secondary={(row) => `${row.patient_name || "Patient"} | Paid ${money(row.paid_amount)} | Balance ${money(row.balance_amount)} | ${row.status || "-"}`}
            hrefForRow={(row) => `/api/clinical/billing/invoices/${row.id}/pdf`}
          />
          <OperationalPanel
            eyebrow="Collections"
            title="Payment List"
            rows={data?.payments || []}
            empty="No payments collected yet."
            primary={(row) => `${row.payment_number || "Payment"} - ${money(row.amount)}`}
            secondary={(row) => `${row.patient_name || "Patient"} | ${row.payment_mode || row.payment_method || "-"} | ${row.invoice_number || "No invoice"} | ${row.payment_date || ""}`}
            hrefForRow={(row) => `/api/clinical/documents/render/payment-receipt/${row.id}`}
          />
          <OperationalPanel
            eyebrow="Recovery"
            title="Pending Dues"
            rows={data?.pendingDues || []}
            empty="No pending dues."
            primary={(row) => `${row.invoice_number || "Invoice"} - ${money(row.balance_amount)}`}
            secondary={(row) => `${row.patient_name || "Patient"} | Total ${money(row.total)} | Paid ${money(row.paid_amount)} | ${row.status || "-"}`}
            hrefForRow={(row) => `/api/clinical/billing/invoices/${row.id}/pdf`}
          />
          <OperationalPanel
            eyebrow="Insurance"
            title="Pending Claims"
            rows={data?.claims || []}
            empty="No insurance claims recorded."
            primary={(row) => `${row.claim_number || "Claim"} - ${money(row.claim_amount)}`}
            secondary={(row) => `Approved ${money(row.approved_amount)} | Settled ${money(row.settled_amount)} | ${row.status || "-"}`}
            hrefForRow={(row) => `/clinical-services/finance/claims/${row.id}`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <OperationalPanel
            eyebrow="Prescription Revenue"
            title="Pharmacy Queue"
            rows={data?.prescriptionQueue || []}
            empty="No prescriptions awaiting pharmacy."
            primary={(row) => `${row.prescription_uid || row.prescription_number || "Prescription"} - ${row.patient_name || "Patient"}`}
            secondary={(row) => `${row.queue_number || "-"} | ${row.status || "-"} | ${row.created_at || ""}`}
            hrefForRow={() => "/clinical-services/pharmacy"}
          />
          <OperationalPanel
            eyebrow="Asset Management"
            title="Hospital Assets"
            rows={data?.assets || []}
            empty="No assets registered."
            primary={(row) => `${row.asset_number || "Asset"} - ${row.asset_name || "-"}`}
            secondary={(row) => `${row.category || "Asset"} | ${row.department_name || row.location || "-"} | Current value ${money(row.current_value)} | ${row.status || "-"}`}
            hrefForRow={(row) => `/clinical-services/finance/assets/${row.id}`}
          />
          <OperationalPanel
            eyebrow="Asset Alerts"
            title="Maintenance / Warranty Signals"
            rows={data?.assetAlerts || []}
            empty="No asset alerts."
            primary={(row) => `${row.asset_number || "Asset"} - ${row.asset_name || "-"}`}
            secondary={(row) => `${row.category || "-"} | ${row.status || "-"} | ${row.location || "-"} | Purchased ${row.purchase_date || "-"}`}
            hrefForRow={(row) => `/clinical-services/finance/assets/${row.id}`}
          />
          <OperationalPanel
            eyebrow="Audit"
            title="Recent Audit Events"
            rows={data?.auditEvents || []}
            empty="No audit events captured."
            primary={(row) => `${row.module_name || "Module"} - ${row.action || "Action"}`}
            secondary={(row) => `${row.user_name || "System"} | ${row.entity_type || "-"} #${row.entity_id || "-"} | ${row.summary || ""}`}
            hrefForRow={() => "/clinical-services/security/audit"}
          />
        </section>
      </div>
    </ClinicalShell>
  );
}
