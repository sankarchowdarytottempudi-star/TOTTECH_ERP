import Layout from "@/components/Layout";

export default function PrincipalDashboardPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Principal Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          School/College 360, academic year, attendance, finance, and risk overview.
        </p>
      </main>
    </Layout>
  );
}
