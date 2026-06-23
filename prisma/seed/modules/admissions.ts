import { prisma } from "../../../lib/prisma";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOWUP",
  "INTERESTED",
  "ADMITTED",
  "REJECTED",
];

function randomStatus() {
  return STATUSES[
    Math.floor(
      Math.random() * STATUSES.length
    )
  ];
}

export async function createAdmissionLeads() {

  console.log(
    "Creating Admission Leads..."
  );

  const schools =
    await prisma.schools.findMany();

  let counter = 1;

  for (const school of schools) {

    for (let i = 1; i <= 250; i++) {

      const status =
        randomStatus();

      await prisma.admission_leads.create({
        data: {

          school_id:
            school.id,

          parent_name:
            `Parent ${counter}`,

          student_name:
            `Lead Student ${counter}`,

          phone:
            `98${String(counter)
              .padStart(8, "0")}`,

          email:
            `lead${counter}@gmail.com`,

          interested_class:
            `${(counter % 12) + 1}`,

          status,

        },
      });

      counter++;

    }

  }

  console.log(
    "Admission Leads Created"
  );

}

export async function createLeadFollowups() {

  console.log(
    "Creating Lead Followups..."
  );

  const leads =
    await prisma.admission_leads.findMany();

  for (const lead of leads) {

    const followupCount =
      Math.floor(
        Math.random() * 3
      ) + 1;

    for (
      let i = 0;
      i < followupCount;
      i++
    ) {

      const date =
        new Date();

      date.setDate(
        date.getDate() - i
      );

      await prisma.lead_followups.create({
        data: {

          lead_id:
            lead.id,

          followup_date:
            date,

          remarks:
            `Followup ${i + 1} for ${lead.student_name}`,

          status:
            lead.status,

        },
      });

    }

  }

  console.log(
    "Lead Followups Created"
  );

}

export async function admissionsSeed() {

  await createAdmissionLeads();

  await createLeadFollowups();

  console.log(
    "Admissions Module Completed"
  );

}
