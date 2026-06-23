"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

export default function SchoolSetupWizard() {

  const [step,setStep] =
    useState(1);

  const [data,setData] =
    useState({

      school_name:"",
      school_code:"",
      email:"",
      phone:"",
      principal_name:"",

      academic_year:"2025-2026",

      classes:[
        "1","2","3","4","5",
        "6","7","8","9","10"
      ],

      sections:[
        "A","B"
      ],

      admin_name:"",
      admin_email:"",
      admin_password:"",

    });

  return (

    <Layout>

      <div className="bg-white rounded-3xl p-10 shadow">

        <div className="mb-10">

          <h1 className="text-4xl font-black">
            School/College Setup Wizard
          </h1>

          <p className="text-slate-500">
            Step {step} of 7
          </p>

        </div>

        {step === 1 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              School/College Profile
            </h2>

            <input
              placeholder="School/College Name"
              className="input"
            />

            <input
              placeholder="School/College Code"
              className="input"
            />

            <input
              placeholder="Principal"
              className="input"
            />

            <button
              onClick={()=>
                setStep(2)
              }
              className="btn"
            >
              Next
            </button>

          </div>

        )}

        {step === 2 && (

          <div>

            <h2 className="text-2xl font-bold">
              Academic Year
            </h2>

            <input
              value="2025-2026"
              className="input"
            />

            <button
              onClick={()=>
                setStep(3)
              }
              className="btn mt-4"
            >
              Next
            </button>

          </div>

        )}

        {step === 3 && (

          <div>

            <h2 className="text-2xl font-bold">
              Classes
            </h2>

            <p>
              Classes 1-10
              will be created
            </p>

            <button
              onClick={()=>
                setStep(4)
              }
              className="btn mt-4"
            >
              Next
            </button>

          </div>

        )}

        {step === 4 && (

          <div>

            <h2 className="text-2xl font-bold">
              Sections
            </h2>

            <p>
              A & B Sections
              will be created
            </p>

            <button
              onClick={()=>
                setStep(5)
              }
              className="btn mt-4"
            >
              Next
            </button>

          </div>

        )}

        {step === 5 && (

          <div>

            <h2 className="text-2xl font-bold">
              Subjects
            </h2>

            <p>
              Default Subjects
              will be created
            </p>

            <button
              onClick={()=>
                setStep(6)
              }
              className="btn mt-4"
            >
              Next
            </button>

          </div>

        )}

        {step === 6 && (

          <div>

            <h2 className="text-2xl font-bold">
              Fee Categories
            </h2>

            <p>
              Tuition, Transport,
              Hostel, Exam Fees
            </p>

            <button
              onClick={()=>
                setStep(7)
              }
              className="btn mt-4"
            >
              Next
            </button>

          </div>

        )}

        {step === 7 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              School/College Admin
            </h2>

            <input
              placeholder="Admin Name"
              className="input"
            />

            <input
              placeholder="Admin Email"
              className="input"
            />

            <input
              placeholder="Password"
              className="input"
            />

            <button
              className="
                bg-green-600
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              Complete Setup
            </button>

          </div>

        )}

      </div>

    </Layout>

  );

}
