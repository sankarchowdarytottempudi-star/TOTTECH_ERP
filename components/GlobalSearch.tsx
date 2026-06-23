"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { translateLabel } from "@/lib/i18n";

export default function GlobalSearch() {
  const { language, t } = useLanguage();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<any>(null);

  const search =
    async (value: string) => {

      setQuery(value);

      if (!value.trim()) {

        setResults(null);

        return;

      }

      try {

        const response =
          await fetch(
            `/api/search?q=${encodeURIComponent(
              value
            )}`
          );

        const data =
          await response.json();

        setResults(data);

      } catch (error) {

        console.error(error);

      }

    };

  return (

    <div className="relative w-full">

      <SearchIcon
        size={16}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        value={query}
        onChange={(e) =>
          search(e.target.value)
        }
        placeholder={t(
          "searchPlaceholder",
          "Search Students, Teachers, Schools/Colleges, Classes..."
        )}
        className="
          w-full
          border
          border-slate-300
          rounded-lg
          pl-12
          pr-4
          py-3
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-amber-500
        "
      />

      {results && (

        <div
          className="
            absolute
            top-14
            left-0
            w-full
            bg-white
            rounded-lg
            shadow-2xl
            border
            border-slate-200
            z-50
            max-h-[500px]
            overflow-auto
          "
        >

          {/* STUDENTS */}

          {results.students?.length >
            0 && (

            <>

              <div
                className="
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-slate-400
                  border-b
                "
                >
                {translateLabel(
                  language,
                  "Students"
                ).toUpperCase()}
              </div>

              {results.students.map(
                (student: any) => (

                  <Link
                    key={student.id}
                    href={`/students/${student.id}`}
                    className="
                      block
                      p-3
                      hover:bg-amber-50
                    "
                  >
                    🎓{" "}
                    {student.first_name}{" "}
                    {student.last_name}

                    <div className="text-xs text-slate-500">
                      Admission:
                      {" "}
                      {
                        student.admission_number
                      }
                    </div>

                  </Link>

                )
              )}

            </>

          )}

          {/* TEACHERS */}

          {results.teachers?.length >
            0 && (

            <>

              <div
                className="
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-slate-400
                  border-y
                "
                >
                {translateLabel(
                  language,
                  "Teachers"
                ).toUpperCase()}
              </div>

              {results.teachers.map(
                (teacher: any) => (

                  <Link
                    key={teacher.id}
                    href={`/teachers/${teacher.id}`}
                    className="
                      block
                      p-3
                      hover:bg-amber-50
                    "
                  >
                    👨‍🏫{" "}
                    {teacher.first_name}{" "}
                    {teacher.last_name}

                    <div className="text-xs text-slate-500">
                      Employee:
                      {" "}
                      {
                        teacher.employee_id
                      }
                    </div>

                  </Link>

                )
              )}

            </>

          )}

          {/* SCHOOLS */}

          {results.schools?.length >
            0 && (

            <>

              <div
                className="
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-slate-400
                  border-y
                "
                >
                {translateLabel(
                  language,
                  "Schools"
                ).toUpperCase()}
              </div>

              {results.schools.map(
                (school: any) => (

                  <Link
                    key={school.id}
                    href={`/schools/${school.id}`}
                    className="
                      block
                      p-3
                      hover:bg-slate-100
                    "
                  >
                    🏫{" "}
                    {
                      school.school_name
                    }
                  </Link>

                )
              )}

            </>

          )}

          {/* CLASSES */}

          {results.classes?.length >
            0 && (

            <>

              <div
                className="
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-slate-400
                  border-y
                "
              >
                CLASSES
              </div>

              {results.classes.map(
                (cls: any) => (

                  <div
                    key={cls.id}
                    className="
                      p-3
                      hover:bg-slate-100
                    "
                  >
                    📚{" "}
                    {cls.class_name}
                  </div>

                )
              )}

            </>

          )}

          {!results.students?.length &&
           !results.teachers?.length &&
           !results.schools?.length &&
           !results.classes?.length && (

            <div className="p-4 text-slate-500">
              No results found
            </div>

          )}

        </div>

      )}

    </div>

  );

}
