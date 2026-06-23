"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function SMTPSettingsPage() {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<any>({
      host: "",
      port: "",
      username: "",
      password: "",
      sender_email: "",
      sender_name: "",
    });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings =
    async () => {

      const response =
        await fetch(
          "/api/settings/smtp"
        );

      const data =
        await response.json();

      if (data) {
        setForm(data);
      }
    };

  const saveSettings =
    async () => {

      setLoading(true);

      await fetch(
        "/api/settings/smtp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(form),
        }
      );

      setLoading(false);

      toast.success(
        "SMTP Settings Saved"
      );
    };

  return (
    <Layout>

      <div className="space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow">

          <h1 className="text-4xl font-bold">
            SMTP Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Configure Email Notifications
          </p>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow">

          <div className="grid md:grid-cols-2 gap-5">

            <input
              placeholder="SMTP Host"
              value={form.host || ""}
              onChange={(e)=>
                setForm({
                  ...form,
                  host:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              placeholder="SMTP Port"
              value={form.port || ""}
              onChange={(e)=>
                setForm({
                  ...form,
                  port:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              placeholder="SMTP Username"
              value={form.username || ""}
              onChange={(e)=>
                setForm({
                  ...form,
                  username:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              type="password"
              placeholder="SMTP Password"
              value={form.password || ""}
              onChange={(e)=>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Sender Email"
              value={
                form.sender_email || ""
              }
              onChange={(e)=>
                setForm({
                  ...form,
                  sender_email:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Sender Name"
              value={
                form.sender_name || ""
              }
              onChange={(e)=>
                setForm({
                  ...form,
                  sender_name:
                    e.target.value,
                })
              }
              className="border rounded-xl p-4"
            />

          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="
              mt-8
              bg-blue-600
              text-white
              px-8
              py-3
              rounded-xl
            "
          >
            {
              loading
                ? "Saving..."
                : "Save Settings"
            }
          </button>

        </div>

      </div>

    </Layout>
  );
}
