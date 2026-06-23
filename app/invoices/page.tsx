"use client";

import Layout from "@/components/Layout";

export default function InvoicesPage() {
  return (
    <Layout>
      <div className="space-y-8">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-3xl p-10">
          <h1 className="text-5xl font-black">
            📄 Invoice Management
          </h1>
          <p className="mt-3">
            Generate & Track School/College Invoices
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            <p>Total Invoices</p>
            <h2 className="text-5xl font-black">4</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p>Paid</p>
            <h2 className="text-5xl font-black text-green-600">
              2
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p>Pending</p>
            <h2 className="text-5xl font-black text-red-600">
              2
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p>Overdue</p>
            <h2 className="text-5xl font-black text-orange-600">
              0
            </h2>
          </div>

        </div>

      </div>
    </Layout>
  );
}
