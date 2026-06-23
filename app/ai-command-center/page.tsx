import { redirect } from "next/navigation";

import TottechAIChat from "@/components/ai/TottechAIChat";
import { hasEffectiveAiAccess } from "@/lib/ai-access";

export default async function AICommandCenterPage() {
  if (!(await hasEffectiveAiAccess())) {
    redirect("/module-not-licensed?module=AI");
  }

  return <TottechAIChat />;
}
