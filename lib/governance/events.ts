import { prisma } from "@/lib/prisma";

type EventInput = {
  school_id?: number | null;
  academic_year_id?: number | null;
  user_id?: number | null;
  created_by?: number | null;
  actor_role?: string | null;
  module_name: string;
  event_type: string;
  action?: string | null;
  entity_type?: string | null;
  entity_id?: number | null;
  entity_uid?: string | null;
  severity?: string | null;
  summary?: string | null;
  payload?: unknown;
  metadata?: unknown;
};

const asJson = (value: unknown) =>
  value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));

export async function recordEvent(
  input: EventInput
) {
  const effectiveSchoolId =
    input.school_id ??
    (input.entity_type === "school"
      ? input.entity_id
      : null);
  const academicYearId =
    input.academic_year_id ??
    (effectiveSchoolId
      ? (
          await prisma.academic_years.findFirst({
            where: {
              school_id:
                effectiveSchoolId,
              is_current: true,
            },
            orderBy: {
              id: "desc",
            },
          })
        )?.id ?? null
      : null);
  const event =
    await prisma.event_ledger.create({
      data: {
        school_id:
          effectiveSchoolId,
        academic_year_id:
          academicYearId,
        user_id: input.user_id ?? null,
        created_by:
          input.created_by ??
          input.user_id ??
          null,
        actor_role:
          input.actor_role ?? null,
        module_name: input.module_name,
        event_type: input.event_type,
        action: input.action ?? null,
        entity_type:
          input.entity_type ?? null,
        entity_id:
          input.entity_id ?? null,
        entity_uid:
          input.entity_uid ?? null,
        severity:
          input.severity ?? "INFO",
        summary: input.summary ?? null,
        payload: asJson(input.payload),
        metadata: asJson(input.metadata),
      },
    });

  await fanOutTimeline(event).catch(
    (error) => {
      console.error(
        "Timeline fan-out failed",
        error
      );
    }
  );

  return event;
}

async function fanOutTimeline(
  event: {
    id: number;
    school_id: number | null;
    academic_year_id: number | null;
    entity_type: string | null;
    entity_id: number | null;
    module_name: string;
    summary: string | null;
    payload: unknown;
    occurred_at: Date | null;
  }
) {
  if (
    !event.entity_type ||
    !event.entity_id
  ) {
    return;
  }

  const title =
    event.summary ||
    `${event.module_name} event`;

  const data = {
    school_id: event.school_id,
    event_id: event.id,
    academic_year_id:
      event.academic_year_id,
    title,
    description: title,
    source_module:
      event.module_name,
    metadata: asJson({
      event_payload: event.payload,
    }),
    occurred_at:
      event.occurred_at ?? undefined,
  };

  if (
    event.entity_type === "student"
  ) {
    await prisma.student_timelines.create({
      data: {
        ...data,
        student_id: event.entity_id,
      },
    });
  }

  if (
    event.entity_type === "teacher"
  ) {
    await prisma.teacher_timelines.create({
      data: {
        ...data,
        teacher_id: event.entity_id,
      },
    });
  }

  if (
    event.entity_type === "class"
  ) {
    await prisma.class_timelines.create({
      data: {
        ...data,
        class_id: event.entity_id,
      },
    });
  }

  if (
    event.entity_type === "school"
  ) {
    await prisma.school_timelines.create({
      data: {
        ...data,
        school_id: event.entity_id,
      },
    });
  }
}
