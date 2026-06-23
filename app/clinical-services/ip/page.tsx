import { redirect } from "next/navigation";

export default function ClinicalIpRedirectPage() {
  redirect("/clinical-services/hms/ip");
}
