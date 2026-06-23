type Normalized = {
  text: string;
  tokens: string[];
};

export type AssessmentAIEvaluation = {
  exactMatchScore: number;
  conceptMatchScore: number;
  keywordMatchScore: number;
  semanticSimilarityScore: number;
  completenessScore: number;
  grammarScore: number;
  writingQualityScore: number;
  logicalFlowScore: number;
  criticalThinkingScore: number;
  recommendedMarks: number;
  confidencePercent: number;
  understandingLevel: "YES" | "PARTIAL" | "NO";
  qualityLabel: "Excellent" | "Good" | "Average" | "Weak" | "Poor";
  misconceptions: string[];
  missingConcepts: string[];
  strongConcepts: string[];
  reasoning: string;
  rubricNotes: string[];
};

export type AssessmentAggregateMetrics = {
  conceptUnderstandingPercent: number;
  memoryRetentionPercent: number;
  applicationSkillPercent: number;
  analyticalSkillPercent: number;
  criticalThinkingPercent: number;
  writingSkillPercent: number;
  problemSolvingPercent: number;
  confidenceScorePercent: number;
};

const tokenize = (input: unknown): Normalized => {
  const text = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9%+\-/.\s]/g, " ");

  const tokens = text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return { text, tokens };
};

const jaccard = (a: string[], b: string[]) => {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection += 1;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
};

const countOverlap = (a: string[], b: string[]) => {
  const setB = new Set(b);
  return a.filter((token) => setB.has(token)).length;
};

const normalizeMarks = (value: number, maxMarks: number) => {
  if (!Number.isFinite(value) || !Number.isFinite(maxMarks) || maxMarks <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(Number(value.toFixed(2)), maxMarks));
};

const labelFor = (percent: number) => {
  if (percent >= 90) return "Excellent";
  if (percent >= 75) return "Good";
  if (percent >= 60) return "Average";
  if (percent >= 45) return "Weak";
  return "Poor";
};

const understandingFor = (percent: number) => {
  if (percent >= 80) return "YES";
  if (percent >= 45) return "PARTIAL";
  return "NO";
};

export function evaluateAnswer(input: {
  questionText?: string | null;
  idealAnswer?: string | null;
  rubric?: string | null;
  keywords?: string[] | string | null;
  studentAnswer?: string | null;
  maxMarks: number;
  questionType?: string | null;
}) : AssessmentAIEvaluation {
  const ideal = tokenize(input.idealAnswer || input.questionText || "");
  const student = tokenize(input.studentAnswer || "");
  const rubricText = String(input.rubric || "").trim();
  const keywordList = Array.isArray(input.keywords)
    ? input.keywords.map((value) => String(value || "").trim().toLowerCase()).filter(Boolean)
    : String(input.keywords || "")
        .split(/[,;\n]/)
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

  const exactMatchScore = ideal.text && student.text && ideal.text === student.text ? 100 : 0;
  const conceptMatchScore = Math.round(jaccard(ideal.tokens, student.tokens) * 100);
  const keywordHits = keywordList.length
    ? countOverlap(keywordList, student.tokens)
    : countOverlap(ideal.tokens.slice(0, Math.min(12, ideal.tokens.length)), student.tokens);
  const keywordMatchScore = keywordList.length
    ? Math.round((keywordHits / keywordList.length) * 100)
    : Math.round(jaccard(ideal.tokens.slice(0, 10), student.tokens) * 100);
  const semanticSimilarityScore = Math.round((conceptMatchScore * 0.55) + (keywordMatchScore * 0.45));
  const completenessScore = Math.round(
    Math.min(100, (student.tokens.length / Math.max(ideal.tokens.length || 1, 6)) * 100)
  );
  const grammarPenalty = /(?:\b(?:lol|u|ur|r)\b|[A-Z]{5,}|[^\w\s]{4,})/.test(input.studentAnswer || "")
    ? 30
    : 0;
  const grammarScore = Math.max(20, 100 - grammarPenalty - Math.max(0, 6 - student.tokens.length) * 5);
  const writingQualityScore = Math.round((grammarScore * 0.55) + (completenessScore * 0.45));
  const logicalFlowScore = Math.round((semanticSimilarityScore + completenessScore) / 2);
  const criticalThinkingScore = /because|therefore|hence|compare|analyze|evaluate|reason/i.test(input.studentAnswer || "")
    ? Math.min(100, logicalFlowScore + 15)
    : Math.max(20, logicalFlowScore - 10);

  const weightedPercent =
    (exactMatchScore * 0.1) +
    (conceptMatchScore * 0.3) +
    (keywordMatchScore * 0.15) +
    (semanticSimilarityScore * 0.2) +
    (completenessScore * 0.1) +
    (grammarScore * 0.05) +
    (writingQualityScore * 0.05) +
    (logicalFlowScore * 0.03) +
    (criticalThinkingScore * 0.02);

  const confidencePercent = Math.max(35, Math.min(99, Math.round((conceptMatchScore * 0.6) + (keywordMatchScore * 0.4))));
  const recommendedMarks = normalizeMarks((weightedPercent / 100) * input.maxMarks, input.maxMarks);
  const understandingLevel = understandingFor(weightedPercent);
  const qualityLabel = labelFor(weightedPercent);

  const idealTokens = new Set(ideal.tokens);
  const studentTokens = new Set(student.tokens);
  const missingConcepts = ideal.tokens
    .filter((token, index) => index < 18 && !studentTokens.has(token))
    .slice(0, 6);
  const strongConcepts = ideal.tokens
    .filter((token) => studentTokens.has(token))
    .slice(0, 6);
  const misconceptions: string[] = [];
  if (student.tokens.some((token) => ["none", "wrong", "guess"].includes(token))) {
    misconceptions.push("Possible guessing or weak concept recall.");
  }
  if (conceptMatchScore < 40 && keywordMatchScore < 40) {
    misconceptions.push("Concept appears confused or not yet understood.");
  } else if (conceptMatchScore < 60) {
    misconceptions.push("Partial concept understanding detected.");
  }
  if (!student.tokens.length) {
    misconceptions.push("Blank or near-blank answer detected.");
  }
  if (/memor/i.test(input.questionType || "") && conceptMatchScore > 70 && exactMatchScore < 100) {
    misconceptions.push("Answer may be memorized but not fully expressed.");
  }

  const rubricNotes = rubricText
    ? rubricText
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  const reasonParts = [
    `Concept match ${conceptMatchScore}%`,
    `keyword match ${keywordMatchScore}%`,
    `completeness ${completenessScore}%`,
    `${understandingLevel} concept understanding`,
  ];
  if (misconceptions.length) {
    reasonParts.push(`misconceptions: ${misconceptions.join("; ")}`);
  }

  return {
    exactMatchScore,
    conceptMatchScore,
    keywordMatchScore,
    semanticSimilarityScore,
    completenessScore,
    grammarScore: Math.round(grammarScore),
    writingQualityScore,
    logicalFlowScore,
    criticalThinkingScore,
    recommendedMarks,
    confidencePercent,
    understandingLevel,
    qualityLabel,
    misconceptions,
    missingConcepts,
    strongConcepts,
    reasoning: reasonParts.join(". "),
    rubricNotes,
  };
}

export function buildAssessmentSummary(evaluations: AssessmentAIEvaluation[]) {
  if (!evaluations.length) {
    return {
      averageRecommendedMarks: 0,
      conceptDetectionAccuracy: 0,
      partialCreditAccuracy: 0,
      subjectAccuracy: 0,
      qualityDistribution: {},
    };
  }
  const averageRecommendedMarks =
    evaluations.reduce((sum, item) => sum + item.recommendedMarks, 0) / evaluations.length;
  const conceptDetectionAccuracy =
    evaluations.reduce((sum, item) => sum + item.conceptMatchScore, 0) / evaluations.length;
  const partialCreditAccuracy =
    evaluations.reduce((sum, item) => sum + (item.understandingLevel === "PARTIAL" ? 1 : 0), 0) /
    evaluations.length * 100;
  const subjectAccuracy =
    evaluations.reduce((sum, item) => sum + item.confidencePercent, 0) / evaluations.length;
  const qualityDistribution = evaluations.reduce<Record<string, number>>((acc, item) => {
    acc[item.qualityLabel] = (acc[item.qualityLabel] || 0) + 1;
    return acc;
  }, {});
  return {
    averageRecommendedMarks,
    conceptDetectionAccuracy,
    partialCreditAccuracy,
    subjectAccuracy,
    qualityDistribution,
  };
}

export function buildAssessmentAggregateMetrics(
  evaluations: AssessmentAIEvaluation[]
): AssessmentAggregateMetrics {
  if (!evaluations.length) {
    return {
      conceptUnderstandingPercent: 0,
      memoryRetentionPercent: 0,
      applicationSkillPercent: 0,
      analyticalSkillPercent: 0,
      criticalThinkingPercent: 0,
      writingSkillPercent: 0,
      problemSolvingPercent: 0,
      confidenceScorePercent: 0,
    };
  }

  const average = (getter: (item: AssessmentAIEvaluation) => number) =>
    evaluations.reduce((sum, item) => sum + getter(item), 0) / evaluations.length;

  const conceptUnderstandingPercent = average((item) =>
    (item.conceptMatchScore * 0.45) +
    (item.semanticSimilarityScore * 0.3) +
    (item.completenessScore * 0.25)
  );

  const memoryRetentionPercent = average((item) =>
    (item.exactMatchScore * 0.45) +
    (item.keywordMatchScore * 0.35) +
    (item.completenessScore * 0.2)
  );

  const applicationSkillPercent = average((item) =>
    (item.semanticSimilarityScore * 0.4) +
    (item.logicalFlowScore * 0.35) +
    (item.conceptMatchScore * 0.25)
  );

  const analyticalSkillPercent = average((item) =>
    (item.logicalFlowScore * 0.45) +
    (item.criticalThinkingScore * 0.35) +
    (item.completenessScore * 0.2)
  );

  const criticalThinkingPercent = average((item) => item.criticalThinkingScore);

  const writingSkillPercent = average((item) =>
    (item.grammarScore * 0.45) +
    (item.writingQualityScore * 0.4) +
    (item.logicalFlowScore * 0.15)
  );

  const problemSolvingPercent = average((item) =>
    (item.criticalThinkingScore * 0.4) +
    (item.logicalFlowScore * 0.35) +
    (item.conceptMatchScore * 0.25)
  );

  const confidenceScorePercent = average((item) => item.confidencePercent);

  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value * 100) / 100));

  return {
    conceptUnderstandingPercent: clamp(conceptUnderstandingPercent),
    memoryRetentionPercent: clamp(memoryRetentionPercent),
    applicationSkillPercent: clamp(applicationSkillPercent),
    analyticalSkillPercent: clamp(analyticalSkillPercent),
    criticalThinkingPercent: clamp(criticalThinkingPercent),
    writingSkillPercent: clamp(writingSkillPercent),
    problemSolvingPercent: clamp(problemSolvingPercent),
    confidenceScorePercent: clamp(confidenceScorePercent),
  };
}
