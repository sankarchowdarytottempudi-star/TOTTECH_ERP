import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { buildClinicalOpenApiSpec } from "@/lib/clinical/openapi-spec";

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const spec =
    await buildClinicalOpenApiSpec(
      auth.context!
    );

  return NextResponse.json(spec);
}
