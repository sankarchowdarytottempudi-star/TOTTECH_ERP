import { redirect } from "next/navigation";

export default function ClinicalWardManagementRedirectPage() {
  redirect("/clinical-services/hms/wards");
}
