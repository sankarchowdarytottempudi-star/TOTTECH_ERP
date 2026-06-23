import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);

const safeExtension = (
  fileName: string,
  mimeType: string
) => {
  const ext = path
    .extname(fileName || "")
    .toLowerCase();

  if (ext && /^[.][a-z0-9]+$/.test(ext)) {
    return ext;
  }

  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/svg+xml") return ".svg";
  return ".jpg";
};

export async function POST(
  request: Request
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Login required before uploading a school logo.",
      },
      {
        status: 401,
      }
    );
  }

  const formData =
    await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        error:
          "Select a logo image from your device.",
      },
      {
        status: 400,
      }
    );
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      {
        error:
          "Logo must be PNG, JPG, WEBP, or SVG.",
      },
      {
        status: 400,
      }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      {
        error:
          "Logo image must be smaller than 2 MB.",
      },
      {
        status: 400,
      }
    );
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "schools"
  );
  await mkdir(uploadDir, {
    recursive: true,
  });

  const extension = safeExtension(
    file.name,
    file.type
  );
  const fileName = `school-logo-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${extension}`;
  const bytes =
    await file.arrayBuffer();

  await writeFile(
    path.join(uploadDir, fileName),
    Buffer.from(bytes)
  );

  return NextResponse.json({
    url: `/uploads/schools/${fileName}`,
  });
}
