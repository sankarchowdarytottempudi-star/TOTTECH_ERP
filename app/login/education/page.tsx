import { redirect } from "next/navigation";

export default function EducationLoginPage() {
  redirect("/login?platform=education");
}
