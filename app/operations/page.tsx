import Layout from "@/components/Layout";

const cards = [
  {
    title: "Health",
    href: "/api/operations/health",
    text: "Database restore, Prisma schema, event ledger, and service checks.",
  },
  {
    title: "Audit",
    href: "/api/operations/audit",
    text: "Recovered audit logs plus reconstructed event ledger records.",
  },
  {
    title: "Backups",
    href: "/api/operations/backups",
    text: "Backup records and manual backup requests for recovery operations.",
  },
];

export default function OperationsPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">
            Operations Center
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Production recovery, auditability, and platform health.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-base font-semibold text-slate-900">
                {card.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {card.text}
              </div>
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
