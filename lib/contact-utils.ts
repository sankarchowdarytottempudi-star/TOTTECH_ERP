const normalizePhone = (value: unknown) =>
  String(value || "")
    .replace(/\D/g, "")
    .trim();

export function uniquePhones(values: Array<unknown>) {
  return Array.from(
    new Set(
      values
        .map((value) => normalizePhone(value))
        .filter(Boolean)
    )
  );
}

export function phonesConflict(values: Array<unknown>) {
  const normalized = values
    .map((value) => normalizePhone(value))
    .filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function alternatePhoneConflictsWithPrimary({
  primary,
  alternates,
}: {
  primary: Array<unknown>;
  alternates: Array<unknown>;
}) {
  const primaryPhones = new Set(
    primary
      .map((value) => normalizePhone(value))
      .filter(Boolean)
  );

  return alternates
    .map((value) => normalizePhone(value))
    .filter(Boolean)
    .some((value) => primaryPhones.has(value));
}

export function pickPreferredPhone(
  values: Array<unknown>
) {
  return uniquePhones(values)[0] || "";
}

export function normalizePhoneValue(value: unknown) {
  return normalizePhone(value) || "";
}
