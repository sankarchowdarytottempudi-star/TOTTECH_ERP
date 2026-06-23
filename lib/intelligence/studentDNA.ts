export function generateStudentDNA({
  attendancePercent,
  averageMarks,
  subjectStrengths,
  subjectWeaknesses,
}: any) {

  const learningVelocity =
    averageMarks >= 85
      ? 20
      : averageMarks >= 70
      ? 15
      : averageMarks >= 50
      ? 8
      : -5;

  const academicConsistency =
    Math.round(
      attendancePercent * 0.4 +
      averageMarks * 0.6
    );

  const stemSubjects = [
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
  ];

  const stemCount =
    subjectStrengths.filter(
      (s: string) =>
        stemSubjects.includes(s)
    ).length;

  let subjectAffinity =
    "General";

  if (stemCount >= 2) {
    subjectAffinity = "STEM";
  }

  let career =
    "General Studies";

  let confidence = 50;

  if (subjectAffinity === "STEM") {
    career = "Engineering";
    confidence = 82;
  }

  if (
    subjectStrengths.includes(
      "Biology"
    )
  ) {
    career = "Medical";
    confidence = 85;
  }

  const promotionReadiness =
    Math.round(
      attendancePercent * 0.4 +
      averageMarks * 0.6
    );

  let learningStyle =
    "Developing Learner";

  if (attendancePercent >= 90) {
    learningStyle =
      "Consistent Learner";
  }

  const summary = `
Student demonstrates excellent attendance,
steady academic growth and strong ${subjectAffinity} aptitude.

Recent examination trends indicate continuous
improvement across ${
      subjectStrengths.join(", ")
    }.

Current promotion readiness is ${promotionReadiness}% and career inclination aligns with ${career} pathways.
`;

  return {
    learningStyle,

    learningVelocity,

    academicConsistency,

    subjectAffinity,

    career,

    careerConfidence:
      confidence,

    promotionReadiness,

    strengths:
      subjectStrengths.length
        ? subjectStrengths
        : ["Consistent Attendance"],

    improvements:
      subjectWeaknesses.length
        ? subjectWeaknesses
        : ["No major weaknesses"],

    summary,
  };
}
