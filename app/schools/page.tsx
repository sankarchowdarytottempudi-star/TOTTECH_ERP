"use client";
import Link from "next/link";
import type {
  SyntheticEvent,
} from "react";
import toast from "react-hot-toast";
import {
  useEffect,
  useState,
} from "react";
import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";

type School = {
  id: number;
  school_name?: string | null;
  school_code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  principal_name?: string | null;
  school_logo?: string | null;
  logo_url?: string | null;
  is_active?: boolean | null;
};

function imageSrc(value?: string | null) {
  const src = String(value || "").trim();

  if (!src) {
    return "/images/logo.png";
  }

  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  return `/${src}`;
}

function fallbackLogo(
  event: SyntheticEvent<HTMLImageElement>
) {
  const image = event.currentTarget;

  if (
    image.src.endsWith(
      "/images/logo.png"
    )
  ) {
    return;
  }

  image.src = "/images/logo.png";
}

export default function SchoolsPage() {
  const [schools, setSchools] =
    useState<School[]>([]);
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
    ai_branding_name: "",
    subscription_plan: "BASIC",
  });
  const [saving, setSaving] =
    useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [loadingSchools, setLoadingSchools] =
    useState(true);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoadingSchools(true);
      const payload =
        await apiJson<School[]>(
          "/api/schools"
        );
      setSchools(
        Array.isArray(payload)
          ? payload
          : []
      );
    } catch (error) {
      toast.error(
        errorMessage(
          error,
          "Failed to load schools/colleges"
        )
      );
    } finally {
      setLoadingSchools(false);
    }
  };

  const uploadLogo = async (
    file?: File
  ) => {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
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

      setForm((previous) => ({
        ...previous,
        logo_url: payload.url,
        favicon_url:
          previous.favicon_url ||
          payload.url,
      }));
      toast.success(
        "Logo uploaded"
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
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      await apiJson("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      toast.success("School/College Created Successfully");
      await loadSchools();
      setForm({
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
        ai_branding_name: "",
        subscription_plan: "BASIC",
      });
    } catch (error) {
      toast.error(
        errorMessage(
          error,
          "Failed to create school/college"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="text-4xl font-black mb-8">
          Add School/College
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <input
            className="input"
            placeholder="School/College Name"
            value={form.school_name}
            onChange={(e) =>
              setForm({
                ...form,
                school_name: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="School/College Code"
            value={form.school_code}
            onChange={(e) =>
              setForm({
                ...form,
                school_code: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <textarea
            className="input"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Principal Name"
            value={form.principal_name}
            onChange={(e) =>
              setForm({
                ...form,
                principal_name: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Principal Contact"
            value={form.principal_contact}
            onChange={(e) =>
              setForm({
                ...form,
                principal_contact:
                  e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Owner Name"
            value={form.owner_name}
            onChange={(e) =>
              setForm({
                ...form,
                owner_name: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Owner Contact"
            value={form.owner_contact}
            onChange={(e) =>
              setForm({
                ...form,
                owner_contact:
                  e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Website"
            value={form.website}
            onChange={(e) =>
              setForm({
                ...form,
                website: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Country"
            value={form.country}
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Postal Code"
            value={form.postal_code}
            onChange={(e) =>
              setForm({
                ...form,
                postal_code: e.target.value,
              })
            }
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
              <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                {form.logo_url ? (
                  <img
                    src={imageSrc(form.logo_url)}
                    alt="School/College logo preview"
                    onError={fallbackLogo}
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <span className="px-4 text-center text-sm font-bold text-slate-500">
                    Upload school/college logo
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-black uppercase text-slate-700">
                  School/College Logo
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Browse from PC or mobile. No URL/link required.
                </p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={uploading}
                  className="mt-4 block w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                  onChange={(event) =>
                    uploadLogo(
                      event.target.files?.[0]
                    )
                  }
                />
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  PNG, JPG, WEBP, or SVG. Maximum size 2 MB.
                </p>
              </div>
            </div>
          </div>

          <input
            className="input"
            placeholder="Favicon URL"
            value={form.favicon_url}
            onChange={(e) =>
              setForm({
                ...form,
                favicon_url: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Recognition Number"
            value={form.recognition_number}
            onChange={(e) =>
              setForm({
                ...form,
                recognition_number: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Recognition Authority"
            value={form.recognition_authority}
            onChange={(e) =>
              setForm({
                ...form,
                recognition_authority: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="date"
            placeholder="Recognition Start Date"
            value={form.recognition_start_date}
            onChange={(e) =>
              setForm({
                ...form,
                recognition_start_date: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="date"
            placeholder="Recognition Expiry Date"
            value={form.recognition_expiry_date}
            onChange={(e) =>
              setForm({
                ...form,
                recognition_expiry_date: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Affiliation Number"
            value={form.affiliation_number}
            onChange={(e) =>
              setForm({
                ...form,
                affiliation_number: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Affiliation Authority"
            value={form.affiliation_authority}
            onChange={(e) =>
              setForm({
                ...form,
                affiliation_authority: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="date"
            placeholder="Affiliation Start Date"
            value={form.affiliation_start_date}
            onChange={(e) =>
              setForm({
                ...form,
                affiliation_start_date: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="date"
            placeholder="Affiliation Expiry Date"
            value={form.affiliation_expiry_date}
            onChange={(e) =>
              setForm({
                ...form,
                affiliation_expiry_date: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Primary Color"
            value={form.primary_color}
            onChange={(e) =>
              setForm({
                ...form,
                primary_color:
                  e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Secondary Color"
            value={form.secondary_color}
            onChange={(e) =>
              setForm({
                ...form,
                secondary_color:
                  e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="School/College Assistant Name"
            value={form.ai_branding_name}
            onChange={(e) =>
              setForm({
                ...form,
                ai_branding_name:
                  e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Subscription Plan"
            value={form.subscription_plan}
            onChange={(e) =>
              setForm({
                ...form,
                subscription_plan:
                  e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={saveSchool}
          disabled={saving}
          className="mt-8 rounded-xl bg-slate-950 px-8 py-4 font-black text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save School/College"}
        </button>

      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">
              Existing Schools/Colleges
            </p>
            <h2 className="text-3xl font-black text-slate-950">
              Manage Schools/Colleges
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Edit school/college name, address, contact details, and upload/update logo from device.
            </p>
          </div>
          <button
            onClick={loadSchools}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-sm"
          >
            Refresh
          </button>
        </div>

        {loadingSchools ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 font-bold text-slate-600">
            Loading schools/colleges...
          </div>
        ) : schools.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {schools.map((school) => {
              const logo =
                school.school_logo ||
                school.logo_url ||
                "/images/logo.png";

              return (
                <article
                  key={school.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={imageSrc(logo)}
                        alt={`${school.school_name || "School/College"} logo`}
                        onError={fallbackLogo}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-black text-slate-950">
                        {school.school_name ||
                          `School ${school.id}`}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-amber-700">
                        {school.school_code ||
                          "-"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-600">
                        {school.address ||
                          "No address saved"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                    <Info
                      label="Phone"
                      value={
                        school.phone || "-"
                      }
                    />
                    <Info
                      label="Principal"
                      value={
                        school.principal_name ||
                        "-"
                      }
                    />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/schools/${school.id}`}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-black text-slate-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/schools/edit/${school.id}`}
                      className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-black text-amber-100"
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 font-bold text-slate-600">
            No schools/colleges found.
          </div>
        )}
      </section>
      </div>
    </Layout>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}
