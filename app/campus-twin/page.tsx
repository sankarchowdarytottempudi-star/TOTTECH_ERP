"use client";

import Layout from "@/components/Layout";

export default function CampusTwin() {

  const buildings = [

    {
      name: "🏫 Academic Block",
      status: "Healthy",
      color: "bg-green-500",
    },

    {
      name: "🏠 Hostel",
      status: "Warning",
      color: "bg-yellow-500",
    },

    {
      name: "🍽 Dining Hall",
      status: "Healthy",
      color: "bg-green-500",
    },

    {
      name: "🚌 Transport",
      status: "Critical",
      color: "bg-red-500",
    },

    {
      name: "📚 Library",
      status: "Healthy",
      color: "bg-green-500",
    },

    {
      name: "⚽ Sports Complex",
      status: "Healthy",
      color: "bg-green-500",
    },

  ];

  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-10 rounded-3xl">

          <h1 className="text-5xl font-black">
            🌐 Digital Campus Twin
          </h1>

          <p className="text-xl mt-4">
            Live Campus Visualization
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {buildings.map((building) => (

            <div
              key={building.name}
              className="
                bg-white
                rounded-3xl
                shadow
                p-8
                cursor-pointer
                hover:scale-105
                transition-all
              "
            >

              <div
                className={`
                  w-5 h-5 rounded-full
                  ${building.color}
                `}
              />

              <h2 className="text-2xl font-bold mt-4">
                {building.name}
              </h2>

              <p className="mt-2">
                Status:
                {" "}
                {building.status}
              </p>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  );
}
