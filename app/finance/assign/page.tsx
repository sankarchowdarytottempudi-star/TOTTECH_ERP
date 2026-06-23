"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

export default function AssignFeesPage() {

  const [form,setForm] =
    useState({

      student_id:"",
      fee_category:"",
      amount:"",

    });

  return (

    <Layout>

      <div className="bg-white p-8 rounded-3xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Assign Fee
        </h1>

        <div className="grid grid-cols-3 gap-4">

          <input
            placeholder="Student ID"
            className="input"
          />

          <input
            placeholder="Fee Category"
            className="input"
          />

          <input
            placeholder="Amount"
            className="input"
          />

        </div>

        <button
          className="
            mt-6
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Assign Fee
        </button>

      </div>

    </Layout>

  );

}
