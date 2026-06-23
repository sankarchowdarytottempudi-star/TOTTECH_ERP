"use client";

import TeacherDNA from "@/components/teacher/TeacherDNA";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";

export default function TeacherDetailsPage() {

  const params = useParams();

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    if (params?.id) {
      loadTeacher();
    }
  }, [params]);

  const loadTeacher =
    async () => {

      const response =
        await fetch(
          `/api/teachers/${params?.id}`
        );

      const result =
        await response.json();

      setData(result);
    };

  if (!data) {
    return (
      <Layout>
        <div className="p-10">
          Loading Teacher...
        </div>
      </Layout>
    );
  }

  const {
    teacher,
    attendancePercent,
    experienceScore,
    impactScore,
    rating,
teacherDNA,
  } = data;

  const currentAddress = teacher.current_address || {};
  const permanentAddress = teacher.permanent_address || {};
  const employmentHistory = Array.isArray(teacher.employment_history)
    ? teacher.employment_history
    : [];
  const salaryHistory = teacher.salary_history || {};
  const documents = Array.isArray(teacher.documents)
    ? teacher.documents
    : [];
  const qualifications = Array.isArray(teacher.qualifications)
    ? teacher.qualifications
    : [];
  const certifications = Array.isArray(teacher.certifications)
    ? teacher.certifications
    : [];
  const teacherNotes = Array.isArray(teacher.teacher_notes)
    ? teacher.teacher_notes
    : [];
  const performanceNotes = teacher.performance_notes || {};
  const teachingGaps = Array.isArray(data.teachingGaps)
    ? data.teachingGaps
    : [];
  const classesHandling = Array.isArray(teacher.classes_handling)
    ? teacher.classes_handling
    : [];
  const sectionsHandling = Array.isArray(teacher.sections_handling)
    ? teacher.sections_handling
    : [];

  return (
    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-10">

          <h1 className="text-5xl font-black">
            👨‍🏫 Teacher Intelligence
          </h1>

          <p className="text-xl mt-3">
            AI Powered Faculty Insights
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow">

          <div className="flex items-center gap-6">

            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-6xl">
              👨‍🏫
            </div>

            <div>

              <h2 className="text-4xl font-black">
                {teacher.first_name}
                {" "}
                {teacher.last_name}
              </h2>

              <p>
                Employee:
                {" "}
                {teacher.employee_id}
              </p>

              <p>
                {teacher.designation}
              </p>

              <p>
                {teacher.department}
              </p>
              <p>
                Staff Type:
                {" "}
                {teacher.staff_type || "Teaching"}
              </p>
              <p>
                Subject Specialization:
                {" "}
                {teacher.subject_specialization || "-"}
              </p>

            </div>

          </div>

        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">

            <p>Impact Score</p>

            <h2 className="text-5xl font-black">
              {impactScore}
            </h2>

        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Current Address</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(currentAddress).map(([key, value]) => (
                <p key={key}><strong>{key.replaceAll("_", " ")}:</strong> {String(value || "-")}</p>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Permanent Address</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(permanentAddress).map(([key, value]) => (
                <p key={key}><strong>{key.replaceAll("_", " ")}:</strong> {String(value || "-")}</p>
              ))}
            </div>
          </div>
        </div>

        {teachingGaps.length ? (
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Teaching Gaps</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {teachingGaps.map((item: any, index: number) => (
                <div key={item.id || index} className="rounded-2xl border p-4">
                  <p><strong>Gap Category:</strong> {item.gap_category || "-"}</p>
                  <p><strong>Description:</strong> {item.description || "-"}</p>
                  <p><strong>Severity:</strong> {item.severity || "-"}</p>
                  <p><strong>Training Recommendation:</strong> {item.training_recommendation || "-"}</p>
                  <p><strong>Target Date:</strong> {item.target_date || "-"}</p>
                  <p><strong>Status:</strong> {item.status || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="bg-white p-6 rounded-3xl shadow">

            <p>Attendance</p>

            <h2 className="text-5xl font-black">
              {attendancePercent}%
            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow">

            <p>Experience Score</p>

            <h2 className="text-5xl font-black">
              {experienceScore}
            </h2>

          </div>
<div className="bg-white p-6 rounded-3xl shadow">

  <p>Teacher Health</p>

  <h2 className="text-5xl font-black text-purple-600">
    {Math.round(
      attendancePercent * 0.5 +
      impactScore * 0.5
    )}
  </h2>

</div>


          <div className="bg-white p-6 rounded-3xl shadow">

            <p>Rating</p>

            <h2 className="text-3xl font-black">
              {rating}
            </h2>

          </div>

        </div>

<div className="bg-white p-6 rounded-3xl shadow">

  <p>Burnout Risk</p>

  <h2 className="text-3xl font-black text-red-600">
    {teacherDNA?.burnoutRisk}
  </h2>

</div>


        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white p-8 rounded-3xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              Faculty Details
            </h2>

            <p>
              Email:
              {" "}
              {teacher.email}
            </p>

            <p>
              Phone:
              {" "}
              {teacher.phone}
            </p>

            <p>
              Qualification:
              {" "}
              {teacher.qualification}
            </p>
            <p>
              Classes Handling:
              {" "}
              {classesHandling.length ? classesHandling.join(", ") : "-"}
            </p>
            <p>
              Sections Handling:
              {" "}
              {sectionsHandling.length ? sectionsHandling.join(", ") : "-"}
            </p>

            <p>
              Experience:
              {" "}
              {teacher.experience_years}
              {" "}Years
            </p>

            <p>
              Salary:
              {" "}
              ₹{teacher.salary}
            </p>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              AI Recommendations
            </h2>

            <ul className="space-y-3">

              <li>
                ✅ Continue mentoring
                high-performing students
              </li>

              <li>
                ✅ Maintain attendance
                consistency
              </li>

              <li>
                ✅ Conduct advanced
                workshops
              </li>

              <li>
                ✅ Share best practices
                with faculty
              </li>

            </ul>

          </div>

        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Educational Qualifications</h2>
            {qualifications.length ? (
              <div className="space-y-4">
                {qualifications.map((item: any, index: number) => (
                  <div key={index} className="rounded-2xl border p-4">
                    <p><strong>Qualification:</strong> {item.qualification || "-"}</p>
                    <p><strong>Specialization:</strong> {item.specialization || "-"}</p>
                    <p><strong>University:</strong> {item.university || "-"}</p>
                    <p><strong>College:</strong> {item.college || "-"}</p>
                    <p><strong>Board/University Type:</strong> {item.board_university_type || "-"}</p>
                    <p><strong>Year Of Passing:</strong> {item.year_of_passing || "-"}</p>
                    <p><strong>Percentage/CGPA:</strong> {item.percentage_cgpa || "-"}</p>
                    <p><strong>Grade:</strong> {item.grade || "-"}</p>
                    {item.certificate_upload ? (
                      <a className="text-blue-600 underline" href={item.certificate_upload} target="_blank" rel="noreferrer">
                        View Certificate
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>No qualifications recorded.</p>
            )}
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Professional Certifications</h2>
            {certifications.length ? (
              <div className="space-y-4">
                {certifications.map((item: any, index: number) => (
                  <div key={index} className="rounded-2xl border p-4">
                    <p><strong>Certification Name:</strong> {item.certification_name || "-"}</p>
                    <p><strong>Issuing Authority:</strong> {item.issuing_authority || "-"}</p>
                    <p><strong>Issue Date:</strong> {item.issue_date || "-"}</p>
                    <p><strong>Expiry Date:</strong> {item.expiry_date || "-"}</p>
                    {item.certificate_upload ? (
                      <a className="text-blue-600 underline" href={item.certificate_upload} target="_blank" rel="noreferrer">
                        View Certificate
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>No certifications recorded.</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Teacher Notes</h2>
            {teacherNotes.length ? (
              <div className="space-y-4">
                {teacherNotes.map((item: any, index: number) => (
                  <div key={index} className="rounded-2xl border p-4">
                    <p><strong>Note Type:</strong> {item.note_type || "-"}</p>
                    <p><strong>Note Date:</strong> {item.note_date || "-"}</p>
                    <p><strong>Added By:</strong> {item.added_by || "-"}</p>
                    <p><strong>Visibility:</strong> {item.visibility || "-"}</p>
                    <p><strong>Notes:</strong> {item.notes || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No teacher notes recorded.</p>
            )}
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Performance Notes</h2>
            <p><strong>Achievements:</strong> {performanceNotes.achievements || "-"}</p>
            <p><strong>Awards:</strong> {performanceNotes.awards || "-"}</p>
            <p><strong>Parent Feedback:</strong> {performanceNotes.parent_feedback || "-"}</p>
            <p><strong>Improvement Areas:</strong> {performanceNotes.improvement_areas || "-"}</p>
            <p><strong>Disciplinary Notes:</strong> {performanceNotes.disciplinary_notes || "-"}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-bold mb-4">Employment History</h2>
          {employmentHistory.length ? (
            <div className="space-y-4">
              {employmentHistory.map((item: any, index: number) => (
                <div key={index} className="rounded-2xl border p-4">
                  <p><strong>Previous School/College:</strong> {item.previous_school_name || "-"}</p>
                  <p><strong>School/College Address:</strong> {item.school_address || "-"}</p>
                  <p><strong>School/College Type:</strong> {item.school_type || "-"}</p>
                  <p><strong>Board:</strong> {item.board || "-"}</p>
                  <p><strong>Designation:</strong> {item.designation || "-"}</p>
                  <p><strong>Subject Handled:</strong> {item.subject_handled || "-"}</p>
                  <p><strong>Joining Date:</strong> {item.joining_date || "-"}</p>
                  <p><strong>Relieving Date:</strong> {item.relieving_date || "-"}</p>
                  <p><strong>Reason For Leaving:</strong> {item.reason_for_leaving || "-"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No employment history recorded.</p>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold mb-4">Salary History</h2>
            <p><strong>Previous Gross Salary:</strong> {salaryHistory.previous_gross_salary || "-"}</p>
            <p><strong>Previous Net Salary:</strong> {salaryHistory.previous_net_salary || "-"}</p>
            <p><strong>Last Drawn Salary:</strong> {salaryHistory.last_drawn_salary || "-"}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold mb-4">Documents</h2>
            {documents.length ? (
              <ul className="space-y-2">
                {documents.map((doc: any, index: number) => (
                  <li key={index}>
                    <a className="text-blue-600 underline" href={doc.url} target="_blank" rel="noreferrer">
                      {doc.label || doc.type || `Document ${index + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents uploaded.</p>
            )}
          </div>
        </div>

<div className="bg-white rounded-3xl p-8 shadow">

  <h2 className="text-3xl font-black mb-6">
    Teacher DNA
  </h2>

  <TeacherDNA
    dna={teacherDNA}
  />

</div>


      </div>

    </Layout>
  );
}
