"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function StaffAttendancePage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const [teacherId, setTeacherId] = useState("");
  const [status, setStatus] = useState("Present");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const teachersRes = await fetch("/api/teachers");
      const attendanceRes = await fetch(
        "/api/staff-attendance"
      );

      const teachersData =
        await teachersRes.json();

      const attendanceData =
        await attendanceRes.json();

      setTeachers(
        Array.isArray(teachersData)
          ? teachersData
          : []
      );

      setRecords(
        Array.isArray(attendanceData)
          ? attendanceData
          : []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const saveAttendance = async () => {
    if (!teacherId) {
      toast.success("Please select a teacher");
      return;
    }

    try {
      await fetch(
        "/api/staff-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            teacher_id: Number(
              teacherId
            ),
            attendance_date: today,
            status,
            remarks: "",
          }),
        }
      );

      setTeacherId("");
      setStatus("Present");

      loadData();

      toast.success(
        "Staff Attendance Saved"
      );

    } catch (error) {

      console.error(error);

      toast.success(
        "Failed to Save Attendance"
      );
    }
  };

  const getTeacherName = (
    teacherId: number
  ) => {
    const teacher =
      teachers.find(
        (t: any) =>
          t.id === teacherId
      );

    if (!teacher)
      return "Unknown Teacher";

    return `${teacher.first_name || ""} ${teacher.last_name || ""}`;
  };

  return (
    <Layout>

      <div className="space-y-10">

        {/* Entry Form */}

        <div className="bg-white rounded-3xl p-10 shadow">

          <h1 className="text-4xl font-bold mb-8">
            Staff Attendance
          </h1>

          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Attendance date is locked to today: {today}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <select
              className="border p-4 rounded-xl"
              value={teacherId}
              onChange={(e) =>
                setTeacherId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Teacher
              </option>

              {teachers.map(
                (teacher: any) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {
                      teacher.first_name
                    }{" "}
                    {
                      teacher.last_name
                    }
                  </option>
                )
              )}
            </select>

            <select
              className="border p-4 rounded-xl"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >
              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Late">
                Late
              </option>

              <option value="Half Day">
                Half Day
              </option>

              <option value="On Leave">
                On Leave
              </option>

            </select>

          </div>

          <button
            onClick={saveAttendance}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold"
          >
            Save Attendance
          </button>

        </div>

        {/* Attendance Records */}

        <div className="bg-white rounded-3xl p-10 shadow">

          <h2 className="text-3xl font-bold mb-6">
            Staff Attendance Records
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  ID
                </th>

                <th className="text-left py-3">
                  Teacher Name
                </th>

                <th className="text-left py-3">
                  Status
                </th>

                <th className="text-left py-3">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {records.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-slate-500"
                  >
                    No Attendance Records
                  </td>
                </tr>
              ) : (
                records.map(
                  (
                    record: any
                  ) => (
                    <tr
                      key={
                        record.id
                      }
                      className="border-b"
                    >
                      <td className="py-3">
                        {record.id}
                      </td>

                      <td className="py-3">
                        {getTeacherName(
                          record.teacher_id
                        )}
                      </td>

                      <td className="py-3">
                        {
                          record.status
                        }
                      </td>

                      <td className="py-3">
                        {record.attendance_date
                          ? new Date(
                              record.attendance_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}
