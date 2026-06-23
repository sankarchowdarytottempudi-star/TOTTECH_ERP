import fs from "fs";
import path from "path";

import PDFDocument from "pdfkit";
import QRCode from "qrcode";

import {
  normalizeSchoolBranding,
  type SchoolBrandingSource,
} from "@/lib/school-branding";

type Row = Record<string, unknown>;
type FinanceTemplate = "digital" | "print";

const navy = "#04142E";
const gold = "#D4AF37";
const ink = "#111827";
const muted = "#5B667A";
const line = "#D1D5DB";

const text = (
  value: unknown,
  fallback = "-"
) => {
  const output = String(
    value ?? ""
  ).trim();

  return output || fallback;
};

const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

const dateText = (value: unknown) => {
  if (!value) {
    return "-";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const publicImagePath = (
  logoUrl?: string | null
) => {
  const url = text(logoUrl, "");

  if (
    !url ||
    !url.startsWith("/")
  ) {
    return null;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    url.replace(/^\/+/, "")
  );

  try {
    return fs.existsSync(filePath)
      ? filePath
      : null;
  } catch {
    return null;
  }
};

function appBaseUrl() {
  return String(
    process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://erp.tottechsolutions.com"
  ).replace(/\/+$/, "");
}

async function qrBuffer(value: string) {
  const dataUrl = await QRCode.toDataURL(
    value,
    {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 128,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    }
  );

  return Buffer.from(
    dataUrl.split(",")[1] || "",
    "base64"
  );
}

async function collectPdf(
  render: (
    doc: PDFKit.PDFDocument
  ) => void | Promise<void>
) {
  return new Promise<Buffer>(
    (resolve, reject) => {
      const doc =
        new PDFDocument({
          size: "A4",
          margin: 0,
          autoFirstPage: true,
        });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) =>
        chunks.push(Buffer.from(chunk))
      );
      doc.on("end", () =>
        resolve(Buffer.concat(chunks))
      );
      doc.on("error", reject);

      Promise.resolve(render(doc))
        .then(() => doc.end())
        .catch(reject);
    }
  );
}

function brandingDetails(
  school: SchoolBrandingSource | null
) {
  const branding =
    normalizeSchoolBranding(school);

  return {
    branding,
    logo: publicImagePath(
      branding.logoUrl
    ),
    contact: [
      school?.address,
      school?.phone,
      school?.email,
    ]
      .filter(Boolean)
      .join(" | "),
  };
}

function itemLabel(item: Row) {
  return text(
    item.fee_name ||
      item.description ||
      item.particulars ||
      item.billing_period ||
      "Fee"
  );
}

function itemAmount(item: Row) {
  return Number(
    item.amount ||
      item.total_amount ||
      item.payable_amount ||
      0
  );
}

function barcode(
  doc: PDFKit.PDFDocument,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const source = text(value, "TOTTECH");
  let cursor = x;
  const unit = width / (source.length * 5);

  source.split("").forEach((char) => {
    const code = char.charCodeAt(0);
    for (let index = 0; index < 5; index += 1) {
      const on =
        ((code >> index) & 1) === 1;
      const barWidth =
        unit * (on ? 1.8 : 0.8);

      if (on || index % 2 === 0) {
        doc
          .rect(cursor, y, barWidth, height)
          .fill(ink);
      }

      cursor += unit * 1.4;
    }
  });
}

function labelValue(
  doc: PDFKit.PDFDocument,
  label: string,
  value: unknown,
  x: number,
  y: number,
  width = 160,
  compact = false
) {
  doc
    .fillColor(muted)
    .fontSize(compact ? 6 : 8)
    .font("Helvetica-Bold")
    .text(label.toUpperCase(), x, y);
  doc
    .fillColor(ink)
    .fontSize(compact ? 8 : 10)
    .font("Helvetica-Bold")
    .text(text(value), x, y + (compact ? 9 : 12), {
      width,
    });
}

function drawLogo(
  doc: PDFKit.PDFDocument,
  logo: string | null,
  x: number,
  y: number,
  size: number,
  grayscale = false
) {
  doc
    .rect(x, y, size, size)
    .strokeColor(line)
    .lineWidth(1)
    .stroke();

  if (!logo) {
    doc
      .fillColor(grayscale ? "#F3F4F6" : gold)
      .rect(x + 4, y + 4, size - 8, size - 8)
      .fill();
    return;
  }

  try {
    doc.image(logo, x + 4, y + 4, {
      fit: [size - 8, size - 8],
      align: "center",
      valign: "center",
    });
  } catch {
    doc
      .fillColor(grayscale ? "#F3F4F6" : gold)
      .rect(x + 4, y + 4, size - 8, size - 8)
      .fill();
  }
}

function drawDigitalHeader(
  doc: PDFKit.PDFDocument,
  school: SchoolBrandingSource | null,
  title: string,
  documentNumber: string
) {
  const {
    branding,
    logo,
    contact,
  } = brandingDetails(school);

  doc
    .rect(0, 0, 595, 142)
    .fill(navy);
  doc
    .rect(0, 130, 595, 12)
    .fill(gold);
  drawLogo(doc, logo, 42, 34, 68);

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(23)
    .text(branding.schoolName, 128, 38, {
      width: 270,
    });
  doc
    .fillColor("#F6E6B5")
    .fontSize(9)
    .text(
      text(branding.schoolCode, "SCHOOL"),
      128,
      69
    );
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica")
    .fontSize(8)
    .text(contact, 128, 86, {
      width: 300,
    });

  doc
    .roundedRect(430, 34, 118, 58, 8)
    .strokeColor("#A8872D")
    .lineWidth(1)
    .stroke();
  doc
    .fillColor(gold)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(title, 442, 48, {
      width: 94,
      align: "right",
    });
  doc
    .fillColor("#FFFFFF")
    .fontSize(8)
    .text(documentNumber, 442, 67, {
      width: 94,
      align: "right",
    });

  doc
    .fillColor("#F8FAFC")
    .font("Helvetica-Bold")
    .fontSize(54)
    .opacity(0.05)
    .text("TOTTECH ONE", 118, 342, {
      width: 360,
      align: "center",
    })
    .opacity(1);
}

function drawDigitalFooter(
  doc: PDFKit.PDFDocument,
  documentNumber: string,
  verificationUrl: string
) {
  doc
    .moveTo(36, 768)
    .lineTo(560, 768)
    .strokeColor("#E5E7EB")
    .lineWidth(1)
    .stroke();
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Generated by TOTTECH ONE | Document ${documentNumber} | ${new Date().toLocaleString("en-IN")}`,
      36,
      778,
      {
        width: 360,
      }
    )
    .text("Page 1", 512, 778);
  doc
    .fontSize(7)
    .text(verificationUrl, 36, 792, {
      width: 500,
    });
}

function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
  x: number,
  y: number,
  widths: number[],
  compact = false
) {
  const rowHeight = compact ? 18 : 26;
  const fontSize = compact ? 7 : 9;
  const totalWidth = widths.reduce(
    (sum, width) => sum + width,
    0
  );

  doc
    .rect(x, y, totalWidth, rowHeight)
    .fill("#F3F4F6");
  let cursor = x;
  headers.forEach((header, index) => {
    doc
      .fillColor(ink)
      .font("Helvetica-Bold")
      .fontSize(compact ? 6 : 8)
      .text(header, cursor + 5, y + 6, {
        width: widths[index] - 10,
      });
    cursor += widths[index];
  });
  doc
    .rect(x, y, totalWidth, rowHeight)
    .strokeColor(line)
    .stroke();

  let rowY = y + rowHeight;
  rows.forEach((row) => {
    cursor = x;
    row.forEach((cell, index) => {
      doc
        .fillColor(ink)
        .font("Helvetica")
        .fontSize(fontSize)
        .text(cell, cursor + 5, rowY + 6, {
          width: widths[index] - 10,
          align:
            index === row.length - 1
              ? "right"
              : "left",
        });
      cursor += widths[index];
    });
    doc
      .rect(x, rowY, totalWidth, rowHeight)
      .strokeColor(line)
      .stroke();
    rowY += rowHeight;
  });

  return rowY;
}

function invoiceRows(
  invoice: Row,
  lineItems: Row[]
) {
  const items =
    lineItems.length > 0
      ? lineItems
      : [
          {
            fee_name:
              invoice.billing_period ||
              "Fee Invoice",
            amount:
              invoice.total_amount,
          },
        ];

  return items.slice(0, 8).map((item) => [
    itemLabel(item),
    money(itemAmount(item)),
  ]);
}

function drawCopyHeader(
  doc: PDFKit.PDFDocument,
  school: SchoolBrandingSource | null,
  title: string,
  copyLabel: string,
  documentNumber: string,
  x: number,
  y: number,
  width: number
) {
  const {
    branding,
    logo,
    contact,
  } = brandingDetails(school);

  drawLogo(doc, logo, x + 12, y + 12, 44, true);
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(branding.schoolName, x + 66, y + 12, {
      width: 270,
    });
  doc
    .fillColor("#374151")
    .fontSize(7)
    .text(contact, x + 66, y + 33, {
      width: 270,
    });
  doc
    .fillColor(ink)
    .fontSize(11)
    .text(title, x + width - 160, y + 13, {
      width: 140,
      align: "right",
    });
  doc
    .fontSize(7)
    .text(documentNumber, x + width - 160, y + 31, {
      width: 140,
      align: "right",
    });
  doc
    .roundedRect(x + width - 142, y + 50, 122, 20, 4)
    .strokeColor(ink)
    .stroke();
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(copyLabel, x + width - 136, y + 56, {
      width: 110,
      align: "center",
    });
}

async function drawReceiptPrintCopy(
  doc: PDFKit.PDFDocument,
  input: {
    school: SchoolBrandingSource | null;
    payment: Row;
    lineItems: Row[];
  },
  copyLabel: string,
  y: number
) {
  const x = 28;
  const width = 539;
  const height = 382;
  const receiptNo = text(
    input.payment.receipt_number ||
      input.payment.id
  );
  const verifyUrl = `${appBaseUrl()}/verify/receipt/${encodeURIComponent(receiptNo)}`;
  const qr = await qrBuffer(verifyUrl);

  doc
    .rect(x, y, width, height)
    .strokeColor(ink)
    .lineWidth(1)
    .stroke();
  drawCopyHeader(
    doc,
    input.school,
    "FEE RECEIPT",
    copyLabel,
    receiptNo,
    x,
    y,
    width
  );

  labelValue(doc, "Student", input.payment.student_name, x + 14, y + 84, 150, true);
  labelValue(doc, "Admission No", input.payment.admission_number, x + 184, y + 84, 90, true);
  labelValue(doc, "Class / Section", `${text(input.payment.class_name)} / ${text(input.payment.section_name)}`, x + 294, y + 84, 110, true);
  labelValue(doc, "Academic Year", input.payment.academic_year, x + 424, y + 84, 90, true);
  labelValue(doc, "Payment Date", dateText(input.payment.payment_date || input.payment.receipt_date), x + 14, y + 124, 115, true);
  labelValue(doc, "Invoice No", input.payment.invoice_number, x + 154, y + 124, 115, true);
  labelValue(doc, "Mode", input.payment.payment_method, x + 294, y + 124, 90, true);
  labelValue(doc, "Collected By", input.payment.received_by_name || "Finance Desk", x + 404, y + 124, 110, true);

  const rows =
    input.lineItems.length > 0
      ? input.lineItems.slice(0, 5).map((item) => [
          itemLabel(item),
          money(itemAmount(item)),
        ])
      : [["Fee Payment", money(input.payment.amount)]];
  const tableBottom = drawTable(
    doc,
    ["Fee Details", "Amount"],
    rows,
    x + 14,
    y + 168,
    [360, 140],
    true
  );

  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Amount Paid", x + 314, tableBottom + 12)
    .text(money(input.payment.amount), x + 416, tableBottom + 12, {
      width: 98,
      align: "right",
    })
    .fontSize(9)
    .text("Balance", x + 314, tableBottom + 30)
    .text(money(input.payment.balance_amount), x + 416, tableBottom + 30, {
      width: 98,
      align: "right",
    });

  doc.image(qr, x + 15, y + height - 78, {
    fit: [52, 52],
  });
  barcode(doc, receiptNo, x + 78, y + height - 62, 150, 26);
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(6)
    .text(verifyUrl, x + 78, y + height - 31, {
      width: 260,
    });
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Parent / Guardian", x + 330, y + height - 50)
    .text("Authorized Signature", x + 425, y + height - 50);
  doc
    .moveTo(x + 330, y + height - 56)
    .lineTo(x + 405, y + height - 56)
    .moveTo(x + 425, y + height - 56)
    .lineTo(x + 514, y + height - 56)
    .strokeColor(ink)
    .stroke();
}

async function drawInvoicePrintCopy(
  doc: PDFKit.PDFDocument,
  input: {
    school: SchoolBrandingSource | null;
    invoice: Row;
    lineItems: Row[];
  },
  copyLabel: string,
  y: number
) {
  const x = 28;
  const width = 539;
  const height = 382;
  const invoiceNo = text(
    input.invoice.invoice_number ||
      input.invoice.id
  );
  const verifyUrl = `${appBaseUrl()}/verify/invoice/${encodeURIComponent(invoiceNo)}`;
  const qr = await qrBuffer(verifyUrl);

  doc
    .rect(x, y, width, height)
    .strokeColor(ink)
    .lineWidth(1)
    .stroke();
  drawCopyHeader(
    doc,
    input.school,
    "FEE INVOICE",
    copyLabel,
    invoiceNo,
    x,
    y,
    width
  );

  labelValue(doc, "Student", input.invoice.student_name, x + 14, y + 84, 150, true);
  labelValue(doc, "Admission No", input.invoice.admission_number, x + 184, y + 84, 90, true);
  labelValue(doc, "Class / Section", `${text(input.invoice.class_name)} / ${text(input.invoice.section_name)}`, x + 294, y + 84, 110, true);
  labelValue(doc, "Academic Year", input.invoice.academic_year, x + 424, y + 84, 90, true);
  labelValue(doc, "Invoice Date", dateText(input.invoice.invoice_date), x + 14, y + 124, 115, true);
  labelValue(doc, "Due Date", dateText(input.invoice.due_date), x + 154, y + 124, 115, true);
  labelValue(doc, "Status", input.invoice.status, x + 294, y + 124, 90, true);

  const tableBottom = drawTable(
    doc,
    ["Fee Details", "Amount"],
    invoiceRows(input.invoice, input.lineItems),
    x + 14,
    y + 168,
    [360, 140],
    true
  );

  [
    ["Total", input.invoice.total_amount],
    ["Paid", input.invoice.paid_amount],
    ["Balance", input.invoice.balance_amount],
  ].forEach(([label, value], index) => {
    doc
      .fillColor(ink)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(String(label), x + 314, tableBottom + 9 + index * 16)
      .text(money(value), x + 416, tableBottom + 9 + index * 16, {
        width: 98,
        align: "right",
      });
  });

  doc.image(qr, x + 15, y + height - 78, {
    fit: [52, 52],
  });
  barcode(doc, invoiceNo, x + 78, y + height - 62, 150, 26);
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(6)
    .text(verifyUrl, x + 78, y + height - 31, {
      width: 260,
    });
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Parent / Guardian", x + 330, y + height - 50)
    .text("Authorized Signature", x + 425, y + height - 50);
  doc
    .moveTo(x + 330, y + height - 56)
    .lineTo(x + 405, y + height - 56)
    .moveTo(x + 425, y + height - 56)
    .lineTo(x + 514, y + height - 56)
    .strokeColor(ink)
    .stroke();
}

function drawCutLine(doc: PDFKit.PDFDocument) {
  doc
    .moveTo(34, 418)
    .lineTo(561, 418)
    .dash(5, {
      space: 4,
    })
    .strokeColor("#6B7280")
    .lineWidth(1)
    .stroke()
    .undash();
  doc
    .fillColor("#374151")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("----------- CUT HERE -----------", 0, 411, {
      width: 595,
      align: "center",
    });
}

async function renderPrintInvoice(
  input: {
    school: SchoolBrandingSource | null;
    invoice: Row;
    lineItems: Row[];
  }
) {
  return collectPdf(async (doc) => {
    await drawInvoicePrintCopy(
      doc,
      input,
      "PARENT COPY",
      24
    );
    drawCutLine(doc);
    await drawInvoicePrintCopy(
      doc,
      input,
      "SCHOOL RECORD COPY",
      436
    );
  });
}

async function renderPrintReceipt(
  input: {
    school: SchoolBrandingSource | null;
    payment: Row;
    lineItems: Row[];
  }
) {
  return collectPdf(async (doc) => {
    await drawReceiptPrintCopy(
      doc,
      input,
      "PARENT COPY",
      24
    );
    drawCutLine(doc);
    await drawReceiptPrintCopy(
      doc,
      input,
      "SCHOOL RECORD COPY",
      436
    );
  });
}

async function renderDigitalInvoice(
  input: {
    school: SchoolBrandingSource | null;
    invoice: Row;
    lineItems: Row[];
    installments: Row[];
    payments: Row[];
  }
) {
  const invoiceNo = text(
    input.invoice.invoice_number ||
      input.invoice.id
  );
  const verifyUrl = `${appBaseUrl()}/verify/invoice/${encodeURIComponent(invoiceNo)}`;
  const qr = await qrBuffer(verifyUrl);

  return collectPdf((doc) => {
    drawDigitalHeader(
      doc,
      input.school,
      "FEE INVOICE",
      invoiceNo
    );

    labelValue(doc, "Student", input.invoice.student_name, 42, 172, 170);
    labelValue(doc, "Admission No", input.invoice.admission_number, 232, 172, 120);
    labelValue(doc, "Class / Section", `${text(input.invoice.class_name)} / ${text(input.invoice.section_name)}`, 382, 172, 130);
    labelValue(doc, "Academic Year", input.invoice.academic_year, 42, 220, 130);
    labelValue(doc, "Invoice Date", dateText(input.invoice.invoice_date), 232, 220, 120);
    labelValue(doc, "Due Date", dateText(input.invoice.due_date), 382, 220, 130);

    const bottom = drawTable(
      doc,
      ["Fee Details", "Amount"],
      invoiceRows(input.invoice, input.lineItems),
      42,
      292,
      [360, 110]
    );

    [
      ["Total Amount", input.invoice.total_amount],
      ["Paid Amount", input.invoice.paid_amount],
      ["Balance", input.invoice.balance_amount],
    ].forEach(([label, value], index) => {
      const y = bottom + 22 + index * 24;
      doc
        .fillColor(
          label === "Balance"
            ? gold
            : ink
        )
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(String(label), 344, y)
        .text(money(value), 442, y, {
          width: 72,
          align: "right",
        });
    });

    doc.image(qr, 42, 650, {
      fit: [72, 72],
    });
    barcode(doc, invoiceNo, 132, 666, 190, 34);
    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text("Scan to verify this invoice", 42, 728, {
        width: 130,
      });
    doc
      .fillColor(ink)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Authorized Signature", 408, 704);
    doc
      .moveTo(400, 696)
      .lineTo(525, 696)
      .strokeColor(ink)
      .stroke();

    drawDigitalFooter(
      doc,
      invoiceNo,
      verifyUrl
    );
  });
}

async function renderDigitalReceipt(
  input: {
    school: SchoolBrandingSource | null;
    payment: Row;
    lineItems: Row[];
  }
) {
  const receiptNo = text(
    input.payment.receipt_number ||
      input.payment.id
  );
  const verifyUrl = `${appBaseUrl()}/verify/receipt/${encodeURIComponent(receiptNo)}`;
  const qr = await qrBuffer(verifyUrl);
  const rows =
    input.lineItems.length > 0
      ? input.lineItems.slice(0, 8).map((item) => [
          itemLabel(item),
          money(itemAmount(item)),
        ])
      : [["Fee Payment", money(input.payment.amount)]];

  return collectPdf((doc) => {
    drawDigitalHeader(
      doc,
      input.school,
      "FEE RECEIPT",
      receiptNo
    );

    labelValue(doc, "Student", input.payment.student_name, 42, 172, 170);
    labelValue(doc, "Admission No", input.payment.admission_number, 232, 172, 120);
    labelValue(doc, "Class / Section", `${text(input.payment.class_name)} / ${text(input.payment.section_name)}`, 382, 172, 130);
    labelValue(doc, "Academic Year", input.payment.academic_year, 42, 220, 130);
    labelValue(doc, "Invoice No", input.payment.invoice_number, 232, 220, 120);
    labelValue(doc, "Payment Date", dateText(input.payment.payment_date || input.payment.receipt_date), 382, 220, 130);

    doc
      .roundedRect(42, 276, 470, 72, 12)
      .fill("#FFF7E6")
      .strokeColor("#F2C879")
      .stroke();
    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("AMOUNT PAID", 62, 294);
    doc
      .fillColor(ink)
      .fontSize(26)
      .text(money(input.payment.amount), 62, 310);
    doc
      .fillColor(muted)
      .fontSize(8)
      .text("PAYMENT MODE", 340, 296);
    doc
      .fillColor(ink)
      .fontSize(12)
      .text(text(input.payment.payment_method), 340, 312, {
        width: 140,
      });

    drawTable(
      doc,
      ["Fee Details", "Amount"],
      rows,
      42,
      382,
      [360, 110]
    );

    labelValue(doc, "Reference", input.payment.reference_number, 42, 586, 170);
    labelValue(doc, "Collected By", input.payment.received_by_name || "Finance Desk", 232, 586, 140);
    labelValue(doc, "Balance After Payment", money(input.payment.balance_amount), 392, 586, 130);

    doc.image(qr, 42, 650, {
      fit: [72, 72],
    });
    barcode(doc, receiptNo, 132, 666, 190, 34);
    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text("Scan to verify this receipt", 42, 728, {
        width: 130,
      });
    doc
      .fillColor(ink)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Authorized Signature", 408, 704);
    doc
      .moveTo(400, 696)
      .lineTo(525, 696)
      .strokeColor(ink)
      .stroke();

    drawDigitalFooter(
      doc,
      receiptNo,
      verifyUrl
    );
  });
}

export async function renderInvoicePdf(
  input: {
    school: SchoolBrandingSource | null;
    invoice: Row;
    lineItems: Row[];
    installments: Row[];
    payments: Row[];
    template?: FinanceTemplate;
  }
) {
  if (input.template === "print") {
    return renderPrintInvoice(input);
  }

  return renderDigitalInvoice(input);
}

export async function renderReceiptPdf(
  input: {
    school: SchoolBrandingSource | null;
    payment: Row;
    lineItems?: Row[];
    template?: FinanceTemplate;
  }
) {
  if (input.template === "print") {
    return renderPrintReceipt({
      ...input,
      lineItems: input.lineItems || [],
    });
  }

  return renderDigitalReceipt({
    ...input,
    lineItems: input.lineItems || [],
  });
}
