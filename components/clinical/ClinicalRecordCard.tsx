"use client";

import Link from "next/link";
import {
  ClipboardList,
  Edit3,
  Eye,
  Paperclip,
  History,
  UserRound,
} from "lucide-react";

type Action = {
  label: string;
  href: string;
};

export default function ClinicalRecordCard({
  href,
  eyebrow,
  title,
  description,
  status,
  metadata = [],
  patientHref,
  editHref,
  auditHref,
  historyHref,
  attachmentsHref,
  children,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  description?: string;
  status?: string;
  metadata?: string[];
  patientHref?: string;
  editHref?: string;
  auditHref?: string;
  historyHref?: string;
  attachmentsHref?: string;
  children?: React.ReactNode;
}) {
  const actions: Action[] = [
    {
      label: "View Details",
      href,
    },
    ...(editHref
      ? [
          {
            label: "Edit",
            href: editHref,
          },
        ]
      : []),
    ...(auditHref
      ? [
          {
            label: "Audit Timeline",
            href: auditHref,
          },
        ]
      : []),
    ...(historyHref
      ? [
          {
            label: "History",
            href: historyHref,
          },
        ]
      : []),
    ...(attachmentsHref
      ? [
          {
            label: "Attachments",
            href: attachmentsHref,
          },
        ]
      : []),
    ...(patientHref
      ? [
          {
            label: "Patient 360",
            href: patientHref,
          },
        ]
      : []),
  ];

  return (
    <article
      data-clinical-record-card="interactive"
      role="link"
      tabIndex={0}
      aria-label={`Open ${title}`}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          target.closest(
            "a,button,input,select,textarea"
          )
        ) {
          return;
        }

        window.location.href = href;
      }}
      onKeyDown={(event) => {
        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {
          return;
        }

        const target = event.target as HTMLElement;
        if (
          target.closest(
            "a,button,input,select,textarea"
          )
        ) {
          return;
        }

        event.preventDefault();
        window.location.href = href;
      }}
      className="group relative cursor-pointer rounded-[8px] border border-slate-200 bg-slate-50 p-4 shadow-sm outline-none transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-xl active:translate-y-0"
    >
      <Link
        href={href}
        aria-label={`Open ${title}`}
        className="absolute inset-0 z-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/45"
      />
      <div className="pointer-events-none relative z-10 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#735300]">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-1 break-words text-lg font-black text-[#04142E]">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {status ? (
          <span className="inline-flex shrink-0 rounded-[8px] border border-[#D4AF37]/45 bg-[#fff4df] px-3 py-2 text-xs font-black uppercase text-[#735300]">
            {status}
          </span>
        ) : null}
      </div>

      {metadata.length ? (
        <div className="pointer-events-none relative z-10 mt-4 flex flex-wrap gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {children ? (
        <div className="relative z-10 mt-4">{children}</div>
      ) : null}

      <div className="relative z-20 mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8] hover:text-[#735300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/45"
          >
            {iconForAction(action.label)}
            {action.label}
          </Link>
        ))}
      </div>
    </article>
  );
}

function iconForAction(label: string) {
  if (label === "Edit") {
    return <Edit3 size={14} />;
  }

  if (label === "Audit Timeline") {
    return <ClipboardList size={14} />;
  }

  if (label === "History") {
    return <History size={14} />;
  }

  if (label === "Attachments") {
    return <Paperclip size={14} />;
  }

  if (label === "Patient 360") {
    return <UserRound size={14} />;
  }

  return <Eye size={14} />;
}
