"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function FeeCategoriesPage() {
  const [categories, setCategories] =
    useState<any[]>([]);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [feeName, setFeeName] =
    useState("");

  const [feeCode, setFeeCode] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [frequency, setFrequency] =
    useState("YEARLY");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response =
        await fetch(
          "/api/fee-categories"
        );

      const data =
        await response.json();

      setCategories(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const saveCategory =
    async () => {
      try {

        if (editId) {

          await fetch(
            "/api/fee-categories",
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                id: editId,
                fee_name: feeName,
                fee_code: feeCode,
                amount,
                frequency,
              }),
            }
          );

        } else {

          await fetch(
            "/api/fee-categories",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                fee_name: feeName,
                fee_code: feeCode,
                amount,
                frequency,
              }),
            }
          );

        }

        resetForm();

        loadData();

      } catch (error) {

        console.error(error);

        toast.success(
          "Failed to Save"
        );
      }
    };

  const editCategory = (
    category: any
  ) => {

    setEditId(category.id);

    setFeeName(
      category.fee_name || ""
    );

    setFeeCode(
      category.fee_code || ""
    );

    setAmount(
      String(
        category.amount || ""
      )
    );

    setFrequency(
      category.frequency ||
        "YEARLY"
    );
  };

  const deleteCategory =
    async (id: number) => {

      if (
        !confirm(
          "Delete this category?"
        )
      )
        return;

      try {

        await fetch(
          `/api/fee-categories?id=${id}`,
          {
            method: "DELETE",
          }
        );

        loadData();

      } catch (error) {

        console.error(error);

        toast.success(
          "Delete Failed"
        );
      }
    };

  const resetForm = () => {

    setEditId(null);

    setFeeName("");

    setFeeCode("");

    setAmount("");

    setFrequency("YEARLY");
  };

  return (
    <Layout>

      <div className="space-y-10">

        {/* Form */}

        <div className="bg-white rounded-3xl p-10 shadow">

          <h1 className="text-4xl font-bold mb-8">
            Fee Categories
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <input
              className="border p-4 rounded-xl"
              placeholder="Fee Name"
              value={feeName}
              onChange={(e) =>
                setFeeName(
                  e.target.value
                )
              }
            />

            <input
              className="border p-4 rounded-xl"
              placeholder="Fee Code"
              value={feeCode}
              onChange={(e) =>
                setFeeCode(
                  e.target.value
                )
              }
            />

            <input
              className="border p-4 rounded-xl"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />

            <select
              className="border p-4 rounded-xl"
              value={frequency}
              onChange={(e) =>
                setFrequency(
                  e.target.value
                )
              }
            >
              <option value="YEARLY">
                YEARLY
              </option>

              <option value="MONTHLY">
                MONTHLY
              </option>

              <option value="ONE_TIME">
                ONE_TIME
              </option>

            </select>

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={
                saveCategory
              }
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold"
            >
              {editId
                ? "Update Category"
                : "Save Category"}
            </button>

            {editId && (

              <button
                onClick={
                  resetForm
                }
                className="px-6 py-3 bg-slate-500 text-white rounded-xl font-semibold"
              >
                Cancel
              </button>

            )}

          </div>

        </div>

        {/* Grid */}

        <div className="bg-white rounded-3xl p-10 shadow">

          <h2 className="text-3xl font-bold mb-6">
            Existing Categories
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  ID
                </th>

                <th className="text-left py-3">
                  Fee Name
                </th>

                <th className="text-left py-3">
                  Fee Code
                </th>

                <th className="text-left py-3">
                  Amount
                </th>

                <th className="text-left py-3">
                  Frequency
                </th>

                <th className="text-left py-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {categories.map(
                (
                  category: any
                ) => (

                  <tr
                    key={
                      category.id
                    }
                    className="border-b"
                  >

                    <td className="py-3">
                      {
                        category.id
                      }
                    </td>

                    <td className="py-3">
                      {
                        category.fee_name
                      }
                    </td>

                    <td className="py-3">
                      {
                        category.fee_code
                      }
                    </td>

                    <td className="py-3">
                      {
                        category.amount
                      }
                    </td>

                    <td className="py-3">
                      {
                        category.frequency
                      }
                    </td>

                    <td className="py-3 space-x-2">

                      <button
                        onClick={() =>
                          editCategory(
                            category
                          )
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCategory(
                            category.id
                          )
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}
