"use client";

import {
  ChevronDown,
  Languages,
} from "lucide-react";
import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { language, setLanguage, t } =
    useLanguage();

  return (
    <label
      className={`
        flex
        min-w-0
        items-center
        gap-2
        rounded-lg
        border
        border-slate-300
        bg-white
        px-3
        py-2.5
        text-sm
        font-semibold
        text-slate-950
        shadow-sm
        focus-within:ring-2
        focus-within:ring-amber-500
        ${compact ? "w-full" : "w-[168px]"}
        ${compact ? "" : "min-w-[168px]"}
      `}
    >
      <Languages
        size={16}
        className="shrink-0 text-slate-500"
      />
      <span className="sr-only">
        {t("selectLanguage", "Select language")}
      </span>
      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value)
        }
        className="
          w-full
          min-w-0
          appearance-none
          border-0
          bg-transparent
          pr-4
          text-sm
          font-semibold
          text-slate-950
          outline-none
        "
        aria-label={t(
          "selectLanguage",
          "Select language"
        )}
      >
        {languageOptions().map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none shrink-0 text-slate-400"
      />
    </label>
  );
}
