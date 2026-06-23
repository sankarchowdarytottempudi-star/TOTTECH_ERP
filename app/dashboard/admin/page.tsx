import Layout from "@/components/Layout";

export default function AdminDashboardPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Platform administration, school/college lifecycle, governance, and AI
          controls.
        </p>
      </main>
    </Layout>
  );
}
