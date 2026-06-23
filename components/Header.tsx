"use client";

import {
  Activity,
  Bell,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import AcademicYearSwitcher from "./AcademicYearSwitcher";
import BrandLogo from "./BrandLogo";
import GlobalSearch from "./GlobalSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import SchoolSwitcher from "./SchoolSwitcher";

type HeaderUser = {
  full_name?: string;
  role?: string;
};

type HeaderSchool = {
  school_name?: string;
  schoolName?: string;
  logoUrl?: string;
  product?: string;
  secondaryColor?: string;
};

const readStoredHeaderUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser =
      localStorage.getItem("erpUser");

    return storedUser
      ? (JSON.parse(
          storedUser
        ) as HeaderUser)
      : null;
  } catch {
    return null;
  }
};

export default function Header({
  onOpenMenu,
}: {
  onOpenMenu?: () => void;
}) {
  const [user, setUser] =
    useState<HeaderUser | null>(null);
  const [school, setSchool] =
    useState<HeaderSchool | null>(
      null
    );
  const { t } = useLanguage();

  useEffect(() => {
    setUser(readStoredHeaderUser());
  }, []);

  useEffect(() => {
    let active = true;
    const loadBranding = () => {
      fetch(
        `/api/my-school-branding?t=${Date.now()}`,
        {
          cache: "no-store",
        }
      )
        .then((response) =>
          response.json()
        )
        .then((data) => {
          if (active) {
            setSchool(data);
          }
        })
        .catch(console.error);
    };

    loadBranding();
    window.addEventListener(
      "tottech-branding-updated",
      loadBranding
    );

    return () => {
      active = false;
      window.removeEventListener(
        "tottech-branding-updated",
        loadBranding
      );
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      localStorage.removeItem(
        "erpUser"
      );

      window.location.href =
        "/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="
        sticky
        top-0
        z-40
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          hidden
          min-h-[118px]
          flex-col
          gap-2
          px-4
          py-3
          md:flex
          lg:px-6
          xl:px-7
        "
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex min-w-[420px] max-w-[560px] flex-[0_0_52%] items-center gap-4">
            <BrandLogo
              variant="mark"
              logoUrl={school?.logoUrl}
              imageClassName="h-[58px] w-[72px] shrink-0 rounded-xl object-contain object-center shadow-sm lg:h-[66px] lg:w-[82px]"
            />
            <div className="min-w-0 pt-0.5">
              <p
                className="max-w-full truncate text-[22px] font-black leading-[1.02] tracking-[-0.02em] text-slate-950 lg:text-[26px]"
                title={
                  school?.schoolName ||
                  school?.school_name ||
                  t(
                    "noSchoolSelected",
                    "No school/college selected"
                  )
                }
              >
                {school?.schoolName ||
                  school?.school_name ||
                  t(
                    "noSchoolSelected",
                    "No school/college selected"
                  )}
              </p>
              <p className="mt-1 max-w-full truncate text-[12px] font-medium leading-snug text-slate-600 lg:text-[13px]">
                TOTTECH ONE - AI Powered Education Institution Management
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_auto] justify-end">
            <div className="min-w-[380px] max-w-[720px] flex-1">
              <GlobalSearch />
            </div>

            <div className="ml-3 hidden min-w-[170px] flex-[0_0_180px] xl:block">
              <AcademicYearSwitcher />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-3">
          <div className="min-w-[210px] flex-[0_1_250px]">
            <SchoolSwitcher />
          </div>

          <div className="hidden min-w-[150px] flex-[0_0_180px] lg:block">
            <LanguageSwitcher />
          </div>

          <DesktopUserSection
            user={user}
            logout={logout}
            t={t}
          />
        </div>
      </div>

      <div
        className="
          px-4
          py-3
          md:hidden
        "
      >
        <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
          <button
            onClick={onOpenMenu}
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-950
              shadow-sm
              active:scale-95
            "
            aria-label="Open menu"
            >
            <Menu size={21} />
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-3">
            <div className="min-w-0 flex-1 overflow-hidden">
              <BrandLogo
                variant="full"
                orientation="horizontal"
                logoUrl={school?.logoUrl}
                name="TOTTECH ONE"
                imageClassName="h-[48px] w-[60px] shrink-0 rounded-xl object-contain object-center shadow-sm"
                nameClassName="max-w-[180px] truncate text-left text-[18px]"
              />
              <p className="truncate text-xs font-medium text-amber-700">
              {school?.schoolName ||
                  school?.school_name ||
                  t("schoolCollege", "School/College")}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <LanguageSwitcher compact />
          </div>

          <button
            onClick={logout}
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-lg
              bg-slate-950
              text-white
            "
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <AcademicYearSwitcher compact />
          <SchoolSwitcher />
        </div>

        <GlobalSearch />
      </div>
    </div>
  );
}

function DesktopUserSection({
  user,
  logout,
  t,
}: {
  user: HeaderUser | null;
  logout: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  const initial =
    user?.full_name
      ? String(user.full_name)
          .charAt(0)
          .toUpperCase()
      : "T";

  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-2
        whitespace-nowrap
      "
    >
      <div
        className="
          flex
          h-10
          items-center
          gap-1.5
          rounded-lg
          border
          border-amber-200
          bg-amber-50
          px-3
          text-xs
          font-bold
          text-amber-800
        "
      >
        <Activity size={15} />
        {t("health", "Health")} 87
      </div>

      <button
        className="
          relative
          grid
          h-10
          w-10
          place-items-center
          rounded-lg
          bg-slate-100
          text-slate-950
        "
        aria-label={t(
          "notifications",
          "Notifications"
        )}
      >
        <Bell size={17} />
        <span
          className="
            absolute
            right-1
            top-1
            h-2
            w-2
            rounded-full
            bg-amber-600
          "
        />
      </button>

      <div
        className="
          hidden
          min-w-0
          max-w-[128px]
          text-right
          xl:block
        "
      >
        <p
          className="
            truncate
            text-sm
            font-bold
            leading-5
            text-slate-950
          "
        >
          {user?.full_name ||
            t("activeUser", "Administrator")}
        </p>

        <p
          className="
            truncate
            text-[11px]
            font-semibold
            uppercase
            text-slate-500
          "
        >
          {user?.role || "ADMIN"}
        </p>
      </div>

      <div
        className="
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-lg
          border
          border-amber-300/70
          bg-slate-950
          shadow-sm
          text-sm
          font-black
          leading-none
          text-amber-100
        "
        aria-label="Current user avatar"
        title={
          user?.full_name ||
          t("activeUser", "Administrator")
        }
      >
        <span>
          {initial || (
            <UserCircle
              size={18}
              className="text-amber-100"
            />
          )}
        </span>
      </div>

      <button
        onClick={logout}
        className="
          flex
          h-10
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          font-bold
          text-slate-950
          shadow-sm
          hover:bg-slate-50
        "
        >
        <LogOut size={16} />
        <span className="hidden xl:inline">
          {t("logout", "Logout")}
        </span>
      </button>
    </div>
  );
}
