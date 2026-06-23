"use client";

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

export default function ExecutiveAnalytics() {

  const [data, setData] =
    useState<any>(null);

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
        Loading...
      </Layout>
    );
  }

  const dna =
    data.schoolDNA;

  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-10 rounded-3xl">

          <h1 className="text-5xl font-black">
            🧠 School/College DNA
          </h1>

          <p className="text-xl mt-3">
            AI Native School/College Intelligence
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <Card
            title="Overall Health"
            value={`${dna.overallScore}%`}
          />

          <Card
            title="Student Health"
            value={`${dna.studentHealth}%`}
          />

          <Card
            title="Teacher Health"
            value={`${dna.teacherHealth}%`}
          />

          <Card
            title="Revenue Health"
            value={`${dna.revenueHealth}%`}
          />

          <Card
            title="Transport Health"
            value={`${dna.transportHealth}%`}
          />

          <Card
            title="Hostel Health"
            value={`${dna.hostelHealth}%`}
          />

         <a
  href="/war-room"
  className="
    inline-flex
    items-center
    px-6
    py-3
    rounded-xl
    bg-indigo-600
    text-white
    font-bold
  "
>
  🚀 Open War Room
</a>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow">

          <h2 className="text-2xl font-black mb-4">
            AI School/College Summary
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
    <div className="bg-white p-8 rounded-3xl shadow">

      <div className="text-gray-500">
        {title}
      </div>

      <div className="text-5xl font-black mt-4">
        {value}
      </div>

    </div>
  );
}
