"use client";

import Layout from "@/components/Layout";

export default function BackupSettingsPage() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-3xl font-bold">
          Backup & Restore
        </h1>

        <p className="text-gray-500 mt-2">
          Manage database backups.
        </p>
      </div>
    </Layout>
  );
}
