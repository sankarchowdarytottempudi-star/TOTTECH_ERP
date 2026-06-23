"use client";

import Layout from "@/components/Layout";

export default function CommunicationsPage() {
  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-3xl p-10">

          <h1 className="text-5xl font-black">
            📨 Communication Center
          </h1>

          <p className="mt-3">
            Email, SMS & WhatsApp Hub
          </p>

        </div>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            📧 Email
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            📱 SMS
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            💬 WhatsApp
          </div>

        </div>

      </div>

    </Layout>
  );
}
