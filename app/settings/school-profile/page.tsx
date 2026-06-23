"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function SchoolProfilePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    school_name: "",
    school_code: "",
    principal_name: "",
    academic_year: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#04142E",
    secondary_color: "#D4AF37",
    principal_contact: "",
    owner_name: "",
    owner_contact: "",
    subscription_plan: "BASIC",
    subscription_status: "ACTIVE",
    ai_branding_name: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        "/api/settings/school-profile"
      );

      const data = await response.json();

      if (data) {
        setForm({
          school_name:
            data.school_name || "",
          school_code:
            data.school_code || "",
          principal_name:
            data.principal_name || "",
          academic_year:
            data.academic_year || "",
          email:
            data.email || "",
          phone:
            data.phone || "",
          website:
            data.website || "",
          address:
            data.address || "",
          city:
            data.city || "",
          state:
            data.state || "",
          country:
            data.country || "",
          postal_code:
            data.postal_code || "",
          logo_url:
            data.school_logo ||
            data.logo_url ||
            "",
          favicon_url:
            data.school_favicon ||
            data.favicon_url ||
            "",
          primary_color:
            data.primary_color ||
            "#04142E",
          secondary_color:
            data.secondary_color ||
            "#D4AF37",
          principal_contact:
            data.principal_contact ||
            "",
          owner_name:
            data.owner_name || "",
          owner_contact:
            data.owner_contact ||
            "",
          subscription_plan:
            data.subscription_plan ||
            "BASIC",
          subscription_status:
            data.subscription_status ||
            "ACTIVE",
          ai_branding_name:
            data.ai_branding_name ||
            "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/settings/school-profile",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const data =
          await response.json().catch(
            () => ({})
          );
        throw new Error(
          data.error ||
            "Failed to save school/college branding."
        );
      }

      toast.success(
        "School/College branding saved successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save school/college branding."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow">
          <h1 className="text-4xl font-bold">
            School/College Branding
          </h1>

          <p className="text-gray-500 mt-2">
            Manage the school/college identity shown after login
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              placeholder="School/College Name"
              value={form.school_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  school_name:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="School/College Code"
              value={form.school_code}
              readOnly
              className="border rounded-xl p-4 bg-slate-100 text-slate-500"
            />

            <input
              type="text"
              placeholder="Principal Name"
              value={form.principal_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  principal_name:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Academic Year"
              value={form.academic_year}
              onChange={(e) =>
                setForm({
                  ...form,
                  academic_year:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Website"
              value={form.website}
              onChange={(e) =>
                setForm({
                  ...form,
                  website:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="School/College Logo URL"
              value={form.logo_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  logo_url:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Favicon URL"
              value={form.favicon_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  favicon_url:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Primary Color"
              value={form.primary_color}
              onChange={(e) =>
                setForm({
                  ...form,
                  primary_color:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Secondary Color"
              value={form.secondary_color}
              onChange={(e) =>
                setForm({
                  ...form,
                  secondary_color:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  state:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Country"
              value={form.country}
              onChange={(e) =>
                setForm({
                  ...form,
                  country:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={form.postal_code}
              onChange={(e) =>
                setForm({
                  ...form,
                  postal_code:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Principal Contact"
              value={form.principal_contact}
              onChange={(e) =>
                setForm({
                  ...form,
                  principal_contact:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Owner Name"
              value={form.owner_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  owner_name:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Owner Contact"
              value={form.owner_contact}
              onChange={(e) =>
                setForm({
                  ...form,
                  owner_contact:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="School/College Assistant Name"
              value={form.ai_branding_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  ai_branding_name:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

          </div>

          <textarea
            placeholder="School/College Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
            className="
              border
              rounded-xl
              p-4
              w-full
              mt-5
              h-32
            "
          />

          <div className="flex gap-4 mt-8">

            <button
              onClick={saveProfile}
              disabled={loading}
              className="
                bg-blue-600
                text-white
                px-8
                py-3
                rounded-xl
              "
            >
              {loading
                ? "Saving..."
                : "Save Profile"}
            </button>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                bg-gray-200
                px-8
                py-3
                rounded-xl
              "
            >
              Reset
            </button>

          </div>

        </div>

      </div>
    </Layout>
  );
}
