"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  ClipboardList,
  FlaskConical,
  Pill,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { notify } from "@/lib/notify";

type Message = {
  role: "user" | "assistant";
  text: string;
  confidenceScore?: number;
  dataSourcesUsed?: string[];
  reasoningSummary?: string;
  audience?: string;
  intent?: string;
  safetyFlags?: string[];
  patientId?: number | null;
};

const suggestedPrompts = [
  "Show patient summary for mobile 8179618819.",
  "What are the latest lab results for this patient?",
  "Show BP trend for the last 6 months.",
  "Generate SOAP notes for the latest consultation.",
  "Check medicine availability for Paracetamol.",
  "How many appointments today?",
  "Show pending lab tests.",
  "Explain abnormal CBC values in simple language.",
];

const assistantModes = [
  {
    key: "doctor",
    label: "Doctor AI Copilot",
    icon: Stethoscope,
    description:
      "Patient summaries, vitals, lab review, prescriptions, SOAP notes, guidelines.",
  },
  {
    key: "nurse",
    label: "Nursing AI",
    icon: ClipboardList,
    description:
      "Vitals queue, admitted patients, abnormal vitals, nursing workflow support.",
  },
  {
    key: "lab_staff",
    label: "Lab AI",
    icon: FlaskConical,
    description:
      "Pending tests, critical results, report summaries, previous result comparison.",
  },
  {
    key: "pharmacist",
    label: "Pharmacy AI",
    icon: Pill,
    description:
      "Stock checks, alternatives, expiring medicines, reorder support.",
  },
  {
    key: "patient",
    label: "Patient Assistant",
    icon: UserRound,
    description:
      "Appointments, records, report explanations, medicine education, hospital services.",
  },
  {
    key: "hospital_admin",
    label: "Operations AI",
    icon: Brain,
    description:
      "OPD load, revenue, waiting patients, productivity, inventory risk.",
  },
];

export default function ClinicalAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "MedGPT Clinical is ready. Ask doctor, nurse, lab, pharmacy, patient, research, or hospital operations questions. For patient-specific answers, include UHID, mobile number, patient name, or open AI from Patient 360.",
      confidenceScore: 82,
      dataSourcesUsed: [
        "Hospital ERP Records",
        "Clinical Medical Knowledge Base",
      ],
      reasoningSummary:
        "Answers are scoped to the selected hospital/branch and include clinical safety guardrails.",
      audience: "doctor",
      intent: "general_medical",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("doctor");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, thinking]);

  const ask = async (question = prompt) => {
    const clean = question.trim();

    if (!clean) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: clean,
      },
    ]);
    setPrompt("");
    setThinking(true);

    try {
      const response = await fetch("/api/clinical/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: clean,
          audience: mode,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Clinical AI failed");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: payload.answer,
          confidenceScore: payload.confidenceScore,
          dataSourcesUsed: payload.dataSourcesUsed || [],
          reasoningSummary: payload.reasoningSummary,
          audience: payload.audience,
          intent: payload.intent,
          patientId: payload.patientId,
          safetyFlags: payload.safetyFlags || [],
        },
      ]);
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Clinical AI failed"
      );
    } finally {
      setThinking(false);
    }
  };

  return (
    <ClinicalShell>
      <div className="grid min-h-full gap-6 p-4 xl:grid-cols-[0.34fr_0.66fr]">
        <aside className="space-y-6">
          <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-[8px] border border-teal-300 bg-teal-500/10 text-teal-300">
                <Brain size={24} />
              </div>
              <div>
                <p className="text-xl font-black">MedGPT Clinical</p>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-teal-300">
                  Healthcare Copilot
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-200">
              Answers use tenant-isolated hospital records first, then the
              medical knowledge layer. It supports doctors, nurses, lab teams,
              pharmacists, patients, administrators, and researchers.
            </p>
          </section>

          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Assistant Mode</h2>
            <div className="mt-4 space-y-3">
              {assistantModes.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className={[
                    "w-full rounded-[8px] border p-3 text-left transition",
                    mode === item.key
                      ? "border-teal-400 bg-teal-50 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:border-teal-200",
                  ].join(" ")}
                >
                  <Capability
                    icon={item.icon}
                    text={item.label}
                    description={item.description}
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <h2 className="text-lg font-black">Clinical Safety</h2>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6">
              AI never diagnoses with certainty and never replaces a licensed
              physician. Emergency symptoms and critical values must be
              escalated immediately.
            </p>
          </section>
        </aside>

        <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h1 className="text-3xl font-black">Clinical AI Workspace</h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Role-aware Medical GPT for hospital records, clinical support,
              patient education, research questions, and operations.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-[8px] border p-4 shadow-sm ${
                  message.role === "user"
                    ? "ml-auto border-slate-900 bg-slate-950 text-white"
                    : "border-teal-100 bg-white text-slate-950"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-6">
                  {message.text}
                </p>
                {message.role === "assistant" ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <Meta
                      label="Confidence"
                      value={`${message.confidenceScore || 0}%`}
                    />
                    <Meta label="Mode" value={message.audience || mode} />
                    <Meta label="Intent" value={message.intent || "-"} />
                    <Meta
                      label="Sources"
                      value={(message.dataSourcesUsed || []).join(", ") || "-"}
                    />
                    {message.patientId ? (
                      <Meta label="Patient ID" value={String(message.patientId)} />
                    ) : null}
                    <Meta
                      label="Reasoning"
                      value={message.reasoningSummary || "-"}
                    />
                    {message.safetyFlags?.length ? (
                      <Meta
                        label="Safety"
                        value={message.safetyFlags.join(" ")}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
            {thinking ? (
              <div className="max-w-[88%] rounded-[8px] border border-teal-100 bg-white p-4 text-slate-950 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-teal-600" />
                  <p className="text-sm font-black">
                    MedGPT Clinical is reviewing hospital records and knowledge...
                  </p>
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((item) => (
                <button
                  key={item}
                  onClick={() => ask(item)}
                  className="rounded-[8px] border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-black text-teal-800"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void ask();
                  }
                }}
                placeholder="Ask MedGPT Clinical. Example: summarize patient history for UHID..."
                className="min-h-14 flex-1 resize-none rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600"
              />
              <button
                onClick={() => ask()}
                disabled={thinking}
                className="grid h-14 w-14 place-items-center rounded-[8px] bg-slate-950 text-white disabled:opacity-50"
                aria-label="Send prompt"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Capability({
  icon: Icon,
  text,
  description,
}: {
  icon: typeof Brain;
  text: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-black">{text}</p>
        {description ? (
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}
