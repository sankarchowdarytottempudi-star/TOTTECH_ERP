"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Crown,
  Edit3,
  Eye,
  GitBranch,
  Hospital,
  Power,
  PowerOff,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type HospitalPayload = {
  rows?: Row[];
  hospital?: Row;
  rawHospital?: Row;
  error?: string;
  details?: string;
};

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const initialForm = {
  id: "",
  hospital_name: "",
  hospital_code: "",
  logo_url: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  legal_name: "",
  gst_number: "",
  license_number: "",
  nabh_number: "",
  abha_client_id: "",
  abha_facility_id: "",
  timezone: "Asia/Kolkata",
  currency: "INR",
  status: "ACTIVE",
  primary_color: "#04142E",
  accent_color: "#D4AF37",
  plan_type: "STANDARD",
  start_date: "",
  end_date: "",
  maximum_users: "25",
  maximum_doctors: "10",
  maximum_branches: "1",
  owner_name: "",
  owner_email: "",
  owner_phone: "",
  owner_password: "",
  admin_name: "",
  admin_email: "",
  admin_phone: "",
  admin_password: "",
};

const asText = (value: unknown) =>
  value === null || value === undefined
    ? ""
    : String(value);

const asObject = (value: unknown) =>
  value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};

const hospitalLogoSrc = (value: unknown) => {
  const source = asText(value).trim();
  if (!source) return "";
  if (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("data:")
  ) {
    return source;
  }
  return source.startsWith("/") ? source : `/${source}`;
};

function HospitalLogo({
  src,
  name,
  className = "h-full w-full object-contain",
  fallbackClassName = "text-[#D4AF37]",
}: {
  src?: unknown;
  name: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const logo = hospitalLogoSrc(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logo]);

  if (!logo || failed) {
    return <Hospital className={fallbackClassName} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={`${name || "Hospital"} logo`}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

const fieldGroups = [
  {
    title: "Step 1: Hospital Details",
    fields: [
      ["hospital_name", "Hospital Name", "text", true],
      ["hospital_code", "Hospital Code", "text", false],
      ["email", "Email", "email", true],
      ["phone", "Phone", "text", true],
      ["address", "Address", "textarea", true],
      ["city", "City", "text", true],
      ["state", "State", "text", true],
      ["country", "Country", "text", true],
    ],
  },
  {
    title: "Step 2: Compliance & Go-Live",
    fields: [
      ["legal_name", "Legal Name", "text", false],
      ["gst_number", "GST Number", "text", false],
      ["license_number", "License / NABH Number", "text", false],
      ["nabh_number", "NABH Number", "text", false],
      ["abha_client_id", "ABHA Client ID", "text", false],
      ["abha_facility_id", "ABHA Facility ID", "text", false],
      ["timezone", "Timezone", "text", false],
      ["currency", "Currency", "text", false],
      ["status", "Status", "status", false],
      ["plan_type", "Plan Type", "select", false],
      ["start_date", "Plan Start Date", "date", false],
      ["end_date", "Plan End Date", "date", false],
      ["maximum_users", "Maximum Users", "number", false],
      ["maximum_doctors", "Maximum Doctors", "number", false],
      ["maximum_branches", "Maximum Branches", "number", false],
    ],
  },
  {
    title: "Step 3: Hospital Owner",
    fields: [
      ["owner_name", "Owner Name", "text", false],
      ["owner_email", "Owner Login Email", "email", false],
      ["owner_phone", "Owner Phone", "text", false],
      ["owner_password", "Owner Password", "password", false],
    ],
  },
  {
    title: "Step 4: Hospital Admin",
    fields: [
      ["admin_name", "Admin Name", "text", false],
      ["admin_email", "Admin Login Email", "email", false],
      ["admin_phone", "Admin Phone", "text", false],
      ["admin_password", "Admin Password", "password", false],
    ],
  },
] as const;

export default function PlatformHospitalsPage() {
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedHospital, setSelectedHospital] =
    useState<Row | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");
  const [localLogoPreview, setLocalLogoPreview] = useState("");
  const [traceMessage, setTraceMessage] =
    useState("");

  const previewName =
    form.hospital_name.trim() || "Hospital Name";
  const previewLogo =
    localLogoPreview || form.logo_url.trim();
  const previewInitials = useMemo(
    () =>
      previewName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0]?.toUpperCase())
        .join("") || "H",
    [previewName]
  );

  const update = (
    key: keyof typeof initialForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setFormErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    console.info("FORM_VALIDATION_STARTED");
    const nextErrors: FormErrors = {};
    const requiredFields: Array<
      keyof typeof initialForm
    > = [
      "hospital_name",
      "hospital_code",
      "logo_url",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "country",
    ];

    if (!form.id) {
      requiredFields.push(
        "owner_name",
        "owner_email",
        "admin_name",
        "admin_email"
      );
    }

    requiredFields.forEach((key) => {
      if (!form[key].trim()) {
        nextErrors[key] = "Required";
      }
    });
    if (logoUploading) {
      nextErrors.logo_url = "Logo is still uploading. Please wait.";
    } else if (!form.logo_url.trim() && localLogoPreview) {
      nextErrors.logo_url =
        logoUploadError || "Logo upload did not complete. Please select the logo again.";
    } else if (logoUploadError) {
      nextErrors.logo_url = logoUploadError;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    (
      [
        ["email", "Hospital email"],
        ["owner_email", "Owner email"],
        ["admin_email", "Admin email"],
      ] as const
    ).forEach(([key, label]) => {
      const value = form[key].trim();
      if (value && !emailPattern.test(value)) {
        nextErrors[key] = `${label} is invalid`;
      }
    });

    const missing = Object.entries(nextErrors).map(
      ([key, value]) => `${key}: ${value}`
    );
    console.info("FORM_VALIDATION_RESULT", {
      valid: missing.length === 0,
      errors: nextErrors,
      values: {
        hospitalName: form.hospital_name,
        hospitalCode: form.hospital_code,
        logoUrlPresent: Boolean(form.logo_url),
        localLogoPreviewPresent: Boolean(localLogoPreview),
        logoUploading,
        logoUploadError,
        ownerName: form.owner_name,
        ownerEmail: form.owner_email,
        adminName: form.admin_name,
        adminEmail: form.admin_email,
        phone: form.phone,
        address: form.address,
      },
    });
    setFormErrors(nextErrors);

    if (missing.length) {
      throw new Error(
        `Please complete the highlighted fields: ${missing.join(", ")}`
      );
    }

    console.info("FORM_VALIDATION_PASSED");
  };

  const uploadLogo = async (file: File | null) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalLogoPreview(objectUrl);
    setLogoUploadError("");
    setFormErrors((current) => {
      const next = { ...current };
      delete next.logo_url;
      return next;
    });
    setLogoUploading(true);
    setTraceMessage("Uploading hospital logo...");
    const body = new FormData();
    body.append("logo", file);
    try {
      console.info("LOGO_UPLOAD_STARTED", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      const response = await fetch(
        "/api/clinical/platform/hospitals/upload-logo",
        {
          method: "POST",
          body,
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to upload hospital logo");
      }
      console.info("LOGO_UPLOAD_COMPLETED", payload);
      const uploadedLogoUrl =
        asText(payload.logoUrl) ||
        asText(payload.logo_url) ||
        asText(payload.url) ||
        asText(payload.path);

      if (!uploadedLogoUrl) {
        throw new Error(
          "Logo upload completed but no public logo URL was returned."
        );
      }

      update("logo_url", uploadedLogoUrl);
      setLocalLogoPreview(uploadedLogoUrl);
      setLogoUploadError("");
      setTraceMessage("Logo uploaded successfully.");
      notify.success("Hospital logo uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload hospital logo";
      console.error("LOGO_UPLOAD_FAILED", error);
      setLogoUploadError(message);
      setFormErrors((current) => ({
        ...current,
        logo_url: message,
      }));
      setTraceMessage(message);
      notify.error(
        message
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const load = async (overrides?: {
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      console.info(
        "REGISTRY_REFRESH_STARTED",
        overrides || {
          search,
          status: statusFilter,
        }
      );
      const params = new URLSearchParams();
      const effectiveSearch =
        overrides?.search ?? search;
      const effectiveStatus =
        overrides?.status ?? statusFilter;
      if (effectiveSearch.trim()) {
        params?.set(
          "search",
          effectiveSearch.trim()
        );
      }
      if (effectiveStatus) {
        params?.set("status", effectiveStatus);
      }
      const response = await fetch(
        `/api/clinical/platform/hospitals?${params?.toString()}&ts=${Date.now()}`,
        {
          cache: "no-store",
        }
      );
      const responseText =
        await response.text();
      const payload =
        responseText.trim()
          ? (JSON.parse(
              responseText
            ) as HospitalPayload & {
              error?: string;
            })
          : ({ rows: [] } as HospitalPayload & {
              error?: string;
            });

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Failed to load hospitals"
        );
      }

      setRows(payload.rows || []);
      console.info(
        "REGISTRY_REFRESH_SUCCESS",
        {
          rows: (payload.rows || []).length,
          search: effectiveSearch,
          status: effectiveStatus,
        }
      );
      if (selectedHospital) {
        const next = (payload.rows || []).find(
          (row) => asText(row.id) === asText(selectedHospital.id)
        );
        setSelectedHospital(next || null);
      }
    } catch (error) {
      console.error(
        "REGISTRY_REFRESH_FAILED",
        error
      );
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to load hospitals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const formFromHospital = (row: Row) => {
    const branding = asObject(row.branding);
    const settings = asObject(row.settings);
    const subscription = asObject(settings.subscription);
    const abha = asObject(settings.abha_integration);
    const nabh = asObject(row.nabh_details);

    return {
      ...initialForm,
      id: asText(row.id),
      hospital_name: asText(row.hospital_name),
      hospital_code: asText(row.hospital_code),
      logo_url:
        asText(branding.logoUrl) ||
        asText(branding.logo_url),
      email: asText(row.email),
      phone: asText(row.phone),
      address: asText(row.address),
      city: asText(row.city),
      state: asText(row.state),
      country: asText(row.country) || "India",
      legal_name: asText(row.legal_name),
      gst_number: asText(row.gst_number),
      license_number: asText(row.license_number),
      nabh_number: asText(nabh.number),
      abha_client_id: asText(abha.client_id),
      abha_facility_id: asText(abha.facility_id),
      timezone: asText(settings.timezone) || "Asia/Kolkata",
      currency: asText(settings.currency) || "INR",
      status: asText(row.status) || "ACTIVE",
      primary_color: asText(branding.primaryColor) || "#04142E",
      accent_color: asText(branding.accentColor) || "#D4AF37",
      plan_type: asText(subscription.plan_type) || "STANDARD",
      start_date: asText(subscription.start_date).slice(0, 10),
      end_date: asText(subscription.end_date).slice(0, 10),
      maximum_users: asText(subscription.maximum_users) || "25",
      maximum_doctors: asText(subscription.maximum_doctors) || "10",
      maximum_branches: asText(subscription.maximum_branches) || "1",
    };
  };

  const startEdit = (row: Row) => {
    setSelectedHospital(row);
    setForm(formFromHospital(row));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(initialForm);
    setFormErrors({});
    setLocalLogoPreview("");
    setLogoUploadError("");
    setLogoUploading(false);
  };

  const handleCreateClick = () => {
    console.info("CREATE_BUTTON_CLICKED", {
      saving,
      loading,
      mode: form.id ? "edit" : "create",
      disabledReasons: {
        saving,
        loading,
        logoUploading,
      },
      formState: {
        hospitalName: form.hospital_name,
        hospitalCode: form.hospital_code,
        logoUrlPresent: Boolean(form.logo_url),
        localLogoPreviewPresent: Boolean(localLogoPreview),
        logoUploading,
        logoUploadError,
        ownerName: form.owner_name,
        ownerEmail: form.owner_email,
        adminName: form.admin_name,
        adminEmail: form.admin_email,
        phone: form.phone,
        address: form.address,
      },
    });

    if (saving) {
      setTraceMessage("Hospital save is already running...");
      return;
    }
    if (logoUploading) {
      setTraceMessage("Logo is still uploading. Please wait a moment.");
      setFormErrors((current) => ({
        ...current,
        logo_url: "Logo is still uploading. Please wait.",
      }));
      return;
    }

    void submit();
  };

  const submit = async () => {
    setSaving(true);
    setTraceMessage("Starting hospital save...");
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      45000
    );
    let succeeded = false;
    try {
      setTraceMessage("Validating hospital form...");
      validateForm();
      console.info("API_CALL_STARTED", {
        method: form.id ? "PATCH" : "POST",
        endpoint:
          "/api/clinical/platform/hospitals",
        payload: {
          ...form,
          owner_password: form.owner_password
            ? "[REDACTED]"
            : "",
          admin_password: form.admin_password
            ? "[REDACTED]"
            : "",
        },
      });
      setTraceMessage("Saving hospital to server...");
      if (!form.logo_url.trim()) {
        console.warn("CREATE_HOSPITAL_BLOCKED", {
          reason: "missing_logo_url",
          localLogoPreviewPresent: Boolean(localLogoPreview),
          logoUploadError,
        });
      }
      const response = await fetch(
        "/api/clinical/platform/hospitals",
        {
          method: form.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          signal: controller.signal,
        }
      );
      const responseText =
        await response.text();
      const payload = responseText.trim()
        ? JSON.parse(responseText)
        : {};
      console.info("API_RESPONSE_RECEIVED", {
        status: response.status,
        ok: response.ok,
        body: payload,
      });
      if (!response.ok) {
        throw new Error(
          payload.step ||
          payload.details ||
            payload.error ||
            "Failed to save hospital"
        );
      }

      const savedHospital =
        (payload as HospitalPayload).hospital ||
        (payload as HospitalPayload)
          .rawHospital;
      if (savedHospital?.id) {
        setRows((current) => {
          const withoutSaved =
            current.filter(
              (row) =>
                asText(row.id) !==
                asText(savedHospital.id)
            );

          return [
            savedHospital,
            ...withoutSaved,
          ];
        });
      }

      notify.success(
        form.id
          ? "Hospital changes saved"
          : "Hospital Created Successfully"
      );
      succeeded = true;
      setTraceMessage(
        "Hospital saved. Refreshing registry..."
      );
      setStatusFilter("ACTIVE");
      setSearch("");
      setForm(initialForm);
      setLocalLogoPreview("");
      setLogoUploadError("");
      setLogoUploading(false);
      setSelectedHospital(null);
      await load({
        status: "ACTIVE",
        search: "",
      });
      if (savedHospital?.id) {
        setRows((current) => {
          const exists = current.some(
            (row) =>
              asText(row.id) ===
              asText(savedHospital.id)
          );
          return exists
            ? current
            : [savedHospital, ...current];
        });
      }
      console.info(
        "REGISTRY_REFRESH_SUCCESS",
        {
          source: "post-save",
          hospital_id: asText(
            savedHospital?.id
          ),
        }
      );
    } catch (error) {
      console.error(
        "CREATE_HOSPITAL_FAILED",
        error
      );
      setTraceMessage(
        error instanceof DOMException &&
          error.name === "AbortError"
          ? "Hospital creation timed out. Please check backend logs and try again."
          : error instanceof Error
          ? error.message
          : "Failed to save hospital"
      );
      notify.error(
        error instanceof DOMException &&
          error.name === "AbortError"
          ? "Hospital creation timed out. Please check backend logs and try again."
          : error instanceof Error
          ? error.message
          : "Failed to save hospital"
      );
    } finally {
      window.clearTimeout(timeout);
      setSaving(false);
      if (succeeded) {
        window.setTimeout(() => {
          setTraceMessage("");
        }, 1500);
      }
    }
  };

  const updateStatus = async (
    row: Row,
    action: "ACTIVATE" | "DEACTIVATE"
  ) => {
    try {
      const response = await fetch(
        "/api/clinical/platform/hospitals",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: row.id,
            action,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to update hospital status");
      }
      notify.success(
        action === "ACTIVATE"
          ? "Hospital activated"
          : "Hospital deactivated"
      );
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to update hospital status"
      );
    }
  };

  const deleteHospital = async (row: Row) => {
    const confirmed = window.confirm(
      `Delete ${asText(row.hospital_name)}? This is a soft delete.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/clinical/platform/hospitals?id=${encodeURIComponent(asText(row.id))}`,
        {
          method: "DELETE",
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete hospital");
      }
      notify.success("Hospital deleted");
      if (asText(selectedHospital?.id) === asText(row.id)) {
        setSelectedHospital(null);
      }
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to delete hospital"
      );
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-[#D4AF37]/60 bg-[#04142E] p-6 text-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">
                Platform Super Admin
              </p>
              <h1 className="mt-3 text-3xl font-black md:text-5xl">
                White-label Hospital Onboarding
              </h1>
              <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-white/85 md:text-base">
                Create hospitals, attach their own logo and brand identity,
                create owner/admin users, provision the default branch and HMS
                clinic, and keep all operational records isolated by tenant,
                hospital and branch.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#D4AF37]/50 bg-white/10 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#D4AF37]" />
                <div>
                  <p className="text-xs font-black uppercase text-[#D4AF37]">
                    Branding Rule
                  </p>
                  <p className="text-sm font-bold text-white/90">
                    Login shows Tottempudi. After login, the assigned hospital
                    logo and name become the product identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9A6B00]">
                  Create Hospital
                </p>
                <h2 className="text-2xl font-black text-[#04142E]">
                  Tenant-ready hospital setup
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCreateClick}
                aria-disabled={saving}
                className={`relative z-10 inline-flex pointer-events-auto items-center gap-2 rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-white shadow transition hover:-translate-y-0.5 hover:bg-[#08214a] ${
                  saving ? "cursor-wait opacity-60" : "cursor-pointer"
                }`}
              >
                <Save
                  size={18}
                  className={saving ? "animate-pulse" : ""}
                />
                {saving
                  ? "Saving..."
                  : logoUploading
                    ? "Uploading logo..."
                  : form.id
                    ? "Save Changes"
                    : "Create Hospital"}
              </button>
              {form.id ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-black text-[#04142E] hover:border-[#D4AF37]"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              ) : null}
              {traceMessage ? (
                <div className="w-full rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#8a6500]">
                  {traceMessage}
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-6">
              <div className="rounded-[8px] border border-slate-200 p-4">
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#04142E]">
                  Hospital Logo Upload
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
                  <div className="grid h-40 w-full place-items-center overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
                    {previewLogo ? (
                      <HospitalLogo
                        src={previewLogo}
                        name={previewName}
                      />
                    ) : (
                      <span className="text-3xl font-black text-[#D4AF37]">
                        {previewInitials}
                      </span>
                    )}
                  </div>
                  <label>
                    <span className="text-xs font-black uppercase text-slate-600">
                      Browse Logo From PC or Mobile *
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={(event) => void uploadLogo(event.target.files?.[0] || null)}
                      className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold text-[#04142E] outline-none focus:border-[#D4AF37]"
                    />
                    {logoUploading ? (
                      <p className="mt-2 text-xs font-black text-[#8a6500]">
                        Uploading logo...
                      </p>
                    ) : null}
                    {form.logo_url ? (
                      <p className="mt-2 text-xs font-black text-emerald-700">
                        Logo uploaded successfully.
                      </p>
                    ) : null}
                    {formErrors.logo_url || logoUploadError ? (
                      <p className="mt-2 text-xs font-black text-red-600">
                        {formErrors.logo_url || logoUploadError}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      PNG, JPG, WEBP, or SVG. Maximum size 2 MB.
                    </p>
                  </label>
                </div>
              </div>
              {fieldGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[8px] border border-slate-200 p-4"
                >
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#04142E]">
                    {group.title}
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {group.fields.map(
                      ([key, label, type, required]) => {
                        const fieldKey =
                          key as keyof typeof initialForm;
                        const value = form[fieldKey];

                        if (type === "textarea") {
                          return (
                            <label
                              key={key}
                              className="md:col-span-2"
                            >
                              <span className="text-xs font-black uppercase text-slate-600">
                                {label}
                                {required ? " *" : ""}
                              </span>
                              <textarea
                                value={value}
                                onChange={(event) =>
                                  update(
                                    fieldKey,
                                    event.target.value
                                  )
                                }
                                rows={3}
                                className={`mt-1 w-full rounded-[8px] border px-3 py-3 text-sm font-semibold text-[#04142E] outline-none focus:border-[#D4AF37] ${
                                  formErrors[fieldKey]
                                    ? "border-red-400 bg-red-50"
                                    : "border-slate-300"
                                }`}
                              />
                              {formErrors[fieldKey] ? (
                                <p className="mt-1 text-xs font-black text-red-600">
                                  {formErrors[fieldKey]}
                                </p>
                              ) : null}
                            </label>
                          );
                        }

                        if (type === "select" || type === "status") {
                          return (
                            <label key={key}>
                              <span className="text-xs font-black uppercase text-slate-600">
                                {label}
                              </span>
                              <select
                                value={value}
                                onChange={(event) =>
                                  update(
                                    fieldKey,
                                    event.target.value
                                  )
                                }
                                className={`mt-1 w-full rounded-[8px] border px-3 py-3 text-sm font-semibold text-[#04142E] outline-none focus:border-[#D4AF37] ${
                                  formErrors[fieldKey]
                                    ? "border-red-400 bg-red-50"
                                    : "border-slate-300"
                                }`}
                              >
                                {type === "status" ? (
                                  <>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="STANDARD">
                                      Standard
                                    </option>
                                    <option value="PRO">
                                      Pro
                                    </option>
                                    <option value="ENTERPRISE">
                                      Enterprise
                                    </option>
                                    <option value="IVF_CENTER">
                                      IVF Center
                                    </option>
                                    <option value="HOSPITAL_CHAIN">
                                      Hospital Chain
                                    </option>
                                  </>
                                )}
                              </select>
                              {formErrors[fieldKey] ? (
                                <p className="mt-1 text-xs font-black text-red-600">
                                  {formErrors[fieldKey]}
                                </p>
                              ) : null}
                            </label>
                          );
                        }

                        return (
                          <label key={key}>
                            <span className="text-xs font-black uppercase text-slate-600">
                              {label}
                              {required ? " *" : ""}
                            </span>
                            <input
                              type={type}
                              value={value}
                              onChange={(event) =>
                                update(
                                  fieldKey,
                                  event.target.value
                                )
                              }
                              className={`mt-1 w-full rounded-[8px] border px-3 py-3 text-sm font-semibold text-[#04142E] outline-none focus:border-[#D4AF37] ${
                                formErrors[fieldKey]
                                  ? "border-red-400 bg-red-50"
                                  : "border-slate-300"
                              }`}
                            />
                            {formErrors[fieldKey] ? (
                              <p className="mt-1 text-xs font-black text-red-600">
                                {formErrors[fieldKey]}
                              </p>
                            ) : null}
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-5 text-white shadow-xl">
              <p
                className="text-xs font-black uppercase tracking-[0.14em]"
                style={{ color: "#D4AF37" }}
              >
                Live Brand Preview
              </p>
              <div className="mt-4 flex items-center gap-4 rounded-[8px] border border-white/15 bg-white/10 p-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-[#D4AF37]/50 bg-white">
                  {previewLogo ? (
                    <HospitalLogo
                      src={previewLogo}
                      name={previewName}
                    />
                  ) : (
                    <span className="text-2xl font-black text-[#D4AF37]">
                      {previewInitials}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className="break-words text-2xl font-black"
                    style={{ color: "#FFFFFF" }}
                  >
                    {previewName}
                  </p>
                  <p
                    className="text-xs font-black uppercase tracking-[0.12em]"
                    style={{ color: "#D4AF37" }}
                  >
                    Hospital Management
                  </p>
                  <p
                    className="mt-2 text-sm font-semibold leading-6"
                    style={{
                      color: "rgba(255,255,255,0.86)",
                    }}
                  >
                    This identity appears in the Clinical Services sidebar,
                    header and command centers after hospital users log in.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Default Branch", "Created"],
                  ["HMS Clinic", "Created"],
                  ["Tenant Isolation", "Enforced"],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-[8px] border border-white/20 bg-white/10 p-3"
                  >
                    <p
                      className="text-[11px] font-black uppercase"
                      style={{ color: "#D4AF37" }}
                    >
                      {title}
                    </p>
                    <p
                      className="mt-1 text-sm font-black"
                      style={{ color: "#FFFFFF" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9A6B00]">
                    Hospital Registry
                  </p>
                  <h2 className="text-2xl font-black text-[#04142E]">
                    Created Hospitals
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 text-[#04142E] hover:border-[#D4AF37]"
                  aria-label="Refresh hospitals"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
                <label className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A6B00]"
                  />
                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search hospital name, code, phone, or email..."
                    className="w-full rounded-[8px] border border-slate-300 py-3 pl-10 pr-3 text-sm font-semibold text-[#04142E] outline-none focus:border-[#D4AF37]"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-black text-[#04142E] outline-none focus:border-[#D4AF37]"
                >
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>

              <div className="mt-4 space-y-3">
                {loading ? (
                  <div className="rounded-[8px] border border-slate-200 p-4 text-sm font-bold text-slate-600">
                    Loading hospitals...
                  </div>
                ) : rows.length === 0 ? (
                  <div className="rounded-[8px] border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-600">
                    No hospitals created yet.
                  </div>
                ) : (
                  rows.map((row) => {
                    const branding = asObject(
                      row.branding
                    );
                    const settings = asObject(
                      row.settings
                    );
                    const subscription = asObject(
                      settings.subscription
                    );
                    const logo =
                      asText(branding.logoUrl) ||
                      asText(branding.logo_url);
                    const name =
                      asText(row.hospital_name) ||
                      asText(branding.name);

                    return (
                      <article
                        key={asText(row.id)}
                        className="rounded-[8px] border border-slate-200 p-4 transition hover:border-[#D4AF37] hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              setSelectedHospital(row)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setSelectedHospital(row);
                              }
                            }}
                            className="flex cursor-pointer gap-3"
                          >
                          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
                            <HospitalLogo
                              src={logo}
                              name={name}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="break-words text-lg font-black text-[#04142E]">
                                  {name}
                                </p>
                                <p className="break-words text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                                  {asText(row.hospital_code)}
                                </p>
                              </div>
                              <span className={`rounded-[8px] border px-3 py-1 text-xs font-black uppercase ${
                                asText(row.status) === "ACTIVE"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : asText(row.status) === "DELETED"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                              }`}>
                                {asText(row.status) || "ACTIVE"}
                              </span>
                            </div>
                            <p className="mt-2 break-words text-xs font-bold text-slate-600">
                              {asText(row.email) || "-"} | {asText(row.phone) || "-"}
                            </p>
                            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-3">
                              <span className="inline-flex items-center gap-2">
                                <Building2
                                  size={14}
                                  className="text-[#D4AF37]"
                                />
                                Branches:{" "}
                                {asText(row.branch_count) ||
                                  "0"}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Stethoscope
                                  size={14}
                                  className="text-[#D4AF37]"
                                />
                                Doctors:{" "}
                                {asText(row.doctor_count) ||
                                  "0"}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <UsersRound
                                  size={14}
                                  className="text-[#D4AF37]"
                                />
                                Staff:{" "}
                                {asText(row.staff_count) ||
                                  "0"}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Crown
                                  size={14}
                                  className="text-[#D4AF37]"
                                />
                                {asText(
                                  subscription.plan_type
                                ) || "STANDARD"}
                              </span>
                              <span>
                                Created: {asText(row.created_at).slice(0, 10)}
                              </span>
                            </div>
                          </div>
                          {asText(row.status) === "ACTIVE" ? (
                            <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" />
                          ) : null}
                          </div>
                          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHospital(row)
                              }
                              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHospital(row)
                              }
                              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
                            >
                              <Stethoscope size={14} />
                              Manage Doctors
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHospital(row)
                              }
                              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
                            >
                              <UsersRound size={14} />
                              Manage Staff
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHospital(row)
                              }
                              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
                            >
                              <GitBranch size={14} />
                              Manage Branches
                            </button>
                            {asText(row.status) === "ACTIVE" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  void updateStatus(row, "DEACTIVATE")
                                }
                                className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 hover:bg-amber-100"
                              >
                                <PowerOff size={14} />
                                Deactivate
                              </button>
                            ) : asText(row.status) !== "DELETED" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  void updateStatus(row, "ACTIVATE")
                                }
                                className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100"
                              >
                                <Power size={14} />
                                Activate
                              </button>
                            ) : null}
                            {asText(row.status) !== "DELETED" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  void deleteHospital(row)
                                }
                                className="inline-flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            {selectedHospital ? (
              <HospitalDetailsPanel
                row={selectedHospital}
                onClose={() => setSelectedHospital(null)}
                onEdit={() => startEdit(selectedHospital)}
              />
            ) : null}
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function asArray(value: unknown): Row[] {
  return Array.isArray(value) ? (value as Row[]) : [];
}

function HospitalDetailsPanel({
  row,
  onClose,
  onEdit,
}: {
  row: Row;
  onClose: () => void;
  onEdit: () => void;
}) {
  const branding = asObject(row.branding);
  const settings = asObject(row.settings);
  const subscription = asObject(settings.subscription);
  const abha = asObject(settings.abha_integration);
  const nabh = asObject(row.nabh_details);
  const logo =
    asText(branding.logoUrl) ||
    asText(branding.logo_url);
  const branches = asArray(row.branches);
  const doctors = asArray(row.doctors);
  const staff = asArray(row.staff);

  return (
    <section className="rounded-[8px] border border-[#D4AF37]/50 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
            <HospitalLogo
              src={logo}
              name={asText(row.hospital_name)}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9A6B00]">
              Hospital Details
            </p>
            <h2 className="mt-1 break-words text-2xl font-black text-[#04142E]">
              {asText(row.hospital_name)}
            </h2>
            <p className="mt-1 break-words text-sm font-bold text-slate-600">
              {asText(row.hospital_code)} | {asText(row.status)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-2 text-xs font-black text-white"
          >
            <Edit3 size={14} />
            Edit Hospital
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-4 py-2 text-xs font-black text-[#04142E] hover:border-[#D4AF37]"
          >
            <X size={14} />
            Close
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Detail label="Email" value={asText(row.email)} />
        <Detail label="Phone" value={asText(row.phone)} />
        <Detail label="GST" value={asText(row.gst_number)} />
        <Detail label="License" value={asText(row.license_number)} />
        <Detail label="NABH" value={asText(nabh.number)} />
        <Detail label="ABHA Client" value={asText(abha.client_id)} />
        <Detail label="ABHA Facility" value={asText(abha.facility_id)} />
        <Detail label="Timezone" value={asText(settings.timezone)} />
        <Detail label="Currency" value={asText(settings.currency)} />
        <Detail label="Plan" value={asText(subscription.plan_type)} />
        <Detail label="Created By" value={asText(row.created_by_name)} />
        <Detail label="Created Date" value={asText(row.created_at).slice(0, 10)} />
        <Detail
          label="Address"
          value={[
            asText(row.address),
            asText(row.city),
            asText(row.state),
            asText(row.country),
          ]
            .filter(Boolean)
            .join(", ")}
          wide
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <RelatedList
          icon={GitBranch}
          title={`Branches (${branches.length})`}
          rows={branches}
          primary={(item) => asText(item.branch_name)}
          secondary={(item) =>
            `${asText(item.branch_code)} | ${asText(item.phone) || "-"} | ${asText(item.status) || "ACTIVE"}`
          }
        />
        <RelatedList
          icon={Stethoscope}
          title={`Doctors (${doctors.length})`}
          rows={doctors}
          primary={(item) => asText(item.full_name)}
          secondary={(item) =>
            `${asText(item.specialization) || "-"} | ${asText(item.phone) || "-"} | ${asText(item.status) || "AVAILABLE"}`
          }
        />
        <RelatedList
          icon={UsersRound}
          title={`Staff (${staff.length})`}
          rows={staff}
          primary={(item) => asText(item.full_name)}
          secondary={(item) =>
            `${asText(item.email) || "-"} | ${asText(item.role) || asText(item.profile_name) || "-"}`
          }
        />
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-[8px] border border-slate-200 bg-slate-50 p-3 ${
        wide ? "md:col-span-2 xl:col-span-3" : ""
      }`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-[#04142E]">
        {value || "-"}
      </p>
    </div>
  );
}

function RelatedList({
  icon: Icon,
  title,
  rows,
  primary,
  secondary,
}: {
  icon: typeof Hospital;
  title: string;
  rows: Row[];
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-[#D4AF37]" />
        <h3 className="text-sm font-black text-[#04142E]">
          {title}
        </h3>
      </div>
      <div className="mt-3 space-y-2">
        {rows.length ? (
          rows.slice(0, 8).map((item, index) => (
            <div
              key={`${primary(item)}-${index}`}
              className="rounded-[8px] border border-slate-100 bg-slate-50 p-3"
            >
              <p className="break-words text-sm font-black text-[#04142E]">
                {primary(item) || "-"}
              </p>
              <p className="mt-1 break-words text-xs font-bold text-slate-600">
                {secondary(item) || "-"}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-[8px] border border-dashed border-slate-200 p-3 text-xs font-bold text-slate-500">
            No records yet.
          </p>
        )}
      </div>
    </div>
  );
}
