import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const teacher = await prisma.teachers.update({
      where: {
        id: Number(body.id),
      },
      data: {
        employee_id: body.employee_id,
        first_name: body.first_name,
        last_name: body.last_name,
        gender: body.gender,
        phone: body.phone,
        email: body.email,
        qualification: body.qualification,
        experience_years: Number(body.experience_years || 0),
        joining_date: body.joining_date || null,
        department: body.department,
        designation: body.designation,
        salary: body.salary || null,
        address: body.address,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Update Failed" },
      { status: 500 }
    );
  }
}
