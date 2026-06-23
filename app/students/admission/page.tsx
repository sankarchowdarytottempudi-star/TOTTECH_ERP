"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

export default function AdmissionWizard() {

  const [step,setStep] =
    useState(1);

  const [student,setStudent] =
    useState({

      school_id:"",
      academic_year:"",

      admission_number:"",
      enrollment_number:"",

      first_name:"",
      middle_name:"",
      last_name:"",

      gender:"",
      dob:"",

      father_name:"",
      mother_name:"",

      class_id:"",
      section_id:"",

      transport_required:false,

      hostel_required:false,

    });

  const next = () =>
    setStep(step + 1);

  const previous = () =>
    setStep(step - 1);

  return (

    <Layout>

      <div className="bg-white rounded-3xl p-10 shadow">

        <div className="mb-8">

          <h1 className="text-4xl font-black">
            Student Admission Wizard
          </h1>

          <div className="mt-4 text-slate-500">

            School/College →
            Student →
            Parent →
            Academic →
            Transport →
            Hostel →
            Documents →
            Login

          </div>

        </div>

        {/* STEP 1 */}

        {step === 1 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              School/College Information
            </h2>

            <input
              placeholder="School/College"
              className="input"
            />

            <input
              placeholder="Academic Year"
              className="input"
            />

            <input
              placeholder="Admission Number"
              className="input"
            />

            <input
              placeholder="Enrollment Number"
              className="input"
            />

          </div>

        )}

        {/* STEP 2 */}

        {step === 2 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              Personal Details
            </h2>

            <input
              placeholder="First Name"
              className="input"
            />

            <input
              placeholder="Middle Name"
              className="input"
            />

            <input
              placeholder="Last Name"
              className="input"
            />

            <input
              type="date"
              className="input"
            />

          </div>

        )}

        {/* STEP 3 */}

        {step === 3 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              Parent Details
            </h2>

            <input
              placeholder="Father Name"
              className="input"
            />

            <input
              placeholder="Mother Name"
              className="input"
            />

            <input
              placeholder="Father Phone"
              className="input"
            />

            <input
              placeholder="Mother Phone"
              className="input"
            />

          </div>

        )}

        {/* STEP 4 */}

        {step === 4 && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              Academic Details
            </h2>

            <select className="input">
              <option>Class</option>
            </select>

            <select className="input">
              <option>Section</option>
            </select>

            <input
              placeholder="Roll Number"
              className="input"
            />

          </div>

        )}

        {/* STEP 5 */}

        {step === 5 && (

          <div>

            <h2 className="text-2xl font-bold">
              Transport
            </h2>

            <label>

              <input
                type="checkbox"
              />

              Transport Required

            </label>

          </div>

        )}

        {/* STEP 6 */}

        {step === 6 && (

          <div>

            <h2 className="text-2xl font-bold">
              Hostel
            </h2>

            <label>

              <input
                type="checkbox"
              />

              Hostel Required

            </label>

          </div>

        )}

        {/* STEP 7 */}

        {step === 7 && (

          <div>

            <h2 className="text-2xl font-bold">
              Documents
            </h2>

            <input
              type="file"
            />

          </div>

        )}

        {/* STEP 8 */}

        {step === 8 && (

          <div>

            <h2 className="text-2xl font-bold">
              Portal Accounts
            </h2>

            <div className="bg-blue-50 p-4 rounded">

              Student Login:
              john.doe

            </div>

            <div className="bg-green-50 p-4 rounded mt-3">

              Parent Login:
              parent.john.doe

            </div>

          </div>

        )}

        <div className="flex justify-between mt-10">

          {step > 1 && (

            <button
              onClick={previous}
              className="
                px-6
                py-3
                bg-gray-200
                rounded-xl
              "
            >
              Previous
            </button>

          )}

          {step < 8 ? (

            <button
              onClick={next}
              className="
                px-6
                py-3
                bg-blue-600
                text-white
                rounded-xl
              "
            >
              Next
            </button>

          ) : (

            <button
              className="
                px-6
                py-3
                bg-green-600
                text-white
                rounded-xl
              "
            >
              Complete Admission
            </button>

          )}

        </div>

      </div>

    </Layout>

  );

}
