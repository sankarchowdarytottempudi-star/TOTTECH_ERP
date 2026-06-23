import fs from "fs";
import path from "path";

import PDFDocument from "pdfkit";
import QRCode from "qrcode";

import type { ClinicalContext } from "@/lib/clinical/context";

export type PdfTableRow = Record<string, unknown>;

export type ClinicalPdfSection = {
  title: string;
  rows?: Array<[string, unknown]>;
  table?: {
    columns: Array<{ key: string; label: string; width?: number }>;
    rows: PdfTableRow[];
  };
  notes?: string[];
};

export type ClinicalPdfInput = {
  title: string;
  subtitle?: string;
  documentNumber?: string;
  patient?: PdfTableRow | null;
  sections: ClinicalPdfSection[];
  qrText?: string;
  signatureLabel?: string;
  signatureImageUrl?: string | null;
  generatedAt?: Date;
};

const pageWidth = 595.28;
const margin = 42;
const gold = "#D4AF37";
const navy = "#04142E";
const ink = "#0B1F3A";
const muted = "#516176";

const textValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
};

const moneyValue = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "Rs. 0.00";
  }
  return `Rs. ${parsed.toFixed(2)}`;
};

const dateValue = (value: unknown) => {
  if (!value) {
    return "-";
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return textValue(value);
  }
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const logoFileFromUrl = (logoUrl: string | null) => {
  if (!logoUrl || logoUrl.startsWith("http")) {
    return null;
  }
  const normalized = logoUrl.startsWith("/")
    ? logoUrl.slice(1)
    : logoUrl;
  const candidate = path.join(process.cwd(), "public", normalized);
  return fs.existsSync(candidate) ? candidate : null;
};

const drawHeader = async (
  doc: PDFKit.PDFDocument,
  context: ClinicalContext,
  input: ClinicalPdfInput
) => {
  const primary = context.branding.primaryColor || navy;
  const accent = context.branding.accentColor || gold;
  doc.rect(0, 0, pageWidth, 104).fill(primary);

  const logoPath = logoFileFromUrl(context.branding.logoUrl);
  if (logoPath) {
    try {
      doc.image(logoPath, margin, 22, {
        fit: [54, 54],
        align: "center",
        valign: "center",
      });
    } catch {
      doc
        .roundedRect(margin, 22, 54, 54, 8)
        .strokeColor(accent)
        .stroke();
    }
  } else {
    doc
      .roundedRect(margin, 22, 54, 54, 8)
      .strokeColor(accent)
      .stroke();
    doc
      .fillColor(accent)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("TC", margin, 41, { width: 54, align: "center" });
  }

  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(context.branchName || "HOSPITAL DOCUMENT", 110, 22, { width: 310 });
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(context.hospitalName || context.branding.name || "Hospital", 110, 36, { width: 330 });
  doc
    .fillColor("#E8EEF7")
    .font("Helvetica")
    .fontSize(9)
    .text(
      input.subtitle ||
        `${context.hospitalAddress || context.branchName || ""}${context.hospitalPhone ? ` | ${context.hospitalPhone}` : ""}${context.hospitalEmail ? ` | ${context.hospitalEmail}` : ""}${context.hospitalLicenseNumber ? ` | License ${context.hospitalLicenseNumber}` : ""}`,
      110,
      62,
      { width: 330 }
    );
  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(input.title, 110, 88, { width: 330 });

  const qrText =
    input.qrText ||
    `${input.title}|${input.documentNumber || ""}|${context.tenantId}|${context.hospitalId}|${context.branchId}`;
  const qrBuffer = await QRCode.toBuffer(qrText, {
    width: 74,
    margin: 1,
    color: {
      dark: primary,
      light: "#FFFFFF",
    },
  });
  doc.image(qrBuffer, pageWidth - margin - 74, 18, { width: 74 });
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica")
    .fontSize(7)
    .text("Scan to verify", pageWidth - margin - 78, 82, {
      width: 82,
      align: "center",
    });
};

const ensureSpace = (doc: PDFKit.PDFDocument, needed = 80) => {
  if (doc.y + needed > 770) {
    doc.addPage();
    doc.y = margin;
  }
};

const drawKeyValueRows = (
  doc: PDFKit.PDFDocument,
  rows: Array<[string, unknown]>
) => {
  const labelWidth = 150;
  rows.forEach(([label, value]) => {
    ensureSpace(doc, 22);
    const y = doc.y;
    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(label.toUpperCase(), margin, y, { width: labelWidth });
    doc
      .fillColor(ink)
      .font("Helvetica")
      .fontSize(10)
      .text(textValue(value), margin + labelWidth + 16, y, {
        width: pageWidth - margin * 2 - labelWidth - 16,
      });
    doc.y = Math.max(doc.y, y + 18);
  });
};

const drawTable = (
  doc: PDFKit.PDFDocument,
  table: NonNullable<ClinicalPdfSection["table"]>
) => {
  const available = pageWidth - margin * 2;
  const defaultWidth = Math.floor(available / table.columns.length);
  const widths = table.columns.map((column) => column.width || defaultWidth);
  const renderRow = (row: PdfTableRow, header = false) => {
    ensureSpace(doc, 32);
    const y = doc.y;
    let x = margin;
    doc
      .rect(margin, y - 4, available, 24)
      .fill(header ? navy : "#F7F9FC");
    table.columns.forEach((column, index) => {
      doc
        .fillColor(header ? "#FFFFFF" : ink)
        .font(header ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8)
        .text(
          header ? column.label : textValue(row[column.key]),
          x + 6,
          y + 3,
          { width: widths[index] - 10, ellipsis: true }
        );
      x += widths[index];
    });
    doc.y = y + 28;
  };

  renderRow(
    Object.fromEntries(table.columns.map((column) => [column.key, column.label])),
    true
  );
  if (!table.rows.length) {
    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text("No records available for this document.", margin, doc.y + 4);
    doc.moveDown();
    return;
  }
  table.rows.forEach((row) => renderRow(row));
};

export async function renderClinicalPdf(
  context: ClinicalContext,
  input: ClinicalPdfInput
) {
  const doc = new PDFDocument({
    size: "A4",
    margin,
    bufferPages: true,
    info: {
      Title: input.title,
      Author: "TOTTECH Clinical Services",
      Producer: "TOTTECH Clinical Services",
    },
  });
  const chunks: Buffer[] = [];

  return new Promise<Buffer>(async (resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      await drawHeader(doc, context, input);
      doc.y = 124;

      doc
        .fillColor(muted)
        .font("Helvetica")
        .fontSize(8)
        .text(
          `Generated ${dateValue(input.generatedAt || new Date())} | Tenant ${context.tenantId} | Hospital ${context.hospitalId} | Branch ${context.branchId}`,
          margin,
          doc.y
        );
      doc.moveDown(1.5);

      if (input.patient) {
        doc
          .fillColor(gold)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text("PATIENT DETAILS");
        doc.moveDown(0.5);
        drawKeyValueRows(doc, [
          ["Patient", input.patient.patient_name || input.patient.name],
          ["UHID", input.patient.uhid || input.patient.patient_uid],
          ["Phone", input.patient.phone || input.patient.mobile],
          ["Gender", input.patient.gender],
        ]);
        doc.moveDown();
      }

      input.sections.forEach((section) => {
        ensureSpace(doc, 72);
        doc
          .moveDown(0.4)
          .fillColor(gold)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(section.title.toUpperCase());
        doc
          .moveTo(margin, doc.y + 3)
          .lineTo(pageWidth - margin, doc.y + 3)
          .strokeColor("#E6D3A1")
          .stroke();
        doc.moveDown(0.8);

        if (section.rows) {
          drawKeyValueRows(doc, section.rows);
        }
        if (section.table) {
          drawTable(doc, section.table);
        }
        if (section.notes?.length) {
          section.notes.forEach((note) => {
            ensureSpace(doc, 24);
            doc
              .fillColor(ink)
              .font("Helvetica")
              .fontSize(10)
              .text(`- ${note}`, margin, doc.y, {
                width: pageWidth - margin * 2,
              });
          });
        }
      });

      ensureSpace(doc, 100);
      doc.moveDown(2);
      doc
        .strokeColor("#C9D2DF")
        .moveTo(pageWidth - margin - 180, doc.y)
        .lineTo(pageWidth - margin, doc.y)
        .stroke();
      const signaturePath = logoFileFromUrl(input.signatureImageUrl || null);
      if (signaturePath) {
        try {
          doc.image(signaturePath, pageWidth - margin - 170, doc.y - 44, {
            fit: [150, 42],
            align: "center",
          });
        } catch {
          // Keep the signature line if the configured image cannot be rendered.
        }
      }
      doc
        .fillColor(ink)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(input.signatureLabel || "Authorized Signature", pageWidth - margin - 180, doc.y + 6, {
          width: 180,
          align: "center",
        });

      const pageRange = doc.bufferedPageRange();
      for (let i = 0; i < pageRange.count; i += 1) {
        doc.switchToPage(i);
        doc
          .fillColor(muted)
          .font("Helvetica")
          .fontSize(8)
          .text(
            `Generated by TOTTECH Clinical Services | ${input.documentNumber || input.title} | Printed ${dateValue(new Date())} | Page ${i + 1} of ${pageRange.count}`,
            margin,
            810,
            { width: pageWidth - margin * 2, align: "center" }
          );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function pdfResponse(buffer: Buffer, fileName: string) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export const pdfFormatters = {
  date: dateValue,
  money: moneyValue,
  text: textValue,
};
