"use client";

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

export default function WarRoomPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    const response =
      await fetch(
        "/api/dashboard/school-dna"
      );

    const result =
      await response.json();

    setData(result);
  };

  if (!data) {
    return (
      <Layout>
        Loading War Room...
      </Layout>
    );
  }

  const dna = data.schoolDNA;

  return (
    <Layout>
<div className="bg-white rounded-3xl p-8 shadow mt-8">

  <h2 className="text-3xl font-black mb-6">
    👨‍💼 Principal AI Copilot
  </h2>

  <p className="text-slate-600 mb-6">
    Strategic school/college intelligence engine
  </p>

  <div className="grid md:grid-cols-2 gap-4">

    <button
      className="bg-indigo-600 text-white rounded-2xl p-4"
    >
      Which students are at risk?
    </button>

    <button
      className="bg-purple-600 text-white rounded-2xl p-4"
    >
      Which teachers need support?
    </button>

    <button
      className="bg-pink-600 text-white rounded-2xl p-4"
    >
      What should I focus on this week?
    </button>

    <button
      className="bg-green-600 text-white rounded-2xl p-4"
    >
      Show school/college improvement plan
    </button>

  </div>

</div>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-10 rounded-3xl">

          <h1 className="text-5xl font-black">
            🚀 TOTTech War Room
          </h1>

          <p className="text-xl mt-3">
            Real-Time School/College Command Center
          </p>

        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          <Card
            title="Overall Health"
            value={`${dna.overallScore}%`}
          />

          <Card
            title="Students"
            value={data.totalStudents}
          />

          <Card
            title="Teachers"
            value={data.totalTeachers}
          />

          <Card
            title="Revenue"
            value={`₹${data.totalPaidAmount}`}
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-black mb-6">
              Academic Intelligence
            </h2>

            <ul className="space-y-3">
              <li>📚 Student Health: {dna.studentHealth}%</li>
              <li>🎓 Promotion Readiness: High</li>
              <li>⚠ At-Risk Students: 0</li>
              <li>🏆 Top Performers: Available</li>
            </ul>

          </div>

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-black mb-6">
              Faculty Intelligence
            </h2>

            <ul className="space-y-3">
              <li>👨‍🏫 Teacher Health: {dna.teacherHealth}%</li>
              <li>🔥 Burnout Risk: Low</li>
              <li>⭐ Faculty Performance: Stable</li>
              <li>📈 Leadership Pipeline: Active</li>
            </ul>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-black mb-6">
              Financial Intelligence
            </h2>

            <ul className="space-y-3">
              <li>💰 Revenue Health: {dna.revenueHealth}%</li>
              <li>💵 Collected: ₹{data.totalPaidAmount}</li>
              <li>📄 Invoiced: ₹{data.totalInvoiceAmount}</li>
            </ul>

          </div>

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-black mb-6">
              Operations Intelligence
            </h2>

            <ul className="space-y-3">
              <li>🚌 Transport Health: {dna.transportHealth}%</li>
              <li>🏠 Hostel Health: {dna.hostelHealth}%</li>
              <li>📍 Operations Status: Stable</li>
            </ul>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-2xl font-black mb-6">
            🤖 AI Executive Summary
          </h2>

          <p>
            {dna.summary}
          </p>

        </div>

      </div>

    </Layout>
  );
}

function Card({
  title,
  value,
}: any) {
  return (
    <div className="bg-white rounded-3xl shadow p-8">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-5xl font-black mt-3">
        {value}
      </h2>

    </div>
  );
}
