export type InteropModuleKey =
  | "abha"
  | "abha-verification"
  | "consents"
  | "consent-audit"
  | "hie"
  | "fhir-resources"
  | "fhir-audit"
  | "fhir-mappings"
  | "hl7"
  | "hl7-errors"
  | "dicom-nodes"
  | "pacs-studies"
  | "ayushman-beneficiaries"
  | "ayushman-packages"
  | "ayushman-claims"
  | "partner-labs"
  | "partner-pharmacies"
  | "referral-network"
  | "marketplace"
  | "terminology"
  | "terminology-mappings"
  | "mpi"
  | "security";

export type InteropModuleConfig = {
  key: InteropModuleKey;
  label: string;
  table: string;
  idPrefix: string;
  uidColumn?: string;
  patientColumn?: string;
  doctorColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  requiredColumns?: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
  jsonColumns?: string[];
};

const commonNumericColumns = [
  "patient_id",
  "doctor_id",
  "practitioner_id",
  "abha_profile_id",
  "consent_id",
  "approved_by",
  "resource_id",
  "status_code",
  "retry_count",
  "port",
  "image_count",
  "beneficiary_id",
  "package_id",
  "claim_amount",
  "approved_amount",
  "coverage_amount",
  "partner_lab_id",
  "partner_pharmacy_id",
  "network_hospital_id",
  "consumer_id",
  "rate_limit_per_minute",
  "national_code_id",
  "mapping_confidence",
  "abha_profile_id",
  "match_score",
  "candidate_patient_id",
  "source_id",
  "linked_record_id",
];

const commonDateColumns = [
  "start_date",
  "end_date",
  "study_date",
  "submitted_date",
  "paid_date",
];

export const interopModules: Record<
  InteropModuleKey,
  InteropModuleConfig
> = {
  abha: {
    key: "abha",
    label: "ABHA Management",
    table: "clinical_interop_abha_profiles",
    idPrefix: "ABHA",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "abha_number",
      "abha_address",
      "mobile_number",
      "aadhaar_reference",
      "driving_license_reference",
      "pan_reference",
      "passport_reference",
      "verification_status",
      "linked_uhid",
      "status",
    ],
    numericColumns: commonNumericColumns,
  },
  "abha-verification": {
    key: "abha-verification",
    label: "ABHA Verification",
    table:
      "clinical_interop_abha_verifications",
    idPrefix: "ABHAV",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "abha_profile_id",
      "verification_type",
      "otp_reference",
      "aadhaar_verification_status",
      "mobile_verification_status",
      "provider_response",
      "status",
    ],
    requiredColumns: ["verification_type"],
    numericColumns: commonNumericColumns,
    jsonColumns: ["provider_response"],
  },
  consents: {
    key: "consents",
    label: "ABDM Consent Manager",
    table: "clinical_interop_abdm_consents",
    idPrefix: "CONS",
    uidColumn: "consent_id",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "consent_status",
    createColumns: [
      "patient_id",
      "purpose",
      "requester",
      "requester_organization",
      "data_type",
      "consent_type",
      "start_date",
      "end_date",
      "consent_status",
      "provider_response",
    ],
    requiredColumns: ["purpose"],
    numericColumns: commonNumericColumns,
    dateColumns: commonDateColumns,
    jsonColumns: ["provider_response"],
  },
  "consent-audit": {
    key: "consent-audit",
    label: "Consent Audit",
    table: "clinical_interop_consent_audits",
    idPrefix: "CAUD",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    createColumns: [
      "consent_id",
      "patient_id",
      "requested_by",
      "approved_by",
      "data_shared",
      "purpose",
      "event_type",
      "payload",
    ],
    requiredColumns: ["event_type"],
    numericColumns: commonNumericColumns,
    jsonColumns: ["data_shared", "payload"],
  },
  hie: {
    key: "hie",
    label: "Health Information Exchange",
    table: "clinical_interop_hie_exchanges",
    idPrefix: "HIE",
    uidColumn: "exchange_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "source_type",
      "destination_type",
      "exchange_action",
      "resource_type",
      "request_payload",
      "response_payload",
      "status",
    ],
    requiredColumns: ["exchange_action"],
    numericColumns: commonNumericColumns,
    jsonColumns: [
      "request_payload",
      "response_payload",
    ],
  },
  "fhir-resources": {
    key: "fhir-resources",
    label: "FHIR Resources",
    table: "clinical_interop_fhir_resources",
    idPrefix: "FHIR",
    uidColumn: "fhir_id",
    patientColumn: "patient_id",
    doctorColumn: "practitioner_id",
    dateColumn: "created_at",
    statusColumn: "resource_status",
    createColumns: [
      "fhir_version",
      "resource_type",
      "patient_id",
      "practitioner_id",
      "organization_reference",
      "resource_status",
      "resource",
      "source_table",
      "source_id",
    ],
    requiredColumns: ["resource_type"],
    numericColumns: commonNumericColumns,
    jsonColumns: ["resource"],
  },
  "fhir-audit": {
    key: "fhir-audit",
    label: "FHIR Audit",
    table: "clinical_interop_fhir_audit",
    idPrefix: "FAUD",
    dateColumn: "created_at",
    createColumns: [
      "resource_id",
      "request_method",
      "request_path",
      "request_payload",
      "response_payload",
      "status_code",
      "requester",
      "organization",
    ],
    numericColumns: commonNumericColumns,
    jsonColumns: [
      "request_payload",
      "response_payload",
    ],
  },
  "fhir-mappings": {
    key: "fhir-mappings",
    label: "FHIR Mappings",
    table: "clinical_interop_fhir_mappings",
    idPrefix: "FMAP",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "local_table",
      "local_field",
      "fhir_resource",
      "fhir_path",
      "terminology_system",
      "status",
    ],
    requiredColumns: [
      "local_table",
      "local_field",
      "fhir_resource",
      "fhir_path",
    ],
  },
  hl7: {
    key: "hl7",
    label: "HL7 Messages",
    table: "clinical_interop_hl7_messages",
    idPrefix: "HL7",
    uidColumn: "message_control_id",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "processing_status",
    createColumns: [
      "message_type",
      "direction",
      "sending_application",
      "receiving_application",
      "patient_id",
      "raw_message",
      "parsed_payload",
      "processing_status",
      "retry_count",
    ],
    requiredColumns: ["message_type"],
    numericColumns: commonNumericColumns,
    textAreaColumns: ["raw_message"],
    jsonColumns: ["parsed_payload"],
  },
  "hl7-errors": {
    key: "hl7-errors",
    label: "HL7 Message Monitor",
    table: "clinical_interop_hl7_errors",
    idPrefix: "HL7ERR",
    dateColumn: "created_at",
    statusColumn: "resolution_status",
    createColumns: [
      "message_id",
      "error_type",
      "message_content",
      "retry_count",
      "resolution_status",
      "resolution_notes",
    ],
    numericColumns: [
      ...commonNumericColumns,
      "message_id",
    ],
    textAreaColumns: [
      "message_content",
      "resolution_notes",
    ],
  },
  "dicom-nodes": {
    key: "dicom-nodes",
    label: "DICOM Gateway",
    table: "clinical_interop_dicom_nodes",
    idPrefix: "DICOM",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "ae_title",
      "ip_address",
      "port",
      "modality",
      "node_role",
      "status",
    ],
    requiredColumns: ["ae_title"],
    numericColumns: commonNumericColumns,
  },
  "pacs-studies": {
    key: "pacs-studies",
    label: "PACS Studies",
    table: "clinical_interop_pacs_studies",
    idPrefix: "PACS",
    patientColumn: "patient_id",
    dateColumn: "study_date",
    statusColumn: "storage_status",
    createColumns: [
      "study_instance_uid",
      "patient_id",
      "accession_number",
      "modality",
      "study_date",
      "study_description",
      "storage_status",
      "image_count",
      "report_url",
      "payload",
    ],
    requiredColumns: ["study_instance_uid"],
    numericColumns: commonNumericColumns,
    dateColumns: commonDateColumns,
    textAreaColumns: ["study_description"],
    jsonColumns: ["payload"],
  },
  "ayushman-beneficiaries": {
    key: "ayushman-beneficiaries",
    label: "Ayushman Beneficiaries",
    table:
      "clinical_interop_ayushman_beneficiaries",
    idPrefix: "AYB",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "ayushman_id",
      "family_id",
      "scheme",
      "eligibility_status",
      "verification_payload",
      "status",
    ],
    numericColumns: commonNumericColumns,
    jsonColumns: ["verification_payload"],
  },
  "ayushman-packages": {
    key: "ayushman-packages",
    label: "Ayushman Packages",
    table:
      "clinical_interop_ayushman_packages",
    idPrefix: "AYP",
    uidColumn: "package_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "package_name",
      "coverage_amount",
      "specialty",
      "status",
    ],
    requiredColumns: ["package_name"],
    numericColumns: commonNumericColumns,
  },
  "ayushman-claims": {
    key: "ayushman-claims",
    label: "Ayushman Claims",
    table:
      "clinical_interop_ayushman_claims",
    idPrefix: "AYC",
    uidColumn: "claim_number",
    patientColumn: "patient_id",
    dateColumn: "submitted_date",
    statusColumn: "claim_status",
    createColumns: [
      "patient_id",
      "beneficiary_id",
      "package_id",
      "claim_amount",
      "approved_amount",
      "claim_status",
      "submitted_date",
      "paid_date",
      "provider_response",
    ],
    numericColumns: commonNumericColumns,
    dateColumns: commonDateColumns,
    jsonColumns: ["provider_response"],
  },
  "partner-labs": {
    key: "partner-labs",
    label: "External Lab Integration",
    table: "clinical_interop_partner_labs",
    idPrefix: "LAB",
    uidColumn: "lab_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "lab_name",
      "contact",
      "api_endpoint",
      "hl7_support",
      "fhir_support",
      "status",
    ],
    requiredColumns: ["lab_name"],
    booleanColumns: [
      "hl7_support",
      "fhir_support",
    ],
  },
  "partner-pharmacies": {
    key: "partner-pharmacies",
    label: "External Pharmacy Integration",
    table:
      "clinical_interop_partner_pharmacies",
    idPrefix: "PHX",
    uidColumn: "pharmacy_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "pharmacy_name",
      "license_number",
      "contact",
      "api_endpoint",
      "status",
    ],
    requiredColumns: ["pharmacy_name"],
  },
  "referral-network": {
    key: "referral-network",
    label: "Referral Hospital Network",
    table:
      "clinical_interop_referral_hospitals",
    idPrefix: "NET",
    uidColumn: "network_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "hospital_name",
      "location",
      "specialization",
      "abha_compatible",
      "api_endpoint",
      "status",
    ],
    requiredColumns: ["hospital_name"],
    booleanColumns: ["abha_compatible"],
    textAreaColumns: ["location"],
  },
  marketplace: {
    key: "marketplace",
    label: "Healthcare API Marketplace",
    table: "clinical_interop_api_consumers",
    idPrefix: "API",
    uidColumn: "consumer_key",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "consumer_name",
      "consumer_type",
      "allowed_scopes",
      "oauth_client_id",
      "status",
    ],
    requiredColumns: ["consumer_name"],
    jsonColumns: ["allowed_scopes"],
  },
  terminology: {
    key: "terminology",
    label: "Terminology Server",
    table:
      "clinical_interop_terminology_codes",
    idPrefix: "TERM",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "code_system",
      "code_value",
      "display_name",
      "version",
      "category",
      "status",
    ],
    requiredColumns: [
      "code_system",
      "code_value",
      "display_name",
    ],
  },
  "terminology-mappings": {
    key: "terminology-mappings",
    label: "Terminology Mappings",
    table:
      "clinical_interop_terminology_mappings",
    idPrefix: "TMAP",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "local_code",
      "local_display",
      "national_code_id",
      "fhir_system",
      "mapping_confidence",
      "status",
    ],
    requiredColumns: ["local_code"],
    numericColumns: commonNumericColumns,
  },
  mpi: {
    key: "mpi",
    label: "Master Patient Index",
    table: "clinical_interop_mpi_records",
    idPrefix: "MPI",
    uidColumn: "mpi_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "abha_profile_id",
      "uhid",
      "external_id",
      "government_id_reference",
      "insurance_id",
      "match_score",
      "duplicate_status",
      "status",
    ],
    numericColumns: commonNumericColumns,
  },
  security: {
    key: "security",
    label: "Security Audit",
    table:
      "clinical_interop_security_events",
    idPrefix: "SECAUD",
    dateColumn: "created_at",
    createColumns: [
      "event_type",
      "request_path",
      "request_payload",
      "response_payload",
      "user_id",
      "organization",
      "ip_address",
      "signature_status",
      "encryption_status",
    ],
    requiredColumns: ["event_type"],
    numericColumns: [
      ...commonNumericColumns,
      "user_id",
    ],
    jsonColumns: [
      "request_payload",
      "response_payload",
    ],
  },
};

export function getInteropModuleConfig(
  moduleKey: string
) {
  return interopModules[
    moduleKey as InteropModuleKey
  ];
}

export function normalizeInteropValue(
  config: InteropModuleConfig,
  column: string,
  value: unknown
) {
  if (value === undefined || value === "") {
    return null;
  }

  if (
    config.numericColumns?.includes(column)
  ) {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  if (
    config.booleanColumns?.includes(column)
  ) {
    return (
      value === true ||
      value === "true" ||
      value === "1" ||
      value === "on"
    );
  }

  if (config.jsonColumns?.includes(column)) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return column.includes("scopes") ||
          column.includes("shared") ||
          column === "document_payload"
          ? []
          : {};
      }
    }

    return value ?? {};
  }

  if (config.dateColumns?.includes(column)) {
    return String(value);
  }

  return String(value).trim();
}

export const interopDashboardModules =
  Object.values(interopModules);
