"use client";

import {
  useEffect,
  useState,
} from "react";

type BrandLogoProps = {
  variant?: "full" | "mark";
  orientation?: "vertical" | "horizontal";
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
  logoUrl?: string | null;
  name?: string | null;
  alt?: string;
};

function logoSource(value?: string | null) {
  const src = String(value || "").trim();

  if (!src) {
    return "/images/logo.png";
  }

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  return `/${src}`;
}

export default function BrandLogo({
  variant = "full",
  orientation = "vertical",
  className = "",
  imageClassName = "",
  nameClassName = "",
  logoUrl,
  name,
  alt,
}: BrandLogoProps) {
  const logoSrc =
    logoSource(logoUrl);
  const hasExplicitLogo = Boolean(
    String(logoUrl || "").trim()
  );
  const [logoFailed, setLogoFailed] =
    useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  const displayName =
    name || "TOTTECH ONE";

  return (
    <span
      className={`inline-flex min-w-0 items-center ${
        variant === "full"
          ? orientation === "horizontal"
            ? "flex-row gap-3"
            : "flex-col gap-2"
          : ""
      } ${className}`}
    >
      {logoFailed &&
      hasExplicitLogo ? (
        <span
          className={`grid place-items-center rounded-xl border border-amber-400/50 bg-slate-950 text-center text-[10px] font-black uppercase leading-tight text-[#D4AF37] ${imageClassName}`}
          title="Uploaded school/college logo could not be loaded"
        >
          Logo
          <br />
          unavailable
        </span>
      ) : (
        <img
          src={logoSrc}
          alt={
            alt ||
            `${displayName} logo`
          }
          onError={() => {
            if (hasExplicitLogo) {
              setLogoFailed(true);
            }
          }}
          className={`block object-contain ${imageClassName}`}
        />
      )}
      {variant === "full" ? (
        <span
          aria-label={displayName}
          title={displayName}
          className={`block min-w-0 max-w-full overflow-hidden text-center font-black uppercase leading-tight tracking-normal text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.28)] ${nameClassName}`}
        >
          {displayName}
        </span>
      ) : null}
    </span>
  );
}
