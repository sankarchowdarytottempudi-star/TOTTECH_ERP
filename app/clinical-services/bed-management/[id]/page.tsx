import { redirect } from "next/navigation";

export default async function ClinicalBedManagementDetailRedirectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/clinical-services/hms/beds/${id}`);
}
