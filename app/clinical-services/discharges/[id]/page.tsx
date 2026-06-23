import { redirect } from "next/navigation";

export default async function ClinicalDischargesDetailRedirectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/clinical-services/hms/discharges/${id}`);
}
