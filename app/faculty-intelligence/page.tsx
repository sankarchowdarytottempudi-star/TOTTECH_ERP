import { redirect } from "next/navigation";

import Layout from "@/components/Layout";
import { hasEffectiveAiAccess } from "@/lib/ai-access";

export default async function FacultyIntelligence() {
  if (!(await hasEffectiveAiAccess())) {
    redirect("/module-not-licensed?module=AI");
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-5xl font-black">👨‍🏫 Faculty Intelligence</h1>
        <div className="rounded-3xl bg-white p-8 shadow">Teacher Performance</div>
      </div>
    </Layout>
  );
}
