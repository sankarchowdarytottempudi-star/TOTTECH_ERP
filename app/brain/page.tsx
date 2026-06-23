"use client";

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

export default function BrainPage() {

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    fetch("/api/brain")
      .then((r) => r.json())
      .then(setData);

  }, []);

  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-3xl p-10">

          <h1 className="text-5xl font-black">
            🧠 TOTTech Brain
          </h1>

          <p className="text-xl mt-3">
            AI Powered School/College Intelligence
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Executive Summary
          </h2>

          {data?.summary?.map(
            (item: string) => (
              <div
                key={item}
                className="mb-3"
              >
                {item}
              </div>
            )
          )}

        </div>

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            AI Recommendations
          </h2>

          {data?.recommendations?.map(
            (item: string) => (
              <div
                key={item}
                className="
                  bg-blue-50
                  p-4
                  rounded-xl
                  mb-3
                "
              >
                {item}
              </div>
            )
          )}

        </div>

      </div>

    </Layout>
  );
}
