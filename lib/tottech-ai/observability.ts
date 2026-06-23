import { prisma } from "@/lib/prisma";

type ObservabilityInput = {
  request_id?: string | null;
  school_id?: number | null;
  user_id?: number | null;
  layer: "knowledge" | "action" | "approval";
  event_type: string;
  provider_key?: string | null;
  source_type?: string | null;
  action_request_id?: number | null;
  latency_ms?: number | null;
  estimated_cost?: number | null;
  success?: boolean;
  payload?: unknown;
};

const asJson = (value: unknown) =>
  value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));

export async function recordAIObservability(
  input: ObservabilityInput
) {
  return prisma.ai_observability_events
    .create({
      data: {
        request_id:
          input.request_id ?? null,
        school_id:
          input.school_id ?? null,
        user_id:
          input.user_id ?? null,
        layer: input.layer,
        event_type:
          input.event_type,
        provider_key:
          input.provider_key ?? null,
        source_type:
          input.source_type ?? null,
        action_request_id:
          input.action_request_id ??
          null,
        latency_ms:
          input.latency_ms ?? null,
        estimated_cost:
          input.estimated_cost ?? 0,
        success:
          input.success ?? true,
        payload: asJson(input.payload),
      },
    })
    .catch((error) => {
      console.error(
        "AI observability logging failed",
        error
      );
      return null;
    });
}
