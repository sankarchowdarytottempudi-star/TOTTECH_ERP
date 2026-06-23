"use client";

import Layout from "@/components/Layout";

export default function AcademicIntelligence() {

  return (
    <Layout>

      <div className="space-y-6">

        <h1 className="text-5xl font-black">
          📚 Academic Intelligence
        </h1>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            Question Bank
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Question Papers
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Exam Schedule
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Marks Entry
          </div>

        </div>

      </div>

    </Layout>
  );
}
