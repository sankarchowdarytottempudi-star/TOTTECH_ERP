"use client";

import Layout from "@/components/Layout";
import Link from "next/link";

const settingsModules = [
  {
    title: "School/College Branding",
    description:
      "School/College name, logo, colors, contact information, and assistant branding",
    path: "/settings/school-branding",
  },
  {
    title: "Academic Settings",
    description:
      "Academic Year, Classes, Sections",
    path: "/settings/academic",
  },
  {
    title: "Attendance Settings",
    description:
      "Attendance Rules & Configuration",
    path: "/settings/attendance",
  },
  {
    title: "Fee Settings",
    description:
      "Fee Collection & Payment Configuration",
    path: "/settings/fees",
  },
  {
    title: "AI Settings",
    description:
      "Academic Intelligence Configuration",
    path: "/settings/ai",
  },
  {
    title: "SMTP Settings",
    description:
      "Email Notifications Configuration",
    path: "/settings/smtp",
  },
  {
    title: "WhatsApp Settings",
    description:
      "WhatsApp Messaging Integration",
    path: "/settings/whatsapp",
  },
  {
    title: "Roles & Permissions",
    description:
      "User Access Management",
    path: "/settings/roles",
  },
  {
    title: "Backup & Restore",
    description:
      "Database Backup Management",
    path: "/settings/backup",
  },
];

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow">
          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Configure and manage your ERP system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {settingsModules.map(
            (setting) => (
              <Link
                key={setting.title}
                href={setting.path}
                className="
                  bg-white
                  rounded-2xl
                  shadow
                  p-6
                  hover:shadow-xl
                  transition-all
                  border
                  hover:border-blue-500
                "
              >
                <h2 className="text-xl font-bold">
                  {setting.title}
                </h2>

                <p className="text-gray-500 mt-3">
                  {setting.description}
                </p>
              </Link>
            )
          )}

        </div>

      </div>
    </Layout>
  );
}
