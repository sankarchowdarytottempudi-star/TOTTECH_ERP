"use client";

import Link from "next/link";

interface Props {
  title: string;
  value: string | number;
  icon: string;
  href: string;
  color?: string;
}

export default function DrillDownTile({
  title,
  value,
  icon,
  href,
  color: _color = "from-blue-500 to-indigo-600",
}: Props) {
  return (
    <Link href={href}>
      <div className="group tt-card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
        <div className="h-1 bg-amber-600" />

        <div className="tt-card-pad">

          <div className="flex justify-between gap-4">

            <div className="min-w-0">

              <p className="tt-card-title">
                {title}
              </p>

              <h2 className="tt-card-value mt-3">
                {value}
              </h2>

            </div>

            <div className="tt-icon-box text-xl">
              {icon}
            </div>

          </div>

          <div
            className="
              mt-5
              tt-link
              font-semibold
              opacity-0
              group-hover:opacity-100
              transition-all
            "
          >
            View Details →
          </div>

        </div>

      </div>
    </Link>
  );
}
