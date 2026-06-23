import Layout from "@/components/Layout";

export default function ImportsPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Import Center
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Import jobs are tracked through the reconstructed
          <span className="font-semibold"> import_jobs </span>
          table so bulk uploads have status and rollback evidence.
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <a
            className="text-sm font-semibold text-blue-700"
            href="/api/imports"
          >
            Open imports API
          </a>
        </div>
      </main>
    </Layout>
  );
}
