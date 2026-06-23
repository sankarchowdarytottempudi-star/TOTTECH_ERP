import { prisma } from "../../../lib/prisma";

export async function createHostels() {

  console.log("Creating Hostels...");

  const schools =
    await prisma.schools.findMany();

  for (const school of schools) {

    await prisma.hostels.create({
      data: {
        school_id: school.id,
        hostel_name: `${school.school_name} Boys Hostel`,
        hostel_type: "BOYS",
        warden_name: "Boys Warden",
        warden_phone: "9000000001",
      },
    });

    await prisma.hostels.create({
      data: {
        school_id: school.id,
        hostel_name: `${school.school_name} Girls Hostel`,
        hostel_type: "GIRLS",
        warden_name: "Girls Warden",
        warden_phone: "9000000002",
      },
    });

  }

  console.log("Hostels Created");

}

export async function createHostelWardens() {

  console.log("Creating Hostel Wardens...");

  for (let i = 1; i <= 10; i++) {

    await prisma.hostel_wardens.create({
      data: {
        name: `Warden ${i}`,
        phone: `98888888${i}`,
        email: `warden${i}@schoolerp.com`,
      },
    });

  }

  console.log("Hostel Wardens Created");

}

export async function createHostelRooms() {

  console.log("Creating Hostel Rooms...");

  const schools =
    await prisma.schools.findMany();

  for (const school of schools) {

    for (let i = 1; i <= 50; i++) {

      await prisma.hostel_rooms.create({
        data: {
          school_id: school.id,
          room_number: `R-${i}`,
          hostel_name:
            i <= 25
              ? "Boys Hostel"
              : "Girls Hostel",
          capacity: 4,
        },
      });

    }

  }

  console.log("Hostel Rooms Created");

}

export async function createHostelStudents() {

  console.log("Creating Hostel Students...");

  const students =
    await prisma.students.findMany({
      take: 300,
    });

  let bed = 1;

  for (const student of students) {

    await prisma.hostel_students.create({
      data: {
        student_id: student.id,
        room_number: `R-${(bed % 100) + 1}`,
        bed_number: `B-${bed}`,
        joining_date: new Date(),
        status: "ACTIVE",
      },
    });

    bed++;

  }

  console.log("Hostel Students Created");

}

export async function createHostelAllocations() {

  console.log("Creating Hostel Allocations...");

  const students =
    await prisma.students.findMany({
      take: 300,
    });

  const hostels =
    await prisma.hostels.findMany();

  const rooms =
    await prisma.hostel_rooms.findMany();

  let counter = 0;

  for (const student of students) {

    const hostel =
      hostels[counter % hostels.length];

    const room =
      rooms[counter % rooms.length];

    await prisma.hostel_allocations.create({
      data: {
        school_id: student.school_id,
        student_id: student.id,
        hostel_id: hostel.id,
        room_id: room.id,
        bed_number: `B-${counter + 1}`,
        allocation_date: new Date(),
      },
    });

    counter++;

  }

  console.log("Hostel Allocations Created");

}

export async function hostelSeed() {

  await createHostels();

  await createHostelWardens();

  await createHostelRooms();

  await createHostelStudents();

  await createHostelAllocations();

  console.log(
    "Hostel Module Completed"
  );

}
