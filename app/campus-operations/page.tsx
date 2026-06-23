"use client";

import Layout from "@/components/Layout";
import Link from "next/link";

export default function CampusOperations() {
  const modules = [
    {
      title: "🏠 Hostel Management",
      description: "Rooms, Beds, Students",
      href: "/hostel",
    },
    {
      title: "🍽 Dining Intelligence",
      description: "Inventory & Menu",
      href: "/dining",
    },
    {
      title: "🚌 Transport Control",
      description: "Routes & Drivers",
      href: "/transport",
    },
    {
      title: "📚 Book Store",
      description: "Books & Inventory",
      href: "/bookstore",
    },
    {
      title: "👔 Uniform Center",
      description: "Stock & Distribution",
      href: "/uniform",
    },
    {
      title: "🤖 AI Operations",
      description: "Predictive Alerts",
      href: "/brain",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-10 rounded-3xl">
          <h1 className="text-5xl font-black">
            🏠 Campus Operations
          </h1>

          <p className="mt-4 text-xl">
            Unified Operations Control Center
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
            >
              <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all cursor-pointer">

                <h2 className="text-2xl font-bold">
                  {module.title}
                </h2>

                <p className="text-gray-500 mt-3">
                  {module.description}
                </p>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </Layout>
  );
}
