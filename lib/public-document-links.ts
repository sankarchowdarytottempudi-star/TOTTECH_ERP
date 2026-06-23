import crypto from "crypto";

const secret = () =>
  String(
    process.env.PUBLIC_DOCUMENT_SECRET ||
      process.env.JWT_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "tottech-one-public-document-secret"
  );

const appBaseUrl = () =>
  String(
    process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://erp.tottechsolutions.com"
  ).replace(/\/+$/, "");

export type PublicDocumentType =
  | "invoice"
  | "receipt";

export function createPublicDocumentToken(
  type: PublicDocumentType,
  id: number
) {
  return crypto
    .createHmac("sha256", secret())
    .update(`${type}:${id}`)
    .digest("base64url");
}

export function verifyPublicDocumentToken(
  type: PublicDocumentType,
  id: number,
  token: string | null | undefined
) {
  if (!token) {
    return false;
  }

  const expected =
    createPublicDocumentToken(
      type,
      id
    );
  const provided = String(token);

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(provided)
    );
  } catch {
    return false;
  }
}

export function buildPublicInvoicePdfUrl(
  invoiceId: number
) {
  const token =
    createPublicDocumentToken(
      "invoice",
      invoiceId
    );

  return `${appBaseUrl()}/api/public/finance/invoices/${invoiceId}/pdf?token=${encodeURIComponent(token)}`;
}

export function buildPublicPaymentReceiptUrl(
  paymentId: number
) {
  const token =
    createPublicDocumentToken(
      "receipt",
      paymentId
    );

  return `${appBaseUrl()}/api/public/finance/payments/${paymentId}/receipt?token=${encodeURIComponent(token)}`;
}
