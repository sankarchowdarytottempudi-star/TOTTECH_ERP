"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type TrendRow = {
  month: string;
  students: number;
  newStudents?: number;
};

const DEFAULT_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
];

const MONTH_ALIASES: Record<string, string> = {
  jan: "january",
  january: "january",
  feb: "february",
  february: "february",
  mar: "march",
  march: "march",
  apr: "april",
  april: "april",
  may: "may",
  jun: "june",
  june: "june",
  jul: "july",
  july: "july",
  aug: "august",
  august: "august",
  sep: "september",
  sept: "september",
  september: "september",
  oct: "october",
  october: "october",
  nov: "november",
  november: "november",
  dec: "december",
  december: "december",
};

export default function DashboardChart({
  data = [],
}: {
  data?: TrendRow[];
}) {
  const { t } = useLanguage();
  const chartData = useMemo(
    () =>
      Array.isArray(data) && data.length
        ? data
        : DEFAULT_MONTHS.map((month) => ({
            month,
            students: 0,
            newStudents: 0,
          })),
    [data]
  );

  const maxValue = useMemo(() => {
    const values = chartData.flatMap((row) => [
      Number(row.students || 0),
      Number(row.newStudents || 0),
    ]);
    return Math.max(1, ...values);
  }, [chartData]);

  const linePath = useMemo(() => {
    const width = 1000;
    const height = 260;
    const paddingX = 16;
    const paddingTop = 16;
    const paddingBottom = 32;
    const plotWidth = width - paddingX * 2;
    const plotHeight = height - paddingTop - paddingBottom;

    return chartData
      .map((row, index) => {
        const x =
          chartData.length === 1
            ? width / 2
            : paddingX +
              (plotWidth / (chartData.length - 1)) * index;
        const value = Number(row.students || 0);
        const y =
          paddingTop +
          plotHeight -
          (value / maxValue) * plotHeight;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(
          2
        )} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [chartData, maxValue]);

  const hasStudentData = useMemo(
    () =>
      chartData.some(
        (row) =>
          Number(row.students || 0) > 0 ||
          Number(row.newStudents || 0) > 0
      ),
    [chartData]
  );

  const monthLabel = (monthKey: string) => {
    const normalized = String(monthKey || "")
      .trim()
      .toLowerCase();
    const monthKeyForLocale = MONTH_ALIASES[normalized] || normalized;
    return t(monthKeyForLocale, monthKey.slice(0, 3));
  };

  return (
    <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
            {t("analytics", "Analytics")}
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            {t("studentGrowthTrend", "Student Growth Trend")}
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
          {chartData.length} {t("months", "months")}
        </div>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
        <svg
          viewBox="0 0 1000 340"
          className="block h-[340px] w-full"
          role="img"
          aria-label="Student growth trend chart"
        >
          <defs>
            <linearGradient
              id="student-growth-fill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((tick) => {
            const y = 26 + tick * 45;
            return (
              <g key={tick}>
                <line
                  x1="16"
                  x2="984"
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x="14"
                  y={y + 4}
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="end"
                >
                  {Math.round(maxValue - (maxValue / 4) * tick)}
                </text>
              </g>
            );
          })}

          <path
            d={`${linePath} L 984 274 L 16 274 Z`}
            fill="url(#student-growth-fill)"
          />

          <path
            d={linePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {chartData.map((row, index) => {
            const width = 1000;
            const height = 260;
            const paddingX = 16;
            const paddingTop = 16;
            const paddingBottom = 32;
            const plotWidth = width - paddingX * 2;
            const plotHeight = height - paddingTop - paddingBottom;
            const x =
              chartData.length === 1
                ? width / 2
                : paddingX +
                  (plotWidth / (chartData.length - 1)) * index;
            const value = Number(row.students || 0);
            const y =
              paddingTop +
              plotHeight -
              (value / maxValue) * plotHeight;

            return (
              <g key={`${row.month}-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#d4af37"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y="308"
                  fill="#334155"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {monthLabel(row.month)}
                </text>
                <text
                  x={x}
                  y={Math.max(18, y - 12)}
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {Number(row.students || 0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {!hasStudentData ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          {t(
            "noStudentGrowthData",
            "No student admission records found for the selected school/college and academic year yet."
          )}
        </p>
      ) : null}
    </section>
  );
}
