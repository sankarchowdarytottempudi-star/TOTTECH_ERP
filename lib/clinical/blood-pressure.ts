export const BP_VALIDATION_MESSAGE =
  "Please enter a valid blood pressure value";

export type ParsedBloodPressure = {
  bloodPressure: string;
  systolicBp: number;
  diastolicBp: number;
};

export function formatBloodPressureInput(
  value: string
) {
  const digits = value
    .replace(/\D/g, "")
    .slice(0, 5);

  if (digits.length <= 3) {
    return digits;
  }

  return `${digits.slice(0, 3)}/${digits.slice(3)}`;
}

export function parseBloodPressure(
  value: string
): ParsedBloodPressure | null {
  const trimmed = value.trim();
  const match = trimmed.match(
    /^(\d{2,3})\/(\d{1,3})$/
  );

  if (!match) {
    return null;
  }

  const systolicBp = Number(match[1]);
  const diastolicBp = Number(match[2]);

  if (
    !Number.isFinite(systolicBp) ||
    !Number.isFinite(diastolicBp) ||
    systolicBp < 50 ||
    systolicBp > 300 ||
    diastolicBp < 30 ||
    diastolicBp > 200
  ) {
    return null;
  }

  return {
    bloodPressure: `${systolicBp}/${diastolicBp}`,
    systolicBp,
    diastolicBp,
  };
}

export function shouldShowBloodPressureError(
  value: string
) {
  const digits = value.replace(/\D/g, "");

  return (
    digits.length >= 4 &&
    !parseBloodPressure(value)
  );
}
