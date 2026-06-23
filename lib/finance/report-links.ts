import crypto from "crypto";

const secret = () =>
  String(
    process.env.PUBLIC_DOCUMENT_SECRET ||
      process.env.JWT_SECRET ||
      "tottech-one-public-document-secret"
  );

const appBaseUrl = () =>
  String(
    process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://erp.tottechsolutions.com"
  ).replace(/\/+$/, "");

function canonical(params: URLSearchParams) {
  const entries = Array.from(
    params.entries()
  )
    .filter(([key]) => key !== "token")
    .sort(([a], [b]) =>
      a.localeCompare(b)
    );

  return entries
    .map(
      ([key, value]) =>
        `${key}=${value}`
    )
    .join("&");
}

export function createFinanceReportToken(
  params: URLSearchParams
) {
  return crypto
    .createHmac("sha256", secret())
    .update(canonical(params))
    .digest("base64url");
}

export function verifyFinanceReportToken(
  params: URLSearchParams
) {
  const token = params.get("token");
  if (!token) return false;
  const expected =
    createFinanceReportToken(params);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token)
    );
  } catch {
    return false;
  }
}

export function buildPublicFinanceReportUrl(
  params: URLSearchParams
) {
  const next = new URLSearchParams(
    params.toString()
  );
  next.set(
    "token",
    createFinanceReportToken(next)
  );
  return `${appBaseUrl()}/api/public/finance/reports/pdf?${next.toString()}`;
}
