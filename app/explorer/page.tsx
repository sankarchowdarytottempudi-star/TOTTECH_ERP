"use client";

import Layout from "@/components/Layout";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
} from "react";

function ExplorerContent() {

  const searchParams =
    useSearchParams();

  const module =
    searchParams?.get("module");

  const [data, setData] =
    useState<any[]>([]);

  useEffect(() => {

    if (!module) return;

    fetch(
      `/api/explorer?module=${module}`
    )
      .then((r) => r.json())
      .then(setData);

  }, [module]);

  return (

    <Layout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white rounded-3xl p-10">

          <h1 className="text-5xl font-black">
            🔎 Explorer
          </h1>

          <p className="mt-3 text-xl">
            {module}
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow">

          <div className="mb-6 text-xl font-bold">
            Records Found:
            {" "}
            {data.length}
          </div>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-3 text-left">
                  ID
                </th>

                <th className="p-3 text-left">
                  Name
                </th>

              </tr>

            </thead>

            <tbody>

              {data.map(
                (item: any) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {item.id}
                    </td>

                    <td className="p-3">

                      {item.school_name ||

                       item.class_name ||

                       item.subject_name ||

                       item.first_name +

                         " " +

                         (item.last_name ||
                           "")}

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

export default function ExplorerPage() {

  return (

    <Suspense
      fallback={
        <div>
          Loading...
        </div>
      }
    >

      <ExplorerContent />

    </Suspense>

  );

}
