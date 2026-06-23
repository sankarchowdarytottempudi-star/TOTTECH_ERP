"use client";

import { useRouter } from "next/navigation";
import {
  Download,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type Row = Record<string, unknown>;

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  drillDownUrl,
  permissions,
  refresh,
  exportData,
  loading = false,
  caption,
}: {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: string;
  drillDownUrl: string;
  permissions?: string[];
  refresh?: () => void | Promise<void>;
  exportData?: () => void;
  loading?: boolean;
  caption?: string;
}) {
  const router = useRouter();
  const blocked =
    Boolean(permissions?.length) &&
    permissions?.includes("DENY");

  const runRefresh = async (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    event.preventDefault();
    await refresh?.();
  };

  const runExport = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    event.preventDefault();

    if (exportData) {
      exportData();
      return;
    }

    const blob = new Blob(
      [
        JSON.stringify(
          {
            title,
            value,
            trend,
            drillDownUrl,
          },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );
    const url =
      URL.createObjectURL(blob);
    const link =
      document.createElement("a");
    link.href = url;
    link.download = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article
      role="button"
      tabIndex={blocked ? -1 : 0}
      aria-disabled={blocked}
      onClick={() => {
        if (!blocked) {
          router.push(drillDownUrl);
        }
      }}
      onKeyDown={(event) => {
        if (
          !blocked &&
          (event.key === "Enter" ||
            event.key === " ")
        ) {
          router.push(drillDownUrl);
        }
      }}
      className={`group rounded-[8px] border bg-white p-5 shadow-sm transition ${
        blocked
          ? "cursor-not-allowed border-slate-200 opacity-60"
          : "cursor-pointer border-slate-200 hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-xl"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#0B1F3A] text-[#D4AF37] transition group-hover:scale-105">
          <Icon size={20} />
        </div>
      </div>
      {loading ? (
        <div className="mt-4 h-10 w-24 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-4 break-words text-4xl font-black text-slate-950">
          {value ?? 0}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          {caption ? (
            <p className="break-words text-xs font-bold text-slate-500">
              {caption}
            </p>
          ) : null}
          {trend ? (
            <p className="mt-1 break-words text-xs font-black uppercase text-[#8a6500]">
              {trend}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          {refresh ? (
            <button
              type="button"
              onClick={runRefresh}
              className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-700 hover:border-[#D4AF37] hover:text-[#8a6500]"
              aria-label={`Refresh ${title}`}
            >
              <RefreshCw size={14} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={runExport}
            className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-700 hover:border-[#D4AF37] hover:text-[#8a6500]"
            aria-label={`Export ${title}`}
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function QuickActionsPanel({
  actions,
}: {
  actions: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
}) {
  const router = useRouter();

  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[#8a6500]">
            Quick Actions
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Start Workflows
          </h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              type="button"
              key={action.label}
              onClick={() =>
                router.push(action.href)
              }
              className="flex min-h-16 items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#0B1F3A] text-[#D4AF37]">
                <Icon size={18} />
              </span>
              <span className="min-w-0 break-words text-sm font-black text-slate-950">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function OperationalPanel({
  title,
  eyebrow,
  rows,
  empty,
  primary,
  secondary,
  hrefForRow,
}: {
  title: string;
  eyebrow?: string;
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
  hrefForRow?: (row: Row) => string;
}) {
  const router = useRouter();

  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      {eyebrow ? (
        <p className="text-xs font-black uppercase text-[#8a6500]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-2xl font-black text-slate-950">
        {title}
      </h2>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map((row, index) => {
            const href =
              hrefForRow?.(row);
            return (
              <article
                key={`${primary(row)}-${index}`}
                role={href ? "button" : undefined}
                tabIndex={href ? 0 : -1}
                onClick={() => {
                  if (href) {
                    router.push(href);
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    href &&
                    (event.key === "Enter" ||
                      event.key === " ")
                  ) {
                    event.preventDefault();
                    router.push(href);
                  }
                }}
                className={`rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition ${
                  href
                    ? "cursor-pointer hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
                    : ""
                }`}
              >
                <p className="break-words font-black text-slate-950">
                  {primary(row)}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                  {secondary(row)}
                </p>
              </article>
            );
          })
        ) : (
          <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}

export function ClickableBarChart({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: {
    label: string;
    value: number;
    href: string;
  }[];
  empty: string;
}) {
  const router = useRouter();
  const max =
    rows.reduce(
      (highest, row) =>
        Math.max(highest, row.value),
      0
    ) || 1;

  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        {rows.length ? (
          rows.map((row) => (
            <button
              type="button"
              key={row.label}
              onClick={() =>
                router.push(row.href)
              }
              className="block w-full rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 break-words text-sm font-black text-slate-950">
                  {row.label}
                </span>
                <span className="shrink-0 text-sm font-black text-[#8a6500]">
                  {row.value}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#D4AF37]"
                  style={{
                    width: `${Math.max(8, (row.value / max) * 100)}%`,
                  }}
                />
              </div>
            </button>
          ))
        ) : (
          <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}
