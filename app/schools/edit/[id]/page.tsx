"use client";

import { useParams, useRouter } from "next/navigation";
import type {
  SyntheticEvent,
} from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";

type SchoolResponse = {
  school?: Record<string, unknown>;
};

const text = (value: unknown) =>
  String(value ?? "").trim();

function imageSrc(
  value: string,
  version?: number
) {
  const src = text(value);

  if (!src) {
    return "";
  }

  const normalized =
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
      ? src
      : `/${src}`;

  if (
    !version ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  return `${normalized}${normalized.includes("?") ? "&" : "?"}v=${version}`;
}

function preventBrokenImage(
  event: SyntheticEvent<HTMLImageElement>,
  setLogoError: (value: boolean) => void
) {
  event.currentTarget.style.display =
    "none";
  setLogoError(true);
}

export default function EditSchoolPage() {
  const params = useParams<{
    id: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [
    selectedLogoPreview,
    setSelectedLogoPreview,
  ] = useState("");
  const [logoError, setLogoError] =
    useState(false);
  const [logoVersion, setLogoVersion] =
    useState(Date.now());
  const [form, setForm] = useState({
    school_name: "",
    school_code: "",
    email: "",
    phone: "",
    address: "",
    principal_name: "",
    principal_contact: "",
    owner_name: "",
    owner_contact: "",
    website: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#04142E",
    secondary_color: "#D4AF37",
    recognition_number: "",
    recognition_authority: "",
    recognition_start_date: "",
    recognition_expiry_date: "",
    affiliation_number: "",
    affiliation_authority: "",
    affiliation_start_date: "",
    affiliation_expiry_date: "",
    subscription_plan: "BASIC",
    promotion_backlog_mode: "WARNING",
  });

  useEffect(() => {
    const loadSchool = async () => {
      try {
        const payload =
          await apiJson<SchoolResponse>(
            `/api/schools/${params?.id}`
          );
        const school =
          payload.school || {};

        setForm({
          school_name: text(
            school.school_name
          ),
          school_code: text(
            school.school_code
          ),
          email: text(school.email),
          phone: text(school.phone),
          address: text(
            school.address
          ),
          principal_name: text(
            school.principal_name
          ),
          principal_contact: text(
            school.principal_contact
          ),
          owner_name: text(
            school.owner_name
          ),
          owner_contact: text(
            school.owner_contact
          ),
          website: text(
            school.website
          ),
          city: text(school.city),
          state: text(school.state),
          country:
            text(school.country) ||
            "India",
          postal_code: text(
            school.postal_code
          ),
          logo_url:
            text(school.school_logo) ||
            text(school.logo_url),
          favicon_url:
            text(school.school_favicon) ||
            text(school.favicon_url),
          recognition_number: text(
            school.recognition_number
          ),
          recognition_authority: text(
            school.recognition_authority
          ),
          recognition_start_date: text(
            school.recognition_start_date
          ),
          recognition_expiry_date: text(
            school.recognition_expiry_date
          ),
          affiliation_number: text(
            school.affiliation_number
          ),
          affiliation_authority: text(
            school.affiliation_authority
          ),
          affiliation_start_date: text(
            school.affiliation_start_date
          ),
          affiliation_expiry_date: text(
            school.affiliation_expiry_date
          ),
          promotion_backlog_mode:
            String(
              school.settings &&
                typeof school.settings === "object"
                ? (school.settings as Record<string, unknown>).backlog_promotion_mode
                : ""
            ).toUpperCase() === "BLOCK"
              ? "BLOCK"
              : "WARNING",
          primary_color:
            text(school.primary_color) ||
            "#04142E",
          secondary_color:
            text(
              school.secondary_color
            ) || "#D4AF37",
          subscription_plan:
            text(
              school.subscription_plan
            ) || "BASIC",
        });
      } catch (error) {
        toast.error(
          errorMessage(
            error,
            "Failed to load school/college"
          )
        );
      } finally {
        setLoading(false);
      }
    };

    void loadSchool();
  }, [params?.id]);

  useEffect(() => {
    return () => {
      if (
        selectedLogoPreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          selectedLogoPreview
        );
      }
    };
  }, [selectedLogoPreview]);

  const setField = (
    key: keyof typeof form,
    value: string
  ) =>
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

  const uploadLogo = async (
    file?: File
  ) => {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setLogoError(false);

      if (
        selectedLogoPreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          selectedLogoPreview
        );
      }

      const localPreview =
        URL.createObjectURL(file);
      setSelectedLogoPreview(
        localPreview
      );

      const body = new FormData();
      body.append("file", file);

      const response = await fetch(
        "/api/schools/upload",
        {
          method: "POST",
          body,
        }
      );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Logo upload failed"
        );
      }

      const nextForm = {
        ...form,
        logo_url: payload.url,
        favicon_url: payload.url,
      };

      setForm((previous) => ({
        ...previous,
        logo_url: payload.url,
        favicon_url: payload.url,
      }));
      setLogoVersion(Date.now());

      await apiJson(
        `/api/schools/${params?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...nextForm,
            school_logo:
              nextForm.logo_url,
            school_favicon:
              nextForm.logo_url,
          }),
        }
      );

      await fetch("/api/switch-school", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          schoolId: params?.id,
        }),
      });

      window.dispatchEvent(
        new CustomEvent(
          "tottech-branding-updated",
          {
            detail: {
              logoUrl: payload.url,
            },
          }
        )
      );

      router.refresh();
      toast.success(
        "Logo uploaded and saved"
      );
    } catch (error) {
      toast.error(
        errorMessage(
          error,
          "Failed to upload logo"
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const saveSchool = async () => {
    try {
      setSaving(true);
      await apiJson(
        `/api/schools/${params?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            school_logo:
              form.logo_url,
            school_favicon:
              form.favicon_url ||
              form.logo_url,
          }),
        }
      );

      await fetch("/api/switch-school", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          schoolId: params?.id,
        }),
      });

      window.dispatchEvent(
        new CustomEvent(
          "tottech-branding-updated"
        )
      );

      toast.success(
        "School/College updated"
      );
      router.push(
        `/schools/${params?.id}`
      );
    } catch (error) {
      toast.error(
        errorMessage(
          error,
          "Failed to update school/college"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <main className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Edit School/College
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Update school/college name, address, contact details, and upload a school/college logo directly from PC or mobile.
          </p>
        </div>

        {loading ? (
          <section className="tt-card tt-card-pad">
            Loading school/college...
          </section>
        ) : (
          <section className="tt-card tt-card-pad">
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black uppercase text-slate-600">
                  School/College Logo
                </p>
                <div className="mt-4 grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {selectedLogoPreview ||
                  form.logo_url ? (
                    <img
                      src={imageSrc(
                        selectedLogoPreview ||
                          form.logo_url,
                        logoVersion
                      )}
                      alt="School/College logo preview"
                      onError={(event) =>
                        preventBrokenImage(
                          event,
                          setLogoError
                        )
                      }
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm font-bold text-slate-500">
                      No logo uploaded
                    </span>
                  )}
                  {logoError ? (
                    <span className="px-4 text-center text-sm font-black text-amber-700">
                      Uploaded logo file is not loading. Please choose the logo again.
                    </span>
                  ) : null}
                </div>
                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Upload Logo
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                    disabled={uploading}
                    onChange={(event) =>
                      uploadLogo(
                        event.target
                          .files?.[0]
                      )
                    }
                  />
                </label>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  PNG, JPG, WEBP, or SVG. Maximum size 2 MB.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Recognition Number"
                  value={form.recognition_number}
                  onChange={(value) =>
                    setField(
                      "recognition_number",
                      value
                    )
                  }
                />
                <Input
                  label="Recognition Authority"
                  value={form.recognition_authority}
                  onChange={(value) =>
                    setField(
                      "recognition_authority",
                      value
                    )
                  }
                />
                <Input
                  label="Recognition Start Date"
                  type="date"
                  value={
                    form.recognition_start_date
                  }
                  onChange={(value) =>
                    setField(
                      "recognition_start_date",
                      value
                    )
                  }
                />
                <Input
                  label="Recognition Expiry Date"
                  type="date"
                  value={
                    form.recognition_expiry_date
                  }
                  onChange={(value) =>
                    setField(
                      "recognition_expiry_date",
                      value
                    )
                  }
                />
                <Input
                  label="Affiliation Number"
                  value={form.affiliation_number}
                  onChange={(value) =>
                    setField(
                      "affiliation_number",
                      value
                    )
                  }
                />
                <Input
                  label="Affiliation Authority"
                  value={form.affiliation_authority}
                  onChange={(value) =>
                    setField(
                      "affiliation_authority",
                      value
                    )
                  }
                />
                <Input
                  label="Affiliation Start Date"
                  type="date"
                  value={
                    form.affiliation_start_date
                  }
                  onChange={(value) =>
                    setField(
                      "affiliation_start_date",
                      value
                    )
                  }
                />
                <Input
                  label="Affiliation Expiry Date"
                  type="date"
                  value={
                    form.affiliation_expiry_date
                  }
                  onChange={(value) =>
                    setField(
                      "affiliation_expiry_date",
                      value
                    )
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="School/College Name"
                  value={form.school_name}
                  onChange={(value) =>
                    setField(
                      "school_name",
                      value
                    )
                  }
                />
                <Input
                  label="School/College Code"
                  value={form.school_code}
                  disabled
                />
                <Input
                  label="Email"
                  value={form.email}
                  onChange={(value) =>
                    setField(
                      "email",
                      value
                    )
                  }
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(value) =>
                    setField(
                      "phone",
                      value
                    )
                  }
                />
                <label className="min-w-0 md:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Address
                  </span>
                  <textarea
                    className="input min-h-28"
                    value={form.address}
                    onChange={(event) =>
                      setField(
                        "address",
                        event.target.value
                      )
                    }
                  />
                </label>
                <Input
                  label="Principal Name"
                  value={
                    form.principal_name
                  }
                  onChange={(value) =>
                    setField(
                      "principal_name",
                      value
                    )
                  }
                />
                <Input
                  label="Principal Contact"
                  value={
                    form.principal_contact
                  }
                  onChange={(value) =>
                    setField(
                      "principal_contact",
                      value
                    )
                  }
                />
                <Input
                  label="Owner Name"
                  value={form.owner_name}
                  onChange={(value) =>
                    setField(
                      "owner_name",
                      value
                    )
                  }
                />
                <Input
                  label="Owner Contact"
                  value={form.owner_contact}
                  onChange={(value) =>
                    setField(
                      "owner_contact",
                      value
                    )
                  }
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(value) =>
                    setField("city", value)
                  }
                />
                <Input
                  label="State"
                  value={form.state}
                  onChange={(value) =>
                    setField("state", value)
                  }
                />
                <Input
                  label="Country"
                  value={form.country}
                  onChange={(value) =>
                    setField(
                      "country",
                      value
                    )
                  }
                />
                <Input
                  label="Postal Code"
                  value={form.postal_code}
                  onChange={(value) =>
                    setField(
                      "postal_code",
                      value
                    )
                  }
                />
                <Input
                  label="Website"
                  value={form.website}
                  onChange={(value) =>
                    setField(
                      "website",
                      value
                    )
                  }
                />
                <Input
                  label="Subscription Plan"
                  value={
                    form.subscription_plan
                  }
                  onChange={(value) =>
                    setField(
                      "subscription_plan",
                      value
                    )
                  }
                />
                <label className="min-w-0">
                  <span className="mb-1 block text-sm font-bold text-slate-700">
                    Backlog Promotion Mode
                  </span>
                  <select
                    className="input"
                    value={form.promotion_backlog_mode}
                    onChange={(event) =>
                      setField(
                        "promotion_backlog_mode",
                        event.target.value
                      )
                    }
                  >
                    <option value="WARNING">Warning</option>
                    <option value="BLOCK">Block</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={saveSchool}
                disabled={
                  saving || uploading
                }
                className="tt-button"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
              <button
                onClick={() =>
                  router.back()
                }
                className="tt-button-secondary"
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        className="input"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
      />
    </label>
  );
}
