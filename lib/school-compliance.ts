export type SchoolComplianceSource = {
  recognition_number?: string | null;
  recognition_authority?: string | null;
  recognition_start_date?: string | Date | null;
  recognition_expiry_date?: string | Date | null;
  affiliation_number?: string | null;
  affiliation_authority?: string | null;
  affiliation_start_date?: string | Date | null;
  affiliation_expiry_date?: string | Date | null;
};

export type ComplianceStatus =
  | "VALID"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "MISSING";

function toDate(value: unknown) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(String(value));

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function statusForDates(
  start?: string | Date | null,
  expiry?: string | Date | null
): ComplianceStatus {
  if (!start || !expiry) {
    return "MISSING";
  }

  const expiryDate = toDate(expiry);
  if (!expiryDate) {
    return "MISSING";
  }

  const startDate = toDate(start);
  if (!startDate) {
    return "MISSING";
  }

  const now = new Date();
  const diffDays = Math.ceil(
    (expiryDate.getTime() -
      now.getTime()) /
      86400000
  );

  if (diffDays < 0) {
    return "EXPIRED";
  }

  if (diffDays <= 365) {
    return "EXPIRING_SOON";
  }

  return "VALID";
}

export function summarizeSchoolCompliance(
  school: SchoolComplianceSource
) {
  const recognitionStatus =
    statusForDates(
      school.recognition_start_date,
      school.recognition_expiry_date
    );
  const affiliationStatus =
    statusForDates(
      school.affiliation_start_date,
      school.affiliation_expiry_date
    );

  return {
    recognitionStatus,
    affiliationStatus,
    recognitionWarning:
      recognitionStatus === "EXPIRING_SOON"
        ? "Recognition expiring within 365 days"
        : recognitionStatus === "EXPIRED"
          ? "Recognition expired"
          : recognitionStatus === "MISSING"
            ? "Recognition details missing"
            : "Recognition valid",
    affiliationWarning:
      affiliationStatus === "EXPIRING_SOON"
        ? "Affiliation expiring within 365 days"
        : affiliationStatus === "EXPIRED"
          ? "Affiliation expired"
          : affiliationStatus === "MISSING"
            ? "Affiliation details missing"
            : "Affiliation valid",
  };
}

export function complianceBadgeLabel(
  status: ComplianceStatus
) {
  switch (status) {
    case "VALID":
      return "Valid";
    case "EXPIRING_SOON":
      return "Expiring Soon";
    case "EXPIRED":
      return "Expired";
    default:
      return "Missing";
  }
}
