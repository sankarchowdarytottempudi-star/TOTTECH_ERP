"use client";

import Layout from "@/components/Layout";

export default function DocumentsPage() {

  return (

    <Layout>

      <div className="bg-white p-8 rounded-3xl shadow">

        <h1 className="text-5xl font-black mb-8">
          Documents Management
        </h1>

        <input
          type="file"
          className="border p-4 rounded-xl"
        />

        <div className="mt-8">

          <h2 className="font-bold">
            Student Documents
          </h2>

          <ul className="mt-4 space-y-2">

            <li>Birth Certificate</li>
            <li>Aadhar Card</li>
            <li>Transfer Certificate</li>
            <li>Marks Memo</li>

          </ul>

        </div>

      </div>

    </Layout>

  );

}
