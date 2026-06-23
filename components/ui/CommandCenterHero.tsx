import type { ReactNode } from "react";

type CommandCenterHeroProps = {
  label: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  tone?: "navy" | "gold" | "slate";
  healthCard?: ReactNode;
};

const toneClasses: Record<NonNullable<CommandCenterHeroProps["tone"]>, string> = {
  navy: "from-[#04142E] via-[#0B1F3A] to-[#020816]",
  gold: "from-[#0B1F3A] via-[#111827] to-[#020816]",
  slate: "from-[#0F172A] via-[#111827] to-[#020816]",
};

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export default function CommandCenterHero({
  label,
  title,
  subtitle,
  children,
  healthCard,
  className,
  tone = "navy",
}: CommandCenterHeroProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[8px] border border-[#D4AF37]/50 shadow-xl",
        "bg-gradient-to-br",
        toneClasses[tone],
        className
      )}
    >
      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.26),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,20,46,0.82)_0%,rgba(9,20,35,0.84)_46%,rgba(212,175,55,0.22)_100%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
          <div className="min-w-0 w-full max-w-none lg:pr-6">
            <p
              className="text-[11px] font-black uppercase tracking-[0.34em] drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {label}
            </p>
            <h1
              className="mt-2 break-words text-[28px] font-extrabold leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] md:text-[36px] lg:text-[48px]"
              style={{ color: "#FFFFFF" }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className="mt-3 max-w-4xl text-sm font-medium leading-6 md:text-base lg:text-[18px]"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="relative flex shrink-0 flex-wrap items-stretch gap-3 self-start lg:self-auto">
            {healthCard ? <div className="self-stretch">{healthCard}</div> : null}
          </div>
        </div>
        {children ? <div className="relative mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
