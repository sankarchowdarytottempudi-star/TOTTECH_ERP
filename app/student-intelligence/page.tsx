import { redirect } from "next/navigation";

import Layout from "@/components/Layout";
import { hasEffectiveAiAccess } from "@/lib/ai-access";

export default async function StudentIntelligence() {
  if (!(await hasEffectiveAiAccess())) {
    redirect("/module-not-licensed?module=AI");
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-5xl font-black">🎓 Student Intelligence</h1>
        <div className="grid grid-cols-4 gap-6">
          <div className="rounded-3xl bg-white p-6 shadow">Students<div className="text-5xl font-black">89</div></div>
          <div className="rounded-3xl bg-white p-6 shadow">Top Performers<div className="text-5xl font-black">12</div></div>
          <div className="rounded-3xl bg-white p-6 shadow">Risk Students<div className="text-5xl font-black">5</div></div>
          <div className="rounded-3xl bg-white p-6 shadow">Attendance Risk<div className="text-5xl font-black">3</div></div>
        </div>
      </div>
    </Layout>
  );
}
