"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translateLabel } from "@/lib/i18n";

type PlatformType = "EDUCATIONAL" | "CLINICAL";

const platforms: Record<
  PlatformType,
  {
    label: string;
    product: string;
    tagline: string;
    icon: typeof GraduationCap;
    accent: string;
    panel: string;
  }
> = {
  EDUCATIONAL: {
    label: "Educational (TOTTECH ONE)",
    product: "TOTTECH ONE",
    tagline: "School/College ERP & Educational Management Platform",
    icon: GraduationCap,
    accent: "#D4AF37",
    panel: "from-[#04142E] via-[#081c3a] to-[#231b08]",
  },
  CLINICAL: {
    label: "Clinical Services (TOTTECH Clinical Services)",
    product: "TOTTECH Clinical Services",
    tagline: "Hospital ERP, IVF & Clinical Management Platform",
    icon: Building2,
    accent: "#06B6D4",
    panel: "from-[#04142E] via-[#083344] to-[#06251f]",
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f3f6fb] text-[#04142E]">
          <div className="rounded-[8px] border border-slate-200 bg-white px-6 py-5 text-sm font-black shadow-xl">
            Loading TOTTECH Platform Login...
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const initialPlatform =
    searchParams?.get("platform") === "clinical"
      ? "CLINICAL"
      : "EDUCATIONAL";
  const [platformType, setPlatformType] =
    useState<PlatformType>(initialPlatform);
  const [username, setUsername] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    setPlatformType(initialPlatform);
  }, [initialPlatform]);

  const selected = platforms[platformType];
  const Icon = selected.icon;

  const platformHint = useMemo(
    () =>
      platformType === "CLINICAL"
        ? "Examples: admin, doctor1, reception, labtech, pharmacy1"
        : "Examples: admin, principal1",
    [platformType]
  );

  const login = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            platform_type: platformType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || "Login Failed");
        return;
      }

      localStorage.setItem(
        "erpUser",
        JSON.stringify(data.user)
      );

      router.push(
        data.redirectTo ||
          data.user?.redirectTo ||
          "/"
      );
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f6fb] text-[#04142E]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section
          className={`relative hidden overflow-hidden bg-gradient-to-br ${selected.panel} p-12 text-white lg:flex lg:flex-col lg:justify-between`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.22),transparent_32%),radial-gradient(circle_at_78%_25%,rgba(6,182,212,0.18),transparent_28%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-[8px] border border-white/15 bg-white shadow-xl">
                <Image
                  src="/images/logo.png"
                  alt="TOTTECH logo"
                  width={256}
                  height={256}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                  TOTTECH Platform Login
                </p>
                <h1 className="mt-2 text-4xl font-black">
                  {selected.product}
                </h1>
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-5xl font-black leading-tight">
              {translateLabel(
                language,
                "One secure entry for education and clinical operations."
              )}
            </p>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-white/78">
              {translateLabel(
                language,
                "Select the platform first, then sign in with a normal username. No `CS-` prefix is required anymore."
              )}
            </p>
          </div>

          <div className="relative z-10 grid gap-4 md:grid-cols-2">
            {Object.entries(platforms).map(([key, item]) => {
              const CardIcon = item.icon;
              const active = key === platformType;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setPlatformType(key as PlatformType)
                  }
                  className={[
                    "rounded-[8px] border p-5 text-left transition",
                    active
                      ? "border-[#D4AF37] bg-white/14 shadow-2xl"
                      : "border-white/15 bg-white/7 hover:bg-white/10",
                  ].join(" ")}
                >
                  <CardIcon
                    size={24}
                    style={{
                      color: item.accent,
                    }}
                  />
                  <p className="mt-4 text-lg font-black">
                    {item.product}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/72">
                    {item.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-[520px] rounded-[8px] border border-slate-200 bg-white p-7 shadow-2xl md:p-9">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8]">
                <Icon
                  size={26}
                  style={{
                    color: selected.accent,
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6500]">
                  TOTTECH Platform Login
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {selected.product}
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
              {selected.tagline}
            </p>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">
                  {t("platform", "Platform")}
                </span>
                <select
                  value={platformType}
                  onChange={(event) =>
                    setPlatformType(
                      event.target.value as PlatformType
                    )
                  }
                  className="mt-2 h-13 w-full rounded-[8px] border border-slate-300 bg-white px-4 py-4 text-sm font-black outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                  >
                  <option value="EDUCATIONAL">
                    {translateLabel(
                      language,
                      platforms.EDUCATIONAL.label
                    )}
                  </option>
                  <option value="CLINICAL">
                    {translateLabel(
                      language,
                      platforms.CLINICAL.label
                    )}
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">
                  {t("username", "Username")}
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder={translateLabel(
                    language,
                    "Enter username"
                  )}
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-4 py-4 text-sm font-bold outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                />
                <span className="mt-2 block text-xs font-semibold text-slate-500">
                  {translateLabel(language, platformHint)}
                </span>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">
                  {t("password", "Password")}
                </span>
                <div className="relative mt-2">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder={translateLabel(
                      language,
                      "Enter password"
                    )}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void login();
                      }
                    }}
                    className="w-full rounded-[8px] border border-slate-300 bg-white px-4 py-4 pr-12 text-sm font-bold outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={
                      showPassword
                        ? translateLabel(
                            language,
                            "Hide password"
                          )
                        : translateLabel(
                            language,
                            "Show password"
                          )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="button"
                onClick={login}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-[8px] bg-[#04142E] px-5 py-4 text-base font-black text-white shadow-lg shadow-slate-900/20 transition hover:bg-[#08214a] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <LogIn size={19} />
                {loading
                  ? t("loading", "Signing In...")
                  : t("signIn", "Login")}
              </button>
            </div>

            <div className="mt-7 grid gap-3 text-xs font-bold text-slate-500 md:grid-cols-2">
              <a
                href="/login/education"
                className="rounded-[8px] border border-slate-200 px-3 py-3 text-center hover:border-[#D4AF37]"
              >
                {translateLabel(
                  language,
                  "Educational Login"
                )}
              </a>
              <a
                href="/login/clinical"
                className="rounded-[8px] border border-slate-200 px-3 py-3 text-center hover:border-[#D4AF37]"
              >
                {translateLabel(
                  language,
                  "Clinical Login"
                )}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
