"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import { notify } from "@/lib/notify";

export default function AISettingsPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      enable_ai: true,
      enable_parent_advice: true,
      enable_teacher_advice: true,
      passing_percentage: 35,
    });

  useEffect(() => {
    void fetch("/api/school-context")
      .then((response) => response.json())
      .then((context) => {
        const allowed =
          context?.effectiveModuleAccess?.AI !== false;

        if (!allowed) {
          router.replace(
            "/module-not-licensed?module=AI"
          );
        }
      })
      .catch(() => {
        router.replace(
          "/module-not-licensed?module=AI"
        );
      });
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const response =
        await fetch(
          "/api/settings/ai"
        );

      const data =
        await response.json();

      if (data) {
        setForm({
          enable_ai:
            data.enable_ai ?? true,

          enable_parent_advice:
            data.enable_parent_advice ?? true,

          enable_teacher_advice:
            data.enable_teacher_advice ?? true,

          passing_percentage:
            data.passing_percentage ?? 35,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveSettings =
    async () => {

      setLoading(true);

      try {

        await fetch(
          "/api/settings/ai",
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

        notify.success(
          "AI Settings Saved"
        );

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

  return (
    <Layout>

      <div className="space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow">

          <h1 className="text-4xl font-bold">
            AI Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Configure AI Analysis &
            Academic Recommendations
          </p>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow space-y-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.enable_ai}
              onChange={(e) =>
                setForm({
                  ...form,
                  enable_ai:
                    e.target.checked,
                })
              }
            />

            Enable AI Analysis

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                form.enable_parent_advice
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  enable_parent_advice:
                    e.target.checked,
                })
              }
            />

            Enable Parent Advice

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                form.enable_teacher_advice
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  enable_teacher_advice:
                    e.target.checked,
                })
              }
            />

            Enable Teacher Advice

          </label>

          <div>

            <label className="block mb-2 font-semibold">
              Passing Percentage
            </label>

            <input
              type="number"
              value={
                form.passing_percentage
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  passing_percentage:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="
                border
                rounded-xl
                p-4
                w-full
              "
            />

          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="
              bg-purple-600
              text-white
              px-8
              py-3
              rounded-xl
            "
          >
            {loading
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

      </div>

    </Layout>
  );
}
