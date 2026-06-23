import { prisma } from "@/lib/prisma";

type NumberingResult = {
  documentNumber: string;
  sequence: number;
  schoolCode: string;
  yearSuffix: string;
};

function normalizeSchoolCode(value: unknown) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

function yearSuffixFromAcademicYear(value: unknown) {
  const text = String(value ?? "").trim();
  const match = text.match(/(\d{2,4})\s*[-/]\s*(\d{2,4})$/);
  if (match) {
    const raw = match[2];
    return raw.length === 4 ? raw.slice(-2) : raw.padStart(2, "0");
  }
  return new Date().getFullYear().toString().slice(-2);
}

export async function nextDocumentNumber(input: {
  schoolId: number;
  documentType: string;
  academicYearId?: number | null;
  prefix?: string;
}) : Promise<NumberingResult> {
  const prefix = String(input.prefix || input.documentType || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);

  const school = await prisma.schools.findFirst({
    where: { id: input.schoolId },
    select: { school_code: true },
  });

  const schoolCode = normalizeSchoolCode(
    school?.school_code || "SCH"
  );

  const academicYear = input.academicYearId
    ? await prisma.academic_years.findFirst({
        where: { id: input.academicYearId },
        select: { academic_year: true },
      })
    : null;

  const yearSuffix = yearSuffixFromAcademicYear(
    academicYear?.academic_year
  );

  const row = await prisma.$queryRawUnsafe<Array<{ current_sequence: number }>>(
    `
      INSERT INTO document_number_sequences (
        school_id,
        document_type,
        year_suffix,
        current_sequence,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (school_id, document_type, year_suffix)
      DO UPDATE SET
        current_sequence = document_number_sequences.current_sequence + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING current_sequence
    `,
    input.schoolId,
    prefix,
    yearSuffix
  );

  const sequence = Number(row[0]?.current_sequence || 1);
  const documentNumber = `${schoolCode}-${prefix}-${yearSuffix}-${String(sequence).padStart(5, "0")}`;

  return {
    documentNumber,
    sequence,
    schoolCode,
    yearSuffix,
  };
}
