"use client";

import Layout from "@/components/Layout";

export default function CommandCenterPage() {

  const commands = [
    "Create Student",
    "Create Teacher",
    "Generate Report Card",
    "Assign Fees",
    "Mark Attendance",
    "Create Exam",
    "Send Notification",
    "Generate Question Paper"
  ];

  return (

    <Layout>

      <div className="space-y-8">

        <div>

          <h1 className="text-5xl font-black">
            TOTTech Command Center
          </h1>

          <p className="text-slate-500">
            Search Anything. Control Everything.
          </p>

        </div>

        <input
          placeholder="Search Student, Teacher, Class, Fee..."
          className="
            w-full
            p-5
            border
            rounded-2xl
            text-lg
          "
        />

        <div className="grid grid-cols-4 gap-4">

          {commands.map((cmd) => (

            <div
              key={cmd}
              className="
                bg-white
                p-6
                rounded-2xl
                shadow
                cursor-pointer
              "
            >
              {cmd}
            </div>

          ))}

        </div>

      </div>

    </Layout>

  );

}
