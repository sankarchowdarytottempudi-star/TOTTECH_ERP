"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AcademicYearsPage() {

  const [years,setYears] =
    useState<any[]>([]);

  const [form,setForm] =
    useState({

      school_id: 1,

      academic_year: "",

      start_date: "",

      end_date: "",

      is_current: false,

    });

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears =
    async () => {

      const res =
        await fetch(
          "/api/academic-years"
        );

      const data =
        await res.json();

      setYears(data);

    };

  const save =
    async () => {

      await fetch(
        "/api/academic-years",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(form),
        }
      );

      loadYears();

    };

  return (

    <Layout>

      <div className="space-y-8">

        <div className="bg-white rounded-3xl p-8 shadow">

          <h1 className="text-4xl font-black mb-6">
            Academic Years
          </h1>

          <div className="grid grid-cols-4 gap-4">

            <input
              placeholder="2026-2027"
              className="border p-3 rounded"
              onChange={(e)=>
                setForm({
                  ...form,
                  academic_year:
                    e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border p-3 rounded"
              onChange={(e)=>
                setForm({
                  ...form,
                  start_date:
                    e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border p-3 rounded"
              onChange={(e)=>
                setForm({
                  ...form,
                  end_date:
                    e.target.value,
                })
              }
            />

            <button
              onClick={save}
              className="
                bg-blue-600
                text-white
                rounded
              "
            >
              Save
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow">

          <table className="w-full">

            <thead>

              <tr>

                <th>Year</th>
                <th>Start</th>
                <th>End</th>

              </tr>

            </thead>

            <tbody>

              {years.map((y)=>(
                <tr key={y.id}>

                  <td>
                    {y.academic_year}
                  </td>

                  <td>
                    {y.start_date}
                  </td>

                  <td>
                    {y.end_date}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>

  );
}
