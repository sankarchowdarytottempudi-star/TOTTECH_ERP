"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function RolesPage() {

  const [roles, setRoles] =
    useState<any[]>([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles =
    async () => {

      const response =
        await fetch(
          "/api/settings/roles"
        );

      const data =
        await response.json();

      setRoles(data);
    };

  return (
    <Layout>

      <div className="space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow">

          <h1 className="text-4xl font-bold">
            Roles & Permissions
          </h1>

          <p className="text-gray-500 mt-2">
            Manage User Access Levels
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Role Name
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

              </tr>

            </thead>

            <tbody>

              {roles.map((role) => (

                <tr
                  key={role.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {role.id}
                  </td>

                  <td className="p-4 font-semibold">
                    {role.role_name}
                  </td>

                  <td className="p-4">
                    {role.description}
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
