"use client";

import {
  Bot,
  CheckCircle,
  Clock,
  Database,
  FileText,
  FileSpreadsheet,
  Globe,
  History,
  Layers,
  Play,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Layout from "@/components/Layout";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";
import { notify } from "@/lib/notify";
import TottechAIBadge from "./TottechAIBadge";

type AIAction = {
  id: number;
  action_type: string;
  module_name: string;
  status: string;
  risk_level?: string | null;
  preview?: unknown;
  normalized_payload?: unknown;
  execution_result?: unknown;
  failure_reason?: string | null;
  created_at?: string | null;
};

type SourceTrace = {
  source_key?: string;
  source_type?: string;
  display_name?: string;
  official?: boolean;
  evidence?: string[];
};

type AgentResponse = {
  mode: "knowledge" | "action";
  answer?: string;
  planner?: unknown;
  action?: AIAction;
  sourceTrace?: SourceTrace[];
  grounding?: unknown;
  aiMode?: string;
  queryType?: string;
  confidenceScore?: number;
};

type Branding = {
  aiDisplayName?: string;
  assistantName?: string;
  aiTagline?: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  mode?: "knowledge" | "action";
  createdAt: string;
  action?: AIAction;
  sourceTrace?: SourceTrace[];
  planner?: unknown;
  grounding?: unknown;
  aiMode?: string;
  queryType?: string;
  confidenceScore?: number;
};

type ChatThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

type ImportScope =
  | "tottech-one"
  | "clinical-services";

type ImportResult = {
  ok: boolean;
  status: string;
  scope: ImportScope;
  moduleName: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  failedRows: number;
  insertedRows: number;
  detectedColumns: string[];
  requiredColumns: string[];
  recommendedColumns: string[];
  missingColumns: string[];
  rowErrors: {
    row: number;
    error: string;
  }[];
  sampleTemplate: Record<string, string>;
  message: string;
};

const STORAGE_KEY =
  "tottech_ai_chat_threads_v1";

const suggestions = [
  "Which students have attendance below 75%?",
  "How can Rahul improve academically?",
  "Which teachers need support?",
  "What should I focus on today as principal?",
  "Give me institution health report",
  "How do I teach algebra better?",
  "Create a study plan for Grade 10 Mathematics",
  "What is the fee refund policy?",
  "Create student name Ravi Kumar, admission_number: ADM2001, phone: 9876543210",
  "Validate an Excel file before loading real data",
];

const importModules: Record<
  ImportScope,
  {
    key: string;
    label: string;
  }[]
> = {
  "tottech-one": [
    {
      key: "classes",
      label: "Classes",
    },
    {
      key: "sections",
      label: "Sections",
    },
    {
      key: "subjects",
      label: "Subjects",
    },
    {
      key: "students",
      label: "Students",
    },
    {
      key: "teachers",
      label: "Teachers",
    },
    {
      key: "fee_categories",
      label: "Fee Categories",
    },
    {
      key: "transport_routes",
      label: "Transport Routes",
    },
    {
      key: "hostels",
      label: "Hostels",
    },
    {
      key: "dining_meal_plans",
      label: "Dining Meal Plans",
    },
    {
      key: "dining_weekly_menus",
      label: "Dining Weekly Menus",
    },
  ],
  "clinical-services": [
    {
      key: "patients",
      label: "Patients",
    },
    {
      key: "doctors",
      label: "Doctors",
    },
    {
      key: "appointments",
      label: "Appointments",
    },
    {
      key: "op_visits",
      label: "OP Visits",
    },
    {
      key: "ip_admissions",
      label: "IP Admissions",
    },
    {
      key: "lab_orders",
      label: "Lab Orders",
    },
    {
      key: "radiology_orders",
      label: "Radiology Orders",
    },
    {
      key: "billing_invoices",
      label: "Billing Invoices",
    },
    {
      key: "insurance_claims",
      label: "Insurance Claims",
    },
    {
      key: "pharmacy_medicines",
      label: "Pharmacy Medicines",
    },
    {
      key: "pharmacy_inventory",
      label: "Pharmacy Inventory",
    },
    {
      key: "ivf_couples",
      label: "IVF Couples",
    },
    {
      key: "ivf_cycles",
      label: "IVF Cycles",
    },
    {
      key: "clinical_hr_employees",
      label: "HR Employees",
    },
  ],
};

const starterMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "I work in three modes: School/College Data Intelligence from live ERP records, AI Analysis & Recommendations for student and institution improvement, and General Education Knowledge for teaching, learning, research, curriculum, thesis, and policy questions. If a request changes ERP data, I will prepare a preview first and wait for approval.",
  mode: "knowledge",
  aiMode: "EduGPT",
  queryType: "ASSISTANT_INTRO",
  createdAt: new Date().toISOString(),
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function createThread(): ChatThread {
  const now = new Date().toISOString();

  return {
    id: newId("thread"),
    title: "New Chat",
    createdAt: now,
    updatedAt: now,
    messages: [starterMessage],
  };
}

function readThreads() {
  if (typeof window === "undefined") {
    return [createThread()];
  }

  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );
    const parsed = raw
      ? (JSON.parse(raw) as ChatThread[])
      : null;

    return Array.isArray(parsed) &&
      parsed.length
      ? parsed
      : [createThread()];
  } catch {
    return [createThread()];
  }
}

function messageTitle(value: string) {
  const compact = value
    .replace(/\s+/g, " ")
    .trim();

  return compact.length > 42
    ? `${compact.slice(0, 42)}...`
    : compact || "New Chat";
}

function safeText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return JSON.stringify(value, null, 2);
  }

  return "";
}

function previewValidation(action?: AIAction) {
  const preview =
    action?.preview &&
    typeof action.preview === "object"
      ? (action.preview as {
          validation?: {
            ok?: boolean;
            errors?: string[];
          };
        })
      : {};

  return preview.validation;
}

export default function TottechAIChat() {
  const [threads, setThreads] =
    useState<ChatThread[]>([]);
  const [
    activeThreadId,
    setActiveThreadId,
  ] = useState("");
  const [prompt, setPrompt] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [actions, setActions] =
    useState<AIAction[]>([]);
  const [importScope, setImportScope] =
    useState<ImportScope>(
      "tottech-one"
    );
  const [importModule, setImportModule] =
    useState("students");
  const [importCommit, setImportCommit] =
    useState(false);
  const [importFile, setImportFile] =
    useState<File | null>(null);
  const [importLoading, setImportLoading] =
    useState(false);
  const [branding, setBranding] =
    useState<Branding | null>(
      null
    );
  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    let active = true;

    fetch("/api/my-school-branding")
      .then((response) =>
        response.json()
      )
      .then((data) => {
        if (active) {
          setBranding(data);
        }
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const initial = readThreads();
    setThreads(initial);
    setActiveThreadId(
      initial[0]?.id || ""
    );
  }, []);

  useEffect(() => {
    if (!threads.length) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(threads)
    );
  }, [threads]);

  useEffect(() => {
    loadActions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [threads, activeThreadId, loading]);

  const activeThread =
    threads.find(
      (thread) =>
        thread.id === activeThreadId
    ) || threads[0];
  const aiName =
    branding?.aiDisplayName ||
    branding?.assistantName ||
    "School/College Assistant";
  const aiTagline =
    branding?.aiTagline ||
    "School/College Copilot";

  const pendingActions = useMemo(
    () =>
      actions.filter((action) =>
        [
          "PENDING_APPROVAL",
          "APPROVED",
          "FAILED",
        ].includes(action.status)
      ),
    [actions]
  );

  async function loadActions() {
    try {
      const data =
        await apiJson<{
          actions?: AIAction[];
        }>("/api/tottech-ai/actions");
      setActions(data.actions || []);
    } catch {
      setActions([]);
    }
  }

  function updateActiveThread(
    updater: (
      thread: ChatThread
    ) => ChatThread
  ) {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread?.id
          ? updater(thread)
          : thread
      )
    );
  }

  function appendMessages(
    messages: ChatMessage[],
    titleSeed?: string
  ) {
    const now = new Date().toISOString();

    updateActiveThread((thread) => {
      const isUntitled =
        thread.title === "New Chat";

      return {
        ...thread,
        title:
          isUntitled && titleSeed
            ? messageTitle(titleSeed)
            : thread.title,
        updatedAt: now,
        messages: [
          ...thread.messages,
          ...messages,
        ],
      };
    });
  }

  function startNewChat() {
    const thread = createThread();
    setThreads((current) => [
      thread,
      ...current,
    ]);
    setActiveThreadId(thread.id);
    setPrompt("");
  }

  function deleteThread(id: string) {
    setThreads((current) => {
      const next = current.filter(
        (thread) => thread.id !== id
      );
      const safeNext = next.length
        ? next
        : [createThread()];

      if (id === activeThreadId) {
        setActiveThreadId(
          safeNext[0].id
        );
      }

      return safeNext;
    });
  }

  async function sendPrompt(
    value = prompt
  ) {
    const text = value.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: newId("user"),
      role: "user",
      content: text,
      createdAt:
        new Date().toISOString(),
    };

    setPrompt("");
    appendMessages([userMessage], text);

    try {
      setLoading(true);
      const result =
        await apiJson<AgentResponse>(
          "/api/tottech-ai/agent",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt: text,
            }),
          }
        );

      const assistantMessage: ChatMessage =
        {
          id: newId("assistant"),
          role: "assistant",
          mode: result.mode,
          content:
            result.mode === "action"
              ? result.answer ||
                "I prepared a safe action preview. Review it, approve it, then execute it."
              : result.answer ||
                "I could not prepare an answer from the available school/college context.",
          createdAt:
            new Date().toISOString(),
          action: result.action,
          sourceTrace:
            result.sourceTrace,
          planner: result.planner,
          grounding:
            result.grounding,
          aiMode:
            result.aiMode,
          queryType:
            result.queryType,
          confidenceScore:
            result.confidenceScore,
        };

      appendMessages([
        assistantMessage,
      ]);
      await loadActions();
    } catch (error) {
      appendMessages([
        {
          id: newId("assistant"),
          role: "assistant",
          content: errorMessage(
            error,
            "TOTTECH AI failed"
          ),
          createdAt:
            new Date().toISOString(),
        },
      ]);
      notify.error(
        errorMessage(
          error,
          "TOTTECH AI failed"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function approve(
    action: AIAction
  ) {
    try {
      await apiJson(
        `/api/tottech-ai/actions/${action.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            decision: "APPROVE",
            comments:
              "Approved from TOTTECH AI Chat",
          }),
        }
      );
      notify.success(
        "AI action approved"
      );
      await loadActions();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Approval failed"
        )
      );
    }
  }

  async function execute(
    action: AIAction
  ) {
    try {
      await apiJson(
        `/api/tottech-ai/actions/${action.id}/execute`,
        {
          method: "POST",
        }
      );
      notify.success(
        "AI action executed"
      );
      await loadActions();
    } catch (error) {
      notify.error(
        errorMessage(
          error,
          "Execution failed"
        )
      );
    }
  }

  async function runImport() {
    if (!importFile || importLoading) {
      notify.warning(
        "Attach an Excel file first"
      );
      return;
    }

    const formData = new FormData();
    formData.append(
      "scope",
      importScope
    );
    formData.append(
      "module_name",
      importModule
    );
    formData.append(
      "commit",
      String(importCommit)
    );
    formData.append(
      "file",
      importFile
    );

    try {
      setImportLoading(true);
      const result =
        await apiJson<ImportResult>(
          "/api/tottech-ai/imports",
          {
            method: "POST",
            body: formData,
          }
        );

      const missing =
        result.missingColumns.length
          ? `\n\nMissing fields:\n- ${result.missingColumns.join("\n- ")}`
          : "";
      const rowErrors =
        result.rowErrors.length
          ? `\n\nRows to fix:\n${result.rowErrors
              .slice(0, 8)
              .map(
                (item) =>
                  `- Row ${item.row}: ${item.error}`
              )
              .join("\n")}`
          : "";
      const detected =
        result.detectedColumns.length
          ? `\n\nDetected columns: ${result.detectedColumns.join(", ")}`
          : "";
      const template =
        Object.keys(
          result.sampleTemplate || {}
        ).length
          ? `\n\nTemplate columns:\n${Object.keys(
              result.sampleTemplate
            ).join(", ")}`
          : "";

      appendMessages(
        [
          {
            id: newId("assistant"),
            role: "assistant",
            mode: "knowledge",
            content: `${result.message}\n\nScope: ${result.scope}\nModule: ${result.moduleName}\nFile: ${result.fileName}\nRows: ${result.totalRows}\nValid: ${result.validRows}\nFailed: ${result.failedRows}\nLoaded: ${result.insertedRows}${missing}${rowErrors}${detected}${template}`,
            createdAt:
              new Date().toISOString(),
          },
        ],
        `Import ${importModule}`
      );

      notify.success(
        result.insertedRows
          ? `Loaded ${result.insertedRows} rows`
          : "Import validation complete"
      );
    } catch (error) {
      const message = errorMessage(
        error,
        "Import failed"
      );
      appendMessages([
        {
          id: newId("assistant"),
          role: "assistant",
          content: message,
          createdAt:
            new Date().toISOString(),
        },
      ]);
      notify.error(message);
    } finally {
      setImportLoading(false);
    }
  }

  function onSubmit(
    event: FormEvent
  ) {
    event.preventDefault();
    void sendPrompt();
  }

  function onPromptKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void sendPrompt();
    }
  }

  return (
    <Layout>
      <div className="grid min-h-[calc(100vh-190px)] gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-24 space-y-4">
            <button
              onClick={startNewChat}
              className="tt-button flex w-full items-center justify-center gap-2"
            >
              <Plus size={17} />
              New Chat
            </button>

            <section className="tt-card tt-card-pad">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
                <History size={17} />
                Chats
              </div>
              <div className="space-y-2">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`group flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 ${
                      thread.id ===
                      activeThread?.id
                        ? "border-amber-300 bg-amber-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setActiveThreadId(
                          thread.id
                        )
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-bold text-slate-950">
                        {thread.title}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {new Date(
                          thread.updatedAt
                        ).toLocaleString()}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        deleteThread(
                          thread.id
                        )
                      }
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-white hover:text-red-600"
                      aria-label="Delete chat"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
            <TottechAIBadge
              size="md"
              showText
            />

            <div className="flex flex-wrap gap-2">
              <StatusPill
                icon={<Database size={14} />}
                label="ERP Data"
              />
              <StatusPill
                icon={<ShieldCheck size={14} />}
                label="RBAC Safe"
              />
              <StatusPill
                icon={<Layers size={14} />}
                label="EduGPT"
              />
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
            {activeThread?.messages.map(
              (message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  onApprove={approve}
                  onExecute={execute}
                />
              )
            )}

            {loading && (
              <ThinkingBubble
                aiName={aiName}
                aiTagline={aiTagline}
              />
            )}
            <div ref={bottomRef} />
          </div>

          <footer className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      void sendPrompt(item)
                    }
                    disabled={loading}
                    className="max-w-[280px] shrink-0 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <form
              onSubmit={onSubmit}
              className="flex min-w-0 items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 focus-within:border-amber-400"
            >
              <textarea
                value={prompt}
                onChange={(event) =>
                  setPrompt(
                    event.target.value
                  )
                }
                onKeyDown={
                  onPromptKeyDown
                }
                rows={1}
                className="min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm font-medium leading-6 text-slate-950 outline-none placeholder:text-slate-400"
                placeholder={`Ask ${aiName}...`}
              />
              <button
                type="submit"
                disabled={
                  loading ||
                  !prompt.trim()
                }
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </footer>
        </section>

        <aside className="min-w-0 lg:col-span-2 xl:col-span-1">
          <div className="sticky top-24 space-y-4">
            <ImportPanel
              importScope={importScope}
              setImportScope={(value) => {
                setImportScope(value);
                setImportModule(
                  importModules[value][0]
                    ?.key || ""
                );
              }}
              importModule={importModule}
              setImportModule={
                setImportModule
              }
              importCommit={importCommit}
              setImportCommit={
                setImportCommit
              }
              importFile={importFile}
              setImportFile={setImportFile}
              importLoading={
                importLoading
              }
              onRunImport={runImport}
            />

            <section className="tt-card tt-card-pad">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
                <ShieldCheck size={17} />
                Action Queue
              </div>
              <div className="space-y-3">
                {pendingActions.length ? (
                  pendingActions
                    .slice(0, 5)
                    .map((action) => (
                      <ActionQueueCard
                        key={action.id}
                        action={action}
                        onApprove={
                          approve
                        }
                        onExecute={
                          execute
                        }
                      />
                    ))
                ) : (
                  <EmptyState text="No pending AI actions." />
                )}
              </div>
            </section>

            <section className="tt-card tt-card-pad">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
                <Sparkles size={17} />
                Thinking Stack
              </div>
              <div className="space-y-2">
                <ContextRow
                  icon={<Database size={15} />}
                  label="ERP records"
                />
                <ContextRow
                  icon={<FileText size={15} />}
                  label="Documents"
                />
                <ContextRow
                  icon={<Globe size={15} />}
                  label="Official sources"
                />
                <ContextRow
                  icon={<Search size={15} />}
                  label="Internet fallback"
                />
                <ContextRow
                  icon={<ShieldCheck size={15} />}
                  label="Approval layer"
                />
              </div>
            </section>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function ImportPanel({
  importScope,
  setImportScope,
  importModule,
  setImportModule,
  importCommit,
  setImportCommit,
  importFile,
  setImportFile,
  importLoading,
  onRunImport,
}: {
  importScope: ImportScope;
  setImportScope: (
    value: ImportScope
  ) => void;
  importModule: string;
  setImportModule: (
    value: string
  ) => void;
  importCommit: boolean;
  setImportCommit: (
    value: boolean
  ) => void;
  importFile: File | null;
  setImportFile: (
    value: File | null
  ) => void;
  importLoading: boolean;
  onRunImport: () => Promise<void>;
}) {
  const modules =
    importModules[importScope];

  return (
    <section className="tt-card tt-card-pad">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
        <FileSpreadsheet size={17} />
        AI Excel Import
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">
            Application
          </span>
          <select
            value={importScope}
            onChange={(event) =>
              setImportScope(
                event.target
                  .value as ImportScope
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-950"
          >
            <option value="tottech-one">
              School/College ERP
            </option>
            <option value="clinical-services">
              Clinical Services
            </option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">
            Module
          </span>
          <select
            value={importModule}
            onChange={(event) =>
              setImportModule(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-950"
          >
            {modules.map((module) => (
              <option
                key={module.key}
                value={module.key}
              >
                {module.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block rounded-lg border border-dashed border-amber-300 bg-amber-50/70 p-3">
          <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-amber-800">
            <Upload size={14} />
            Excel File
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) =>
              setImportFile(
                event.target.files?.[0] ??
                  null
              )
            }
            className="block w-full text-xs font-semibold text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
          />
          {importFile && (
            <p className="mt-2 break-words text-xs font-semibold text-slate-600">
              {importFile.name}
            </p>
          )}
        </label>

        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input
            type="checkbox"
            checked={importCommit}
            onChange={(event) =>
              setImportCommit(
                event.target.checked
              )
            }
            className="mt-1"
          />
          <span className="text-xs font-semibold leading-5 text-slate-700">
            Load valid rows now. Leave unchecked for AI validation only.
          </span>
        </label>

        <button
          type="button"
          onClick={() => void onRunImport()}
          disabled={
            importLoading || !importFile
          }
          className="tt-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={15} />
          {importLoading
            ? "Checking..."
            : importCommit
              ? "Validate & Load"
              : "Validate Excel"}
        </button>
      </div>
    </section>
  );
}

function ChatBubble({
  message,
  onApprove,
  onExecute,
}: {
  message: ChatMessage;
  onApprove: (
    action: AIAction
  ) => Promise<void>;
  onExecute: (
    action: AIAction
  ) => Promise<void>;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex min-w-0 gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar
          icon={<Bot size={18} />}
        />
      )}
      <div
        className={`min-w-0 max-w-full rounded-lg border p-4 shadow-sm md:max-w-[780px] ${
          isUser
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.content}
        </div>

        {message.action && (
          <ActionPreviewCard
            action={message.action}
            planner={message.planner}
            onApprove={onApprove}
            onExecute={onExecute}
          />
        )}

        {!isUser &&
          message.sourceTrace &&
          message.sourceTrace.length >
            0 && (
            <SourcePanel
              sources={
                message.sourceTrace
              }
            />
          )}

        <div
          className={`mt-3 flex items-center gap-2 text-[11px] font-semibold ${
            isUser
              ? "text-white/60"
              : "text-slate-400"
          }`}
        >
          <Clock size={12} />
          <span>
            {new Date(
              message.createdAt
            ).toLocaleTimeString()}
          </span>
          {message.mode && (
            <span className="uppercase">
              {message.mode}
            </span>
          )}
          {message.aiMode && (
            <span>
              {message.aiMode}
            </span>
          )}
          {message.queryType && (
            <span className="uppercase">
              {message.queryType}
            </span>
          )}
          {typeof message.confidenceScore ===
            "number" && (
            <span>
              {Math.round(
                message.confidenceScore *
                  100
              )}
              % confidence
            </span>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar
          icon={<UserRound size={18} />}
          dark
        />
      )}
    </div>
  );
}

function ThinkingBubble({
  aiName,
  aiTagline,
}: {
  aiName: string;
  aiTagline: string;
}) {
  return (
    <div className="flex gap-3">
      <Avatar icon={<Bot size={18} />} />
      <div className="max-w-[680px] rounded-lg border border-amber-200 bg-amber-50 p-4 text-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <TottechAIBadge
            size="sm"
            label={aiName}
            tagline={aiTagline}
          />
          <div className="min-w-0">
            <div className="text-sm font-black">
              {aiName} is thinking
            </div>
            <div className="mt-1 text-xs font-semibold text-amber-800">
              Grounding the answer before responding
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            "ERP",
            "RBAC",
            "Sources",
          ].map((item) => (
            <div
              key={item}
              className="h-2 overflow-hidden rounded-full bg-white"
            >
              <div className="h-full w-1/2 animate-pulse rounded-full bg-amber-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionPreviewCard({
  action,
  planner,
  onApprove,
  onExecute,
}: {
  action: AIAction;
  planner?: unknown;
  onApprove: (
    action: AIAction
  ) => Promise<void>;
  onExecute: (
    action: AIAction
  ) => Promise<void>;
}) {
  const validation =
    previewValidation(action);
  const ready =
    validation?.ok !== false &&
    action.status ===
      "PENDING_APPROVAL";

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-slate-950">
            {action.action_type}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {ready
              ? "Ready for approval"
              : action.status}
          </p>
        </div>
        <span className="tt-badge shrink-0">
          {action.risk_level || "RISK"}
        </span>
      </div>

      {validation?.errors?.length ? (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {validation.errors.join(", ")}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <PayloadBlock
          title="Payload"
          value={
            action.normalized_payload ||
            planner
          }
        />
        <PayloadBlock
          title="Execution Result"
          value={
            action.execution_result ||
            action.failure_reason ||
            "Pending"
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() =>
            void onApprove(action)
          }
          disabled={
            action.status !==
            "PENDING_APPROVAL"
          }
          className="tt-button-secondary inline-flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={15} />
          Approve
        </button>
        <button
          onClick={() =>
            void onExecute(action)
          }
          disabled={
            action.status !== "APPROVED"
          }
          className="tt-button inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Play size={15} />
          Execute
        </button>
      </div>
    </div>
  );
}

function ActionQueueCard({
  action,
  onApprove,
  onExecute,
}: {
  action: AIAction;
  onApprove: (
    action: AIAction
  ) => Promise<void>;
  onExecute: (
    action: AIAction
  ) => Promise<void>;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">
            {action.action_type}
          </h3>
          <p className="truncate text-xs text-slate-500">
            {action.module_name}
          </p>
        </div>
        <span className="tt-badge shrink-0">
          {action.status}
        </span>
      </div>
      {action.failure_reason && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-700">
          {action.failure_reason}
        </p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            void onApprove(action)
          }
          disabled={
            action.status !==
            "PENDING_APPROVAL"
          }
          className="tt-button-secondary inline-flex items-center justify-center gap-1 px-2 py-2 text-xs disabled:opacity-50"
        >
          <CheckCircle size={13} />
          Approve
        </button>
        <button
          onClick={() =>
            void onExecute(action)
          }
          disabled={
            action.status !== "APPROVED"
          }
          className="tt-button inline-flex items-center justify-center gap-1 px-2 py-2 text-xs disabled:opacity-50"
        >
          <Play size={13} />
          Execute
        </button>
      </div>
    </article>
  );
}

function SourcePanel({
  sources,
}: {
  sources: SourceTrace[];
}) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-500">
        <Search size={14} />
        Sources
      </div>
      <div className="flex flex-wrap gap-2">
        {sources
          .slice(0, 8)
          .map((source, index) => (
            <span
              key={`${source.source_key || index}`}
              className="max-w-full truncate rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              title={
                source.display_name ||
                source.source_key ||
                "Source"
              }
            >
              {source.display_name ||
                source.source_key ||
                "Source"}
            </span>
          ))}
      </div>
    </div>
  );
}

function PayloadBlock({
  title,
  value,
}: {
  title: string;
  value: unknown;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 text-xs font-black uppercase text-slate-500">
        {title}
      </div>
      <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-700">
        {safeText(value)}
      </pre>
    </div>
  );
}

function StatusPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
      {icon}
      {label}
    </span>
  );
}

function ContextRow({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
      <span className="text-amber-700">
        {icon}
      </span>
      <span className="truncate">
        {label}
      </span>
    </div>
  );
}

function Avatar({
  icon,
  dark = false,
}: {
  icon: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
        dark
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-amber-700"
      }`}
    >
      {icon}
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
      {text}
    </div>
  );
}
