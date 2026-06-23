"use client";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

type FeeCategory = {
  id: number;
  fee_name: string;
  fee_code?: string | null;
  amount?: string | number | null;
  frequency?: string | null;
  description?: string | null;
};

const initialForm = {
  id: "",
  fee_name: "",
  fee_code: "",
  amount: "",
  frequency: "ANNUAL",
  description: "",
};

export default function FeesPage() {
  const [categories, setCategories] =
    useState<FeeCategory[]>([]);
  const [form, setForm] =
    useState(initialForm);
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const rows =
        await apiJson<FeeCategory[]>(
          "/api/fee-categories"
        );
      setCategories(
        Array.isArray(rows) ? rows : []
      );
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to load fee structures"
        )
      );
    }
  };

  const saveCategory = async () => {
    try {
      setSaving(true);
      await apiJson("/api/fee-categories", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      notify.success(
        form.id
          ? "Fee structure updated"
          : "Fee structure created"
      );
      setForm(initialForm);
      loadCategories();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to save fee structure"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (
    category: FeeCategory
  ) => {
    if (
      !confirm(
        `Delete ${category.fee_name}?`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/fee-categories?id=${category.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "Fee structure deleted"
      );
      loadCategories();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete fee structure"
        )
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">
            Fee Structures
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and maintain school/college fee categories used for invoice generation.
          </p>
        </div>

        <div className="tt-card tt-card-pad">
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-5
            "
          >
            <Input
              label="Fee Name"
              value={form.fee_name}
              onChange={(value) =>
                setForm({
                  ...form,
                  fee_name: value,
                })
              }
            />
            <Input
              label="Fee Code"
              value={form.fee_code}
              onChange={(value) =>
                setForm({
                  ...form,
                  fee_code: value,
                })
              }
            />
            <Input
              label="Amount"
              value={form.amount}
              onChange={(value) =>
                setForm({
                  ...form,
                  amount: value,
                })
              }
            />
            <label className="min-w-0">
              <span className="mb-1 block text-sm font-bold text-slate-700">
                Frequency
              </span>
              <select
                className="input"
                value={form.frequency}
                onChange={(event) =>
                  setForm({
                    ...form,
                    frequency:
                      event.target.value,
                  })
                }
              >
                <option value="ANNUAL">
                  Annual
                </option>
                <option value="TERM">
                  Term
                </option>
                <option value="MONTHLY">
                  Monthly
                </option>
                <option value="ONE_TIME">
                  One Time
                </option>
              </select>
            </label>
            <Input
              label="Description"
              value={form.description}
              onChange={(value) =>
                setForm({
                  ...form,
                  description: value,
                })
              }
            />
          </div>

          <button
            onClick={saveCategory}
            disabled={saving}
            className="tt-button mt-5 inline-flex items-center gap-2"
          >
            {form.id ? (
              <Pencil size={17} />
            ) : (
              <Plus size={17} />
            )}
            {saving
              ? "Saving..."
              : form.id
              ? "Update Fee"
              : "Create Fee"}
          </button>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {categories.map((category) => (
            <article
              key={category.id}
              className="tt-card tt-card-pad"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {category.fee_name}
                  </h2>
                  <p className="text-sm font-semibold text-amber-700">
                    {category.fee_code ||
                      "No code"}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-black text-amber-800">
                  ₹
                  {Number(
                    category.amount || 0
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {category.frequency ||
                  "-"}
              </p>
              <p className="mt-2 min-h-10 text-sm text-slate-600">
                {category.description ||
                  "No description"}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    setForm({
                      id: String(
                        category.id
                      ),
                      fee_name:
                        category.fee_name ||
                        "",
                      fee_code:
                        category.fee_code ||
                        "",
                      amount: String(
                        category.amount ||
                          ""
                      ),
                      frequency:
                        category.frequency ||
                        "ANNUAL",
                      description:
                        category.description ||
                        "",
                    })
                  }
                  className="tt-button-secondary inline-flex items-center justify-center gap-2"
                >
                  <Pencil size={15} />
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteCategory(
                      category
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-red-700
                  "
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        className="input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}
