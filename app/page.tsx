"use client";


import Widget from "@/components/dashboard/Widget";
import Layout from "@/components/Layout";
import TottechAIBadge from "@/components/ai/TottechAIBadge";
import PremiumCard from "@/components/dashboard/PremiumCard";
import DashboardChart from "@/components/DashboardChart";

import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  ClipboardList,
  Brain,
  FileText,
  School,
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

type DashboardData = {
  students: number;
  teachers: number;
  schools: number;
  classes: number;
  subjects: number;
  sections: number;
  attendance: number;
  marksEntries: number;
  campusHealth: number;
  examSchedule?: number;
  questionBank?: number;
  questionPapers?: number;
  studentGrowthTrend?: {
    month: string;
    students: number;
    newStudents?: number;
  }[];
};

type DashboardUser = {
  full_name?: string;
  school_name?: string;
  role?: string;
  module_access?: Record<string, boolean>;
  user_module_access?: Record<string, boolean>;
};

function normalizeModuleKey(value: string) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function canAccessModule(
  user: DashboardUser | null,
  userModuleKey: string,
  schoolModuleKey: string
) {
  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  if (role === "SUPER_ADMIN") {
    return true;
  }

  const userAccess =
    user?.user_module_access?.[
      normalizeModuleKey(userModuleKey)
    ];
  const schoolAccess =
    user?.module_access?.[
      normalizeModuleKey(schoolModuleKey)
    ];

  return userAccess === true && schoolAccess === true;
}

export default function DashboardPage() {
  const { t } = useLanguage();

  const [data, setData] =
    useState<DashboardData | null>(null);
  const [user] =
    useState<DashboardUser | null>(() => {
      if (
        typeof window === "undefined"
      ) {
        return null;
      }

      const storedUser =
        window.localStorage.getItem(
          "erpUser"
        );

      if (!storedUser) {
        return null;
      }

      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    });

  const canViewAttendance = canAccessModule(
    user,
    "ATTENDANCE",
    "OPERATIONS"
  );
  const canViewExams = canAccessModule(
    user,
    "EXAMS",
    "ACADEMICS"
  );

  async function loadDashboard() {
    try {

        const res =
          await fetch(
            "/api/dashboard"
          );

        const result =
          (await res.json()) as DashboardData;

        setData(result);

    } catch (error) {

        console.error(error);

    }

  }

  useEffect(() => {
    void Promise.resolve().then(
      loadDashboard
    );
  }, []);

  if (!data) {

    return (

      <Layout>

        <div className="p-10">
          {t("loadingDashboard", "Loading Dashboard...")}
        </div>

      </Layout>

    );

  }

  return (

    <Layout>

      <div className="space-y-8">

        {/* HERO */}

        <div
          className="
            tt-hero
            p-8
            md:p-12
          "
        >

  <h1
  className="
  text-3xl
  md:text-5xl
  font-black
  text-slate-950
  "
>
  {t("welcomeBack", "Welcome back")},
  {user?.full_name || t("administrator", "Administrator")}
</h1>

<p
  className="
  text-slate-600
  mt-3
  text-lg
  "
>
  {user?.school_name ||
    t("schoolCollegeIntelligenceCenter", "School/College Intelligence Center")}
</p>
          <p
            className="
              text-slate-600
              mt-3
              text-lg
            "
          >
            {t(
              "aiPoweredEducationOperatingSystem",
              "AI Powered Education Institution Management"
            )}
          </p>

<div
  className="
  mt-8
  inline-flex
  items-center
  gap-3
  tt-accent-panel
  px-5
  py-3
  "
>

  <Brain size={24} />

  <span>
    {t("campusHealthScore", "Campus Health Score")}:
    {data.campusHealth}%
  </span>

</div>
<div
  className="
  mt-6
  grid
  grid-cols-2
  md:grid-cols-4
  gap-4
  "
>

  <MetricCard
    title={t("schoolCollegeHealth", "School/College Health")}
    value={`${data.campusHealth}%`}
    href="/schools/list"
  />

  <MetricCard
    title={t("studentsCount", "Students")}
    value={data.students}
    href="/students/list"
  />

  <MetricCard
    title={t("teachersCount", "Teachers")}
    value={data.teachers}
    href="/teachers"
  />

  <MetricCard
    title={t("schoolsColleges", "Schools/Colleges")}
    value={data.schools}
    href="/schools/list"
  />

</div>
<div
  className="
    mt-8
    flex
    flex-wrap
    gap-3
  "
>

  <Link
    href="/students"
    className="
      px-5
      py-3
      tt-button
    "
  >
      {t("addStudent", "Add Student")}
  </Link>

  {canViewAttendance ? (
    <Link
      href="/attendance"
      className="
        px-5
        py-3
        tt-button-secondary
      "
    >
      {t("attendance", "Attendance")}
    </Link>
  ) : null}

	  <Link
	    href="/ai-command-center"
	    className="
	      inline-flex
	      items-center
	      gap-2
	      px-5
	      py-3
	      tt-button
	    "
	  >
	    <TottechAIBadge size="sm" />
      {t("tottechAi", "TOTTECH AI")}
	  </Link>

</div>

        </div>

        {/* KPI CARDS */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          <PremiumCard
  title={t("studentsCount", "Students")}
  value={data.students}
  href="/students/list"
            icon={
              <GraduationCap />
            }
            color="bg-gradient-to-r from-blue-600 to-indigo-600"
          />

          <PremiumCard
  title={t("teachersCount", "Teachers")}
 value={data.teachers}
  href="/teachers"
            icon={<Users />}
            color="bg-gradient-to-r from-green-600 to-emerald-600"
          />

          <PremiumCard
  title={t("schoolsColleges", "Schools/Colleges")}
  href="/schools/list"
            value={data.schools}
            icon={
              <Building2 />
            }
            color="bg-gradient-to-r from-purple-600 to-pink-600"
          />

          {canViewAttendance ? (
            <PremiumCard
              title={t("attendance", "Attendance")}
              href="/attendance"
              value={data.attendance}
              icon={
                <ClipboardList />
              }
              color="bg-gradient-to-r from-orange-600 to-red-600"
            />
          ) : null}

        </div>

        {/* SECOND ROW */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          <PremiumCard
  title={t("classes", "Classes")}
  href="/academics/classes"
            value={data.classes}
            icon={<School />}
            color="bg-gradient-to-r from-cyan-600 to-sky-600"
          />

          <PremiumCard
  title={t("subjects", "Subjects")}
  href="/academics/subjects"
            value={data.subjects}
            icon={<BookOpen />}
            color="bg-gradient-to-r from-teal-600 to-green-600"
          />

          <PremiumCard
  title={t("questionBank", "Question Bank")}
  href="/academics/question-bank"
            value={data.questionBank ?? 0}
            icon={<FileText />}
            color="bg-gradient-to-r from-violet-600 to-purple-600"
          />

          <PremiumCard
  title={t("questionPapers", "Question Papers")}
  href="/academics/question-papers"
            value={data.questionPapers ?? 0}
            icon={<ClipboardList />}
            color="bg-gradient-to-r from-amber-600 to-orange-600"
          />

        </div>

        {/* CHART */}

<Link
  href="/analytics"
  className="block tt-card tt-card-pad cursor-pointer transition-all hover:border-amber-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
  aria-label={t("openAnalytics", "Open analytics")}
>

  <div className="flex justify-between items-center mb-6">

    <h2
      className="
        text-xl
        font-black
      "
    >
      {t("analytics", "Analytics")}
    </h2>

    <span
      className="
        px-4
        py-2
        tt-button
      "
    >
      {t("openAnalytics", "Open Analytics")}
    </span>

  </div>

  <DashboardChart
    data={data.studentGrowthTrend || []}
  />

</Link>

{/* AI INSIGHTS */}

<a
  href="/ai-command-center"
  className="
    block
    tt-card
    tt-card-pad
    hover:shadow-xl
    transition-all
  "
>

  <div className="flex justify-between items-center mb-6">

    <h2
      className="
        text-xl
        font-black
      "
    >
    {t("aiInsights", "AI Insights")}
    </h2>

    <span
      className="
        px-4
        py-2
        tt-badge
      "
    >
      {t("openAiCenter", "Open AI Center")}
    </span>

  </div>

  <div className="space-y-4">

    <div
      className="
        p-4
        tt-accent-panel
      "
    >
      {t("marksEntries", "Total Marks Entries")}:
      {" "}
      {data.marksEntries}
    </div>

    <div
      className="
        p-4
        tt-accent-panel
      "
    >
      {t("examSchedule", "Exam Schedules")}:
      {" "}
      {data.examSchedule}
    </div>

    <div
      className="
        p-4
        tt-accent-panel
      "
    >
      {t("sections", "Sections")}:
      {" "}
      {data.sections}
    </div>

  </div>

</a>

{/* OPERATIONS */}

<div
  className="
    grid
    md:grid-cols-2
    gap-6
  "
>

  {canViewAttendance ? (
  <Widget title={t("todayAttendance", "Today's Attendance")} href="/attendance">

    <div className="space-y-3">

      <div>
        {t("presentRecords", "Present Records")}:
        {" "}
        {data.attendance}
      </div>

      <span
        className="
          tt-link
        "
      >
        {t("openAttendance", "Open Attendance")} →
      </span>

    </div>

  </Widget>
  ) : null}

  {canViewExams ? (
  <Widget title={t("upcomingExams", "Upcoming Exams")} href="/academics/exam-schedule">

    <div className="space-y-3">

      <div>
        {t("scheduledExams", "Scheduled Exams")}:
        {" "}
        {data.examSchedule}
      </div>

      <span
        className="
          tt-link
        "
      >
        {t("openExams", "Open Exams")} →
      </span>

    </div>

  </Widget>
  ) : null}

</div>

      </div>

    </Layout>

  );

}
function MetricCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number | string | undefined;
  href: string;
}) {

  return (

    <Link
      href={href}
      className="
      tt-card
      p-4
      block
      cursor-pointer
      transition-all
      hover:border-amber-300
      hover:shadow-xl
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-amber-400
      "
      aria-label={`Open ${title}`}
    >

      <p className="tt-card-title">
        {title}
      </p>

      <h2
        className="
        tt-card-value
        mt-2
        "
      >
        {value}
      </h2>

    </Link>

  );

}
