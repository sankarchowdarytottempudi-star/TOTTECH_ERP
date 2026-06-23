import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
};

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const safeFile = path.basename(file || "");
  const extension = path.extname(safeFile).toLowerCase();

  if (!safeFile || !contentTypes[extension]) {
    return NextResponse.json(
      { error: "Certificate not found." },
      { status: 404 }
    );
  }

  try {
    const source = path.join(
      process.cwd(),
      "public",
      "uploads",
      "students",
      "certificates",
      safeFile
    );
    const buffer = await readFile(source);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypes[extension],
        "Content-Disposition": `inline; filename="${safeFile}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Certificate not found." },
      { status: 404 }
    );
  }
}
