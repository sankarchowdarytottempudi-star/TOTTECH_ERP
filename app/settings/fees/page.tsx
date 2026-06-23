"use client";

import Layout from "@/components/Layout";

export default function FeeSettingsPage() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-3xl font-bold">
          Fee Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Configure fee collection settings.
        </p>
      </div>
    </Layout>
  );
}
