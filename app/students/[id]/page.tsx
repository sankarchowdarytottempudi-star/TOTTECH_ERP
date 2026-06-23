"use client";

import Layout from "@/components/Layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import StudentTabs from "@/components/student/StudentTabs";
import StudentKPIs from "@/components/student/StudentKPIs";
import StudentOverview from "@/components/student/StudentOverview";
import StudentAttendance from "@/components/student/StudentAttendance";
import StudentAcademics from "@/components/student/StudentAcademics";
import StudentAIInsights from "@/components/student/StudentAIInsights";
import StudentDNA from "@/components/student/StudentDNA";
import StudentHeader from "@/components/student/StudentHeader";
import ExamAnalytics from "@/components/student/ExamAnalytics";
import FeeAnalytics from "@/components/student/FeeAnalytics";

export default function Student360Page() {

  const params = useParams();
  const [copilotResponse, setCopilotResponse] = useState("");
  const [certificateLoading, setCertificateLoading] = useState(false);

const [copilotLoading, setCopilotLoading] = useState(false);
  const [data, setData] =
    useState<any>(null);

  const [activeTab, setActiveTab] =
    useState("Overview");

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
const askCopilot = async (
  question: string
) => {

  try {

    setCopilotLoading(true);

    const response =
      await fetch(
        "/api/copilot/student",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
  question,

  student,

  studentDNA,

  risk,

  attendancePercent,

  averageMarks,

  subjectPerformance,

  riskFactors,

  examStats,

  aiInsights,
}),
        }
      );

    const result =
      await response.json();

    setCopilotResponse(
      result.answer
    );

  } catch (error) {

    console.error(error);

  } finally {

    setCopilotLoading(false);

  }

};
  const issueCertificate = async (
    type: "transfer" | "study"
  ) => {
    if (!params?.id) {
      return;
    }

    try {
      setCertificateLoading(true);
      const response = await fetch(
        `/api/students/${params?.id}/${type === "transfer" ? "transfer-certificate" : "study-certificate"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to generate ${type} certificate`
        );
      }

      const url =
        result.publicUrl ||
        result.fileUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      setCertificateLoading(false);
      await loadStudent().catch(
        (refreshError) => {
          console.error(
            "Student refresh after certificate generation failed:",
            refreshError
          );
        }
      );
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to generate certificate"
      );
    } finally {
      setCertificateLoading(false);
    }
  };

  if (!data) {

    return (

      <Layout>

        <div className="p-10">
          Loading Student360...
        </div>

      </Layout>

    );

  }

  const {
  student,
  attendancePercent,
  averageMarks,
  risk,
  attendance,
  marks,

  attendanceStreak,

  subjectPerformance,

  studentDNA,
  examStats,
  feeStats,
  aiInsights,
  riskFactors,
  learningGaps,
  documents,
  backlogs,
  backlogSummary,
  backlogTimeline,
} = data;

  return (

    <Layout>

      <div className="space-y-8">

        <StudentHeader
          student={student}
        />

        <div className="bg-white rounded-3xl p-6 shadow flex flex-wrap gap-3">
          <button
            onClick={() => issueCertificate("study")}
            disabled={certificateLoading}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {certificateLoading ? "Generating..." : "Generate Study Certificate"}
          </button>
          <button
            onClick={() => issueCertificate("transfer")}
            disabled={certificateLoading}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 disabled:opacity-60"
          >
            Generate Transfer Certificate
          </button>
        </div>

        <StudentKPIs
          attendancePercent={
            attendancePercent || 0
          }
          averageMarks={
            averageMarks || 0
          }
          riskLevel={
            risk?.level || "LOW"
          }
          healthScore={
            aiInsights?.healthScore || 0
          }
          attendanceStreak={
            attendanceStreak || 0
          }
        />

        <StudentTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === "Overview" && (

          <StudentOverview
            student={student}
            learningGaps={learningGaps || []}
            documents={documents || []}
            backlogs={backlogs || []}
            backlogSummary={backlogSummary || {}}
            backlogTimeline={backlogTimeline || []}
          />

        )}

        {activeTab === "Attendance" && (

          <StudentAttendance
            attendance={
              attendance || []
            }
          />

        )}

        {activeTab === "Academics" && (

          <StudentAcademics
            marks={marks || []}
          />

        )}

        {activeTab === "Exams" && (

          <ExamAnalytics
            examStats={examStats}
          />

        )}

        {activeTab === "Fees" && (

          <FeeAnalytics
            feeStats={feeStats}
          />

        )}

        {activeTab === "Homework" && (

          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-black">
              Homework
            </h2>

            <p className="mt-4 text-slate-600">
              Homework intelligence
              module coming next.
            </p>
          </div>

        )}

        {activeTab === "Documents" && (

          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-black">
              Documents
            </h2>

            <p className="mt-4 text-slate-600">
              Student document vault.
            </p>
          </div>

        )}

        {activeTab === "Communication" && (

          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-black">
              Communication
            </h2>

            <p className="mt-4 text-slate-600">
              Parent-teacher communication
              history.
            </p>
          </div>

        )}

        {activeTab === "AI Insights" && (

          <StudentAIInsights
            risk={risk}
            aiInsights={aiInsights}
            riskFactors={
              riskFactors || []
            }
          />

        )}

        {activeTab === "Student DNA" && (

          <div className="space-y-6">

            <StudentDNA
              dna={studentDNA}
            />

            <div
              className="
              bg-white
              rounded-3xl
              p-8
              shadow
              "
            >

              <h2 className="text-2xl font-black">
                🤖 Teacher AI Copilot
              </h2>

              <p className="mt-3 text-slate-600">
                AI powered student
                intervention engine.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">

                <button
  onClick={() =>
    askCopilot(
      "How can I improve this student?"
    )
  }
  className="
  p-4
  rounded-xl
  bg-indigo-600
  text-white
  font-semibold
  "
>
  How can I improve this student?
</button>

<button
  onClick={() =>
    askCopilot(
      "Generate intervention plan"
    )
  }
  className="
  p-4
  rounded-xl
  bg-indigo-600
  text-white
  font-semibold
  "
>
  Generate intervention plan
</button>

<button
  onClick={() =>
    askCopilot(
      "Parent discussion points"
    )
  }
  className="
  p-4
  rounded-xl
  bg-indigo-600
  text-white
  font-semibold
  "
>
  Parent discussion points
</button>

<button
  onClick={() =>
    askCopilot(
      "Recommend learning style"
    )
  }
  className="
  p-4
  rounded-xl
  bg-indigo-600
  text-white
  font-semibold
  "
>
  Recommend learning style
</button>

{copilotLoading && (

  <div
    className="
    mt-6
    bg-blue-50
    rounded-2xl
    p-6
    "
  >
    Thinking...
  </div>

)}

{copilotResponse && (

  <div
    className="
    mt-6
    bg-slate-50
    rounded-2xl
    p-6
    border
    "
  >

    <h3 className="font-bold mb-3">
      AI Recommendation
    </h3>

    <p className="whitespace-pre-line">
      {copilotResponse}
    </p>

  </div>

)}
              </div>

            </div>

          </div>

        )}

      </div>

    </Layout>

  );

}
