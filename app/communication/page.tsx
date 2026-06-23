"use client";

import Layout from "@/components/Layout";

export default function CommunicationPage() {

  return (

    <Layout>

      <div className="space-y-8">

        <h1 className="text-5xl font-black">
          Communication Center
        </h1>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-green-50 p-6 rounded-3xl">
            WhatsApp
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl">
            Email
          </div>

          <div className="bg-yellow-50 p-6 rounded-3xl">
            SMS
          </div>

          <div className="bg-purple-50 p-6 rounded-3xl">
            Notifications
          </div>

        </div>

      </div>

    </Layout>

  );

}
