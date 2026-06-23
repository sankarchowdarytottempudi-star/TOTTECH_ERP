import { redirect } from "next/navigation";

export default async function ClinicalNursingStationDetailRedirectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/clinical-services/hms/nursing/${id}`);
}
