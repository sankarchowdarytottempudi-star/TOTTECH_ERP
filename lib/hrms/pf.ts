export type PfProfileInput = {
  basic_salary?: unknown;
  da?: unknown;
  pf_wage?: unknown;
  voluntary_pf_percent?: unknown;
  employer_pf_percent?: unknown;
  pf_applicable?: unknown;
  eps_applicable?: unknown;
};

export type PfContributionBreakdown = {
  pfWage: number;
  employeePf: number;
  employerPf: number;
  eps: number;
  edli: number;
};

const decimal = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? Number(number.toFixed(2)) : 0;
};

export function normalizeUan(value: unknown) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "");
}

export function isValidUan(value: unknown) {
  return /^\d{12}$/.test(normalizeUan(value));
}

export function formatMoney(value: unknown) {
  return Number(decimal(value)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function pfContributionBreakdown(
  input: PfProfileInput
): PfContributionBreakdown {
  const basicSalary = decimal(input.basic_salary);
  const da = decimal(input.da);
  const providedPfWage = decimal(input.pf_wage);
  const pfWage = Math.max(
    providedPfWage,
    basicSalary + da
  );
  const voluntaryPercent = Math.max(
    0,
    decimal(input.voluntary_pf_percent)
  );
  const employerPercent = Math.max(
    0,
    decimal(input.employer_pf_percent) || 12
  );
  const pfApplicable =
    input.pf_applicable === undefined
      ? true
      : Boolean(input.pf_applicable);
  const epsApplicable =
    input.eps_applicable === undefined
      ? true
      : Boolean(input.eps_applicable);

  if (!pfApplicable || !pfWage) {
    return {
      pfWage,
      employeePf: 0,
      employerPf: 0,
      eps: 0,
      edli: 0,
    };
  }

  const employeePf = Number(
    (
      pfWage *
      ((12 + voluntaryPercent) / 100)
    ).toFixed(2)
  );
  const employerTotal = Number(
    (
      pfWage *
      (employerPercent / 100)
    ).toFixed(2)
  );
  const epsBase = Math.min(pfWage, 15000);
  const eps = epsApplicable
    ? Number((epsBase * 0.0833).toFixed(2))
    : 0;
  const employerPf = Number(
    Math.max(0, employerTotal - eps).toFixed(2)
  );
  const edli = Number(
    (Math.min(pfWage, 15000) * 0.005).toFixed(2)
  );

  return {
    pfWage: Number(pfWage.toFixed(2)),
    employeePf,
    employerPf,
    eps,
    edli,
  };
}

export function pfRegisterRow(row: {
  employee_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  department?: string | null;
  designation?: string | null;
  uan_number?: string | null;
  pf_number?: string | null;
  pf_status?: string | null;
  basic_salary?: unknown;
  da?: unknown;
  pf_wage?: unknown;
  voluntary_pf_percent?: unknown;
  employer_pf_percent?: unknown;
}) {
  const breakdown = pfContributionBreakdown({
    basic_salary: row.basic_salary,
    da: row.da,
    pf_wage: row.pf_wage,
    voluntary_pf_percent: row.voluntary_pf_percent,
    employer_pf_percent: row.employer_pf_percent,
    pf_applicable: true,
    eps_applicable: true,
  });

  return {
    employee_id: row.employee_id,
    employee_name: [row.first_name, row.last_name].filter(Boolean).join(" "),
    department: row.department,
    designation: row.designation,
    uan_number: row.uan_number,
    pf_member_id: row.pf_number,
    pf_status: row.pf_status,
    pf_wage: breakdown.pfWage,
    employee_pf: breakdown.employeePf,
    employer_pf: breakdown.employerPf,
    eps: breakdown.eps,
    edli: breakdown.edli,
  };
}
