import { redirect } from "next/navigation";

export default async function ClinicalIpdDetailRedirectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/clinical-services/hms/ip/${id}`);
}
