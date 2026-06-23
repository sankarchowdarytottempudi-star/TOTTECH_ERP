"use client";

import Layout from "@/components/Layout";

export default function StudentDNA() {

  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-10 rounded-3xl">

          <h1 className="text-5xl font-black">
            🧬 Student DNA
          </h1>

          <p className="text-xl mt-4">
            AI Powered Student Intelligence
          </p>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow">

          <h2 className="text-3xl font-bold">
            John Doe
          </h2>

          <div className="grid grid-cols-2 gap-6 mt-8">

            <div>
              Strength:
              Mathematics
            </div>

            <div>
              Weakness:
              Physics
            </div>

            <div>
              Attendance:
              92%
            </div>

            <div>
              Risk Level:
              Low
            </div>

            <div>
              Learning Style:
              Visual
            </div>

            <div>
              Career Prediction:
              Engineer
            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}
