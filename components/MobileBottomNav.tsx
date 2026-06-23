"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import {
  BarChart3,
  House,
  Bell,
  Search,
  Wallet,
  UserCircle,
} from "lucide-react";

export default function MobileBottomNav() {

  const pathname =
    usePathname() || "";
  const [role] =
    useState(() => {
      if (typeof window === "undefined") {
        return "";
      }

      try {
        const storedUser =
          localStorage.getItem("erpUser");
        const user = storedUser
          ? JSON.parse(storedUser)
          : null;
        return String(user?.role || "")
          .toUpperCase()
          .replaceAll(" ", "_");
      } catch {
        return "";
      }
    });

  const items = useMemo(() => {
    const dashboardHref =
      role === "PARENT"
        ? "/parent/dashboard"
        : role === "TEACHER"
          ? "/dashboard/teacher"
          : role === "PRINCIPAL"
            ? "/dashboard/principal"
            : "/";

    const reportsHref =
      role === "PARENT"
        ? "/parent/marks"
        : "/reports";

    const profileHref =
      role === "PARENT"
        ? "/parent/dashboard"
        : "/settings";

    if (role === "PARENT") {
      return [
        {
          label: "Dashboard",
          href: dashboardHref,
          icon: House,
        },
        {
          label: "Search",
          href: "/explorer",
          icon: Search,
        },
        {
          label: "Alerts",
          href: "/communication",
          icon: Bell,
          badge: true,
        },
        {
          label: "Reports",
          href: reportsHref,
          icon: BarChart3,
        },
        {
          label: "Profile",
          href: profileHref,
          icon: UserCircle,
        },
      ];
    }

    if (role === "TEACHER") {
      return [
        {
          label: "Dashboard",
          href: dashboardHref,
          icon: House,
        },
        {
          label: "Search",
          href: "/explorer",
          icon: Search,
        },
        {
          label: "Alerts",
          href: "/communication",
          icon: Bell,
          badge: true,
        },
        {
          label: "Reports",
          href: reportsHref,
          icon: BarChart3,
        },
        {
          label: "Profile",
          href: profileHref,
          icon: UserCircle,
        },
      ];
    }

    return [

    {
      label: "Dashboard",
      href: dashboardHref,
      icon: House,
    },

    {
      label: "Search",
      href: "/explorer",
      icon: Search,
    },

    {
      label: "Alerts",
      href: "/communication",
      icon: Bell,
      badge: true,
    },

    {
      label: "Reports",
      href: reportsHref,
      icon: Wallet,
    },

    {
      label: "Profile",
      href: profileHref,
      icon: UserCircle,
    },

  ];
  }, [role]);

  return (

    <div
      className="
        md:hidden
        fixed
        bottom-4
        left-3
        right-3
        z-50
      "
    >

      <div
        className="
          bg-white/95
          backdrop-blur-xl
          rounded-lg
          shadow-2xl
          border
          border-slate-200
          px-2
          py-2
        "
      >

        <div className="grid grid-cols-5">

          {items.map((item) => {

            const Icon =
              item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (

              <Link
                key={item.href}
                href={item.href}
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-2
                "
              >

                <div
                  className={`
                    relative
                    w-12
                    h-12
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    transition-all
                    ${
                      active
                        ? "bg-slate-950 text-white shadow-lg"
                        : "text-slate-500"
                    }
                  `}
                >

                  <Icon size={22} />

                  {"badge" in item &&
                    item.badge && (
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
                    )}

                </div>

                <span
                  className={`
                    text-[11px]
                    mt-1
                    font-bold
                    ${
                      active
                        ? "text-amber-700"
                        : "text-slate-500"
                    }
                  `}
                >
                  {item.label}
                </span>

              </Link>

            );

          })}

        </div>

      </div>

    </div>

  );

}
