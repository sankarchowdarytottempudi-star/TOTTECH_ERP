"use client";

import Layout from "@/components/Layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentProfile() {

  const params = useParams();

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    if (params?.id) {
      loadStudent();
    }

  }, [params]);

  const loadStudent =
    async () => {

      try {

        const response =
          await fetch(
            `/api/students/${params?.id}`
          );

        const result =
          await response.json();

        setData(result);

      } catch (error) {

        console.error(error);

      }

    };

  if (!data) {

    return (

      <Layout>

        <div className="p-10">

          Loading Student Profile...

        </div>

      </Layout>

    );

  }

  const {
    student,
    attendancePercent,
    averageMarks,
    riskLevel,
  } = data;

  return (

    <Layout>

      <div className="space-y-8">

        {/* HERO */}

        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl">

          <h1 className="text-5xl font-black">
            🎓 Student Digital Twin
          </h1>

          <p className="text-xl mt-3 text-blue-100">
            AI Powered Student Intelligence Profile
          </p>

        </div>

        {/* PROFILE */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <div className="flex items-center gap-8">

            <div
              className="
                w-36
                h-36
                rounded-full
                bg-blue-100
                flex
                items-center
                justify-center
                text-7xl
              "
            >
              👨‍🎓
            </div>

            <div>

              <h2 className="text-5xl font-black">

                {student.name ||

                  `${student.first_name || ""}
                   ${student.last_name || ""}`}

              </h2>

              <div className="mt-4 space-y-2">

                <p>
                  <strong>
                    Admission Number:
                  </strong>{" "}
                  {student.admission_number || "-"}
                </p>

                <p>
                  <strong>
                    Roll Number:
                  </strong>{" "}
                  {student.roll_number || "-"}
                </p>

                <p>
                  <strong>
                    Enrollment Number:
                  </strong>{" "}
                  {student.enrollment_number || "-"}
                </p>

              </div>

            </div>

          </div>

          {/* ACADEMIC SUMMARY */}

          <div className="grid grid-cols-4 gap-4 mt-10">

            <div className="bg-slate-100 p-4 rounded-xl">

              <p className="text-sm text-slate-500">
                School
              </p>

              <h3 className="font-black text-lg">
                {student.school_id || "-"}
              </h3>

            </div>

            <div className="bg-slate-100 p-4 rounded-xl">

              <p className="text-sm text-slate-500">
                Section
              </p>

              <h3 className="font-black text-lg">
                {student.section_id || "-"}
              </h3>

            </div>

            <div className="bg-slate-100 p-4 rounded-xl">

              <p className="text-sm text-slate-500">
                Status
              </p>

              <h3 className="font-black text-green-600">
                Active
              </h3>

            </div>

            <div className="bg-slate-100 p-4 rounded-xl">

              <p className="text-sm text-slate-500">
                Student Type
              </p>

              <h3 className="font-black">
                {student.student_type || "-"}
              </h3>

            </div>

          </div>

        </div>

        {/* AI ANALYTICS */}

        <div className="grid lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Attendance
            </p>

            <h2 className="text-5xl font-black text-blue-600">

              {attendancePercent || 0}%

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Average Marks
            </p>

            <h2 className="text-5xl font-black text-green-600">

              {averageMarks || 0}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Risk Level
            </p>

            <h2 className="text-4xl font-black text-red-600">

              {riskLevel || "LOW"}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Recommended Career
            </p>

            <h2 className="text-2xl font-black">

              Engineer

            </h2>

          </div>

        </div>

        {/* PERSONAL + CONTACT */}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-black mb-6">
              Student Information
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Gender:</strong>{" "}
                {student.gender || "-"}
              </p>

              <p>
                <strong>DOB:</strong>{" "}
                {student.dob
                  ? new Date(
                      student.dob
                    ).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <strong>Blood Group:</strong>{" "}
                {student.blood_group || "-"}
              </p>

              <p>
                <strong>Religion:</strong>{" "}
                {student.religion || "-"}
              </p>

              <p>
                <strong>Caste:</strong>{" "}
                {student.caste || "-"}
              </p>

              <p>
                <strong>Mother Tongue:</strong>{" "}
                {student.mother_tongue || "-"}
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-black mb-6">
              Contact Information
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Phone:</strong>{" "}
                {student.phone || "-"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {student.email || "-"}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {student.address || "-"}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {student.city || "-"}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {student.state || "-"}
              </p>

              <p>
                <strong>Country:</strong>{" "}
                {student.country || "-"}
              </p>

            </div>

          </div>

        </div>

        {/* PARENTS */}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-black mb-6">
              Father Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Name:</strong>{" "}
                {student.father_name || "-"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {student.father_phone || "-"}
              </p>

              <p>
                <strong>Occupation:</strong>{" "}
                {student.father_occupation || "-"}
              </p>

              <p>
                <strong>ID Number:</strong>{" "}
                {student.father_id_number || "-"}
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-black mb-6">
              Mother Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Name:</strong>{" "}
                {student.mother_name || "-"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {student.mother_phone || "-"}
              </p>

              <p>
                <strong>Occupation:</strong>{" "}
                {student.mother_occupation || "-"}
              </p>

              <p>
                <strong>ID Number:</strong>{" "}
                {student.mother_id_number || "-"}
              </p>

            </div>

          </div>

        </div>

        {/* AI RECOMMENDATIONS */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <h2 className="text-3xl font-black mb-6">
            🤖 AI Recommendations
          </h2>

          <ul className="space-y-3 text-lg">

            <li>
              ✅ Improve attendance consistency
            </li>

            <li>
              ✅ Focus on weak subjects
            </li>

            <li>
              ✅ Weekly parent review meeting
            </li>

            <li>
              ✅ Personalized study plan
            </li>

            <li>
              ✅ Monitor examination readiness
            </li>

          </ul>

        </div>

      </div>

    </Layout>

  );

}
