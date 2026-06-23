"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { notify } from "@/lib/notify";

type ProviderStatus = {
  enabled?: boolean;
  envEnabled?: boolean;
  databaseEnabled?: boolean;
  hasApiKey?: boolean;
  hasBaseUrl?: boolean;
  configured?: boolean;
};

type TemplateRow = {
  template_name: string;
  trigger_event?: string;
  description?: string;
  variables?: string[];
  is_enabled?: boolean;
};

type MessageRow = {
  id: number;
  template_name?: string;
  recipient_masked?: string;
  status?: string;
  delivery_status?: string;
  last_error?: string;
  retry_count?: number;
  next_attempt_at?: string;
  updated_at?: string;
};

type DashboardData = {
  provider?: ProviderStatus;
  templates?: TemplateRow[];
  stats?: Record<string, number | string | null>;
  failedMessages?: MessageRow[];
  retryQueue?: MessageRow[];
};

const statusTone = (
  enabled?: boolean
) =>
  enabled
    ? "border-amber-300 bg-amber-50 text-slate-950"
    : "border-slate-200 bg-white text-slate-600";

const value = (
  stats: DashboardData["stats"],
  key: string
) => Number(stats?.[key] || 0);

export default function WhatsAppSettingsPage() {
  const [data, setData] =
    useState<DashboardData | null>(
      null
    );
  const [loading, setLoading] =
    useState(true);
  const [posting, setPosting] =
    useState(false);
  const [recipient, setRecipient] =
    useState("");

  const provider =
    data?.provider || {};
  const stats = data?.stats || {};
  const templates =
    data?.templates || [];

  const providerLabel = (() => {
    if (!provider.envEnabled) {
      return "Disabled by environment";
    }

    if (!provider.databaseEnabled) {
      return "Disabled in settings";
    }

    if (!provider.hasApiKey) {
      return "API key missing";
    }

    if (!provider.hasBaseUrl) {
      return "Base URL missing";
    }

    return provider.configured
      ? "Ready"
      : "Configuration required";
  })();

  const loadDashboard =
    async () => {
      setLoading(true);

      try {
        const response =
          await fetch(
            "/api/settings/whatsapp"
          );
        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error ||
              "Failed to load WhatsApp settings"
          );
        }

        setData(payload);
      } catch (error) {
        notify.error(
          error instanceof Error
            ? error.message
            : "Failed to load WhatsApp settings"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadDashboard();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  const postAction = async (
    body: Record<string, unknown>,
    success: string
  ) => {
    setPosting(true);

    try {
      const response =
        await fetch(
          "/api/settings/whatsapp",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "WhatsApp action failed"
        );
      }

      setData(payload.dashboard);
      notify.success(success);
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "WhatsApp action failed"
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="rounded-[8px] border border-amber-300 bg-slate-950 p-8 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-300">
            Notification Service
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-normal">
                WhatsApp Enterprise
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-200">
                Workflow-triggered messages for admissions,
                invoices, payments, homework, exam schedules,
                attendance reports, and fee due reminders.
              </p>
            </div>
            <div className="rounded-[8px] border border-amber-400 bg-white px-5 py-4 text-slate-950">
              <p className="text-xs font-black uppercase text-amber-700">
                Provider Status
              </p>
              <p className="mt-1 text-2xl font-black">
                {providerLabel}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            [
              "Total",
              "total_messages",
            ],
            ["Sent", "sent_messages"],
            [
              "Queued",
              "queued_messages",
            ],
            [
              "Failed",
              "failed_messages",
            ],
            [
              "Needs Config",
              "config_required_messages",
            ],
          ].map(([label, key]) => (
            <div
              key={key}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow"
            >
              <p className="text-xs font-black uppercase text-slate-500">
                {label}
              </p>
              <p className="mt-3 text-4xl font-black text-slate-950">
                {value(stats, key)}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Provider Controls
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Secrets are loaded from environment variables only.
                </p>
              </div>
              <button
                className="rounded-[8px] border border-slate-300 px-4 py-2 text-sm font-black text-slate-950"
                disabled={loading}
                onClick={loadDashboard}
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [
                  "Environment Enabled",
                  provider.envEnabled,
                ],
                [
                  "Settings Enabled",
                  provider.databaseEnabled,
                ],
                [
                  "API Key Present",
                  provider.hasApiKey,
                ],
                [
                  "Base URL Present",
                  provider.hasBaseUrl,
                ],
              ].map(
                ([label, enabledValue]) => (
                  <div
                    key={String(label)}
                    className={`rounded-[8px] border p-4 ${statusTone(
                      Boolean(
                        enabledValue
                      )
                    )}`}
                  >
                    <p className="text-xs font-black uppercase">
                      {String(label)}
                    </p>
                    <p className="mt-1 text-xl font-black">
                      {enabledValue
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                disabled={posting}
                onClick={() =>
                  postAction(
                    {
                      action:
                        "set_enabled",
                      enabled: true,
                    },
                    "WhatsApp enabled"
                  )
                }
              >
                Enable
              </button>
              <button
                className="rounded-[8px] border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
                disabled={posting}
                onClick={() =>
                  postAction(
                    {
                      action:
                        "set_enabled",
                      enabled: false,
                    },
                    "WhatsApp disabled"
                  )
                }
              >
                Disable
              </button>
              <button
                className="rounded-[8px] border border-slate-300 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
                disabled={posting}
                onClick={() =>
                  postAction(
                    {
                      action: "retry",
                      limit: 25,
                    },
                    "Retry queue processed"
                  )
                }
              >
                Process Retry Queue
              </button>
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow">
            <h2 className="text-2xl font-black text-slate-950">
              Test Message
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Sends through the same queue and audit trail as
              production workflow messages.
            </p>
            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              <input
                className="min-w-0 flex-1 rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500"
                placeholder="Recipient phone number"
                value={recipient}
                onChange={(event) =>
                  setRecipient(
                    event.target.value
                  )
                }
              />
              <button
                className="rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                disabled={
                  posting ||
                  !recipient.trim()
                }
                onClick={() =>
                  postAction(
                    {
                      action: "test",
                      recipient,
                      template_name:
                        "student_created",
                    },
                    "Test message queued"
                  )
                }
              >
                Send Test
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Template Registry
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Database-backed templates mapped to ERP
                workflow triggers.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {templates.map((template) => (
              <div
                key={
                  template.template_name
                }
                className="rounded-[8px] border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-lg font-black text-slate-950">
                      {
                        template.template_name
                      }
                    </p>
                    <p className="mt-1 text-xs font-black uppercase text-amber-700">
                      {
                        template.trigger_event
                      }
                    </p>
                  </div>
                  <button
                    className="shrink-0 rounded-[8px] border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-50"
                    disabled={posting}
                    onClick={() =>
                      postAction(
                        {
                          action:
                            "toggle_template",
                          template_name:
                            template.template_name,
                          enabled:
                            !template.is_enabled,
                        },
                        "Template updated"
                      )
                    }
                  >
                    {template.is_enabled
                      ? "Enabled"
                      : "Disabled"}
                  </button>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                  {
                    template.description
                  }
                </p>
                <p className="mt-3 break-words text-xs font-bold text-slate-500">
                  Variables:{" "}
                  {Array.isArray(
                    template.variables
                  )
                    ? template.variables.join(
                        ", "
                      )
                    : "-"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <MessageList
            title="Failed Messages"
            rows={
              data?.failedMessages ||
              []
            }
          />
          <MessageList
            title="Retry Queue"
            rows={
              data?.retryQueue ||
              []
            }
          />
        </section>
      </div>
    </Layout>
  );
}

function MessageList({
  title,
  rows,
}: {
  title: string;
  rows: MessageRow[];
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow">
      <h2 className="text-2xl font-black text-slate-950">
        {title}
      </h2>
      <div className="mt-4 space-y-3">
        {!rows.length ? (
          <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            No records found.
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="rounded-[8px] border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">
                  #{row.id}{" "}
                  {row.template_name}
                </p>
                <span className="rounded-[8px] bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                  {row.delivery_status ||
                    row.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Recipient:{" "}
                {row.recipient_masked ||
                  "-"}
              </p>
              {row.last_error ? (
                <p className="mt-2 break-words text-sm font-semibold text-red-700">
                  {row.last_error}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
