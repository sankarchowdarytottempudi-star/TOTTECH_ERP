"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Baby,
  Download,
  FlaskConical,
  HeartPulse,
  Printer,
  Search,
  UsersRound,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

type Suggestion = {
  result_type: string;
  couple_id: number;
  patient_id?: number | null;
  cycle_id?: number | null;
  primary_label: string;
  secondary_label?: string;
  uhid?: string;
  phone?: string;
};

type DashboardPayload = {
  couple?: Row;
  recentCouples?: Row[];
  suggestions?: Suggestion[];
  records?: Record<string, Row[]>;
  analytics?: Record<string, Row[]>;
  error?: string;
};

const COLORS = [
  "#D4AF37",
  "#0B1F3A",
  "#10B981",
  "#5B7CFA",
  "#F97316",
  "#EF4444",
  "#14B8A6",
  "#A855F7",
];

const moduleLinks: Record<string, string> = {
  couples: "/clinical-services/ivf/couples",
  "female-assessment": "/clinical-services/ivf/female-assessment",
  "male-assessment": "/clinical-services/ivf/male-assessment",
  cycles: "/clinical-services/ivf/cycles",
  stimulation: "/clinical-services/ivf/stimulation",
  retrievals: "/clinical-services/ivf/retrievals",
  embryology: "/clinical-services/ivf/embryology",
  embryos: "/clinical-services/ivf/embryos",
  cryo: "/clinical-services/ivf/cryo",
  transfers: "/clinical-services/ivf/transfers",
  donors: "/clinical-services/ivf/donors",
  surrogacy: "/clinical-services/ivf/surrogacy",
  pregnancies: "/clinical-services/ivf/pregnancies",
};

const asText = (value: unknown) =>
  value === null || value === undefined || value === "" ? "-" : String(value);

const asNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const hasChartData = (rows?: Row[]) =>
  Boolean(
    rows?.some((row) =>
      Object.entries(row).some(
        ([key, value]) => key !== "name" && key !== "date" && asNumber(value) > 0
      )
    )
  );

const withCouple = (moduleKey: string, coupleId?: unknown) => {
  const base = moduleLinks[moduleKey] || "/clinical-services/ivf";
  return coupleId ? `${base}?couple_id=${coupleId}` : base;
};

const printDashboard = () => {
  window.print();
};

function EmptyChart({ text = "No IVF records captured for this chart yet." }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-[8px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-black text-slate-500">
      {text}
    </div>
  );
}

function SectionShell({
  title,
  label,
  icon: Icon,
  moduleKey,
  coupleId,
  children,
}: {
  title: string;
  label: string;
  icon: typeof HeartPulse;
  moduleKey: string;
  coupleId?: unknown;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
              {label}
            </p>
            <h2 className="text-2xl font-black text-[#04142E]">{title}</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={withCouple(moduleKey, coupleId)}
            className="rounded-[8px] border border-[#D4AF37]/60 bg-[#fff9e8] px-4 py-2 text-xs font-black text-[#735300] transition hover:bg-[#D4AF37] hover:text-[#04142E]"
          >
            View More
          </Link>
          <button
            type="button"
            onClick={printDashboard}
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            type="button"
            onClick={printDashboard}
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}

function LinePanel({
  title,
  data,
  lines,
}: {
  title: string;
  data?: Row[];
  lines: {
    key: string;
    label: string;
    color: string;
  }[];
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">{title}</h3>
      <div className="h-[260px]">
        {hasChartData(data) ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 11 }} />
              <YAxis tick={{ fill: "#334155", fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  );
}

function PiePanel({
  title,
  data,
  donut = false,
}: {
  title: string;
  data?: Row[];
  donut?: boolean;
}) {
  const valid = data?.filter((row) => asNumber(row.value) > 0) || [];
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">{title}</h3>
      <div className="h-[260px]">
        {valid.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={valid}
                dataKey="value"
                nameKey="name"
                innerRadius={donut ? 56 : 0}
                outerRadius={92}
                label
              >
                {valid.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  );
}

function BarPanel({
  title,
  data,
  dataKey = "value",
}: {
  title: string;
  data?: Row[];
  dataKey?: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">{title}</h3>
      <div className="h-[260px]">
        {hasChartData(data) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 11 }} />
              <YAxis tick={{ fill: "#334155", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  );
}

function GaugePanel({
  score,
  title,
}: {
  score: number;
  title: string;
}) {
  const data = [
    {
      name: title,
      value: Math.max(0, Math.min(100, score)),
      fill: "#D4AF37",
    },
  ];
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">{title}</h3>
      <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="65%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" cornerRadius={8} background />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-10 text-center">
          <p className="text-4xl font-black text-[#04142E]">{score}%</p>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            Calculated from recorded assessment data
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelinePanel({ data }: { data?: Row[] }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">
        Cycle Timeline View
      </h3>
      <div className="space-y-3">
        {data?.length ? (
          data.map((row, index) => (
            <div
              key={`${row.name}-${index}`}
              className="rounded-[8px] border border-[#D4AF37]/40 bg-white p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black text-[#04142E]">
                  {asText(row.name)}
                </p>
                <span className="rounded-full bg-[#fff4cf] px-3 py-1 text-[11px] font-black text-[#735300]">
                  {asText(row.status)}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-slate-600">
                {asText(row.date)} | Outcome: {asText(row.outcome)}
              </p>
            </div>
          ))
        ) : (
          <EmptyChart text="No cycle timeline records yet." />
        )}
      </div>
    </div>
  );
}

function MedicationTimeline({ data }: { data?: Row[] }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">
        Medication Timeline
      </h3>
      <div className="space-y-3">
        {data?.length ? (
          data.map((row, index) => (
            <div
              key={`${row.name}-${index}`}
              className="rounded-[8px] border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-black text-[#04142E]">
                {asText(row.name)}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-600">
                {asText(row.medication)} | Dose: {asText(row.dose)} |{" "}
                {asText(row.status)}
              </p>
            </div>
          ))
        ) : (
          <EmptyChart text="No stimulation medication records yet." />
        )}
      </div>
    </div>
  );
}

function FunnelPanel({ data }: { data?: Row[] }) {
  const max = Math.max(...(data || []).map((row) => asNumber(row.value)), 1);
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">
        Pregnancy Tracking Funnel
      </h3>
      <div className="space-y-3">
        {data?.length ? (
          data.map((row, index) => {
            const value = asNumber(row.value);
            return (
              <div key={asText(row.name)} className="space-y-1">
                <div className="flex justify-between text-xs font-black text-[#04142E]">
                  <span>{asText(row.name)}</span>
                  <span>{value}</span>
                </div>
                <div className="h-8 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#D4AF37]"
                    style={{
                      width: `${Math.max(8, (value / max) * 100 - index * 4)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  );
}

export default function IvfDashboardPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recentCouples, setRecentCouples] = useState<Row[]>([]);
  const [selectedCoupleId, setSelectedCoupleId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const analytics = data?.analytics || {};
  const records = data?.records || {};
  const couple = data?.couple;

  const fertilityScore = useMemo(() => {
    const female = analytics.femaleAssessmentTrend || [];
    const male = analytics.maleAssessmentTrend || [];
    const latestFemale = female[female.length - 1] || {};
    const latestMale = male[male.length - 1] || {};
    const amhScore = Math.min(30, asNumber(latestFemale.amh) * 6);
    const afcScore = Math.min(25, asNumber(latestFemale.afc) * 2);
    const spermScore = Math.min(25, asNumber(latestMale.sperm_count) / 4);
    const motilityScore = Math.min(20, asNumber(latestMale.motility) / 3);
    return Math.round(amhScore + afcScore + spermScore + motilityScore);
  }, [analytics.femaleAssessmentTrend, analytics.maleAssessmentTrend]);

  const riskIndicators = useMemo(() => {
    const latestFemale = (analytics.femaleAssessmentTrend || []).at(-1) || {};
    const latestMale = (analytics.maleAssessmentTrend || []).at(-1) || {};
    return [
      {
        name: "Low AMH",
        value: asNumber(latestFemale.amh) > 0 && asNumber(latestFemale.amh) < 1 ? 1 : 0,
      },
      {
        name: "Low AFC",
        value: asNumber(latestFemale.afc) > 0 && asNumber(latestFemale.afc) < 6 ? 1 : 0,
      },
      {
        name: "Low Motility",
        value:
          asNumber(latestMale.motility) > 0 && asNumber(latestMale.motility) < 40
            ? 1
            : 0,
      },
      {
        name: "Low Morphology",
        value:
          asNumber(latestMale.morphology) > 0 && asNumber(latestMale.morphology) < 4
            ? 1
            : 0,
      },
    ];
  }, [analytics.femaleAssessmentTrend, analytics.maleAssessmentTrend]);

  const loadRecent = async () => {
    const response = await fetch("/api/clinical/ivf/dashboard");
    if (response.ok) {
      const payload = (await response.json()) as DashboardPayload;
      setRecentCouples(payload.recentCouples || []);
    }
  };

  const loadDashboard = async (coupleId: number) => {
    setLoading(true);
    setSelectedCoupleId(coupleId);
    const response = await fetch(`/api/clinical/ivf/dashboard?couple_id=${coupleId}`);
    const payload = (await response.json()) as DashboardPayload;
    setData(payload);
    setLoading(false);
  };

  useEffect(() => {
    void loadRecent();
  }, []);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setSearching(true);
      const response = await fetch(
        `/api/clinical/ivf/dashboard?search=${encodeURIComponent(normalized)}`
      );
      if (response.ok) {
        const payload = (await response.json()) as DashboardPayload;
        setSuggestions(payload.suggestions || []);
      }
      setSearching(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const selectSuggestion = (suggestion: Suggestion) => {
    setQuery(
      [suggestion.primary_label, suggestion.secondary_label]
        .filter(Boolean)
        .join(" | ")
    );
    setSuggestions([]);
    void loadDashboard(Number(suggestion.couple_id));
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            IVF Command Center
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Graphical IVF Dashboard
          </h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            Search by UHID, mobile, patient name, couple ID, or IVF cycle ID.
            Select a patient or couple to load clinical assessment charts,
            cycle timelines, retrieval outcomes, embryology, cryo, transfer,
            donor, surrogacy, and pregnancy tracking from actual IVF records.
          </p>
        </section>

        <section className="relative rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] border border-slate-300 px-4 focus-within:border-[#D4AF37]">
            <Search size={18} className="text-[#8a6500]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search UHID, mobile, patient name, couple ID, or IVF cycle ID..."
              className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
            />
            {searching ? (
              <span className="text-xs font-black text-slate-500">Searching...</span>
            ) : null}
          </label>

          {suggestions.length ? (
            <div className="absolute z-30 mt-2 max-h-80 w-[calc(100%-2.5rem)] overflow-auto rounded-[8px] border border-[#D4AF37]/50 bg-white shadow-xl">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.result_type}-${suggestion.couple_id}-${index}`}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-[#fff9e8]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#04142E]">
                      {asText(suggestion.primary_label)}
                    </p>
                    <span className="rounded-full bg-[#04142E] px-3 py-1 text-[11px] font-black uppercase text-[#D4AF37]">
                      {asText(suggestion.result_type)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-600">
                    {asText(suggestion.secondary_label)} | UHID {asText(suggestion.uhid)} |
                    Mobile {asText(suggestion.phone)}
                  </p>
                </button>
              ))}
            </div>
          ) : null}

          {!selectedCoupleId && recentCouples.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Recent IVF couples
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {recentCouples.map((item) => (
                  <button
                    key={asText(item.id)}
                    type="button"
                    onClick={() => void loadDashboard(Number(item.id))}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#D4AF37] hover:bg-[#fff9e8] hover:shadow-sm"
                  >
                    <p className="text-sm font-black text-[#04142E]">
                      {asText(item.couple_number)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      {asText(item.female_name)} / {asText(item.male_name)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {loading ? (
          <section className="rounded-[8px] border border-slate-200 bg-white p-6 text-sm font-black text-[#04142E] shadow-sm">
            Loading IVF analytics...
          </section>
        ) : null}

        {couple ? (
          <>
            <section className="rounded-[8px] border border-[#D4AF37]/60 bg-[#fff9e8] p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                    Selected IVF Context
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                    {asText(couple.couple_number)} | {asText(couple.female_name)} /{" "}
                    {asText(couple.male_name)}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    Female UHID {asText(couple.female_uhid || couple.female_patient_uid)} |
                    Male UHID {asText(couple.male_uhid || couple.male_patient_uid)}
                  </p>
                </div>
                <Link
                  href={`/clinical-services/ivf/couples/${asText(couple.id)}`}
                  className="rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B1F3A]"
                >
                  Open IVF 360
                </Link>
              </div>
            </section>

            <SectionShell
              title="Couple Management"
              label="Female and male assessment charts"
              icon={UsersRound}
              moduleKey="couples"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <LinePanel
                  title="Female Assessment: AMH, FSH, AFC, BMI"
                  data={analytics.femaleAssessmentTrend}
                  lines={[
                    { key: "amh", label: "AMH", color: "#D4AF37" },
                    { key: "fsh", label: "FSH", color: "#5B7CFA" },
                    { key: "afc", label: "AFC", color: "#10B981" },
                    { key: "bmi", label: "BMI", color: "#F97316" },
                  ]}
                />
                <LinePanel
                  title="Male Assessment: Sperm Count, Motility, Morphology"
                  data={analytics.maleAssessmentTrend}
                  lines={[
                    { key: "sperm_count", label: "Sperm Count", color: "#D4AF37" },
                    { key: "motility", label: "Motility", color: "#10B981" },
                    { key: "morphology", label: "Morphology", color: "#5B7CFA" },
                  ]}
                />
              </div>
            </SectionShell>

            <SectionShell
              title="Fertility Assessment"
              label="Risk and hormone intelligence"
              icon={HeartPulse}
              moduleKey="female-assessment"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-3">
                <GaugePanel title="Fertility Score Gauge" score={fertilityScore} />
                <BarPanel title="Risk Indicators" data={riskIndicators} />
                <LinePanel
                  title="Hormone Trend Charts"
                  data={analytics.femaleHormoneTrend}
                  lines={[
                    { key: "lh", label: "LH", color: "#D4AF37" },
                    { key: "estradiol", label: "Estradiol", color: "#10B981" },
                    { key: "progesterone", label: "Progesterone", color: "#5B7CFA" },
                    { key: "tsh", label: "TSH", color: "#F97316" },
                    { key: "prolactin", label: "Prolactin", color: "#A855F7" },
                  ]}
                />
              </div>
            </SectionShell>

            <SectionShell
              title="IVF Cycles"
              label="Cycle history and outcomes"
              icon={Workflow}
              moduleKey="cycles"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-3">
                <TimelinePanel data={analytics.cycleTimeline} />
                <PiePanel title="Cycle Status" data={analytics.cycleStatus} donut />
                <PiePanel title="Cycle Outcomes" data={analytics.cycleOutcomes} />
              </div>
            </SectionShell>

            <SectionShell
              title="Stimulation"
              label="Follicle growth and medication"
              icon={HeartPulse}
              moduleKey="stimulation"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <LinePanel
                  title="Follicle Growth Line Chart"
                  data={analytics.follicleGrowth}
                  lines={[
                    { key: "right", label: "Right Ovary Avg", color: "#D4AF37" },
                    { key: "left", label: "Left Ovary Avg", color: "#10B981" },
                    { key: "endometrium", label: "Endometrium", color: "#5B7CFA" },
                  ]}
                />
                <MedicationTimeline data={analytics.medicationTimeline} />
              </div>
              <div className="mt-4 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-3 text-sm font-black text-[#04142E]">
                Trigger Date:{" "}
                {records.retrievals?.[0]?.retrieval_date
                  ? asText(records.retrievals?.[0]?.retrieval_date).slice(0, 10)
                  : "No retrieval or trigger date recorded yet."}
              </div>
            </SectionShell>

            <SectionShell
              title="Retrieval"
              label="Egg retrieval outcomes"
              icon={HeartPulse}
              moduleKey="retrievals"
              coupleId={couple.id}
            >
              <PiePanel title="Retrieved, Mature, Immature, Degenerated Eggs" data={analytics.retrievalBreakdown} />
            </SectionShell>

            <SectionShell
              title="Embryology"
              label="Embryo development distribution"
              icon={FlaskConical}
              moduleKey="embryology"
              coupleId={couple.id}
            >
              <PiePanel title="2PN, 4 Cell, 8 Cell, Blastocyst, Frozen, Discarded" data={analytics.embryologyBreakdown} donut />
            </SectionShell>

            <SectionShell
              title="Cryopreservation"
              label="Frozen material distribution"
              icon={FlaskConical}
              moduleKey="cryo"
              coupleId={couple.id}
            >
              <PiePanel title="Frozen Embryos, Oocytes, Sperm" data={analytics.cryoBreakdown} />
            </SectionShell>

            <SectionShell
              title="Transfer"
              label="Transfer history and success rate"
              icon={HeartPulse}
              moduleKey="transfers"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <BarPanel title="Transfer History" data={analytics.transferHistory} dataKey="embryos" />
                <AreaSuccessChart data={analytics.transferSuccessRate} />
              </div>
            </SectionShell>

            <SectionShell
              title="Donor Management"
              label="Donor usage and success signals"
              icon={UsersRound}
              moduleKey="donors"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <PiePanel title="Donor Usage" data={analytics.donorUsage} />
                <BarPanel title="Donor Success Rate" data={analytics.donorSuccessRate} />
              </div>
            </SectionShell>

            <SectionShell
              title="Surrogacy"
              label="Progress and milestones"
              icon={Baby}
              moduleKey="surrogacy"
              coupleId={couple.id}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <PiePanel title="Surrogacy Progress" data={analytics.surrogacyProgress} />
                <BarPanel title="Surrogacy Milestones" data={analytics.surrogacyMilestones} />
              </div>
            </SectionShell>

            <SectionShell
              title="Pregnancy Tracking"
              label="Beta HCG to delivery funnel"
              icon={Baby}
              moduleKey="pregnancies"
              coupleId={couple.id}
            >
              <FunnelPanel data={analytics.pregnancyFunnel} />
            </SectionShell>
          </>
        ) : (
          <section className="rounded-[8px] border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#04142E]">
              Select a patient, couple, or IVF cycle to load the dashboard.
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              The dashboard will only render charts from actual IVF records for
              the selected couple context.
            </p>
          </section>
        )}
      </div>
    </ClinicalShell>
  );
}

function AreaSuccessChart({ data }: { data?: Row[] }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-black text-[#04142E]">
        Success Rate Chart
      </h3>
      <div className="h-[260px]">
        {hasChartData(data) ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="ivfSuccessGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 11 }} />
              <YAxis tick={{ fill: "#334155", fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#D4AF37"
                fill="url(#ivfSuccessGold)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </div>
  );
}
