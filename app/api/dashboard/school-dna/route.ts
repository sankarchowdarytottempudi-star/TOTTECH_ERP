import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import {
  generateSchoolDNA,
} from "@/lib/intelligence/schoolDNA";

export async function GET() {

  try {

    const totalStudents =
      await prisma.students.count();

    const totalTeachers =
      await prisma.teachers.count();

    const invoices =
      await prisma.invoices.findMany();

    const payments =
      await prisma.payments.findMany();

    const vehicles =
      await prisma.transport_vehicles.findMany();

    const hostelRooms =
      await prisma.hostel_rooms.findMany();

    const hostelStudents =
      await prisma.hostel_students.findMany();

    const totalInvoiceAmount =
      invoices.reduce(
        (sum, i: any) =>
          sum +
          Number(i.total_amount || 0),
        0
      );

    const totalPaidAmount =
      payments.reduce(
        (sum, p: any) =>
          sum +
          Number(p.amount || 0),
        0
      );

    const revenueHealth =
      totalInvoiceAmount > 0
        ? Math.round(
            (totalPaidAmount /
              totalInvoiceAmount) *
              100
          )
        : 100;

    const transportHealth =
      vehicles.length > 0
        ? 90
        : 0;

    const totalCapacity =
      hostelRooms.reduce(
        (sum, room: any) =>
          sum + (room.capacity || 0),
        0
      );

    const hostelHealth =
      totalCapacity > 0
        ? Math.round(
            (hostelStudents.length /
              totalCapacity) *
              100
          )
        : 100;

    const studentHealth = 85;

    const teacherHealth = 82;

    const schoolDNA =
      generateSchoolDNA({
        totalStudents,
        totalTeachers,
        studentHealth,
        teacherHealth,
        revenueHealth,
        transportHealth,
        hostelHealth,
      });

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalInvoiceAmount,
      totalPaidAmount,
      schoolDNA,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}
