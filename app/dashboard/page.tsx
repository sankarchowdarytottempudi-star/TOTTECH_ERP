import Layout from "@/components/Layout";
import CommandCenterHero from "@/components/ui/CommandCenterHero";

export default function DashboardIndexPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <CommandCenterHero
          label="Workspace Gateway"
          title="Dashboard"
          subtitle="Recovered dashboard index for admin, principal, teacher, and parent workspaces."
          className="tt-dark-hero"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["/dashboard/admin", "Admin"],
            [
              "/dashboard/principal",
              "Principal",
            ],
            ["/dashboard/teacher", "Teacher"],
            ["/dashboard/parent", "Parent"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold text-blue-700"
            >
              {label}
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
