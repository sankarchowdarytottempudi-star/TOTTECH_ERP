"use client";

import {
  Loader2,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import TottechAIBadge from "@/components/ai/TottechAIBadge";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";

type Message = {
  role: "assistant" | "user";
  content: string;
};

type AIBranding = {
  aiDisplayName?: string;
  assistantName?: string;
  aiTagline?: string;
};

type SchoolContextResponse = {
  moduleAccess?: Record<string, boolean>;
  userModuleAccess?: Record<string, boolean>;
  effectiveModuleAccess?: Record<string, boolean>;
};

export default function FloatingTottechAI() {
  const [open, setOpen] =
    useState(false);
  const [prompt, setPrompt] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [branding, setBranding] =
    useState<AIBranding | null>(
      null
    );
  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "I can answer school/college questions, search ERP records, and prepare safe action previews for student, teacher, finance, dining, hostel, transport, and academic work.",
      },
    ]);
  const [aiEnabled, setAiEnabled] =
    useState(true);
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );
  const aiName =
    branding?.aiDisplayName ||
    branding?.assistantName ||
    "School/College Assistant";
  const aiTagline =
    branding?.aiTagline ||
    "School/College Copilot";

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch("/api/my-school-branding").then(
        (response) => response.json()
      ),
      fetch("/api/school-context", {
        cache: "no-store",
      }).then((response) =>
        response.ok
          ? response.json()
          : null
      ) as Promise<SchoolContextResponse | null>,
    ])
      .then(([brandingData, context]) => {
        if (!active) {
          return;
        }

        setBranding(brandingData);
        const effectiveAiAccess =
          context?.effectiveModuleAccess?.AI ??
          (context?.moduleAccess?.AI !== false &&
            context?.userModuleAccess?.TOTTECH_AI !== false &&
            context?.userModuleAccess?.SCHOOLGPT !== false);

        if (!effectiveAiAccess) {
          setAiEnabled(false);
        }
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, []);

  if (!aiEnabled) {
    return null;
  }

  const submit = async (
    event?: FormEvent
  ) => {
    event?.preventDefault();

    const value = prompt.trim();

    if (!value || loading) {
      return;
    }

    setPrompt("");
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: value,
      },
    ]);
    setLoading(true);

    try {
      const response =
        await apiJson<any>(
          "/api/tottech-ai/agent",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt: value,
              include_internet: true,
            }),
          }
        );

      const answer =
        response.answer ||
        response.action?.status ||
        `${aiName} prepared a response.`;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (requestError) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: errorMessage(
            requestError,
            `${aiName} could not answer right now.`
          ),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[120] md:bottom-6 md:right-6">
      {open ? (
        <section className="flex h-[min(620px,calc(100vh-120px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-amber-300/50 bg-white shadow-2xl">
          <div className="tottech-ai-panel-header flex items-center justify-between gap-3 border-b border-amber-200 bg-slate-950 p-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <TottechAIBadge
                size="sm"
                label={aiName}
                tagline={aiTagline}
              />
              <div className="min-w-0">
                <p className="tottech-ai-panel-title truncate text-sm font-black leading-5 text-amber-100">
                  {aiName}
                </p>
                <p className="tottech-ai-panel-subtitle truncate text-[11px] font-bold uppercase tracking-[0.12em] text-amber-400">
                  {aiTagline}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10 text-amber-100"
              aria-label={`Close ${aiName}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map(
              (message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`tottech-ai-message max-w-[88%] rounded-lg border p-3 text-sm font-semibold leading-6 shadow-sm ${
                    message.role === "user"
                      ? "tottech-ai-user-message ml-auto border-slate-200 bg-slate-950 text-white"
                      : "tottech-ai-assistant-message border-amber-200 bg-white text-slate-800"
                  }`}
                >
                  {message.content}
                </div>
              )
            )}

            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white p-3 text-sm font-black text-amber-900 shadow-sm">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                {aiName} is thinking
              </div>
            ) : null}
          </div>

          <form
            onSubmit={submit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={prompt}
                onChange={(event) =>
                  setPrompt(
                    event.target.value
                  )
                }
                placeholder={`Ask ${aiName}...`}
                className="input min-h-[44px] flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-amber-100 disabled:opacity-50"
                aria-label={`Send to ${aiName}`}
              >
                <Send size={17} />
              </button>
            </div>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            window.setTimeout(
              () =>
                inputRef.current?.focus(),
              100
            );
          }}
          className="group flex items-center gap-3 rounded-lg border border-amber-300/70 bg-slate-950 px-4 py-3 text-left text-amber-100 shadow-2xl transition hover:-translate-y-1"
          aria-label={`Open ${aiName}`}
        >
          <TottechAIBadge
            size="sm"
            label={aiName}
            tagline={aiTagline}
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-black">
              Ask {aiName}
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200">
              {aiTagline}
            </span>
          </span>
          <MessageSquare
            size={18}
            className="hidden text-amber-100 md:block"
          />
        </button>
      )}
    </div>
  );
}
