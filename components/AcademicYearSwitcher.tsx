"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type AcademicYear = {
  id: number | string;
  academic_year: string | null;
  is_current: boolean | null;
  is_selected?: boolean;
};

export default function AcademicYearSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const [years, setYears] =
    useState<AcademicYear[]>([]);
  const [selected, setSelected] =
    useState("");

  useEffect(() => {
    fetch(
      "/api/academic-years?include_all=true"
    )
      .then((response) => response.json())
      .then((data) => {
        const rows = Array.isArray(data)
          ? data
          : data.academicYears ?? [];
        setYears(rows);

        const current =
          rows.find(
            (year: AcademicYear) =>
              year.is_selected
          ) ||
          rows.find(
            (year: AcademicYear) =>
              year.is_current
          );

        if (current?.id) {
          setSelected(String(current.id));
        }
      })
      .catch(console.error);
  }, []);

  const switchYear = async (
    value: string
  ) => {
    setSelected(value);

    await fetch(
      "/api/switch-academic-year",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          academicYearId: value,
        }),
      }
    );

    window.location.reload();
  };

  return (
    <select
      value={selected}
      onChange={(event) =>
        switchYear(event.target.value)
      }
      className={`
        min-w-0
        min-h-[44px]
        rounded-lg
        border
        border-slate-300
        bg-white
        px-3
        py-2.5
        text-sm
        font-semibold
        text-slate-950
        focus:outline-none
        focus:ring-2
        focus:ring-amber-500
        ${compact ? "w-full" : "w-[180px]"}
      `}
      aria-label="Academic year"
    >
      <option value="">
        {t("academicYear", "Academic Year")}
      </option>

      {years.map((year) => (
        <option
          key={year.id}
          value={year.id}
        >
          {year.academic_year ||
            `Year ${year.id}`}
        </option>
      ))}
    </select>
  );
}
