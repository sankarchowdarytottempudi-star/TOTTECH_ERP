import Link from "next/link";

const items = [
  ["/finance", "Overview"],
  ["/finance/fees", "Fees"],
  ["/finance/assign", "Assign"],
  ["/finance/invoices", "Invoices"],
  ["/finance/payments", "Payments"],
  ["/finance/pending", "Pending"],
  ["/finance/receipts", "Receipts"],
  ["/finance/concessions", "Concessions"],
  ["/finance/expenses", "Expenses"],
  ["/finance/vouchers", "Expense Vouchers"],
  ["/finance/reports", "Reports"],
] as const;

export default function FinanceModuleNav() {
  return (
    <section className="tt-card tt-card-pad">
      <div className="flex flex-wrap gap-2">
        {items.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-amber-300 hover:text-slate-950"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
