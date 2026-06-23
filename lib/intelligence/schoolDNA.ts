export function generateSchoolDNA({
  totalStudents,
  totalTeachers,
  studentHealth,
  teacherHealth,
  revenueHealth,
  transportHealth,
  hostelHealth,
}: any) {

  const overallScore = Math.round(
    studentHealth * 0.30 +
    teacherHealth * 0.25 +
    revenueHealth * 0.20 +
    transportHealth * 0.15 +
    hostelHealth * 0.10
  );

  let status = "Healthy";

  if (overallScore < 60) {
    status = "Critical";
  } else if (overallScore < 80) {
    status = "Needs Attention";
  }

  const summary = `
School currently serves ${totalStudents}
students supported by ${totalTeachers}
teachers.

Student health score is ${studentHealth}%,
teacher effectiveness is ${teacherHealth}%,
and financial health is ${revenueHealth}%.

Overall institutional health score is
${overallScore}% indicating ${status}
operational performance.
`;

  return {
    overallScore,
    status,
    studentHealth,
    teacherHealth,
    revenueHealth,
    transportHealth,
    hostelHealth,
    summary,
  };
}
