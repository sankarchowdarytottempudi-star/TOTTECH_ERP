"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastProvider from "./ToastProvider";
import MobileBottomNav from "./MobileBottomNav";
import FloatingTottechAI from "./FloatingTottechAI";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    document.body.classList.toggle(
      "tt-lock-scroll",
      sidebarOpen
    );

    return () => {
      document.body.classList.remove(
        "tt-lock-scroll"
      );
    };
  }, [sidebarOpen]);

  return (
    <>
      <ToastProvider />

      <div className="tt-app-shell min-h-screen">

        {/* Overlay */}

        {sidebarOpen && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              z-[90]
              md:hidden
            "
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        )}

        {/* Mobile Sidebar */}

        <div
          className={`
            fixed
            top-0
            left-0
            h-screen
            w-[min(86vw,280px)]
            z-[95]
            transform
            transition-transform
            duration-300
            md:hidden
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          <div
            className="
              h-full
              bg-[#101a2c]
              shadow-2xl
            "
          >

            <div className="flex justify-end p-4">

              <button
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="
                  w-10
                  h-10
              rounded-lg
              bg-slate-100
              text-slate-950
            "
              >
                ✕
              </button>

            </div>

            <Sidebar
              onNavigate={() =>
                setSidebarOpen(false)
              }
            />

          </div>

        </div>

        {/* Desktop Sidebar */}

        <div
          className="
            hidden
            md:block
            fixed
            left-0
            top-0
            h-screen
            z-50
          "
        >
          <Sidebar />
        </div>

        {/* Main */}

        <div
          className="
            min-h-screen
            md:ml-[240px]
            lg:ml-[280px]
          "
        >

          <Header
            onOpenMenu={() =>
              setSidebarOpen(true)
            }
          />

          <main
  className="
    tt-main
    p-4
    md:p-6
    lg:p-8
    pb-24
  "
>

  {children}

</main>

        </div>

        {/* Mobile Bottom Navigation */}

        <MobileBottomNav />

        <FloatingTottechAI />

      </div>

    </>
  );

}
