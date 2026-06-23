export type StudentBacklogInput = {
  subject_id?: unknown;
  exam_id?: unknown;
  backlog_status?: unknown;
  backlog_reason?: unknown;
  cleared_date?: unknown;
  remarks?: unknown;
};

export type NormalizedStudentBacklog = {
  subject_id: number | null;
  exam_id: number | null;
  backlog_status: "PENDING" | "CLEARED";
  backlog_reason: string | null;
  cleared_date: string | null;
  remarks: string | null;
};

const numberOrNull = (
  value: unknown
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : null;
};

const textOrNull = (
  value: unknown
) => {
  const text = String(value || "").trim();
  return text ? text : null;
};

export function parseBacklogStatus(
  value: unknown
): "PENDING" | "CLEARED" {
  return String(value || "PENDING")
    .trim()
    .toUpperCase() === "CLEARED"
    ? "CLEARED"
    : "PENDING";
}

export function normalizeStudentBacklogs(
  value: unknown,
  hasBacklogs: boolean
): NormalizedStudentBacklog[] {
  if (!hasBacklogs || !Array.isArray(value)) {
    return [];
  }

  return value
    .map((row: unknown) => {
      const item =
        row && typeof row === "object"
          ? (row as StudentBacklogInput)
          : {};

      const subjectId = numberOrNull(
        item.subject_id
      );
      const examId = numberOrNull(
        item.exam_id
      );
      const backlogStatus =
        parseBacklogStatus(
          item.backlog_status
        );
      const backlogReason = textOrNull(
        item.backlog_reason
      );
      const remarks = textOrNull(
        item.remarks
      );
      const clearedDate = textOrNull(
        item.cleared_date
      );

      return {
        subject_id: subjectId,
        exam_id: examId,
        backlog_status: backlogStatus,
        backlog_reason: backlogReason,
        cleared_date:
          backlogStatus === "CLEARED"
            ? clearedDate
            : null,
        remarks,
      };
    })
    .filter(
      (row) =>
        row.subject_id !== null ||
        row.exam_id !== null ||
        row.backlog_reason !== null ||
        row.remarks !== null
    );
}

export function hasPendingBacklog(
  rows: {
    backlog_status?: string | null;
    cleared_date?: string | null;
  }[]
) {
  return rows.some((row) => {
    const status = String(
      row.backlog_status || "PENDING"
    )
      .trim()
      .toUpperCase();

    return (
      status !== "CLEARED" &&
      !row.cleared_date
    );
  });
}

export function backlogSummary(
  rows: {
    backlog_status?: string | null;
  }[]
) {
  const total = rows.length;
  const cleared = rows.filter(
    (row) =>
      String(
        row.backlog_status || "PENDING"
      )
        .trim()
        .toUpperCase() === "CLEARED"
  ).length;
  const pending = Math.max(
    0,
    total - cleared
  );

  return {
    total,
    cleared,
    pending,
    hasPending: pending > 0,
  };
}
