import Layout from "@/components/Layout";

export default function TeacherDashboardPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Teacher 360, classroom history, attendance, marks, and SchoolGPT.
        </p>
      </main>
    </Layout>
  );
}
