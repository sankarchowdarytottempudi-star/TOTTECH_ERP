"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { hasPermission } from "@/lib/auth/hasPermission";
import TottechAIBadge from "./ai/TottechAIBadge";
import { useLanguage } from "./LanguageProvider";
import { translateLabel } from "@/lib/i18n";

import {
  Bell,
  BookOpen,
  Building2,
  Bus,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  Rocket,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
  Wallet,
} from "lucide-react";

type UserProfile = {
  role: string;
  full_name?: string;
  module_access?: Record<string, boolean>;
  user_module_access?: Record<string, boolean>;
};

type SidebarBranding = {
  schoolName?: string;
  product?: string;
  logoUrl?: string;
  aiDisplayName?: string;
  aiTagline?: string;
};

type MenuItemProps = {
  pathname: string;
  href: string;
  label: string;
  icon?: ReactNode;
  onNavigate?: () => void;
};

type SectionButtonProps = {
  title: string;
  icon: ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const normalizeRole = (
  role?: string
) =>
  role
    ?.toUpperCase()
    .replaceAll(" ", "_") || "";

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser =
      localStorage.getItem("erpUser");

    return storedUser
      ? (JSON.parse(
          storedUser
        ) as UserProfile)
      : null;
  } catch {
    return null;
  }
};

export default function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname =
    usePathname() || "";
  const navRef = useRef<HTMLElement | null>(null);
  const { language, t } = useLanguage();
  const [user, setUser] =
    useState<UserProfile | null>(null);
  const [branding, setBranding] =
    useState<SidebarBranding | null>(null);
  const [academicsOpen, setAcademicsOpen] =
    useState(
      () =>
        pathname.startsWith(
          "/academics"
        ) ||
        pathname.startsWith(
          "/promotions"
        )
    );
  const [financeOpen, setFinanceOpen] =
    useState(
      () =>
        pathname.startsWith(
          "/finance"
        )
    );
  const [operationsOpen, setOperationsOpen] =
    useState(
      () =>
        pathname.startsWith(
          "/attendance"
        ) ||
        pathname.startsWith(
          "/transport"
        ) ||
        pathname.startsWith("/hostel") ||
        pathname.startsWith("/dining")
    );
  const [hrOpen, setHrOpen] =
    useState(
      () =>
        pathname.startsWith("/hrms")
    );
  const [aiOpen, setAiOpen] =
    useState(false);
  const [parentOpen, setParentOpen] =
    useState(false);
  const [communicationOpen, setCommunicationOpen] =
    useState(() =>
      pathname.startsWith("/communication") ||
      pathname.startsWith("/communications") ||
      pathname.startsWith("/ptm")
    );
  const [moduleAccess, setModuleAccess] =
    useState<Record<string, boolean>>(
      () => user?.module_access || {}
    );
  const [effectiveModuleAccess, setEffectiveModuleAccess] =
    useState<Record<string, boolean>>(
      () => user?.module_access || {}
    );
  const [userModuleAccess, setUserModuleAccess] =
    useState<Record<string, boolean>>(
      () => user?.user_module_access || {}
    );

  useEffect(() => {
    setUser(readStoredUser());

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
            setBranding(data);
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

  useEffect(() => {
    let active = true;

    fetch("/api/school-context", {
      cache: "no-store",
    })
      .then((response) =>
        response.ok
          ? response.json()
          : null
      )
      .then((data) => {
        if (active && data?.moduleAccess) {
          setModuleAccess(data.moduleAccess);
          if (data.effectiveModuleAccess) {
            setEffectiveModuleAccess(
              data.effectiveModuleAccess
            );
          }
          if (data.userModuleAccess) {
            setUserModuleAccess(data.userModuleAccess);
          }
          try {
            const stored = readStoredUser();
            if (stored) {
              localStorage.setItem(
                "erpUser",
                JSON.stringify({
                  ...stored,
                  module_access:
                    {
                      ...data.moduleAccess,
                      ...(data.userModuleAccess || {}),
                    },
                  effective_module_access:
                    data.effectiveModuleAccess || {},
                  user_module_access:
                    data.userModuleAccess || {},
                })
              );
            }
          } catch {
            // local storage is best effort only
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      pathname.startsWith("/academics") ||
      pathname.startsWith("/promotions")
    ) {
      setAcademicsOpen(true);
    }

    if (pathname.startsWith("/finance")) {
      setFinanceOpen(true);
    }

    if (
      pathname.startsWith("/attendance") ||
      pathname.startsWith("/transport") ||
      pathname.startsWith("/hostel") ||
      pathname.startsWith("/dining")
    ) {
      setOperationsOpen(true);
    }

    if (pathname.startsWith("/hrms")) {
      setHrOpen(true);
    }

    if (pathname.startsWith("/parent")) {
      setParentOpen(true);
    }

    if (
      pathname.startsWith("/communication") ||
      pathname.startsWith("/communications") ||
      pathname.startsWith("/ptm")
    ) {
      setCommunicationOpen(true);
    }

    if (
      pathname.startsWith("/ai-") ||
      pathname.startsWith("/school-brain") ||
      pathname.startsWith("/student-intelligence") ||
      pathname.startsWith("/faculty-intelligence")
    ) {
      setAiOpen(true);
    }

    const timers = [
      window.setTimeout(() => {
        navRef.current
          ?.querySelector<HTMLElement>(
            '[data-sidebar-active-menu="true"]'
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
      }, 80),
      window.setTimeout(() => {
        navRef.current
          ?.querySelector<HTMLElement>(
            '[data-sidebar-active-menu="true"]'
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
      }, 260),
    ];

    return () =>
      timers.forEach((timer) =>
        window.clearTimeout(timer)
      );
  }, [pathname]);

  const role =
    normalizeRole(user?.role);

  const dashboardHref =
    useMemo(() => {
      if (role === "PARENT") {
        return "/parent/dashboard";
      }

      if (role === "TEACHER") {
        return "/dashboard/teacher";
      }

      if (role === "PRINCIPAL") {
        return "/dashboard/principal";
      }

      return "/";
    }, [role]);

  const can = (permission: string) =>
    Boolean(
      role && hasPermission(role, permission)
    );

  const isExecutive =
    role === "SUPER_ADMIN" ||
    role === "PRINCIPAL";
  const isSchoolAdmin =
    role === "SUPER_ADMIN" ||
    role === "OWNER" ||
    role === "ADMIN";

  const isParent =
    role === "PARENT";
  const hasAccess = (
    ...moduleKeys: string[]
  ) =>
    role === "SUPER_ADMIN" ||
    moduleKeys.some(
      (moduleKey) =>
        moduleAccess[moduleKey] !== false &&
        userModuleAccess[moduleKey] !== false
    );

  const hasAiAccess =
    role === "SUPER_ADMIN" ||
    effectiveModuleAccess.AI !== false;

  const canAcademics =
    hasAccess(
      "ACADEMICS",
      "CLASSES",
      "SECTIONS",
      "SUBJECTS",
      "SYLLABUS",
      "HOMEWORK",
      "EXAM_SCHEDULE",
      "EXAMS",
      "QUESTION_BANK",
      "QUESTION_PAPERS",
      "MARKS_ENTRY"
    ) &&
    (isExecutive ||
    can("academics") ||
    can("classes") ||
    can("sections") ||
    can("subjects") ||
    can("timetable") ||
    can("exams") ||
    can("exam_schedule") ||
    can("question_bank") ||
    can("question_papers") ||
    can("homework") ||
    can("marks") ||
    can("marks_entry"));

  const canDining =
    hasAccess("DINING") &&
    (isExecutive || can("dining"));

  const canOperations =
    hasAccess(
      "OPERATIONS",
      "ATTENDANCE",
      "DINING",
      "TRANSPORT",
      "HOSTEL"
    ) &&
    (isExecutive ||
    can("operations") ||
    can("attendance") ||
    can("transport") ||
    can("hostel") ||
      canDining);
  const canHR =
    hasAccess(
      "HR",
      "PAYROLL",
      "INCREMENTS",
      "PAYSLIPS",
      "LEAVE",
      "CREDENTIALING",
      "LMS",
      "CME",
      "TRAINING",
      "PERFORMANCE",
      "RECRUITMENT",
      "PF"
    ) &&
    (isExecutive ||
      can("hr") ||
      can("payroll") ||
      can("leave") ||
      can("increment") ||
      can("pf"));

  return (
    <aside className="flex h-screen w-[240px] flex-col overflow-y-auto border-r border-white/10 bg-[#101a2c] text-white shadow-[0_0_60px_rgba(15,23,42,0.25)] lg:w-[280px]">
      <div className="min-w-0 border-b border-white/10 px-4 py-5 lg:px-5 lg:py-6">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            <Sparkles size={14} />
            {translateLabel(language, "Workspace")}
          </div>
          <div
            className="mt-2 truncate text-sm font-bold text-white"
            title={user?.full_name || t("schoolCollegeTeam", "School/College Team")}
          >
            {user?.full_name || t("schoolCollegeTeam", "School/College Team")}
          </div>
          <div
            className="mt-1 truncate text-xs font-semibold text-white/50"
            title={
              role.replaceAll("_", " ") ||
                "Protected"
            }
          >
            {role.replaceAll("_", " ") ||
              "Protected"}
          </div>
        </div>
      </div>

      <nav
        ref={navRef}
        className="flex-1 space-y-2 p-4 scroll-smooth"
      >
        <MenuItem
          pathname={pathname}
          href={dashboardHref}
          icon={<LayoutDashboard size={18} />}
          label={t("dashboard", "Dashboard")}
          onNavigate={onNavigate}
        />

        {hasAccess("STUDENTS") && can("students") && (
          <MenuItem
            pathname={pathname}
            href="/students/list"
            icon={<GraduationCap size={18} />}
            label={t("students", "Students")}
            onNavigate={onNavigate}
          />
        )}

        {hasAccess("TEACHERS") && can("teachers") && (
          <MenuItem
            pathname={pathname}
            href="/teachers"
            icon={<Users size={18} />}
            label={t("teachers", "Teachers")}
            onNavigate={onNavigate}
          />
        )}

        {canAcademics && (
          <>
            <SectionButton
              title={t("academics", "Academics")}
              icon={<BookOpen size={18} />}
              open={academicsOpen}
              setOpen={setAcademicsOpen}
            />
            {academicsOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/academics/classes"
                  label={translateLabel(language, "Classes")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/exam-schedule"
                  label={translateLabel(language, "Exam Schedule")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/exams"
                  label={translateLabel(language, "Exams")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/homework"
                  label={translateLabel(language, "Homework")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/marks-entry"
                  label={translateLabel(language, "Marks Entry")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/question-bank"
                  label={translateLabel(language, "Question Bank")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/question-papers"
                  label={translateLabel(language, "Question Papers")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/sections"
                  label={translateLabel(language, "Sections")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/syllabus"
                  label={translateLabel(language, "Syllabus")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/subjects"
                  label={translateLabel(language, "Subjects")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/academics/timetable"
                  label={translateLabel(language, "Timetable")}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {hasAiAccess && (isExecutive || isSchoolAdmin || role === "TEACHER") && (
          <>
            <SectionButton
              title={
                branding?.aiDisplayName ||
                translateLabel(
                  language,
                  "School/College Assistant"
                )
              }
              icon={<TottechAIBadge size="sm" />}
              open={aiOpen}
              setOpen={setAiOpen}
            />
            {aiOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/ai-command-center"
                  label={translateLabel(language, "AI Command Center")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/ai-school-copilot"
                  label={
                    branding?.aiDisplayName ||
                    translateLabel(
                      language,
                      "School/College Assistant"
                    )
                  }
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/faculty-intelligence"
                  label={translateLabel(language, "Faculty Intelligence")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/student-intelligence"
                  label={translateLabel(language, "Student Intelligence")}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {hasAccess(
          "FINANCE",
          "FEES",
          "INVOICES",
          "PAYMENTS",
          "CONCESSIONS",
          "EXPENSES",
          "EXPENSE_VOUCHERS",
          "RECEIPTS"
        ) && can("finance") && (
          <>
            <SectionButton
              title={t("finance", "Finance")}
              icon={<Wallet size={18} />}
              open={financeOpen}
              setOpen={setFinanceOpen}
            />
            {financeOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/finance"
                  label={translateLabel(language, "Overview")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/fees"
                  label={translateLabel(language, "Fees")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/assign"
                  label={translateLabel(language, "Assign")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/invoices"
                  label={translateLabel(language, "Invoices")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/payments"
                  label={translateLabel(language, "Payments")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/pending"
                  label={translateLabel(language, "Pending")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/receipts"
                  label={translateLabel(language, "Receipts")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/concessions"
                  label={translateLabel(language, "Concessions")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/expenses"
                  label={translateLabel(language, "Expenses")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/vouchers"
                  label={translateLabel(language, "Expense Vouchers")}
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/finance/reports"
                  label={t("reports", "Reports")}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {canOperations && (
          <SectionButton
            title={t("operations", "Operations")}
            icon={<Bus size={18} />}
            open={operationsOpen}
            setOpen={setOperationsOpen}
          />
        )}
        {canOperations && operationsOpen && (
          <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
            {hasAccess(
              "OPERATIONS",
              "ATTENDANCE",
              "DINING",
              "TRANSPORT",
              "HOSTEL"
            ) &&
              (isExecutive ||
                can("attendance")) && (
                <>
                  <MenuItem
                    pathname={pathname}
                    href="/attendance"
                    label="Attendance"
                    onNavigate={onNavigate}
                  />
                  <MenuItem
                    pathname={pathname}
                    href="/attendance/calendar"
                    label="Attendance Calendar"
                    onNavigate={onNavigate}
                  />
                </>
              )}
            {canDining && (
              <MenuItem
                pathname={pathname}
                href="/dining"
                icon={<Utensils size={16} />}
                label="Dining"
                onNavigate={onNavigate}
              />
            )}
            {hasAccess("HOSTEL") &&
              (isExecutive ||
                can("hostel")) && (
                <MenuItem
                  pathname={pathname}
                  href="/hostel"
                  label="Hostel"
                  onNavigate={onNavigate}
                />
              )}
            {hasAccess("TRANSPORT") &&
              (isExecutive ||
                can("transport")) && (
                <MenuItem
                  pathname={pathname}
                  href="/transport"
                  label="Transport"
                  onNavigate={onNavigate}
                />
              )}
          </div>
        )}

        {canHR && (
          <>
            <SectionButton
              title="HR"
              icon={<ScrollText size={18} />}
              open={hrOpen}
              setOpen={setHrOpen}
            />
            <MenuItem
              pathname={pathname}
              href="/hrms/pf"
              label="Provident Fund (PF)"
              onNavigate={onNavigate}
            />
            {hrOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/hrms"
                  label="HR Command Center"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/staff-directory"
                  label="Staff Master"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/leave-management"
                  label="Leave Management"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/lop"
                  label="Loss Of Pay (LOP)"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/payroll"
                  label="Salary Management"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/increments"
                  label="Increment Management"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/payslips"
                  label="Pay Slip Generation"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/hrms/approvals"
                  label="Approval Workflow"
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {role === "ACCOUNTANT" && hasAccess("REPORTS") && (
          <MenuItem
            pathname={pathname}
            href="/reports"
            icon={<ClipboardList size={18} />}
            label={translateLabel(language, "Reports Center")}
            onNavigate={onNavigate}
          />
        )}

        {(isExecutive || role === "ADMIN" || role === "OWNER") &&
          hasAccess("ANALYTICS", "WAR_ROOM") && (
            <>
              <MenuItem
                pathname={pathname}
                href="/principal-analytics"
                icon={<Rocket size={18} />}
                label="Principal Analytics"
                onNavigate={onNavigate}
              />
              {hasAccess("REPORTS") && (
              <MenuItem
                pathname={pathname}
                href="/reports"
                icon={<ClipboardList size={18} />}
                  label={translateLabel(language, "Reports Center")}
                onNavigate={onNavigate}
              />
              )}
            </>
          )}

        {isParent && hasAccess("PARENT_PORTAL") && (
          <>
            <SectionButton
              title={translateLabel(language, "Parent Portal")}
              icon={<Home size={18} />}
              open={parentOpen}
              setOpen={setParentOpen}
            />
            {parentOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/parent/dashboard"
                  label="Student 360"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/attendance"
                  label="Attendance"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/exams"
                  label="Exams"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/homework"
                  label="Homework"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/marks"
                  label="Marks"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/syllabus"
                  label="Syllabus"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/timetable"
                  label="Timetable"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/attendance-declaration"
                  label="Attendance Declaration"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/parent/fees"
                  label="Fees"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/ptm"
                  label="PTM"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/communication/feedback"
                  label="Complaints & Suggestions"
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {!isParent && (
          <>
            <SectionButton
              title="Communication"
              icon={<Bell size={18} />}
              open={communicationOpen}
              setOpen={setCommunicationOpen}
            />
            {communicationOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
                <MenuItem
                  pathname={pathname}
                  href="/communication"
                  label="Communication Center"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/ptm"
                  label="Parent Teacher Meetings"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/communication/feedback"
                  label="Complaints & Suggestions"
                  onNavigate={onNavigate}
                />
                <MenuItem
                  pathname={pathname}
                  href="/communication/templates"
                  label="Templates"
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </>
        )}

        {role !== "SUPER_ADMIN" &&
          isSchoolAdmin &&
          hasAccess("USER_MANAGEMENT") && (
            <MenuItem
              pathname={pathname}
              href="/settings/users"
              icon={<ShieldCheck size={18} />}
              label={translateLabel(language, "User Management")}
              onNavigate={onNavigate}
            />
          )}

        {role === "SUPER_ADMIN" && (
          <>
            <MenuItem
              pathname={pathname}
              href="/schools/list"
              icon={<Building2 size={18} />}
              label={translateLabel(language, "Schools/Colleges")}
              onNavigate={onNavigate}
            />
            <MenuItem
              pathname={pathname}
              href="/settings/users"
              icon={<ShieldCheck size={18} />}
              label={translateLabel(language, "User Management")}
              onNavigate={onNavigate}
            />
            <MenuItem
              pathname={pathname}
              href="/platform/subscriptions"
              icon={<ShieldCheck size={18} />}
              label={translateLabel(language, "Module Licensing")}
              onNavigate={onNavigate}
            />
            <MenuItem
              pathname={pathname}
              href="/settings"
              icon={<Settings size={18} />}
              label={translateLabel(language, "Settings")}
              onNavigate={onNavigate}
            />
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        {hasAiAccess && (
          <Link
            href="/ai-school-copilot"
            prefetch={false}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg border border-amber-300/40 bg-amber-300/15 p-4 text-sm font-bold text-amber-50 shadow-[0_14px_40px_rgba(245,158,11,0.12)] transition hover:bg-amber-300/20"
          >
            <TottechAIBadge size="sm" />
            <span className="min-w-0">
              <span className="block truncate">
                Ask{" "}
                {branding?.aiDisplayName ||
                  translateLabel(
                    language,
                    "School/College Assistant"
                  )}
              </span>
              <span className="block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200">
                {branding?.aiTagline ||
                  translateLabel(
                    language,
                    "School/College Copilot"
                  )}
              </span>
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}

function MenuItem({
  pathname,
  href,
  label,
  icon,
  onNavigate,
}: MenuItemProps) {
  const active =
    pathname === href ||
    (href !== "/" &&
      pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onNavigate}
      data-sidebar-active-menu={
        active ? "true" : undefined
      }
      className={`flex min-w-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-white text-slate-950 shadow-lg"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
      }`}
      title={label}
    >
      {icon && (
        <span
          className={`shrink-0 ${
            active
              ? "text-amber-700"
              : "text-slate-300"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}

function SectionButton({
  title,
  icon,
  open,
  setOpen,
}: SectionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
      title={title}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-slate-300">
          {icon}
        </span>
        <span className="min-w-0 truncate">
          {title}
        </span>
      </span>
      {open ? (
        <ChevronDown
          size={17}
          className="shrink-0 text-slate-400"
        />
      ) : (
        <ChevronRight
          size={17}
          className="shrink-0 text-slate-400"
        />
      )}
    </button>
  );
}
