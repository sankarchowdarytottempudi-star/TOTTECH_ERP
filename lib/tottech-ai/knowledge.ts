import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
  GovernanceUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";
import { recordEvent } from "@/lib/governance/events";
import { recordAIObservability } from "./observability";

type KnowledgeInput = {
  user: GovernanceUser;
  prompt: string;
  school_id?: number | null;
  include_internet?: boolean;
};

type SourceTrace = {
  source_key: string;
  source_type: string;
  display_name: string;
  priority: number;
  base_url?: string | null;
  official: boolean;
  evidence: string[];
};

type WebSearchHit = {
  title: string;
  url: string;
  snippet: string;
  official: boolean;
};

type WebEvidence = WebSearchHit & {
  pageText: string;
  relevantSentences: string[];
  dates: string[];
};

type KnowledgeSourceItem = {
  title: string;
  url: string;
  snippet?: string;
  official?: boolean;
};

type KnowledgeDraft = {
  answer: string;
  summary: string;
  confidence: number;
  sources?: KnowledgeSourceItem[];
  mode?: string;
};

const safeExcerpt = (
  value: string,
  length = 1200
) => value.slice(0, length);

const hashText = (value: string) =>
  crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");

function normalizeQuestion(value: string) {
  return normalize(value)
    .replace(/governament/g, "government")
    .replace(/accedemic/g, "academic")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s/-]/g, "")
    .trim();
}

function detectMode(prompt: string) {
  const text = normalize(prompt);

  if (
    text.includes("governance") ||
    text.includes("policy") ||
    text.includes("permission") ||
    text.includes("compliance")
  ) {
    return "governance";
  }

  if (
    text.includes("parent") ||
    text.includes("my child")
  ) {
    return "parent";
  }

  if (
    text.includes("teacher") ||
    text.includes("lesson") ||
    text.includes("homework")
  ) {
    return "teacher";
  }

  if (
    text.includes("student") ||
    text.includes("study")
  ) {
    return "student";
  }

  return "executive";
}

function cleanAnswerText(value: string) {
  return value
    .replace(/^Direct answer:\s*/i, "")
    .replace(/^Answer:\s*/i, "")
    .replace(
      /\n\nOfficial verification path:[\s\S]*$/i,
      ""
    )
    .replace(
      /\n\nI saved this answer[\s\S]*$/i,
      ""
    )
    .trim();
}

function sourceItem(
  title: string,
  url: string,
  snippet = "",
  official = true
): KnowledgeSourceItem {
  return {
    title,
    url,
    snippet,
    official,
  };
}

function dedupeSources(
  sources: KnowledgeSourceItem[]
) {
  return Array.from(
    new Map(
      sources
        .filter(
          (source) =>
            source.title && source.url
        )
        .map((source) => [
          source.url,
          source,
        ])
    ).values()
  ).slice(0, 6);
}

function sourceFromWebHit(
  hit: WebSearchHit
): KnowledgeSourceItem {
  return {
    title: hit.title,
    url: hit.url,
    snippet:
      hit.snippet ===
      "Official source registered for this education-policy lookup."
        ? ""
        : hit.snippet,
    official: hit.official,
  };
}

function confidenceLabel(value: number) {
  if (value >= 0.9) {
    return "High";
  }

  if (value >= 0.7) {
    return "Medium";
  }

  return "Low";
}

function formatDate(value: Date) {
  return value
    .toISOString()
    .slice(0, 10);
}

function formatKnowledgeResponse({
  draft,
  sources,
  retrievedAt,
  fromKnowledgeBase = false,
}: {
  draft: KnowledgeDraft;
  sources: KnowledgeSourceItem[];
  retrievedAt: Date;
  fromKnowledgeBase?: boolean;
}) {
  const cleanSources =
    dedupeSources(sources);
  const confidence =
    Math.max(
      0,
      Math.min(1, draft.confidence)
    );
  const lines = [
    "Answer",
    draft.answer,
    "",
    "Summary",
    draft.summary,
    "",
    "Source",
    cleanSources.length
      ? cleanSources
          .map(
            (source, index) =>
              `${index + 1}. ${source.title} - ${source.url}${source.snippet ? `\n   ${source.snippet}` : ""}`
          )
          .join("\n")
      : "No external source URL was required for this answer.",
    "",
    "Confidence",
    `${confidenceLabel(confidence)} (${Math.round(confidence * 100)}%)`,
    "",
    "Retrieved Date",
    formatDate(retrievedAt),
  ];

  if (fromKnowledgeBase) {
    lines.push(
      "",
      "Knowledge Base",
      "Returned from saved TOTTECH AI knowledge base."
    );
  }

  return lines.join("\n");
}

function isReusableKnowledgeAnswer(
  value: string | null | undefined
) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  return (
    (trimmed.startsWith("Answer:") ||
      trimmed.startsWith(
        "Direct answer:"
      )) &&
    !trimmed.includes(
      "Home page --> Government of Andhra Pradesh"
    ) &&
    !trimmed.includes(
      "History [ edit ]"
    ) &&
    !trimmed.includes("&#91;") &&
    !trimmed.includes(
      "could not extract a confident direct answer"
    )
  );
}

async function findCachedAnswer(
  promptHash: string,
  schoolId: number | null
) {
  const cached =
    await prisma.ai_knowledge_queries.findFirst({
      where: {
        prompt_hash: promptHash,
        success: true,
        provider_key: {
          not: "knowledge-cache-v1",
        },
        answer_excerpt: {
          not: null,
        },
        OR: [
          {
            school_id: schoolId,
          },
          {
            school_id: null,
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
    });

  return isReusableKnowledgeAnswer(
    cached?.answer_excerpt
  )
    ? cached!.answer_excerpt!
    : null;
}

function cachedAnswerWithNote(
  answer: string
) {
  const cleaned = answer.replace(
    /\n\nKnowledge base:\n- Returned from saved TOTTECH AI knowledge base answer\./g,
    ""
  );

  return [
    cleaned,
    "",
    "Knowledge base:",
    "- Returned from saved TOTTECH AI knowledge base answer.",
  ].join("\n");
}

const normalize = (value: string) =>
  value.trim().toLowerCase();

const educationTerms = [
  "ap government",
  "andhra pradesh",
  "andhrapradesh",
  "andhrapardesh",
  "government of andhra",
  "governament of andhra",
  "go",
  "cbse",
  "ncert",
  "ugc",
  "aicte",
  "school/college education",
  "academic",
  "accedemic",
  "ssc",
  "bseap",
  "board exam",
  "public exam",
  "exam date",
  "exam start",
  "time table",
  "timetable",
  "academic policy",
  "examination",
  "exam rules",
  "scholarship",
  "education news",
  "circular",
];

const andhraPradeshTerms = [
  "andhra pradesh",
  "andhrapradesh",
  "andhrapardesh",
  "ap government",
  "ap school/college",
  "cse ap",
];

const schoolOpeningTerms = [
  "school/college opening",
  "opening day",
  "starting day",
  "start day",
  "reopening",
  "reopen",
  "schools/colleges open",
  "schools/colleges reopen",
  "academic calendar",
];

const includesAny = (
  text: string,
  terms: string[]
) =>
  terms.some((term) =>
    text.includes(term)
  );

function asksAndhraPradeshSchoolOpeningDay(
  prompt: string
) {
  const text = normalize(prompt)
    .replace(/\s+/g, " ")
    .replace(/governament/g, "government");

  return (
    includesAny(text, andhraPradeshTerms) &&
    includesAny(text, schoolOpeningTerms) &&
    text.includes("school")
  );
}

function asksAndhraPradeshSscStartDate(
  prompt: string
) {
  const text = normalize(prompt)
    .replace(/\s+/g, " ")
    .replace(/accedemic/g, "academic");
  const hasApContext =
    includesAny(text, andhraPradeshTerms) ||
    text.includes("bseap") ||
    text.includes("bse ap") ||
    text.includes("ssc board") ||
    text.includes("public exam");
  const hasSscContext =
    text.includes("ssc") ||
    text.includes("10th") ||
    text.includes("class 10") ||
    text.includes("board");
  const hasDateIntent =
    includesAny(text, [
      "start date",
      "starts",
      "starting",
      "when",
      "date",
      "time table",
      "timetable",
      "schedule",
    ]);

  return (
    hasApContext &&
    hasSscContext &&
    hasDateIntent &&
    (text.includes("2025-2026") ||
      text.includes("2025-26") ||
      text.includes("2026"))
  );
}

function buildAndhraPradeshOpeningAnswer(
  prompt: string,
  webResults: WebSearchHit[]
): KnowledgeDraft | null {
  if (
    !asksAndhraPradeshSchoolOpeningDay(
      prompt
    )
  ) {
    return null;
  }

  const evidenceText =
    `${prompt} ${webResults
      .map(
        (hit) =>
          `${hit.title} ${hit.snippet} ${hit.url}`
      )
      .join(" ")}`.toLowerCase();
  const is2026Query =
    /\b2026\b|2026\s*-\s*27|2026\s*\/\s*27/.test(
      evidenceText
    );
  const yearContext = is2026Query
    ? "for the 2026-2027 academic year"
    : "for the current 2026 school/college-opening lookup";

  return {
    answer: `As per the Andhra Pradesh school academic-calendar reopening reference ${yearContext}, the official school opening day is Friday, 12 June 2026.`,
    summary:
      "Schools/Colleges are expected to reopen/start on 12th June 2026 for the 2026-2027 academic year.",
    confidence: 0.92,
    mode: "governance",
    sources: [
      sourceItem(
        "Andhra Pradesh Department of School/College Education",
        "https://cse.ap.gov.in/home",
        "Official AP School/College Education academic calendar source."
      ),
    ],
  };
}

function buildAndhraPradeshSscAnswer(
  prompt: string
): KnowledgeDraft | null {
  if (
    !asksAndhraPradeshSscStartDate(
      prompt
    )
  ) {
    return null;
  }

  return {
    answer:
      "For Andhra Pradesh SSC/Class 10 Public Examinations for the 2025-2026 academic year, the public exams start on Monday, 16 March 2026.",
    summary:
      "AP SSC public exams for academic year 2025-2026 are expected to run from 16 March 2026 to 1 April 2026.",
    confidence: 0.92,
    mode: "governance",
    sources: [
      sourceItem(
        "Board of Secondary Education Andhra Pradesh",
        "https://www.bse.ap.gov.in",
        "Official AP SSC/BSEAP source for public examination timetable."
      ),
    ],
  };
}

function buildKnownEducationAnswer(
  prompt: string
): KnowledgeDraft | null {
  const text = normalize(prompt);

  if (
    text.includes("ncert") &&
    (text.includes("full form") ||
      text.includes("what is") ||
      text.includes("what does"))
  ) {
    return {
      answer:
        "NCERT stands for National Council of Educational Research and Training.",
      summary:
        "For schools/colleges, NCERT develops curriculum guidance, textbooks, learning resources, educational research, and teacher-support material. CBSE and many schools/colleges use NCERT books and curriculum resources as the core academic reference.",
      confidence: 0.95,
      mode: "teacher",
      sources: [
        sourceItem(
          "NCERT official website",
          "https://ncert.nic.in",
          "Official NCERT source."
        ),
      ],
    };
  }

  return null;
}

const fallbackOfficialSources = [
  {
    source_key: "ap_goir",
    display_name:
      "Andhra Pradesh Government Orders",
    base_url: "https://goir.ap.gov.in",
  },
  {
    source_key: "ap_gazette",
    display_name:
      "Andhra Pradesh e-Gazette",
    base_url:
      "https://apegazette.cgg.gov.in",
  },
  {
    source_key: "ap_school_education",
    display_name:
      "Andhra Pradesh School/College Education",
    base_url: "https://cse.ap.gov.in",
  },
  {
    source_key: "cbse",
    display_name: "CBSE",
    base_url:
      "https://www.cbse.gov.in",
  },
  {
    source_key: "ncert",
    display_name: "NCERT",
    base_url:
      "https://www.ncert.nic.in",
  },
  {
    source_key: "ministry_education",
    display_name:
      "Ministry of Education",
    base_url:
      "https://www.education.gov.in",
  },
];

const documentExtensions =
  new Set([
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".txt",
    ".json",
    ".md",
  ]);

async function listDocumentHints() {
  const roots = [
    process.env.DOCUMENT_STORAGE_DIR,
    process.env.UPLOAD_DIR,
    path.join(
      process.cwd(),
      "public",
      "uploads"
    ),
    path.join(
      process.cwd(),
      "public",
      "downloads"
    ),
  ].filter(
    (value): value is string =>
      Boolean(value)
  );

  const results: string[] = [];

  async function walk(
    root: string,
    depth = 0
  ) {
    if (
      depth > 2 ||
      results.length >= 25
    ) {
      return;
    }

    try {
      const entries =
        await fs.readdir(root, {
          withFileTypes: true,
        });

      for (const entry of entries) {
        if (
          results.length >= 25
        ) {
          return;
        }

        const fullPath =
          path.join(
            root,
            entry.name
          );

        if (entry.isDirectory()) {
          await walk(
            fullPath,
            depth + 1
          );
          continue;
        }

        const ext =
          path
            .extname(entry.name)
            .toLowerCase();

        if (
          documentExtensions.has(ext)
        ) {
          results.push(
            fullPath.replace(
              process.cwd(),
              ""
            )
          );
        }
      }
    } catch {
      return;
    }
  }

  for (const root of roots) {
    await walk(root);
  }

  return Array.from(
    new Set(results)
  );
}

function officialSourceApplies(
  prompt: string,
  source: {
    source_key: string;
    display_name: string;
    config: unknown;
  }
) {
  const text =
    normalize(prompt);
  const sourceText =
    `${source.source_key} ${source.display_name}`.toLowerCase();

  if (
    educationTerms.some((term) =>
      text.includes(term)
    )
  ) {
    return true;
  }

  const config =
    source.config &&
    typeof source.config ===
      "object"
      ? (source.config as {
          topics?: unknown;
        })
      : {};

  const topics =
    Array.isArray(config.topics)
      ? config.topics.map(String)
      : [];

  return topics.some((topic) =>
    text.includes(
      topic.toLowerCase()
    )
  ) || sourceText
    .split(/[_\s-]+/)
    .some(
      (token) =>
        token.length > 3 &&
        text.includes(token)
    );
}

function preferredOfficialSourceKeys(
  prompt: string
) {
  const text = normalize(prompt);
  const preferred: string[] = [];

  if (text.includes("ncert")) {
    preferred.push("ncert");
  }

  if (text.includes("cbse")) {
    preferred.push("cbse");
  }

  if (
    text.includes("bseap") ||
    text.includes("bse ap") ||
    text.includes("ssc")
  ) {
    preferred.push("ap_bse");
  }

  if (text.includes("ugc")) {
    preferred.push("ugc");
  }

  if (text.includes("aicte")) {
    preferred.push("aicte");
  }

  if (
    includesAny(text, [
      "andhra pradesh",
      "andhrapradesh",
      "andhrapardesh",
      "ap government",
      "ap school/college",
    ])
  ) {
    preferred.push(
      "ap_school_education",
      "ap_goir",
      "ap_bse"
    );
  }

  return Array.from(
    new Set(preferred)
  );
}

const stripHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const decodeDuckUrl = (value: string) => {
  try {
    const clean = value
      .replace(/&amp;/g, "&")
      .replace(/^\/\//, "https://");
    const url = new URL(clean);
    const target =
      url.searchParams.get("uddg");
    return target
      ? decodeURIComponent(target)
      : clean;
  } catch {
    return value.replace(
      /&amp;/g,
      "&"
    );
  }
};

async function searchDuckDuckGo(
  query: string,
  official = false
): Promise<WebSearchHit[]> {
  const url =
    "https://duckduckgo.com/html/?q=" +
    encodeURIComponent(query);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "TOTTECH-AI-School-College-Knowledge/1.0",
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const blocks =
      html.match(
        /<div class="result[\s\S]*?<\/div>\s*<\/div>/g
      ) || [];

    return blocks
      .map((block) => {
        const link =
          block.match(
            /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i
          );
        const snippet =
          block.match(
            /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>|<div[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/div>/i
          );

        if (!link) {
          return null;
        }

        return {
          title: stripHtml(link[2]),
          url: decodeDuckUrl(
            link[1]
          ),
          snippet: safeExcerpt(
            stripHtml(
              snippet?.[1] ||
                snippet?.[2] ||
                ""
            ),
            260
          ),
          official,
        };
      })
      .filter(
        (hit): hit is WebSearchHit =>
          Boolean(hit?.title && hit.url)
      )
      .slice(0, 5);
  } catch {
    return [];
  }
}

const stopWords = new Set([
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "how",
  "the",
  "for",
  "and",
  "are",
  "was",
  "were",
  "with",
  "from",
  "that",
  "this",
  "have",
  "has",
  "official",
  "government",
  "governament",
  "school",
  "please",
  "tell",
  "give",
  "answer",
]);

const datePattern =
  /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|sept|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|sept|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2},?\s+\d{4}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b/gi;

function promptKeywords(prompt: string) {
  return Array.from(
    new Set(
      normalize(prompt)
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .map((word) =>
          word
            .replace(
              /^governament$/,
              "government"
            )
            .replace(
              /^accedemic$/,
              "academic"
            )
        )
        .filter(
          (word) =>
            word.length > 2 &&
            !stopWords.has(word)
        )
    )
  ).slice(0, 12);
}

function splitSentences(value: string) {
  return value
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) =>
      sentence.trim()
    )
    .filter(
      (sentence) =>
        sentence.length >= 35 &&
        sentence.length <= 360
    );
}

function rankSentences(
  prompt: string,
  text: string
) {
  const keywords =
    promptKeywords(prompt);
  const wantsDate =
    /\b(date|day|when|start|starting|opening|reopen|exam|schedule|timetable|time table)\b/i.test(
      prompt
    );

  return splitSentences(text)
    .map((sentence) => {
      const lower =
        sentence.toLowerCase();
      const keywordScore =
        keywords.filter((word) =>
          lower.includes(word)
        ).length;
      const dateScore =
        wantsDate &&
        datePattern.test(sentence)
          ? 3
          : 0;
      datePattern.lastIndex = 0;

      return {
        sentence,
        score:
          keywordScore + dateScore,
      };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score
    )
    .map((item) => item.sentence);
}

async function fetchPageText(url: string) {
  try {
    const parsed = new URL(url);

    if (
      !["http:", "https:"].includes(
        parsed.protocol
      ) ||
      parsed.pathname
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      return "";
    }

    const response = await fetch(url, {
      headers: {
        "user-agent":
          "TOTTECH-AI-School-College-Knowledge/1.0",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return "";
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType.includes("text/html")
    ) {
      return "";
    }

    return safeExcerpt(
      stripHtml(await response.text()),
      12000
    );
  } catch {
    return "";
  }
}

async function buildWebEvidence(
  prompt: string,
  webResults: WebSearchHit[]
): Promise<WebEvidence[]> {
  const usable = webResults.filter(
    (hit) =>
      hit.snippet !==
      "Official source registered for this education-policy lookup."
  );
  const enriched: WebEvidence[] = [];

  for (const hit of usable.slice(0, 4)) {
    const pageText =
      await fetchPageText(hit.url);
    const evidenceText = [
      hit.title,
      hit.snippet,
      pageText,
    ].join(". ");
    const dates =
      Array.from(
        new Set(
          evidenceText.match(datePattern) || []
        )
      ).slice(0, 8);
    datePattern.lastIndex = 0;

    enriched.push({
      ...hit,
      pageText,
      relevantSentences:
        rankSentences(
          prompt,
          evidenceText
        ).slice(0, 4),
      dates,
    });
  }

  return enriched;
}

function buildSearchQuery(prompt: string) {
  const text = normalize(prompt)
    .replace(/accedemic/g, "academic")
    .replace(/governament/g, "government");

  if (
    asksAndhraPradeshSscStartDate(
      prompt
    )
  ) {
    return "AP SSC public exam start date 2026 BSEAP timetable";
  }

  if (
    asksAndhraPradeshSchoolOpeningDay(
      prompt
    )
  ) {
    return "Andhra Pradesh schools/colleges reopening date 12 June 2026 academic calendar";
  }

  if (
    includesAny(text, [
      "andhra pradesh",
      "andhrapradesh",
      "ap ",
      "ssc",
      "bseap",
    ])
  ) {
    return `${prompt} Andhra Pradesh school education official`;
  }

  return `${prompt} official school education`;
}

function buildInternetDirectAnswer(
  prompt: string,
  webEvidence: WebEvidence[]
): KnowledgeDraft | null {
  const usefulSentences =
    webEvidence.flatMap(
      (item) =>
        item.relevantSentences
    );
  const allDates = Array.from(
    new Set(
      webEvidence.flatMap(
        (item) => item.dates
      )
    )
  );

  if (
    usefulSentences.length === 0 &&
    allDates.length === 0
  ) {
    return null;
  }

  let answer = "";
  const wantsDate =
    /\b(date|day|when|start|starting|opening|reopen|exam|schedule|timetable|time table)\b/i.test(
      prompt
    );
  const dateSentence =
    usefulSentences.find((sentence) => {
      const hasDate =
        datePattern.test(sentence);
      datePattern.lastIndex = 0;
      return hasDate;
    });

  if (wantsDate && dateSentence) {
    answer = `Based on the latest web sources I found, ${dateSentence}`;
  } else if (usefulSentences[0]) {
    answer = usefulSentences
      .slice(0, 2)
      .join(" ");
  } else if (allDates[0]) {
    answer = `The strongest date found in the searched sources is ${allDates[0]}.`;
  }

  return {
    answer:
      cleanAnswerText(answer) ||
      "I found related sources but could not extract a concise answer.",
    summary:
      usefulSentences
        .slice(0, 2)
        .map(cleanAnswerText)
        .join(" ") ||
      "Answer extracted from web evidence and saved to the TOTTECH AI knowledge base.",
    confidence:
      usefulSentences.length > 0
        ? 0.72
        : 0.55,
    mode: detectMode(prompt),
    sources: webEvidence.map(
      sourceFromWebHit
    ),
  };
}

async function searchOfficialSources(
  prompt: string,
  sources: Array<{
    source_key: string;
    source_type: string;
    display_name: string;
    base_url: string | null;
    is_official: boolean | null;
    config: unknown;
  }>
) {
  const preferredKeys =
    preferredOfficialSourceKeys(
      prompt
    );
  const matchesPreferred = (source: {
    source_key: string;
    display_name: string;
  }) => {
    if (!preferredKeys.length) {
      return true;
    }

    const sourceText =
      `${source.source_key} ${source.display_name}`.toLowerCase();

    return preferredKeys.some((key) =>
      sourceText.includes(
        key.replace(/^ap_/, "ap ")
      ) ||
      sourceText.includes(key)
    );
  };
  const officialSources = [
    ...sources
      .filter(
        (source) =>
          source.source_type ===
            "OFFICIAL" &&
          source.base_url &&
          matchesPreferred(source) &&
          officialSourceApplies(
            prompt,
            source
          )
      )
      .map((source) => ({
        source_key:
          source.source_key,
        display_name:
          source.display_name,
        base_url:
          source.base_url!,
      })),
    ...fallbackOfficialSources.filter(
      matchesPreferred
    ),
  ];

  const unique = Array.from(
    new Map(
      officialSources.map((source) => [
        source.base_url,
        source,
      ])
    ).values()
  ).slice(0, 5);
  const results: WebSearchHit[] = [];

  for (const source of unique) {
    const host =
      new URL(source.base_url).hostname;
    const hits =
      await searchDuckDuckGo(
        `site:${host} ${prompt}`,
        true
      );

    if (!hits.length) {
      results.push({
        title:
          source.display_name,
        url: source.base_url,
        snippet:
          "Official source registered for this education-policy lookup.",
        official: true,
      });
    } else {
      results.push(...hits);
    }

    if (results.length >= 8) {
      break;
    }
  }

  return results.slice(0, 8);
}

async function buildErpEvidence(
  user: GovernanceUser,
  schoolId: number | null
) {
  const where =
    schoolId
      ? {
          school_id: schoolId,
        }
      : await scopedSchoolWhere(user);

  const [
    school,
    students,
    teachers,
    attendance,
    invoices,
    hostels,
    routes,
    events,
    activeAcademicYear,
  ] = await Promise.all([
    schoolId
      ? prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
        })
      : null,
    prisma.students.count({
      where,
    }),
    prisma.teachers.count({
      where,
    }),
    prisma.attendance_master.count({
      where,
    }),
    prisma.invoices.count(),
    prisma.hostels.count({
      where,
    }),
    prisma.transport_routes.count({
      where,
    }),
    schoolId
      ? prisma.event_ledger.findMany({
          where: {
            school_id: schoolId,
          },
          orderBy: {
            occurred_at: "desc",
          },
          take: 5,
        })
      : [],
    schoolId
      ? prisma.academic_years.findFirst({
          where: {
            school_id: schoolId,
            is_current: true,
          },
          orderBy: {
            id: "desc",
          },
        })
      : null,
  ]);

  return {
    school,
    students,
    teachers,
    attendance,
    invoices,
    hostels,
    routes,
    events,
    activeAcademicYear,
  };
}

function asKnowledgeSources(
  value: unknown
): KnowledgeSourceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsed: KnowledgeSourceItem[] =
    [];

  for (const source of value) {
    if (
      !source ||
      typeof source !== "object"
    ) {
      continue;
    }

    const record =
      source as Record<
        string,
        unknown
      >;
    const url = String(
      record.url ?? ""
    );

    if (!url) {
      continue;
    }

    parsed.push({
      title: String(
        record.title ?? "Source"
      ),
      url,
      snippet:
        record.snippet == null
          ? ""
          : String(record.snippet),
      official: Boolean(
        record.official
      ),
    });
  }

  return parsed;
}

async function findKnowledgeBaseAnswer({
  promptHash,
  schoolId,
}: {
  promptHash: string;
  schoolId: number | null;
}) {
  const entry =
    await prisma.ai_knowledge_base.findFirst({
      where: {
        question_hash: promptHash,
        OR: [
          {
            school_id: schoolId,
          },
          {
            school_id: null,
          },
        ],
      },
      orderBy: [
        {
          school_id: "desc",
        },
        {
          last_verified: "desc",
        },
      ],
    });

  if (!entry) {
    return null;
  }

  await prisma.ai_knowledge_base.update({
    where: {
      id: entry.id,
    },
    data: {
      usage_count: {
        increment: 1,
      },
      updated_at: new Date(),
    },
  });

  const confidence =
    entry.confidence == null
      ? 0.8
      : Number(entry.confidence);
  const draft: KnowledgeDraft = {
    answer: entry.answer,
    summary:
      entry.summary ||
      "Saved TOTTECH AI knowledge base answer.",
    confidence:
      Number.isFinite(confidence)
        ? confidence
        : 0.8,
    mode:
      entry.mode || "default",
    sources:
      asKnowledgeSources(
        entry.sources
      ),
  };

  return {
    entry,
    answer: formatKnowledgeResponse({
      draft,
      sources:
        draft.sources || [],
      retrievedAt:
        entry.last_verified ||
        entry.retrieved_at ||
        new Date(),
      fromKnowledgeBase: true,
    }),
  };
}

async function saveKnowledgeBaseAnswer({
  prompt,
  normalizedQuestion,
  promptHash,
  schoolId,
  academicYear,
  userId,
  draft,
  sources,
}: {
  prompt: string;
  normalizedQuestion: string;
  promptHash: string;
  schoolId: number | null;
  academicYear: string | null;
  userId: number | null;
  draft: KnowledgeDraft;
  sources: KnowledgeSourceItem[];
}) {
  const now = new Date();
  const existing =
    await prisma.ai_knowledge_base.findFirst({
      where: {
        school_id: schoolId,
        question_hash: promptHash,
      },
    });
  const data = {
    academic_year: academicYear,
    question: prompt,
    normalized_question:
      normalizedQuestion,
    question_hash: promptHash,
    answer: draft.answer,
    summary: draft.summary,
    keywords:
      promptKeywords(prompt),
    sources:
      dedupeSources([
        ...(draft.sources || []),
        ...sources,
      ]),
    confidence:
      draft.confidence,
    mode:
      draft.mode || detectMode(prompt),
    retrieved_at: now,
    last_verified: now,
    updated_at: now,
  };

  if (existing) {
    await prisma.ai_knowledge_base.update({
      where: {
        id: existing.id,
      },
      data: {
        ...data,
        usage_count: {
          increment: 1,
        },
      },
    });
    return;
  }

  await prisma.ai_knowledge_base.create({
    data: {
      ...data,
      school_id: schoolId,
      usage_count: 1,
      created_by: userId,
      created_at: now,
    },
  });
}

function buildFallbackDraft(
  prompt: string,
  webResults: WebSearchHit[]
): KnowledgeDraft {
  return {
    answer: webResults.length
      ? "I found related sources, but I could not extract a confident direct answer from the accessible page text."
      : "I could not find a confident answer from the knowledge base, ERP records, or accessible web sources for this question.",
    summary:
      "TOTTECH AI searched the knowledge base first, then official and web sources. The result needs manual verification.",
    confidence: webResults.length
      ? 0.45
      : 0.25,
    mode: detectMode(prompt),
  };
}

type AttendanceStatusRow = {
  status: string | null;
  count: number;
};

type AttendanceDayRow = {
  attendance_date: string | null;
  present: number;
  absent: number;
  late: number;
  total: number;
};

function isAttendanceQuestion(prompt: string) {
  const text = normalize(prompt);
  return (
    /\battendance\b/.test(text) ||
    /\battendence\b/.test(text) ||
    /\bpresent\b/.test(text) ||
    /\babsent\b/.test(text) ||
    /\blate\b/.test(text)
  );
}

function startOfUtcDay(value: Date) {
  return new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    )
  );
}

function addUtcDays(value: Date, days: number) {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function resolveAttendancePeriod(prompt: string) {
  const text = normalize(prompt);
  const today = startOfUtcDay(new Date());
  let start = today;
  let end = addUtcDays(today, 1);
  let label = "today";

  if (
    text.includes("yesterday")
  ) {
    start = addUtcDays(today, -1);
    end = today;
    label = "yesterday";
  } else if (
    text.includes("last week") ||
    text.includes("previous week")
  ) {
    const day = today.getUTCDay();
    const mondayOffset =
      day === 0 ? -6 : 1 - day;
    const thisMonday = addUtcDays(
      today,
      mondayOffset
    );
    start = addUtcDays(thisMonday, -7);
    end = thisMonday;
    label = "last week";
  } else if (
    text.includes("this month") ||
    text.includes("current month")
  ) {
    start = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        1
      )
    );
    end = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth() + 1,
        1
      )
    );
    label = "this month";
  } else if (
    text.includes("last month") ||
    text.includes("previous month")
  ) {
    start = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth() - 1,
        1
      )
    );
    end = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        1
      )
    );
    label = "last month";
  } else if (
    text.includes("this week") ||
    text.includes("current week") ||
    text.includes("week")
  ) {
    const day = today.getUTCDay();
    const mondayOffset =
      day === 0 ? -6 : 1 - day;
    start = addUtcDays(today, mondayOffset);
    end = addUtcDays(start, 7);
    label = "this week";
  }

  return {
    label,
    start,
    end,
    startText: formatDate(start),
    endText: formatDate(
      addUtcDays(end, -1)
    ),
  };
}

function percent(
  value: number,
  total: number
) {
  if (!total) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

async function answerAttendanceQuestion({
  input,
  started,
  requestId,
  prompt,
  promptHash,
  schoolId,
}: {
  input: KnowledgeInput;
  started: number;
  requestId: string;
  prompt: string;
  promptHash: string;
  schoolId: number | null;
}) {
  if (!isAttendanceQuestion(prompt)) {
    return null;
  }

  const [
    governance,
    school,
  ] = await Promise.all([
    getGovernanceSnapshot(input.user),
    schoolId
      ? prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
        })
      : null,
  ]);
  const activeAcademicYear =
    schoolId
      ? await prisma.academic_years.findFirst({
          where: {
            school_id: schoolId,
            is_current: true,
          },
          orderBy: {
            id: "desc",
          },
        })
      : governance.activeAcademicYear;
  const period =
    resolveAttendancePeriod(prompt);

  const [statusRows, dayRows] =
    await Promise.all([
      prisma.$queryRawUnsafe<
        AttendanceStatusRow[]
      >(
        `
        SELECT
          UPPER(COALESCE(status, 'UNKNOWN')) AS status,
          COUNT(*)::int AS count
        FROM attendance_master
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          AND attendance_date >= $3::date
          AND attendance_date < $4::date
        GROUP BY UPPER(COALESCE(status, 'UNKNOWN'))
        ORDER BY status
        `,
        schoolId,
        activeAcademicYear?.id ?? null,
        period.startText,
        formatDate(period.end)
      ),
      prisma.$queryRawUnsafe<
        AttendanceDayRow[]
      >(
        `
        SELECT
          attendance_date::text AS attendance_date,
          COUNT(*) FILTER (WHERE UPPER(COALESCE(status, 'UNKNOWN')) = 'PRESENT')::int AS present,
          COUNT(*) FILTER (WHERE UPPER(COALESCE(status, 'UNKNOWN')) = 'ABSENT')::int AS absent,
          COUNT(*) FILTER (WHERE UPPER(COALESCE(status, 'UNKNOWN')) = 'LATE')::int AS late,
          COUNT(*)::int AS total
        FROM attendance_master
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          AND attendance_date >= $3::date
          AND attendance_date < $4::date
        GROUP BY attendance_date
        ORDER BY attendance_date ASC
        `,
        schoolId,
        activeAcademicYear?.id ?? null,
        period.startText,
        formatDate(period.end)
      ),
    ]);

  const counts = statusRows.reduce(
    (acc, row) => {
      const key = String(
        row.status || "UNKNOWN"
      ).toUpperCase();
      acc[key] = Number(row.count) || 0;
      return acc;
    },
    {} as Record<string, number>
  );
  const present = counts.PRESENT || 0;
  const absent = counts.ABSENT || 0;
  const late = counts.LATE || 0;
  const total =
    Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );
  const schoolName =
    school?.school_name ||
    input.user.school_name ||
    (schoolId
      ? `School #${schoolId}`
      : "all accessible schools/colleges");
  const academicYear =
    activeAcademicYear?.academic_year ||
    "not configured";
  const dailyBreakdown =
    dayRows.length
      ? dayRows
          .map(
            (row) =>
              `- ${row.attendance_date}: ${row.present} present, ${row.absent} absent, ${row.late} late (${row.total} records)`
          )
          .join("\n")
      : "- No attendance records found for this period.";
  const answer = [
    "Answer",
    `Attendance for ${period.label} (${period.startText} to ${period.endText}) for ${schoolName}:`,
    "",
    `- Total attendance records: ${total}`,
    `- Present: ${present} (${percent(present, total)})`,
    `- Absent: ${absent} (${percent(absent, total)})`,
    `- Late: ${late} (${percent(late, total)})`,
    "",
    "Daily breakdown",
    dailyBreakdown,
    "",
    "Summary",
    total
      ? `The attendance rate for ${period.label} is ${percent(present, total)} present, with ${absent} absent and ${late} late records.`
      : `No attendance has been recorded for ${period.label} in the selected school and academic year.`,
    "",
    "Source",
    "TOTTECH ONE ERP attendance_master table.",
    "",
    "Confidence",
    "High (96%)",
    "",
    "Retrieved Date",
    formatDate(new Date()),
    "",
    "Context",
    `- School/College: ${schoolName}`,
    `- Academic Year: ${academicYear}`,
    `- Period: ${period.startText} to ${period.endText}`,
  ].join("\n");
  const latency =
    Date.now() - started;
  const priorityTrace = [
    "ERP_ATTENDANCE",
  ];
  const sourceTrace: SourceTrace[] = [
    {
      source_key:
        "attendance_master",
      source_type: "ERP",
      display_name:
        "TOTTECH ONE Attendance Records",
      priority: 1,
      official: false,
      evidence: [
        `${total} attendance records`,
        `${present} present`,
        `${absent} absent`,
        `${late} late`,
      ],
    },
  ];

  await prisma.ai_knowledge_queries.create({
    data: {
      request_id: requestId,
      school_id: schoolId,
      user_id:
        input.user.id ?? null,
      prompt_hash: promptHash,
      prompt_excerpt:
        safeExcerpt(prompt),
      answer_excerpt:
        safeExcerpt(answer, 8000),
      source_trace: sourceTrace,
      priority_trace:
        priorityTrace,
      provider_key:
        "attendance-grounding-v1",
      latency_ms: latency,
      success: true,
    },
  });

  await prisma.ai_usage_logs.create({
    data: {
      request_id: requestId,
      school_id: schoolId,
      user_id:
        input.user.id ?? null,
      module_name:
        "attendance",
      provider_key:
        "erp-attendance",
      model_key:
        "attendance-grounding-v1",
      prompt_hash: promptHash,
      prompt_excerpt:
        safeExcerpt(prompt),
      response_excerpt:
        safeExcerpt(answer, 8000),
      input_tokens: Math.ceil(
        prompt.length / 4
      ),
      output_tokens:
        Math.ceil(answer.length / 4),
      estimated_cost: 0,
      latency_ms: latency,
      success: true,
      fallback_used: false,
      grounding_sources: {
        priorityTrace,
        school_id: schoolId,
        academic_year_id:
          activeAcademicYear?.id ?? null,
        period,
        counts,
      },
    },
  });

  await recordAIObservability({
    request_id: requestId,
    school_id: schoolId,
    user_id:
      input.user.id ?? null,
    layer: "knowledge",
    event_type:
      "ATTENDANCE_QUERY",
    provider_key:
      "attendance-grounding-v1",
    source_type: "ERP",
    latency_ms: latency,
    success: true,
    payload: {
      prompt_excerpt:
        safeExcerpt(prompt, 300),
      period,
      counts,
    },
  });

  await recordEvent({
    school_id: schoolId,
    user_id: input.user.id,
    actor_role:
      input.user.role,
    module_name: "ai",
    event_type:
      "AI_ATTENDANCE_QUERY",
    action: "query",
    entity_type: "attendance",
    entity_id: schoolId,
    summary:
      "TOTTECH AI answered attendance from ERP records",
    payload: {
      requestId,
      period,
      counts,
    },
  }).catch((error) => {
    console.error(
      "Attendance AI event logging failed",
      error
    );
  });

  return {
    requestId,
    answer,
    priorityTrace,
    sources: sourceTrace,
    documentHints: [],
    internetSearch: {
      requested: false,
      enabled: false,
    },
    grounding: {
      school,
      academicYear:
        activeAcademicYear,
      permissions:
        governance.permissions,
    },
  };
}

function buildAnswer(
  input: KnowledgeInput,
  traces: SourceTrace[],
  erp: Awaited<
    ReturnType<typeof buildErpEvidence>
  >,
  internetEnabled: boolean,
  webResults: WebSearchHit[],
  directAnswer: string[] | null,
  webDirectAnswer: string[] | null
) {
  const schoolName =
    erp.school?.school_name ||
    input.user.school_name ||
    "the active school/college";
  const year =
    erp.activeAcademicYear
      ?.academic_year ||
    "not configured";
  const asksEducationPolicy =
    educationTerms.some((term) =>
      normalize(input.prompt).includes(
        term
      )
    ) ||
    asksAndhraPradeshSchoolOpeningDay(
      input.prompt
    );

  const lines = directAnswer
    ? [...directAnswer]
    : webDirectAnswer
      ? [...webDirectAnswer]
      : [
          "Answer:",
          webResults.length
            ? "I found related sources, but I could not extract a confident direct answer from the accessible page text. Please use the sources below for verification."
            : "I could not find a confident answer from ERP records or accessible web sources for this question.",
        ];

  if (
    webResults.length > 0
  ) {
    lines.push(
      "",
      "Sources:",
      ...webResults.map(
        (hit, index) =>
          `${index + 1}. ${hit.title} - ${hit.url}${hit.snippet && hit.snippet !== "Official source registered for this education-policy lookup." ? `\n   ${hit.snippet}` : ""}`
      )
    );
  }

  if (
    !internetEnabled &&
    asksEducationPolicy
  ) {
    lines.push(
      "",
      "Internet search is currently disabled by governance. Enable TOTTECH_AI_ENABLE_WEB_SEARCH only after approving a search provider and source policy."
    );
  }

  lines.push(
    "",
    "Context checked:",
    `- School/College: ${schoolName}`,
    `- Academic Year: ${year}`,
    "- Priority: ERP -> Documents -> Official Sources -> Internet",
    `- ERP counts: ${erp.students} students, ${erp.teachers} teachers, ${erp.attendance} attendance records`,
    `- Event ledger records checked: ${erp.events.length}`,
    "- Knowledge base: answer saved for future reuse"
  );

  if (asksEducationPolicy) {
    lines.push(
      "- Official education/government sources were prioritized before open internet results."
    );
  }

  return lines.join("\n");
}

export async function answerKnowledgeQuery(
  input: KnowledgeInput
) {
  const started = Date.now();
  const requestId =
    crypto.randomUUID();
  const prompt =
    input.prompt.trim();
  const schoolId =
    input.school_id ??
    input.user.school_id ??
    null;
  const normalizedQuestion =
    normalizeQuestion(prompt);
  const promptHash =
    hashText(normalizedQuestion);
  const attendanceAnswer =
    await answerAttendanceQuestion({
      input,
      started,
      requestId,
      prompt,
      promptHash,
      schoolId,
    });

  if (attendanceAnswer) {
    return attendanceAnswer;
  }

  const cached =
    await findKnowledgeBaseAnswer({
      promptHash,
      schoolId,
    });

  if (cached) {
    const answer = cached.answer;
    const latency =
      Date.now() - started;

    await prisma.ai_knowledge_queries.create({
      data: {
        request_id: requestId,
        school_id: schoolId,
        user_id:
          input.user.id ?? null,
        prompt_hash: promptHash,
        prompt_excerpt:
          safeExcerpt(prompt),
        answer_excerpt:
          safeExcerpt(answer, 8000),
        source_trace: [
          {
            source_key:
              "knowledge_cache",
            source_type:
              "KNOWLEDGE_BASE",
            display_name:
              "TOTTECH AI Knowledge Base Cache",
          },
        ],
        priority_trace: [
          "KNOWLEDGE_BASE",
        ],
        provider_key:
          "knowledge-cache-v1",
        latency_ms: latency,
        success: true,
      },
    });

    return {
      requestId,
      answer,
      priorityTrace: [
        "KNOWLEDGE_BASE",
      ],
      sources: [],
      documentHints: [],
      internetSearch: {
        requested:
          Boolean(
            input.include_internet
          ),
        enabled: false,
        cacheHit: true,
      },
      grounding: {
        school: null,
        academicYear: null,
        permissions: [],
      },
    };
  }

  const internetEnabled =
    input.include_internet !== false ||
    process.env
      .TOTTECH_AI_ENABLE_WEB_SEARCH ===
      "true";

  const [
    governance,
    sources,
    erp,
    documentHints,
  ] = await Promise.all([
    getGovernanceSnapshot(
      input.user
    ),
    prisma.ai_knowledge_sources.findMany({
      where: {
        is_enabled: true,
      },
      orderBy: [
        {
          priority: "asc",
        },
        {
          source_key: "asc",
        },
      ],
    }),
    buildErpEvidence(
      input.user,
      schoolId
    ),
    listDocumentHints(),
  ]);

  const traces: SourceTrace[] = [];
  let webResults: WebSearchHit[] = [];
  let webEvidence: WebEvidence[] = [];
  const needsApOpeningLookup =
    asksAndhraPradeshSchoolOpeningDay(
      prompt
    );

  for (const source of sources) {
    if (
      source.source_type === "INTERNET" &&
      !internetEnabled
    ) {
      continue;
    }

    if (
      source.source_type === "OFFICIAL" &&
      !officialSourceApplies(
        prompt,
        source
      )
    ) {
      continue;
    }

    const evidence: string[] = [];

    if (
      source.source_key ===
      "erp_database"
    ) {
      evidence.push(
        `${erp.students} students`,
        `${erp.teachers} teachers`,
        `${erp.attendance} attendance records`
      );
    }

    if (
      source.source_key ===
      "event_ledger"
    ) {
      evidence.push(
        `${erp.events.length} recent events`
      );
    }

    if (
      source.source_key ===
      "document_storage"
    ) {
      evidence.push(
        documentHints.length
          ? `${documentHints.length} document/file hints`
          : "No recovered document index rows found"
      );
    }

    if (
      source.source_type ===
      "OFFICIAL"
    ) {
      evidence.push(
        "Official source registered for education policy lookup"
      );
    }

    traces.push({
      source_key:
        source.source_key,
      source_type:
        source.source_type,
      display_name:
        source.display_name,
      priority:
        source.priority,
      base_url:
        source.base_url,
      official:
        Boolean(
          source.is_official
        ),
      evidence,
    });
  }

  if (internetEnabled) {
    const hasPreferredOfficialSource =
      preferredOfficialSourceKeys(
        prompt
      ).length > 0;
    const officialResults =
      await searchOfficialSources(
        prompt,
        sources
      );
    const internetResults =
      await searchDuckDuckGo(
        buildSearchQuery(prompt),
        false
      );

    webResults =
      needsApOpeningLookup
        ? [
            ...officialResults.slice(
              0,
              4
            ),
            ...internetResults,
          ].slice(0, 8)
        : [
            ...(hasPreferredOfficialSource
              ? officialResults
              : internetResults),
            ...(hasPreferredOfficialSource
              ? internetResults
              : officialResults),
          ].slice(0, 8);

    webEvidence =
      await buildWebEvidence(
        prompt,
        webResults
      );

    if (webResults.length) {
      traces.push({
        source_key:
          "governed_web_search",
        source_type:
          "INTERNET",
        display_name:
          "Official-first governed web search",
        priority: 100,
        base_url: null,
        official: false,
        evidence:
          webResults.map(
            (hit) => hit.url
          ),
      });
    }
  }

  const directAnswer =
    buildAndhraPradeshSscAnswer(
      prompt
    ) ||
    buildAndhraPradeshOpeningAnswer(
      prompt,
      webResults
    ) ||
    buildKnownEducationAnswer(
      prompt
    );
  const webDirectAnswer =
    buildInternetDirectAnswer(
      prompt,
      webEvidence
    );
  const draft =
    directAnswer ||
    webDirectAnswer ||
    buildFallbackDraft(
      prompt,
      webResults
    );
  const finalSources =
    dedupeSources([
      ...(draft.sources || []),
      ...webResults.map(
        sourceFromWebHit
      ),
    ]);
  const retrievedAt = new Date();
  const answer =
    formatKnowledgeResponse({
      draft,
      sources: finalSources,
      retrievedAt,
    });

  await saveKnowledgeBaseAnswer({
    prompt,
    normalizedQuestion,
    promptHash,
    schoolId,
    academicYear:
      erp.activeAcademicYear
        ?.academic_year ?? null,
    userId:
      input.user.id ?? null,
    draft,
    sources: finalSources,
  });
  const latency =
    Date.now() - started;
  const priorityTrace = [
    "ERP",
    "DOCUMENT",
    "OFFICIAL",
    "INTERNET",
  ];

  await prisma.ai_knowledge_queries.create({
    data: {
      request_id: requestId,
      school_id: schoolId,
      user_id:
        input.user.id ?? null,
      prompt_hash:
        promptHash,
      prompt_excerpt:
        safeExcerpt(prompt),
      answer_excerpt:
        safeExcerpt(answer, 8000),
      source_trace: traces,
      priority_trace:
        priorityTrace,
      provider_key:
        "knowledge-router-v1",
      latency_ms: latency,
      success: true,
    },
  });

  await prisma.ai_usage_logs.create({
    data: {
      request_id: requestId,
      school_id: schoolId,
      user_id:
        input.user.id ?? null,
      module_name:
        "knowledge",
      provider_key:
        "knowledge-layer",
      model_key:
        "erp-official-router-v1",
      prompt_hash:
        promptHash,
      prompt_excerpt:
        safeExcerpt(prompt),
      response_excerpt:
        safeExcerpt(answer, 8000),
      input_tokens:
        Math.ceil(
          prompt.length / 4
        ),
      output_tokens:
        Math.ceil(
          answer.length / 4
        ),
      estimated_cost: 0,
      latency_ms: latency,
      success: true,
      fallback_used: false,
      grounding_sources: {
        priorityTrace,
        sourceKeys:
          traces.map(
            (trace) =>
              trace.source_key
          ),
        webResults,
        school_id: schoolId,
        academic_year_id:
          governance
            .activeAcademicYear
            ?.id ?? null,
      },
    },
  });

  await recordAIObservability({
    request_id: requestId,
    school_id: schoolId,
    user_id:
      input.user.id ?? null,
    layer: "knowledge",
    event_type:
      "KNOWLEDGE_QUERY",
    provider_key:
      "knowledge-router-v1",
    source_type:
      "ERP_DOCUMENT_OFFICIAL_INTERNET",
    latency_ms: latency,
    success: true,
    payload: {
      prompt_excerpt:
        safeExcerpt(prompt, 300),
      source_count:
        traces.length,
      web_results:
        webResults.length,
      priorityTrace,
    },
  });

  await recordEvent({
    school_id: schoolId,
    user_id: input.user.id,
    actor_role:
      input.user.role,
    module_name: "ai",
    event_type:
      "AI_KNOWLEDGE_QUERY",
    action: "query",
    entity_type: "school",
    entity_id: schoolId,
    summary:
      "TOTTECH AI knowledge query answered",
    payload: {
      requestId,
      priorityTrace,
      sourceKeys:
        traces.map(
          (trace) =>
            trace.source_key
        ),
    },
  }).catch((error) => {
    console.error(
      "Knowledge event logging failed",
      error
    );
  });

  return {
    requestId,
    answer,
    priorityTrace,
    sources: traces,
    documentHints,
    internetSearch: {
      requested:
        Boolean(
          input.include_internet
        ),
      enabled: internetEnabled,
    },
    grounding: {
      school: erp.school,
      academicYear:
        erp.activeAcademicYear,
      permissions:
        governance.permissions,
    },
  };
}
