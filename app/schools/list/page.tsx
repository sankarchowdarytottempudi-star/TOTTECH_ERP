"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  canManageRecord,
} from "@/lib/access-control";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";

export default function SchoolListPage() {

  const [schools, setSchools] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");
  const [role, setRole] =
    useState("");

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "erpUser"
        );
      const user = stored
        ? JSON.parse(stored)
        : null;
      setRole(user?.role || "");
    } catch {
      setRole("");
    }

    loadSchools();
  }, []);

  const loadSchools =
    async () => {

      try {

        const response =
          await fetch("/api/schools");

        const data =
          await response.json();

        setSchools(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const filteredSchools =
    schools.filter(
      (school:any) => {

        const text = `
          ${school.school_name || ""}
          ${school.school_code || ""}
          ${school.principal_name || ""}
          ${school.email || ""}
          ${school.phone || ""}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      }
    );
  const canDeleteSchool =
    canManageRecord(
      role,
      "school",
      "delete"
    );
  const canEditSchool =
    canManageRecord(
      role,
      "school",
      "update"
    );

  const deleteSchool = async (
    school: any
  ) => {
    if (
      !confirm(
        `Delete ${school.school_name}? This is only allowed for Super Admin.`
      )
    ) {
      return;
    }

    try {
      await apiJson(
        `/api/schools/${school.id}`,
        {
          method: "DELETE",
        }
      );
      notify.success(
        "School/College deleted"
      );
      loadSchools();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Failed to delete school/college"
        )
      );
    }
  };
  const activeSchools =
    schools.filter(
      (school: any) =>
        school.is_active
    ).length;
  const campusHealth =
    schools.length
      ? Math.round(
          (activeSchools /
            schools.length) *
            100
        )
      : 0;

  return (

    <Layout>

      <div className="space-y-6">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          <div>

            <h1 className="text-4xl md:text-5xl font-black">
              Schools/Colleges
            </h1>

            <p className="text-slate-500">
              School/College Intelligence Directory
            </p>

          </div>

          <Link
            href="/schools"
            className="
              px-6
              py-3
              bg-slate-950
              text-amber-100
              rounded-lg
              font-black
              text-center
            "
          >
            + Add School/College
          </Link>

        </div>

        {/* Search */}

        <div className="tt-card p-5">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search School/College"
            className="
              w-full
              input
            "
          />

        </div>

        {/* Summary Cards */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          <SummaryCard
            label="Total Schools/Colleges"
            value={schools.length}
          />

          <SummaryCard
            label="Active Schools/Colleges"
            value={activeSchools}
          />

          <SummaryCard
            label="Plans"
            value={
              new Set(
                schools.map(
                  (s:any) =>
                    s.subscription_plan
                )
              ).size
            }
          />

          <SummaryCard
            label="Campus Health"
            value={campusHealth}
            suffix="%"
          />

        </div>

        {/* Desktop Table */}

        <div
          className="
            hidden
            lg:block
            tt-card
            overflow-x-auto
          "
        >

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  School/College
                </th>

                <th className="p-4 text-left">
                  Code
                </th>

                <th className="p-4 text-left">
                  Principal
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSchools.map(
                (school:any) => (

                  <tr
                    key={school.id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {school.school_name}
                    </td>

                    <td className="p-4">
                      {school.school_code}
                    </td>

                    <td className="p-4">
                      {school.principal_name}
                    </td>

                    <td className="p-4">
                      {school.phone}
                    </td>

                    <td className="p-4">

                      <span
                        className={
                          school.is_active
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >
                        {
                          school.is_active
                            ? "ACTIVE"
                            : "INACTIVE"
                        }
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/schools/${school.id}`}
                          className="
                            rounded-lg
                            bg-slate-950
                            px-4
                            py-2
                            font-black
                            text-amber-100
                          "
                        >
                          View
                        </Link>
                        {canEditSchool && (
                          <Link
                            href={`/schools/edit/${school.id}`}
                            className="
                              rounded-lg
                              border
                              border-amber-200
                              bg-amber-50
                              px-4
                              py-2
                              font-black
                              text-amber-900
                            "
                          >
                            Edit
                          </Link>
                        )}
                        {canDeleteSchool && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteSchool(
                                school
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              px-4
                              py-2
                              font-black
                              text-red-700
                            "
                          >
                            Delete
                          </button>
                        )}
                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* Mobile Cards */}

        <div
          className="
            lg:hidden
            space-y-4
          "
        >

          {filteredSchools.map(
            (school:any) => (

              <div
                key={school.id}
                className="
                  tt-card
                  tt-card-pad
                "
              >

                <div className="flex justify-between">

                  <div>

                    <h3 className="font-bold text-lg">
                      {school.school_name}
                    </h3>

                    <p className="text-slate-500">
                      {school.school_code}
                    </p>

                  </div>

                  <div
                    className="
                      px-3
                      py-1
                      rounded-lg
                      text-sm
                      font-bold
                      bg-blue-100
                      text-blue-700
                    "
                  >
                    School/College
                  </div>

                </div>

                <div className="mt-4 space-y-2">

                  <p>
                    👨‍💼 {school.principal_name}
                  </p>

                  <p>
                    📞 {school.phone}
                  </p>

                  <p>
                    ✉️ {school.email}
                  </p>

                </div>

                <div className="mt-5 grid gap-2">
                  <Link
                    href={`/schools/${school.id}`}
                    className="
                      rounded-lg
                      bg-slate-950
                      py-3
                      text-center
                      font-black
                      text-amber-100
                    "
                  >
                    Open School/College
                  </Link>
                  {canEditSchool && (
                    <Link
                      href={`/schools/edit/${school.id}`}
                      className="
                        rounded-lg
                        border
                        border-amber-200
                        bg-amber-50
                        py-3
                        text-center
                        font-black
                        text-amber-900
                      "
                    >
                      Edit School/College
                    </Link>
                  )}
                  {canDeleteSchool && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteSchool(
                          school
                        )
                      }
                      className="
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        py-3
                        font-black
                        text-red-700
                      "
                    >
                      Delete School/College
                    </button>
                  )}
                </div>

              </div>

            )
          )}

        </div>

      </div>

    </Layout>

  );

}

function SummaryCard({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <h2 className="mt-2 text-4xl font-black text-slate-950">
        {Number(value || 0).toLocaleString()}
        {suffix}
      </h2>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amber-600"
          style={{
            width: `${Math.min(
              100,
              Math.max(8, value || 0)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}
