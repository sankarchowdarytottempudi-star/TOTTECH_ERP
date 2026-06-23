import { redirect } from "next/navigation";

export default function ClinicalLoginPage() {
  redirect("/login?platform=clinical");
}
