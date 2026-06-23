import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const totalStudents =
      await prisma.students.count();

    const totalTeachers =
      await prisma.teachers.count();

    const totalExams =
      await prisma.exam_schedule.count();

    const attendanceRecords =
      await prisma.attendance_master.findMany();

    const presentCount =
      attendanceRecords.filter(
        (a) => a.status === "PRESENT"
      ).length;

    const absentCount =
      attendanceRecords.filter(
        (a) => a.status === "ABSENT"
      ).length;

    const attendancePercent =
      attendanceRecords.length > 0
        ? Math.round(
            (presentCount /
              attendanceRecords.length) *
              100
          )
        : 0;

    const marks =
      await prisma.student_marks_entry.findMany();

    const studentTotals =
      new Map<
        number,
        {
          obtained: number;
          max: number;
        }
      >();

    marks.forEach((mark) => {

      if (!mark.student_id)
        return;

      const current =
        studentTotals.get(
          mark.student_id
        ) || {
          obtained: 0,
          max: 0,
        };

      current.obtained +=
        Number(
          mark.obtained_marks || 0
        );

      current.max +=
        Number(
          mark.max_marks || 0
        );

      studentTotals.set(
        mark.student_id,
        current
      );

    });

    let academicRisk = 0;

    studentTotals.forEach(
      (value) => {

        const percent =
          value.max > 0
            ? (
                value.obtained /
                value.max
              ) *
              100
            : 0;

        if (percent < 40) {
          academicRisk++;
        }

      }
    );

    const feeAssignments =
      await prisma.student_fee_assignments.findMany();

    const payments =
      await prisma.payments.findMany();

    const assignedAmount =
      feeAssignments.reduce(
        (sum, item) =>
          sum +
          Number(
            item.assigned_amount ||
              0
          ),
        0
      );

    const paidAmount =
      payments.reduce(
        (sum, item) =>
          sum +
          Number(
            item.amount || 0
          ),
        0
      );

    const outstandingAmount =
      assignedAmount -
      paidAmount;

    const feeDefaulters =
      outstandingAmount > 0
        ? feeAssignments.length
        : 0;

    const aiAnalyses =
      await prisma.ai_student_analysis.findMany();

    const highRiskStudents =
      aiAnalyses.filter(
        (x) =>
          x.risk_level ===
          "HIGH"
      ).length;

    const recommendations =
      [];

    if (
      attendancePercent < 75
    ) {
      recommendations.push(
        "Attendance is below 75%. Immediate intervention recommended."
      );
    }

    if (
      academicRisk > 0
    ) {
      recommendations.push(
        `${academicRisk} students are academically at risk.`
      );
    }

    if (
      outstandingAmount > 0
    ) {
      recommendations.push(
        `Outstanding fees detected: ₹${outstandingAmount.toLocaleString()}`
      );
    }

    if (
      highRiskStudents > 0
    ) {
      recommendations.push(
        `${highRiskStudents} students marked HIGH risk by AI analysis.`
      );
    }

    recommendations.push(
      "Review upcoming exam readiness."
    );

    return NextResponse.json({

      metrics: {

        totalStudents,

        totalTeachers,

        totalExams,

        attendancePercent,

        absentStudents:
          absentCount,

        presentStudents:
          presentCount,

        academicRisk,

        feeDefaulters,

        outstandingAmount,

        highRiskStudents,

      },

      recommendations,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI Engine Failed",
      },
      {
        status: 500,
      }
    );

  }

}
