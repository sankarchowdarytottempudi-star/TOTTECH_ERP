"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, GraduationCap, Users, UserRoundCheck, Wifi, Loader2 } from "lucide-react";

import Layout from "@/components/Layout";
import CommandCenterHero from "@/components/ui/CommandCenterHero";
import DashboardChart from "@/components/DashboardChart";
import { useLanguage } from "@/components/LanguageProvider";
import { apiJson, errorMessage } from "@/lib/client/api";

type DashboardMetrics = {
  students?: number;
  teachers?: number;
  schools?: number;
  classes?: number;
  subjects?: number;
  sections?: number;
  attendance?: number;
  marksEntries?: number;
  campusHealth?: number;
  studentGrowthTrend?: Array<{
    month: string;
    students: number;
    newStudents?: number;
  }>;
};

function percent(value?: number) {
  return `${Math.max(0, Math.min(100, Math.round(Number(value || 0))))}%`;
}

function formatCount(value?: number) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

export default function Analytics() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");
        const payload = await apiJson<DashboardMetrics>("/api/dashboard");
        if (!mounted) return;
        setData(payload);
      } catch (requestError) {
        if (!mounted) return;
        setError(errorMessage(requestError, "Failed to load live analytics data"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: t("studentsCount", "Students"),
        value: data?.students,
        icon: GraduationCap,
        tone: "from-sky-600 to-cyan-600",
      },
      {
        label: t("teachersCount", "Teachers"),
        value: data?.teachers,
        icon: Users,
        tone: "from-violet-600 to-fuchsia-600",
      },
      {
        label: t("attendance", "Attendance"),
        value: data?.attendance,
        icon: UserRoundCheck,
        tone: "from-emerald-600 to-teal-600",
        suffix: "%",
      },
      {
        label: t("marksEntries", "Marks Entries"),
        value: data?.marksEntries,
        icon: BookOpen,
        tone: "from-amber-600 to-orange-600",
      },
      {
        label: t("classes", "Classes"),
        value: data?.classes,
        icon: BarChart3,
        tone: "from-indigo-600 to-blue-600",
      },
      {
        label: t("schoolCollegeHealth", "School/College Health"),
        value: data?.campusHealth,
        icon: Wifi,
        tone: "from-slate-700 to-slate-950",
        suffix: "%",
      },
    ],
    [data]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <CommandCenterHero
          label={t("institutionIntelligence", "Institution Intelligence")}
          title={t("analyticsDashboard", "Analytics Dashboard")}
          subtitle={t(
            "analyticsDashboardSubtitle",
            "Live KPI snapshot for students, teachers, attendance, marks, and school/college health."
          )}
          className="tt-dark-hero"
        />

        {error ? (
          <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.label}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      {metric.label}
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <p className="text-4xl font-black text-slate-900">
                        {loading ? "..." : `${formatCount(metric.value)}${metric.suffix || ""}`}
                      </p>
                    </div>
                  </div>
                  <div className={`grid h-11 w-11 place-items-center rounded-[8px] bg-gradient-to-br ${metric.tone} text-white shadow-sm`}>
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="space-y-6">
          <DashboardChart data={data?.studentGrowthTrend || []} />

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
                  {t("liveStatus", "Live Status")}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {t("campusSnapshot", "Campus Snapshot")}
                </h2>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {t("realTime", "Real-time")}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <StatusRow label={t("studentsCount", "Students")} value={formatCount(data?.students)} />
              <StatusRow label={t("teachersCount", "Teachers")} value={formatCount(data?.teachers)} />
              <StatusRow label={t("classes", "Classes")} value={formatCount(data?.classes)} />
              <StatusRow label={t("subjects", "Subjects")} value={formatCount(data?.subjects)} />
              <StatusRow label={t("sections", "Sections")} value={formatCount(data?.sections)} />
              <StatusRow label={t("schoolCollegeHealth", "Campus Health")} value={loading ? "..." : percent(data?.campusHealth)} highlight />
            </div>

            <div className="mt-6 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              {t(
                "analyticsLivePayloadNotice",
                "This chart and these KPIs now use the live /api/dashboard payload for the selected school/college and academic year."
              )}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
                {t("trends", "Trends")}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                {t("studentGrowthTrend", "Student Growth Trend")}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {data?.studentGrowthTrend?.length
                ? `${data.studentGrowthTrend.length} ${t("monthsLoaded", "months loaded")}`
                : t("noTrendData", "No trend data")}
            </div>
          </div>
          <div className="mt-5">
            <DashboardChart data={data?.studentGrowthTrend || []} />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatusRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-[8px] border px-4 py-3 ${
        highlight
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
}
