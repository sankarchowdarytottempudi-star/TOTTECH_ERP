import { prisma } from "../../../lib/prisma";

export async function createTransportRoutes() {

  console.log("Creating Transport Routes...");

  const schools =
    await prisma.schools.findMany();

  for (const school of schools) {

    for (let i = 1; i <= 5; i++) {

      await prisma.transport_routes.create({
        data: {

          school_id:
            school.id,

          route_name:
            `Route ${i}`,

          vehicle_number:
            `TS09AB${1000 + i}`,

          driver_name:
            `Driver ${i}`,

          driver_phone:
            `9000000${i}${i}`,

        },
      });

    }

  }

  console.log("Transport Routes Created");

}

export async function createTransportStops() {

  console.log("Creating Transport Stops...");

  const schools =
    await prisma.schools.findMany();

  for (const school of schools) {

    for (let i = 1; i <= 20; i++) {

      await prisma.transport_stops.create({
        data: {

          school_id:
            school.id,

          stop_name:
            `Stop ${i}`,

          stop_time:
            `${6 + (i % 6)}:00 AM`,

        },
      });

    }

  }

  console.log("Transport Stops Created");

}

export async function createTransportVehicles() {

  console.log("Creating Transport Vehicles...");

  const schools =
    await prisma.schools.findMany();

  for (const school of schools) {

    for (let i = 1; i <= 8; i++) {

      await prisma.transport_vehicles.create({
        data: {

          school_id:
            school.id,

          vehicle_number:
            `BUS-${school.id}-${i}`,

          vehicle_type:
            "BUS",

          capacity:
            50,

          driver_name:
            `Driver ${i}`,

          driver_phone:
            `9888888${i}${i}`,

        },
      });

    }

  }

  console.log("Transport Vehicles Created");

}

export async function createTransportAssignments() {

  console.log("Creating Transport Assignments...");

  const students =
    await prisma.students.findMany();

  const routes =
    await prisma.transport_routes.findMany();

  let counter = 0;

  for (const student of students) {

    if (counter > 700) break;

    const route =
      routes[counter % routes.length];

    await prisma.transport_assignments.create({
      data: {

        student_id:
          student.id,

        route_id:
          route.id,

        pickup_point:
          "Home",

        drop_point:
          "School",

      },
    });

    counter++;

  }

  console.log("Transport Assignments Created");

}

export async function transportSeed() {

  await createTransportRoutes();

  await createTransportStops();

  await createTransportVehicles();

  await createTransportAssignments();

  console.log(
    "Transport Module Completed"
  );

}
