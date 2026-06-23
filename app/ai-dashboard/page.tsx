import { redirect } from "next/navigation";

import Layout from "@/components/Layout";
import { hasEffectiveAiAccess } from "@/lib/ai-access";

export default async function AIDashboardPage() {
  if (!(await hasEffectiveAiAccess())) {
    redirect("/module-not-licensed?module=AI");
  }

  const stats = [
    { title: "Students Analyzed", value: "1,248" },
    { title: "Average Score", value: "78%" },
    { title: "Weak Students", value: "92" },
    { title: "Top Performers", value: "138" },
    { title: "Attendance Risk", value: "34" },
    { title: "AI Recommendations", value: "427" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">AI Academic Intelligence</h1>
          <p className="mt-2 text-gray-500">
            Predictive Academic Analytics & Student Performance Insights
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {stats.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white p-6 shadow">
              <div className="text-gray-500">{item.title}</div>
              <div className="mt-4 text-5xl font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-4 text-2xl font-bold">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-red-50 p-4">
                24 students need immediate mathematics intervention.
              </div>
              <div className="rounded-xl bg-yellow-50 p-4">
                Attendance dropped in Class 8-A by 12%.
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                Science performance improved by 18%.
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-4 text-2xl font-bold">AI Insights</h2>
            <div className="space-y-4">
              <div>Strongest Subject: Mathematics</div>
              <div>Weakest Subject: Physics</div>
              <div>Top Performing Class: Grade 10-A</div>
              <div>At Risk Students: 34</div>
              <div>Parent Notifications: 57 Pending</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
