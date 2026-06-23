"use client";

import Layout from "@/components/Layout";

export default function AcademicSettingsPage() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-3xl font-bold">
          Academic Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Configure academic years, classes and sections.
        </p>
      </div>
    </Layout>
  );
}
