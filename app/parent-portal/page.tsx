import { redirect } from "next/navigation";

export default function ParentPortalRedirect() {
  redirect("/parent/dashboard");
}
