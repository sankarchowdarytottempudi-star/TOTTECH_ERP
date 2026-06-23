export function generateTeacherDNA({
  attendancePercent,
  experienceScore,
  impactScore,
}: any) {

  const classroomManagement =
    Math.round(
      attendancePercent * 0.5 +
      impactScore * 0.5
    );

  const studentSatisfaction =
    Math.round(
      impactScore * 0.7 +
      attendancePercent * 0.3
    );

  const parentCommunication =
    Math.round(
      impactScore * 0.8
    );

  const innovationScore =
    Math.min(
      experienceScore + 15,
      100
    );

  const leadershipPotential =
    Math.round(
      impactScore * 0.6 +
      experienceScore * 0.4
    );

  const burnoutRisk =
    attendancePercent < 75
      ? "HIGH"
      : attendancePercent < 90
      ? "MEDIUM"
      : "LOW";

  return {

    teachingStyle:
      impactScore > 80
        ? "Highly Engaging"
        : impactScore > 60
        ? "Balanced Instructor"
        : "Needs Engagement",

    classroomManagement,

    studentSatisfaction,

    parentCommunication,

    innovationScore,

    leadershipPotential,

    burnoutRisk,

    strengths: [
      "Student Engagement",
      "Classroom Discipline",
    ],

    improvements: [
      "Parent Communication",
    ],

    summary:
      `Teacher demonstrates ${impactScore}% instructional effectiveness with ${classroomManagement}% classroom management capability.`,
  };
}
