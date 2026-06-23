import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const safeFile = path.basename(file || "");
  const extension = path.extname(safeFile).toLowerCase();

  if (!safeFile || !contentTypes[extension]) {
    return NextResponse.json({ error: "Logo not found." }, { status: 404 });
  }

  try {
    const source = path.join(
      process.cwd(),
      "public",
      "uploads",
      "clinical",
      "hospitals",
      safeFile
    );
    const buffer = await readFile(source);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypes[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Logo not found." }, { status: 404 });
  }
}
