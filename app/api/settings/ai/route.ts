import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSchoolModule } from "@/lib/module-governance";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");

  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  try {
    const settings =
      await prisma.ai_settings.findFirst();

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  const moduleGuard = await requireSchoolModule("AI");

  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  try {
    const body =
      await request.json();

    const existing =
      await prisma.ai_settings.findFirst();

    if (existing) {

      const updated =
        await prisma.ai_settings.update({
          where: {
            id: existing.id,
          },
          data: body,
        });

      return NextResponse.json(updated);
    }

    const created =
      await prisma.ai_settings.create({
        data: body,
      });

    return NextResponse.json(created);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
