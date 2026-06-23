"use client";

import Layout from "@/components/Layout";

export default function FinancialIntelligence() {
  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-10 rounded-3xl">

          <h1 className="text-5xl font-black">
            💰 Financial Intelligence
          </h1>

          <p className="mt-4 text-xl">
            Revenue, Fees & Collections
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            Total Revenue
            <div className="text-4xl font-black">
              ₹52L
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Pending Fees
            <div className="text-4xl font-black">
              ₹4L
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Invoices
            <div className="text-4xl font-black">
              224
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            Collections
            <div className="text-4xl font-black">
              91%
            </div>
          </div>

        </div>

      </div>

    </Layout>
  );
}
