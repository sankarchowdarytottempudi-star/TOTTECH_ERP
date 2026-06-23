import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;

  const form = await request.formData();
  const file = form.get("logo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Logo file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPG, WEBP, or SVG hospital logos are allowed." },
      { status: 400 }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Logo must be 2 MB or smaller." }, { status: 400 });
  }

  const extension =
    file.type === "image/svg+xml"
      ? "svg"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/png"
          ? "png"
          : "jpg";
  const directory = path.join(process.cwd(), "public", "uploads", "clinical", "hospitals");
  await mkdir(directory, { recursive: true });
  const fileName = `hospital-logo-${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;
  const destination = path.join(directory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, buffer);
  console.info("LOGO_UPLOAD_SUCCESS", {
    fileName,
    size: file.size,
    type: file.type,
    url: `/uploads/clinical/hospitals/${fileName}`,
  });

  return NextResponse.json({
    logoUrl: `/uploads/clinical/hospitals/${fileName}`,
  });
}
