"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  href: string;
  trend?: string;
}

export default function PremiumCard({
  title,
  value,
  icon,
  color: _color,
  href,
}: Props) {

  return (

    <Link href={href}>

      <motion.div
  whileHover={{
    y: -3,
  }}

  whileTap={{
    scale: 0.98,
  }}

  transition={{
    duration: 0.2,
  }}

  className="
          tt-card
          tt-card-pad
          min-h-[150px]
          cursor-pointer
          transition-all
          duration-300
          hover:border-amber-300
          hover:shadow-xl
        "
      >

        <div className="flex h-full justify-between gap-4">

          <div className="min-w-0">

            <p className="tt-card-title">
              {title}
            </p>

            <h2
              className="
                tt-card-value
                mt-3
              "
            >
              {value}
            </h2>

          </div>

          <div className="tt-icon-box">
            {icon}
          </div>

        </div>

      </motion.div>

    </Link>

  );

}
