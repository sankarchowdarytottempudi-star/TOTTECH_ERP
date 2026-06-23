import { redirect } from "next/navigation";

export default function ClinicalDischargesRedirectPage() {
  redirect("/clinical-services/hms/discharges");
}
