"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function AttendanceHomePage() {

  const router =
    useRouter();

  return (

    <Layout>

      <div className="space-y-8">

        <div className="bg-white rounded-3xl p-8 shadow">

          <h1 className="text-5xl font-black">
            Attendance Management
          </h1>

          <p className="text-slate-500 mt-2">
            Student, Teacher & Staff Attendance
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <button
            onClick={() =>
              router.push(
                "/attendance/calendar"
              )
            }
            className="
              p-8
              rounded-3xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
            "
          >

            <div className="text-6xl">
              📅
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Calendar View
            </h2>

          </button>

          <button
            onClick={() =>
              router.push(
                "/attendance/students"
              )
            }
            className="
              p-8
              rounded-3xl
              bg-gradient-to-r
              from-green-600
              to-emerald-600
              text-white
            "
          >

            <div className="text-6xl">
              👨‍🎓
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Student Attendance
            </h2>

          </button>

          <button
            onClick={() =>
              router.push(
                "/attendance/absence-monitoring"
              )
            }
            className="p-8 rounded-3xl bg-gradient-to-r from-rose-600 to-orange-600 text-white"
          >

            <div className="text-6xl">
              🚨
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Absence Monitoring
            </h2>

          </button>

          <button
            onClick={() =>
              router.push(
                "/attendance/staff"
              )
            }
            className="
              p-8
              rounded-3xl
              bg-gradient-to-r
              from-purple-600
              to-pink-600
              text-white
            "
          >

            <div className="text-6xl">
              👨‍🏫
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Staff Attendance
            </h2>

          </button>

        </div>

      </div>

    </Layout>

  );

}
