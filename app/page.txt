"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function Home() {

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    schools: 0,
    classes: 0,
    subjects: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const response = await fetch(
      "/api/dashboard"
    );

    const data = await response.json();

    setStats(data);
  };

  return (
    <Layout>

      <div className="space-y-10">

        <div className="relative overflow-hidden rounded-[40px] p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">

          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
              NEXORA ERP
            </div>

            <h1 className="text-6xl font-black text-white">
              Welcome Back 👋
            </h1>

            <p className="text-blue-100 text-xl mt-4">
              Smart School Management Dashboard
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <p className="text-slate-500">
              Students
            </p>
            <h2 className="text-5xl font-black mt-3">
              {stats.students}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <p className="text-slate-500">
              Teachers
            </p>
            <h2 className="text-5xl font-black mt-3">
              {stats.teachers}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <p className="text-slate-500">
              Schools
            </p>
            <h2 className="text-5xl font-black mt-3">
              {stats.schools}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <p className="text-slate-500">
              Classes
            </p>
            <h2 className="text-5xl font-black mt-3">
              {stats.classes}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <p className="text-slate-500">
              Subjects
            </p>
            <h2 className="text-5xl font-black mt-3">
              {stats.subjects}
            </h2>
          </div>

        </div>

      </div>

    </Layout>
  );
}
