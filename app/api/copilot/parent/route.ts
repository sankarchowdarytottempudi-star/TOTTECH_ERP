import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "AI access is not enabled for parent accounts.",
    },
    { status: 403 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "AI access is not enabled for parent accounts.",
    },
    { status: 403 }
  );
}
