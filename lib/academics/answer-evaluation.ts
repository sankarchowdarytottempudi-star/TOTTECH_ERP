import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

import {
  buildAssessmentAggregateMetrics,
  buildAssessmentSummary,
  evaluateAnswer,
  type AssessmentAIEvaluation,
} from "@/lib/academics/assessment-ai";

const execFileAsync = promisify(execFile);

export type AnswerSheetChunk = {
  question_number: number | null;
  answer_text: string;
};

export type AnswerEvaluationQuestion = {
  question_id: number;
  question_text: string;
  answer_text?: string | null;
  ideal_answer?: string | null;
  keywords?: string | null;
  rubric?: string | null;
  question_type?: string | null;
  question_marks?: number | null;
  bloom_level?: string | null;
  difficulty_level?: string | null;
};

function hasBinaryTool(name: string) {
  return execFileAsync("bash", ["-lc", `command -v ${name} >/dev/null 2>&1`])
    .then(() => true)
    .catch(() => false);
}

export async function saveAnswerSheetFile(
  directory: string,
  originalFileName: string,
  buffer: Buffer
) {
  await fs.mkdir(directory, { recursive: true });
  const safeBase = originalFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
  const storedFileName = `${stamp}-${safeBase}`;
  const filePath = path.join(directory, storedFileName);
  await fs.writeFile(filePath, buffer);
  return {
    filePath,
    storedFileName,
  };
}

async function ocrPdfWithTextTools(filePath: string) {
  const [pdftotextExists, pdfinfoExists, pdftoppmExists, tesseractExists] = await Promise.all([
    hasBinaryTool("pdftotext"),
    hasBinaryTool("pdfinfo"),
    hasBinaryTool("pdftoppm"),
    hasBinaryTool("tesseract"),
  ]);

  let extracted = "";
  let pageCount: number | null = null;

  if (pdftotextExists) {
    const { stdout } = await execFileAsync("pdftotext", ["-layout", "-nopgbrk", filePath, "-"]);
    extracted = String(stdout || "").trim();
  }

  if (pdfinfoExists) {
    try {
      const { stdout } = await execFileAsync("pdfinfo", [filePath]);
      const match = String(stdout || "").match(/^Pages:\s+(\d+)/m);
      pageCount = match ? Number(match[1]) : null;
    } catch {
      pageCount = null;
    }
  }

  if ((!extracted || extracted.length < 50) && pdftoppmExists && tesseractExists) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "answer-eval-"));
    try {
      const prefix = path.join(tempDir, "page");
      await execFileAsync("pdftoppm", ["-png", filePath, prefix]);
      const pageFiles = (await fs.readdir(tempDir))
        .filter((file) => /^page-\d+\.png$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      const pageTexts: string[] = [];
      for (const pageFile of pageFiles) {
        const imagePath = path.join(tempDir, pageFile);
        const { stdout } = await execFileAsync("tesseract", [imagePath, "stdout", "-l", "eng", "--psm", "6"]);
        pageTexts.push(String(stdout || "").trim());
      }
      extracted = pageTexts.filter(Boolean).join("\n\n");
      pageCount = pageFiles.length || pageCount;
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  return {
    text: extracted,
    pageCount: pageCount ?? (extracted ? 1 : 0),
  };
}

async function ocrImageWithTesseract(filePath: string) {
  const tesseractExists = await hasBinaryTool("tesseract");
  if (!tesseractExists) {
    return {
      text: "",
      pageCount: 1,
    };
  }

  const { stdout } = await execFileAsync("tesseract", [filePath, "stdout", "-l", "eng", "--psm", "6"]);
  return {
    text: String(stdout || "").trim(),
    pageCount: 1,
  };
}

export async function extractAnswerSheetText(
  filePath: string,
  mimeType?: string | null
) {
  const normalizedMime = String(mimeType || "").toLowerCase();
  if (normalizedMime.includes("pdf") || filePath.toLowerCase().endsWith(".pdf")) {
    return ocrPdfWithTextTools(filePath);
  }
  return ocrImageWithTesseract(filePath);
}

const questionPattern = /^(?:q(?:uestion)?\s*)?(\d{1,3})[\).\:-]?\s*(.*)$/i;
const answerPattern = /^(?:a(?:ns(?:wer)?)?)?\s*(\d{1,3})[\).\:-]?\s*(.*)$/i;

export function splitAnswerSheetText(
  text: string,
  questionCount: number
): AnswerSheetChunk[] {
  const lines = String(text || "")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const chunks: AnswerSheetChunk[] = [];
  let current: AnswerSheetChunk | null = null;

  const pushCurrent = () => {
    if (current && current.answer_text.trim()) {
      chunks.push({
        question_number: current.question_number,
        answer_text: current.answer_text.trim(),
      });
    }
    current = null;
  };

  for (const line of lines) {
    const match = line.match(questionPattern) || line.match(answerPattern);
    if (match) {
      pushCurrent();
      current = {
        question_number: Number(match[1]) || null,
        answer_text: String(match[2] || "").trim(),
      };
      continue;
    }

    if (!current) {
      current = {
        question_number: null,
        answer_text: line,
      };
    } else {
      current.answer_text = `${current.answer_text}\n${line}`.trim();
    }
  }

  pushCurrent();

  if (chunks.length >= questionCount || !questionCount) {
    return chunks;
  }

  const answerText = String(text || "").trim();
  if (!answerText) {
    return Array.from({ length: questionCount }, (_, index) => ({
      question_number: index + 1,
      answer_text: "",
    }));
  }

  const paragraphParts = answerText
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphParts.length > 1) {
    return Array.from({ length: questionCount }, (_, index) => ({
      question_number: index + 1,
      answer_text: paragraphParts[index] || paragraphParts[paragraphParts.length - 1] || "",
    }));
  }

  const approximateChunkSize = Math.max(1, Math.ceil(answerText.length / questionCount));
  return Array.from({ length: questionCount }, (_, index) => ({
    question_number: index + 1,
    answer_text: answerText.slice(index * approximateChunkSize, (index + 1) * approximateChunkSize).trim(),
  }));
}

export function evaluateQuestionSheet(
  questions: AnswerEvaluationQuestion[],
  studentAnswers: AnswerSheetChunk[],
  input: {
    teacherOverrideMarks?: Record<number, number | null>;
  } = {}
) {
  const evaluations: Array<
    AssessmentAIEvaluation & {
      question_id: number;
      question_number: number;
      max_marks: number;
      student_answer: string;
      ideal_answer: string;
      teacherOverrideMarks: number | null;
    }
  > = [];

  questions.forEach((question, index) => {
    const chunk =
      studentAnswers.find((item) => item.question_number === index + 1) ||
      studentAnswers[index] ||
      { question_number: index + 1, answer_text: "" };
    const maxMarks = Number(question.question_marks || 0);
    const evaluation = evaluateAnswer({
      questionText: question.question_text,
      idealAnswer: question.ideal_answer || question.answer_text || question.question_text,
      rubric: question.rubric,
      keywords: question.keywords,
      studentAnswer: chunk.answer_text,
      maxMarks,
      questionType: question.question_type,
    });

    evaluations.push({
      question_id: question.question_id,
      question_number: index + 1,
      max_marks: maxMarks,
      student_answer: chunk.answer_text,
      ideal_answer: String(question.ideal_answer || question.answer_text || question.question_text || ""),
      teacherOverrideMarks: input.teacherOverrideMarks?.[question.question_id] ?? null,
      ...evaluation,
    });
  });

  return {
    evaluations,
    aggregate: buildAssessmentAggregateMetrics(evaluations),
    summary: buildAssessmentSummary(evaluations),
  };
}

export function answerEvaluationDisplayName(studentName?: string | null, admissionNumber?: string | null) {
  return [
    String(studentName || "").trim(),
    String(admissionNumber || "").trim(),
  ]
    .filter(Boolean)
    .join(" • ") || "-";
}
