"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import DrillDownTile from "@/components/DrillDownTile";
import Layout from "@/components/Layout";

function money(value: unknown) {
  return `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;
}

export default function SchoolProfile() {
  const params = useParams();

  const [data, setData] =
    useState<any>(null);
  const [error, setError] =
    useState("");

  useEffect(() => {
    void loadSchool();
  }, []);

  const loadSchool = async () => {
    try {
      const response =
        await fetch(
          `/api/schools/${params?.id}`
        );
      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to load school/college"
        );
      }

      setData(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load school/college"
      );
    }
  };

  if (!data) {
    return (
      <Layout>
        <div className="p-10 font-black">
          {error || "Loading School/College..."}
        </div>
      </Layout>
    );
  }

  const {
    school,
    compliance,
    studentCount,
    teacherCount,
    classCount,
    sectionCount,
    subjectCount,
    attendanceCount,
    campusHealth,
    finance,
    recentEvents,
  } = data;

  const insights = [
    {
      title: "Academic Setup",
      value:
        classCount > 0 &&
        sectionCount > 0
          ? "Classes and sections active"
          : "Create classes and sections",
    },
    {
      title: "Attendance Evidence",
      value:
        attendanceCount > 0
          ? `${attendanceCount} records captured`
          : "No attendance records yet",
    },
    {
      title: "Finance Exposure",
      value: `${money(
        finance?.balanceAmount
      )} pending`,
    },
    {
      title: "Operational History",
      value:
        recentEvents?.length > 0
          ? `${recentEvents.length} recent ledger events`
          : "No recent ledger events",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-dark-hero overflow-hidden rounded-lg border border-amber-300/40 bg-slate-950 shadow-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,160,52,0.30),transparent_34%),linear-gradient(135deg,#071424,#111827)]" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="tt-dark-accent text-xs font-black uppercase tracking-wide">
                    School/College Command Center
                  </p>
                  <h1 className="tt-dark-title mt-2 break-words text-3xl font-black md:text-4xl">
                    {school.school_name}
                  </h1>
                  <p className="tt-dark-copy mt-2 max-w-3xl text-sm font-semibold leading-6">
                    {school.school_code}
                    {school.principal_name
                      ? ` • Principal: ${school.principal_name}`
                      : ""}
                    {school.phone
                      ? ` • ${school.phone}`
                      : ""}
                  </p>
                  <Link
                    href={`/schools/edit/${school.id}`}
                    className="mt-5 inline-flex rounded-xl border border-amber-300/60 bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/20"
                  >
                    Edit School/College Details
                  </Link>
                </div>

                <div className="grid min-w-[240px] gap-3 rounded-lg border border-amber-300/40 bg-white/10 p-4">
                  <p className="tt-dark-accent text-xs font-black uppercase tracking-wide">
                    Campus Health
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="tt-dark-kpi text-5xl font-black">
                      {campusHealth}
                    </span>
                    <span className="tt-dark-accent pb-2 text-lg font-black">
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${Math.min(
                          100,
                          campusHealth || 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Info
              label="School/College Code"
              value={school.school_code}
            />
            <Info
              label="Principal"
              value={
                school.principal_name ||
                "-"
              }
            />
            <Info
              label="Email"
              value={school.email || "-"}
            />
            <Info
              label="Phone"
              value={school.phone || "-"}
            />
            <Info
              label="Recognition No."
              value={
                school.recognition_number ||
                "-"
              }
            />
            <Info
              label="Affiliation No."
              value={
                school.affiliation_number ||
                "-"
              }
            />
            <Info
              label="Recognition Status"
              value={
                compliance?.recognitionStatus ||
                "MISSING"
              }
            />
            <Info
              label="Affiliation Status"
              value={
                compliance?.affiliationStatus ||
                "MISSING"
              }
            />
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                School/College Compliance Status
              </p>
              <h2 className="text-2xl font-black text-slate-950">
                Recognition & Affiliation
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Track recognition and affiliation validity from the school/college registry.
              </p>
            </div>
            <div className="grid gap-2 text-sm font-black">
              <Badge
                label="Recognition"
                value={compliance?.recognitionStatus || "MISSING"}
              />
              <Badge
                label="Affiliation"
                value={compliance?.affiliationStatus || "MISSING"}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <AlertCard
              title="Recognition Alert"
              message={compliance?.recognitionWarning || "Recognition details missing"}
            />
            <AlertCard
              title="Affiliation Alert"
              message={compliance?.affiliationWarning || "Affiliation details missing"}
            />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DrillDownTile
            title="Students"
            value={studentCount}
            icon="S"
            href="/students/list"
          />

          <DrillDownTile
            title="Teachers"
            value={teacherCount}
            icon="T"
            href="/teachers"
          />

          <DrillDownTile
            title="Classes"
            value={classCount}
            icon="C"
            href={`/academics/classes?school_id=${school.id}`}
          />

          <DrillDownTile
            title="Subjects"
            value={subjectCount}
            icon="A"
            href="/academics/subjects"
          />

          <DrillDownTile
            title="Invoices"
            value={finance?.invoiceCount || 0}
            icon="F"
            href="/finance/invoices"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="tt-card tt-card-pad">
            <h2 className="text-2xl font-black">
              School/College 360 Signals
            </h2>
            <div className="mt-5 grid gap-3">
              {insights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                >
                  <p className="text-xs font-black uppercase text-amber-800">
                    {item.title}
                  </p>
                  <p className="mt-1 font-black text-slate-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <h2 className="text-2xl font-black">
              Recent Event Ledger
            </h2>
            <div className="mt-5 space-y-3">
              {(recentEvents || []).length ? (
                recentEvents.map(
                  (event: any) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-black">
                        {event.event_type}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {event.summary ||
                          event.module_name ||
                          "-"}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No event ledger activity recorded for this school/college yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-black">
        {value}
      </p>
    </div>
  );
}

function Badge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const tone =
    value === "VALID"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : value === "EXPIRING_SOON"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : value === "EXPIRED"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <div className={`rounded-xl border px-4 py-2 ${tone}`}>
      <span className="block text-[10px] uppercase tracking-[0.3em]">{label}</span>
      <strong>{value.replaceAll("_", " ")}</strong>
    </div>
  );
}

function AlertCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-700">
        {message}
      </p>
    </div>
  );
}
