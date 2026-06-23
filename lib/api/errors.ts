import { NextResponse } from "next/server";

type ErrorLike = {
  code?: string;
  message?: string;
  meta?: Record<string, unknown>;
};

const asError = (error: unknown): ErrorLike =>
  error && typeof error === "object"
    ? (error as ErrorLike)
    : {};

export function apiError(
  error: unknown,
  fallback = "Request failed",
  status = 500
) {
  const err = asError(error);
  const message =
    formatDatabaseError(err) ||
    err.message ||
    fallback;

  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
    }
  );
}

export function validationError(
  message: string
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status: 400,
    }
  );
}

function formatDatabaseError(
  error: ErrorLike
) {
  if (error.code === "P2002") {
    const target =
      Array.isArray(error.meta?.target)
        ? error.meta?.target.join(", ")
        : "record";

    return `Duplicate value: ${target} already exists.`;
  }

  if (error.code === "P2003") {
    return "This record is linked to other data. Remove the linked records first, then try again.";
  }

  if (error.code === "P2025") {
    return "Record not found.";
  }

  if (error.code === "23505") {
    return "Duplicate value already exists.";
  }

  if (error.code === "23503") {
    return "This record is linked to other data and cannot be removed until the linked data is cleared.";
  }

  return null;
}
