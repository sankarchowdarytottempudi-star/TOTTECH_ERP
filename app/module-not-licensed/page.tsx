import Link from "next/link";

export default async function ModuleNotLicensedPage({
  searchParams,
}: {
  searchParams?: Promise<{
    module?: string;
  }>;
}) {
  const resolvedSearchParams =
    await searchParams;
  const moduleKey =
    resolvedSearchParams?.module || "MODULE";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
          Subscription Access
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          Module Not Licensed
        </h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
          This module is not enabled for the selected school/college subscription.
        </p>
        <p className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800">
          {moduleKey}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
