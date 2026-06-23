import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
  GovernanceUser,
  userHasPermission,
} from "@/lib/governance/rbac";
import { recordEvent } from "@/lib/governance/events";
import { recordAIObservability } from "./observability";

type CompleteInput = {
  user: GovernanceUser;
  prompt: string;
  module_name: string;
  school_id?: number | null;
  metadata?: Record<string, unknown>;
};

const safeExcerpt = (value: string) =>
  value.slice(0, 1200);

const promptHash = (prompt: string) =>
  crypto
    .createHash("sha256")
    .update(prompt)
    .digest("hex");

async function buildGrounding(
  input: CompleteInput
) {
  const schoolId =
    input.school_id ??
    input.user.school_id ??
    null;

  const [
    governance,
    school,
    students,
    teachers,
    attendance,
    events,
  ] = await Promise.all([
    getGovernanceSnapshot(input.user),
    schoolId
      ? prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
        })
      : null,
    schoolId
      ? prisma.students.count({
          where: {
            school_id: schoolId,
          },
        })
      : 0,
    schoolId
      ? prisma.teachers.count({
          where: {
            school_id: schoolId,
          },
        })
      : 0,
    schoolId
      ? prisma.attendance_master.count({
          where: {
            school_id: schoolId,
          },
        })
      : 0,
    schoolId
      ? prisma.event_ledger.findMany({
          where: {
            school_id: schoolId,
          },
          orderBy: {
            occurred_at: "desc",
          },
          take: 10,
        })
      : [],
  ]);

  return {
    schoolId,
    school,
    students,
    teachers,
    attendance,
    events,
    governance,
  };
}

async function getAIRoleAccess(
  user: GovernanceUser,
  moduleName: string
) {
  if (!user.role) {
    return null;
  }

  const role =
    await prisma.roles.findFirst({
      where: {
        role_name: user.role,
      },
    });

  if (!role) {
    return null;
  }

  return prisma.ai_role_access.findFirst({
    where: {
      role_id: role.id,
      module_name: moduleName,
    },
    orderBy: {
      id: "desc",
    },
  });
}

function deterministicAnswer(
  input: CompleteInput,
  grounding: Awaited<
    ReturnType<typeof buildGrounding>
  >
) {
  const schoolName =
    grounding.school?.school_name ||
    "the active school/college";
  const academicYear =
    grounding.governance
      .activeAcademicYear
      ?.academic_year ||
    "not configured";

  return [
    "TOTTECH AI response",
    "",
    `Context: ${schoolName}`,
    `Academic Year: ${academicYear}`,
    `Module: ${input.module_name}`,
    "",
    "Grounded ERP snapshot:",
    `- Students: ${grounding.students}`,
    `- Teachers: ${grounding.teachers}`,
    `- Attendance records: ${grounding.attendance}`,
    `- Recent event ledger records: ${grounding.events.length}`,
    "",
    "Answer:",
    input.prompt
      ? `Based on the recovered ERP records, ${schoolName} currently has ${grounding.students} students, ${grounding.teachers} teachers, and ${grounding.attendance} attendance records available for this context.`
      : "Ask a question to generate a grounded response.",
    "",
    "Provider note: deterministic fallback was used because external providers are disabled until configured by an authorized AI administrator.",
  ].join("\n");
}

export async function completeWithTottechAI(
  input: CompleteInput
) {
  const roleAccess =
    await getAIRoleAccess(
      input.user,
      input.module_name
    );
  const canUseAI =
    Boolean(roleAccess?.can_use) ||
    (await userHasPermission(
      input.user,
      {
        module: "ai",
        action: "use",
      }
    ));

  const canManageAI =
    Boolean(roleAccess?.can_manage) ||
    (await userHasPermission(
      input.user,
      {
        module: "ai",
        action: "manage",
      }
    ));

  if (
    !canUseAI &&
    !canManageAI
  ) {
    throw new Error(
      "AI access is not enabled for this role."
    );
  }

  const grounding =
    await buildGrounding(input);

  const provider =
    await prisma.ai_providers.findFirst({
      where: {
        is_enabled: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

  const model =
    provider
      ? await prisma.ai_models.findFirst({
          where: {
            provider_key:
              provider.provider_key,
            is_enabled: true,
          },
          orderBy: {
            id: "asc",
          },
        })
      : null;

  const selectedProvider =
    provider?.provider_key ||
    "deterministic";
  const selectedModel =
    model?.model_key ||
    "recovery-grounded-v1";
  const started = Date.now();
  const answer =
    deterministicAnswer(
      input,
      grounding
    );
  const requestId =
    crypto.randomUUID();

  const usage =
    await prisma.ai_usage_logs.create({
      data: {
        request_id: requestId,
        school_id:
          grounding.schoolId,
        user_id:
          input.user.id ?? null,
        module_name:
          input.module_name,
        provider_key:
          selectedProvider,
        model_key:
          selectedModel,
        prompt_hash:
          promptHash(input.prompt),
        prompt_excerpt:
          safeExcerpt(input.prompt),
        response_excerpt:
          safeExcerpt(answer),
        input_tokens:
          Math.ceil(
            input.prompt.length / 4
          ),
        output_tokens:
          Math.ceil(answer.length / 4),
        estimated_cost: 0,
        latency_ms:
          Date.now() - started,
        success: true,
        fallback_used:
          selectedProvider ===
          "deterministic",
        grounding_sources: {
          academicYear:
            grounding.governance
              .activeAcademicYear
              ?.id ?? null,
          school:
            grounding.school?.id ?? null,
          rbacPermissions:
            grounding.governance
              .permissions,
          eventLedgerIds:
            grounding.events.map(
              (event) => event.id
            ),
          erpRecords: {
            students:
              grounding.students,
            teachers:
              grounding.teachers,
            attendance:
              grounding.attendance,
          },
        },
      },
    });

  await recordEvent({
    school_id: grounding.schoolId,
    user_id: input.user.id,
    actor_role: input.user.role,
    module_name: "ai",
    event_type: "AI_COMPLETION",
    action: "complete",
    entity_type: "school",
    entity_id:
      grounding.schoolId ?? null,
    summary:
      "TOTTECH AI completion generated",
    payload: {
      requestId,
      provider: selectedProvider,
      model: selectedModel,
      module: input.module_name,
    },
  }).catch((error) => {
    console.error(
      "AI event logging failed",
      error
    );
  });

  await recordAIObservability({
    request_id: requestId,
    school_id:
      grounding.schoolId,
    user_id:
      input.user.id ?? null,
    layer: "knowledge",
    event_type:
      "AI_COMPLETION",
    provider_key:
      selectedProvider,
    source_type:
      "ERP_EVENT_LEDGER",
    latency_ms:
      usage.latency_ms ?? null,
    estimated_cost:
      Number(
        usage.estimated_cost ?? 0
      ),
    success: true,
    payload: {
      module:
        input.module_name,
      model:
        selectedModel,
      fallbackUsed:
        selectedProvider ===
        "deterministic",
      groundingSources:
        usage.grounding_sources,
    },
  });

  return {
    requestId,
    answer,
    provider: selectedProvider,
    model: selectedModel,
    fallbackUsed:
      selectedProvider === "deterministic",
    usage,
    grounding: {
      academicYear:
        grounding.governance
          .activeAcademicYear,
      school: grounding.school,
      eventCount:
        grounding.events.length,
      rbacPermissions:
        grounding.governance
          .permissions,
    },
  };
}
