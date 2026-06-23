"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import TottechAIBadge from "@/components/ai/TottechAIBadge";

export default function QuickActions() {
  const [hasAiAccess, setHasAiAccess] =
    useState(false);
  const [aiName, setAiName] =
    useState("School/College Assistant");

  useEffect(() => {
    let active = true;

    fetch("/api/school-context")
      .then((response) =>
        response.json()
      )
      .then((data) => {
        if (!active) return;
        setHasAiAccess(
          data?.effectiveModuleAccess?.AI !== false
        );
      })
      .catch(() => {
        if (active) {
          setHasAiAccess(false);
        }
      });

    fetch("/api/my-school-branding")
      .then((response) =>
        response.json()
      )
      .then((data) => {
        if (active) {
          setAiName(
            data.aiDisplayName ||
              data.assistantName ||
              "School/College Assistant"
          );
        }
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, []);

  const actions: {
    title: string;
    href: string;
    icon: ReactNode;
    featured?: boolean;
  }[] = [

    {
      title: "Add Student",
      href: "/students",
      icon: "🎓",
    },

    {
      title: "Add Teacher",
      href: "/teachers",
      icon: "👨‍🏫",
    },

    {
      title: "Create Exam",
      href: "/academics/exam-schedule",
      icon: "📝",
    },

    {
      title: "Collect Fee",
      href: "/finance/payments",
      icon: "💰",
    },
    ...(hasAiAccess
      ? [
          {
            title: aiName,
            href: "/ai-school-copilot",
            icon: (
              <TottechAIBadge
                size="sm"
                label={aiName}
                tagline="School/College Copilot"
              />
            ),
            featured: true,
          },
        ]
      : []),
  ];

  return (

    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-5
        gap-4
      "
    >

      {actions.map((action) => (

        <a
          key={action.title}
          href={action.href}
          className={`
            tt-card
            p-4
            text-center
            transition-all
            hover:border-amber-300
            hover:shadow-xl
            ${
              action.featured
                ? "border-amber-300 bg-amber-50/60 shadow-[0_16px_44px_rgba(245,158,11,0.12)]"
                : ""
            }
          `}
        >

          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-xl">
            {action.icon}
          </div>

          <div className="text-sm font-bold text-slate-950">
            {action.title}
          </div>

        </a>

      ))}

    </div>

  );

}
