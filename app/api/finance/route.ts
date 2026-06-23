import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import {
  filtersFromRequest,
  getFinanceCommandCenter,
} from "@/lib/finance/command-center";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("FINANCE");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      await getFinanceCommandCenter(
        context,
        filtersFromRequest(
          request,
          context
        )
      );

    return NextResponse.json({
      ...payload,
      ...payload.legacy,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Finance API Failed",
      },
      {
        status: 500,
      }
    );
  }
}
