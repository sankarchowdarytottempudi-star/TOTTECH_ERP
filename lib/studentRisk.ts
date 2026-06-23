export interface StudentRiskResult {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  reasons: string[];
  recommendations: string[];
}

export function calculateRisk(
  attendancePercent: number,
  averageMarks: number
): StudentRiskResult {

  let score = 100;

const noAcademicData =
  averageMarks === 0;

  const reasons: string[] = [];

  const recommendations: string[] = [];

  // Attendance

  if (attendancePercent < 90) {
    score -= 10;
    reasons.push(
      "Attendance below excellence threshold"
    );
  }

  if (attendancePercent < 80) {
    score -= 20;
    reasons.push(
      "Attendance below school/college target"
    );

    recommendations.push(
      "Parent follow-up recommended"
    );
  }

  if (attendancePercent < 70) {
    score -= 25;
    reasons.push(
      "Chronic absenteeism detected"
    );

    recommendations.push(
      "Attendance intervention required"
    );
  }

  // Academics

  if (averageMarks < 75) {
    score -= 10;
    reasons.push(
      "Academic performance below distinction level"
    );
  }

 if (
  !noAcademicData &&
  averageMarks < 60
) {

    recommendations.push(
      "Additional academic support suggested"
    );
  }

 if (
  !noAcademicData &&
  averageMarks < 40
) {
  reasons.push(
    "Academic performance below target"
  );
}

  score = Math.max(score, 0);

  let level:
    | "LOW"
    | "MEDIUM"
    | "HIGH" = "LOW";

  if (score < 50) {
    level = "HIGH";
  } else if (score < 75) {
    level = "MEDIUM";
  }

if (averageMarks === 0) {
  return {
    level: attendancePercent >= 75
      ? "LOW"
      : "MEDIUM",
    score: attendancePercent,
    reasons: [
      "No academic records available"
    ],
    recommendations: [
      "Enter examination results"
    ]
  };
}

  return {
    score,
    level,
    reasons,
    recommendations,
  };
}
