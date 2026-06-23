import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const {
    question,
    student,
    studentDNA,
    risk,
    attendancePercent,
    averageMarks,
    subjectPerformance,
    riskFactors,
    examStats,
    aiInsights,
  } = body;

  let answer = "";

  if (
    question ===
    "How can I improve this student?"
  ) {

    answer =
`
STUDENT IMPROVEMENT PLAN

Student:
${student.first_name} ${student.last_name}

Attendance:
${attendancePercent}%

Average Marks:
${averageMarks}%

Risk Level:
${risk.level}

Learning Style:
${studentDNA.learningStyle}

Career Alignment:
${studentDNA.career}

Strength Areas:
${studentDNA.strengths.join(", ")}

Improvement Areas:
${studentDNA.improvements.join(", ")}

Teacher Actions

1. Focus on weak concepts weekly

2. Provide project-based learning

3. Conduct one-on-one mentoring

4. Track attendance every week

5. Review progress every month

Expected Outcome

Improved academic consistency,
higher promotion readiness and
stronger classroom engagement.
`;
  }

  else if (
    question ===
    "Generate intervention plan"
  ) {

    answer =
`
30 DAY INTERVENTION PLAN

Week 1
• Assess weaknesses
• Parent discussion

Week 2
• Personalized assignments

Week 3
• Mock tests

Week 4
• Performance review

Risk Factors

${riskFactors.join("\n")}
`;
  }

  else if (
    question ===
    "Parent discussion points"
  ) {

    answer =
`
PARENT MEETING GUIDE

Student Health:
${aiInsights.healthScore}%

Promotion Probability:
${aiInsights.promotionProbability}%

Discussion Topics

• Attendance

• Homework completion

• Examination readiness

• Strengths:
${studentDNA.strengths.join(", ")}

• Improvement:
${studentDNA.improvements.join(", ")}

Recommended home support:
Daily supervised study.
`;
  }

  else if (
    question ===
    "Recommend learning style"
  ) {

    answer =
`
LEARNING STRATEGY

Student Type:
${studentDNA.learningStyle}

Recommended Techniques

• Visual learning

• Practical projects

• Concept maps

• Quiz reinforcement

• Weekly revision cycles

Career Direction

${studentDNA.career}

Confidence

${studentDNA.careerConfidence}%
`;
  }

  return NextResponse.json({
    answer,
  });

}
