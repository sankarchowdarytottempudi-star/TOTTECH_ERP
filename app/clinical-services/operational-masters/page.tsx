"use client";

import Link from "next/link";
import {
  ArrowRight,
  Database,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { operationalMasterList } from "@/lib/clinical/operational-masters-core";

export default function OperationalMastersIndexPage() {
  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase text-[#8a6500]">
            Hospital Operations
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#04142E]">
            Operational Masters
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-600">
            Practical master-data screens for hospital daily operations. No
            placeholder dashboards, no fake metrics, only data capture and
            record management.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operationalMasterList.map((module) => (
            <Link
              key={module.key}
              href={`/clinical-services/operational-masters/${module.key}`}
              className="group rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
                  <Database size={20} />
                </div>
                <ArrowRight
                  className="text-[#8a6500] transition group-hover:translate-x-1"
                  size={18}
                />
              </div>
              <h2 className="mt-4 text-xl font-black text-[#04142E]">
                {module.label}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {module.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </ClinicalShell>
  );
}
