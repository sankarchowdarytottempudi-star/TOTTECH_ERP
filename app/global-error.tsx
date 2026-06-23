"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f3f6fb] text-[#04142E]">
        <main className="grid min-h-screen place-items-center px-6">
          <section className="max-w-xl rounded-[8px] border border-slate-200 bg-white p-8 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6500]">
              TOTTECH ONE
            </p>
            <h1 className="mt-3 text-2xl font-black">
              Application Error
            </h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              A fatal rendering error occurred. Reset the app and try again.
            </p>
            {error?.message ? (
              <pre className="mt-5 overflow-auto rounded-[8px] bg-slate-50 p-4 text-xs font-semibold text-slate-700">
                {error.message}
              </pre>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-white"
              >
                Reset App
              </button>
              <a
                href="/login"
                className="rounded-[8px] border border-slate-300 px-5 py-3 text-sm font-black text-[#04142E]"
              >
                Go to Login
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
