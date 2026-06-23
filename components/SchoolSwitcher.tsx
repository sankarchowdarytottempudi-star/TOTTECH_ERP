"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type School = {
  id: number;
  school_name: string | null;
};

export default function SchoolSwitcher() {
  const { t } = useLanguage();
  const [schools, setSchools] =
    useState<School[]>([]);
  const [selected, setSelected] =
    useState("all");
  const [isSuperAdmin, setIsSuperAdmin] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "erpUser"
        );
      const role = stored
        ? JSON.parse(stored)?.role
        : "";
      setIsSuperAdmin(
        role === "SUPER_ADMIN"
      );
    } catch {
      setIsSuperAdmin(false);
    }

    Promise.all([
      fetch("/api/schools").then(
        (response) => response.json()
      ),
      fetch("/api/my-school").then(
        (response) => response.json()
      ),
    ])
      .then(([schoolRows, current]) => {
        setSchools(
          Array.isArray(schoolRows)
            ? schoolRows
            : []
        );

        if (
          current?.is_all_schools
        ) {
          setSelected("all");
        } else if (current?.id) {
          setSelected(
            String(current.id)
          );
        }
      })
      .catch(console.error);
  }, []);

  const switchSchool = async (
    schoolId: string
  ) => {
    setSelected(schoolId);

    await fetch("/api/switch-school", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        schoolId,
      }),
    });

    window.location.reload();
  };

  return (
    <select
      value={selected}
      onChange={(event) =>
        switchSchool(event.target.value)
      }
      className="
        w-full
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
      "
      aria-label={t("schoolCollege", "School/College")}
    >
      {isSuperAdmin ? (
        <option value="all">
          {t(
            "allSchoolsColleges",
            "All Schools/Colleges"
          )}
        </option>
      ) : (
        <option value="">
          {t(
            "selectSchoolCollege",
            "Select School/College"
          )}
        </option>
      )}

      {schools.map((school) => (
        <option
          key={school.id}
          value={school.id}
        >
          {school.school_name}
        </option>
      ))}
    </select>
  );
}
