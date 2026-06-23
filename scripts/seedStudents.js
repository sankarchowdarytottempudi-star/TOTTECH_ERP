const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const boys = [
"Sai Teja","Sai Kiran","Venkatesh","Srinivas",
"Praneeth","Harsha","Lokesh","Manideep",
"Naveen","Charan","Karthik","Rohith",
"Mahesh","Naresh","Rakesh","Sandeep",
"Ajay","Vijay","Tejaswi","Pavan"
];

const girls = [
"Sravani","Keerthana","Bhavya","Deepika",
"Sindhu","Mounika","Navya","Sowjanya",
"Harika","Anusha","Anjali","Sneha",
"Divya","Tejaswini","Poojitha","Lasya",
"Sirisha","Pravallika","Kavya","Swathi"
];

const lastNames = [
"Rao","Reddy","Naidu","Kumar",
"Chowdary","Varma","Murthy","Sharma"
];

const cities = [
"Vijayawada",
"Guntur",
"Visakhapatnam",
"Rajahmundry",
"Kakinada",
"Nellore",
"Tirupati",
"Anantapur",
"Eluru",
"Ongole"
];

const religions = [
"Hindu",
"Christian",
"Muslim"
];

const bloodGroups = [
"A+","A-","B+","B-",
"O+","O-","AB+","AB-"
];

async function seed() {

  console.log("Creating Students...");

  for(let i=1;i<=1000;i++) {

    const male =
      Math.random() > 0.5;

    const firstName =
      male
        ? boys[Math.floor(Math.random()*boys.length)]
        : girls[Math.floor(Math.random()*girls.length)];

    const lastName =
      lastNames[
        Math.floor(
          Math.random() * lastNames.length
        )
      ];

    const classNo =
      Math.floor(
        Math.random() * 10
      ) + 1;

    const sectionId =
      Math.floor(
        Math.random() * 20
      ) + 1;

    await prisma.students.create({

      data: {

        school_id: 1,

        enrollment_number:
          `ENR${10000+i}`,

        admission_number:
          `ADM${10000+i}`,

        first_name:
          firstName,

        last_name:
          lastName,

        name:
          `${firstName} ${lastName}`,

        gender:
          male
            ? "Male"
            : "Female",

        phone:
          `9${
            Math.floor(
              100000000 +
              Math.random() * 900000000
            )
          }`,

        email:
          `${firstName.toLowerCase()}${i}@school.com`,

        city:
          cities[
            Math.floor(
              Math.random()*cities.length
            )
          ],

        state:
          "Andhra Pradesh",

        country:
          "India",

        religion:
          religions[
            Math.floor(
              Math.random()*religions.length
            )
          ],

        blood_group:
          bloodGroups[
            Math.floor(
              Math.random()*bloodGroups.length
            )
          ],

        father_name:
          `Venkata ${lastName}`,

        mother_name:
          `Lakshmi ${lastName}`,

        father_phone:
          `9${
            Math.floor(
              100000000 +
              Math.random()*900000000
            )
          }`,

        mother_phone:
          `9${
            Math.floor(
              100000000 +
              Math.random()*900000000
            )
          }`,

        school_class:
          String(classNo),

        section_id:
          sectionId,

        roll_number:
          String(i),

        medium:
          "English",

        category:
          "General",

        house:
          [
            "Red",
            "Blue",
            "Green",
            "Yellow"
          ][
            Math.floor(
              Math.random()*4
            )
          ],

        is_active: true,

      },

    });

    if(i % 100 === 0) {
      console.log(
        `${i} Students Created`
      );
    }
  }

  console.log("Done");

  await prisma.$disconnect();
}

seed();
