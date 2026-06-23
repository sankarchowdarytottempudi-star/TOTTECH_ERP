"use client";

import Layout from "@/components/Layout";

export default function StudentEvaluation() {

  return (
    <Layout>

      <div className="space-y-6">

        <h1 className="text-4xl font-bold">
          Student Evaluation
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow">

          <div className="grid grid-cols-4 gap-4">

            <select className="border p-3 rounded">
              <option>Select Class</option>
            </select>

            <select className="border p-3 rounded">
              <option>Select Section</option>
            </select>

            <select className="border p-3 rounded">
              <option>Select Student</option>
            </select>

            <select className="border p-3 rounded">
              <option>Select Exam</option>
            </select>

          </div>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            AI Evaluation
          </h2>

          <div className="space-y-2">

            <div>
              Overall Score: 82%
            </div>

            <div>
              Grade: A
            </div>

            <div>
              Strong Topic: Algebra
            </div>

            <div>
              Weak Topic: Trigonometry
            </div>

            <div>
              Recommendation:
              Practice 15 Questions Daily
            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}
