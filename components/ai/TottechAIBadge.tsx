"use client";

import { useState } from "react";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  label?: string;
  tagline?: string;
};

const logoSrc =
  "/brand/tottech-ai/logo.png";

const sizes = {
  sm: {
    shell: "h-8 w-8",
    image: "h-8 w-8",
    text: "text-xs",
  },
  md: {
    shell: "h-11 w-11",
    image: "h-11 w-11",
    text: "text-sm",
  },
  lg: {
    shell: "h-16 w-16",
    image: "h-16 w-16",
    text: "text-base",
  },
};

export default function TottechAIBadge({
  size = "md",
  showText = false,
  className = "",
  label = "TOTTECH AI",
  tagline = "Gateway To Innovation",
}: Props) {
  const [failed, setFailed] =
    useState(false);
  const config = sizes[size];

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-3 ${className}`}
    >
      {!failed ? (
        <img
          src={logoSrc}
          alt={`${label} ${tagline}`}
          onError={() => setFailed(true)}
          className={`${config.image} shrink-0 rounded-lg border border-amber-300/70 bg-slate-950 object-cover shadow-sm`}
        />
      ) : (
        <span
          className={`${config.shell} grid shrink-0 place-items-center rounded-lg border border-amber-300/70 bg-slate-950 font-black leading-none text-amber-100 shadow-sm ${config.text}`}
          aria-label={label}
        >
          AI
        </span>
      )}

      {showText && (
        <span className="min-w-0">
          <span className="block truncate font-black leading-5 text-slate-950">
            {label}
          </span>
          <span className="block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
            {tagline}
          </span>
        </span>
      )}
    </span>
  );
}
