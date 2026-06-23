import { redirect } from "next/navigation";

export default async function ClinicalWardManagementDetailRedirectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/clinical-services/hms/wards/${id}`);
}
