import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings =
      await prisma.smtp_settings.findFirst();

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
  try {
    const body =
      await request.json();

    const existing =
      await prisma.smtp_settings.findFirst();

    if (existing) {

      const updated =
        await prisma.smtp_settings.update({
          where: {
            id: existing.id,
          },

          data: body,
        });

      return NextResponse.json(updated);
    }

    const created =
      await prisma.smtp_settings.create({
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
