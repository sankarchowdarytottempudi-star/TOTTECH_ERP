"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Baby,
  BarChart3,
  Brain,
  FileText,
  FlaskConical,
  HeartPulse,
  Snowflake,
  UsersRound,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

type Ivf360Payload = {
  couple?: Row;
  metrics?: Record<string, number>;
  femaleAssessments?: Row[];
  maleAssessments?: Row[];
  treatmentPlans?: Row[];
  cycles?: Row[];
  stimulation?: Row[];
  follicleTracking?: Row[];
  retrievals?: Row[];
  fertilization?: Row[];
  embryos?: Row[];
  freezing?: Row[];
  transfers?: Row[];
  pregnancies?: Row[];
  billing?: Row[];
  referrals?: Row[];
  documents?: Row[];
  alerts?: Row[];
  timeline?: Row[];
  aiSummaries?: Row[];
};

export default function IvfCouple360Page() {
  const params =
    useParams<{ id: string }>();
  const [data, setData] =
    useState<Ivf360Payload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          `/api/clinical/ivf/360/${params?.id}`
        );

        if (response.ok) {
          setData(await response.json());
        }
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [params?.id]);

  const couple = data?.couple || {};
  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/ivf/couples"
          className="inline-flex rounded-[8px] border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm"
        >
          Back to Couples
        </Link>

        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            IVF 360
          </p>
          <h1 className="mt-2 break-words text-4xl font-black">
            {String(
              couple.couple_number ||
                "Couple Record"
            )}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-200">
            {String(couple.female_name || couple.female_first_name || "Female Partner")} /{" "}
            {String(couple.male_name || couple.male_first_name || "Male Partner")}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Workflow}
            title="Cycles"
            value={metrics.cycles}
          />
          <Metric
            icon={FlaskConical}
            title="Embryos"
            value={metrics.embryos}
          />
          <Metric
            icon={Snowflake}
            title="Frozen"
            value={metrics.frozenEmbryos}
          />
          <Metric
            icon={HeartPulse}
            title="Transfers"
            value={metrics.transfers}
          />
          <Metric
            icon={Baby}
            title="Pregnancy"
            value={metrics.pregnancies}
          />
          <Metric
            icon={BarChart3}
            title="Invoices"
            value={metrics.invoices}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Couple Profile">
            <Info
              label="Female"
              value={`${couple.female_patient_uid || couple.female_uhid || ""} ${couple.female_name || couple.female_first_name || ""} ${couple.female_last_name || ""}`}
            />
            <Info
              label="Male"
              value={`${couple.male_patient_uid || couple.male_uhid || ""} ${couple.male_name || couple.male_first_name || ""} ${couple.male_last_name || ""}`}
            />
            <Info
              label="Infertility Duration"
              value={`${couple.infertility_duration_months || 0} months`}
            />
            <Info
              label="Referral"
              value={`${couple.referral_doctor || couple.referral_hospital || couple.referral_agent || "-"}`}
            />
          </Panel>

          <Panel title="TOTTECH IVF AI">
            <Rows
              rows={data?.aiSummaries || []}
              empty="No IVF AI summaries generated yet. Clinical review is always required."
              primary={(row) =>
                String(row.summary_type || "AI Summary")
              }
              secondary={(row) =>
                String(
                  row.answer ||
                    "Clinical Review Required"
                )
              }
              icon={Brain}
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel title="Assessments">
            <Rows
              rows={[
                ...(data?.femaleAssessments || []),
                ...(data?.maleAssessments || []),
              ]}
              empty="No fertility assessments recorded."
              primary={(row) =>
                String(row.assessment_date || "Assessment")
              }
              secondary={(row) =>
                String(row.clinical_summary || row.status || "-")
              }
              icon={UsersRound}
            />
          </Panel>

          <Panel title="Treatment & Cycles">
            <Rows
              rows={[
                ...(data?.treatmentPlans || []),
                ...(data?.cycles || []),
              ]}
              empty="No treatment plan or IVF cycle created."
              primary={(row) =>
                String(row.plan_number || row.cycle_number || "-")
              }
              secondary={(row) =>
                `${row.treatment_type || row.cycle_type || ""} ${row.protocol_type || ""}`.trim()
              }
              icon={Workflow}
            />
          </Panel>

          <Panel title="Stimulation & Follicles">
            <Rows
              rows={[
                ...(data?.stimulation || []),
                ...(data?.follicleTracking || []),
              ]}
              empty="No stimulation or follicle monitoring records."
              primary={(row) =>
                String(row.monitoring_date || row.tracking_date || "-")
              }
              secondary={(row) =>
                String(row.medication || row.impression || row.status || "-")
              }
              icon={HeartPulse}
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel title="Retrievals & Fertilization">
            <Rows
              rows={[
                ...(data?.retrievals || []),
                ...(data?.fertilization || []),
              ]}
              empty="No retrieval or fertilization records."
              primary={(row) =>
                String(row.retrieval_number || row.fertilization_number || "-")
              }
              secondary={(row) =>
                `Oocytes ${row.oocytes_retrieved || row.oocytes_inseminated || 0}`
              }
              icon={FlaskConical}
            />
          </Panel>

          <Panel title="Embryos & Cryo">
            <Rows
              rows={[
                ...(data?.embryos || []),
                ...(data?.freezing || []),
              ]}
              empty="No embryo or cryo records."
              primary={(row) =>
                String(row.embryo_id || row.cryo_number || "-")
              }
              secondary={(row) =>
                String(row.current_status || row.status || row.location_code || "-")
              }
              icon={Snowflake}
            />
          </Panel>

          <Panel title="Transfers & Pregnancy">
            <Rows
              rows={[
                ...(data?.transfers || []),
                ...(data?.pregnancies || []),
              ]}
              empty="No transfer or pregnancy records."
              primary={(row) =>
                String(row.transfer_number || row.pregnancy_outcome || "-")
              }
              secondary={(row) =>
                String(row.transfer_date || row.beta_hcg_status || row.status || "-")
              }
              icon={Baby}
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel title="Billing & Referrals">
            <Rows
              rows={[
                ...(data?.billing || []),
                ...(data?.referrals || []),
              ]}
              empty="No IVF billing or referral records."
              primary={(row) =>
                String(row.invoice_number || row.referral_source || "-")
              }
              secondary={(row) =>
                String(row.total || row.approval_status || row.payment_status || "-")
              }
              icon={BarChart3}
            />
          </Panel>

          <Panel title="Documents & Alerts">
            <Rows
              rows={[
                ...(data?.documents || []),
                ...(data?.alerts || []),
              ]}
              empty="No documents or alerts recorded."
              primary={(row) =>
                String(row.title || row.alert_type || "-")
              }
              secondary={(row) =>
                String(row.message || row.status || "-")
              }
              icon={FileText}
            />
          </Panel>

          <Panel title="Timeline">
            <Rows
              rows={data?.timeline || []}
              empty="No IVF timeline entries yet."
              primary={(row) =>
                String(row.event_title || row.event_type || "-")
              }
              secondary={(row) =>
                String(row.event_summary || row.created_at || "-")
              }
              icon={Workflow}
            />
          </Panel>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Workflow;
  title: string;
  value: unknown;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-4xl font-black">
        {String(value ?? 0)}
      </p>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words font-black">
        {value || "-"}
      </p>
    </div>
  );
}

function Rows({
  rows,
  empty,
  primary,
  secondary,
  icon: Icon,
}: {
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
  icon: typeof Workflow;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <>
      {rows.slice(0, 8).map((row, index) => (
        <article
          key={`${primary(row)}-${index}`}
          className="flex gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="break-words font-black">
              {primary(row)}
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-600">
              {secondary(row)}
            </p>
          </div>
        </article>
      ))}
    </>
  );
}
