"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultLanguage,
  extractLanguageFromUserCookie,
  normalizeLanguage,
  translate,
  type SupportedLanguage,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: string) => void;
  t: (
    key: string,
    fallback?: string
  ) => string;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(
    null
  );

const APP_LANGUAGE_COOKIE =
  "app_language";
const APP_LANGUAGE_STORAGE_KEY =
  "app_language";
const erpUserStorageKey = "erpUser";

function readStoredLanguage() {
  if (typeof window === "undefined") {
    return null;
  }

  const fromStorage =
    localStorage.getItem(
      APP_LANGUAGE_STORAGE_KEY
    ) || "";
  if (fromStorage) {
    return normalizeLanguage(fromStorage);
  }

  const fromCookie =
    document.cookie
      .split("; ")
      .find((entry) =>
        entry.startsWith(
          `${APP_LANGUAGE_COOKIE}=`
        )
      )
      ?.split("=")[1] || "";
  if (fromCookie) {
    return normalizeLanguage(
      decodeURIComponent(fromCookie)
    );
  }

  try {
    const userRaw =
      localStorage.getItem(
        erpUserStorageKey
      );
    return (
      extractLanguageFromUserCookie(
        userRaw
      ) || null
    );
  } catch {
    return null;
  }
}

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage?: string | null;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(
      normalizeLanguage(
        initialLanguage || defaultLanguage
      )
    );
  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const stored =
      readStoredLanguage();

    if (stored) {
      setLanguageState(stored);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(
        APP_LANGUAGE_STORAGE_KEY,
        language
      );

      document.cookie = [
        `${APP_LANGUAGE_COOKIE}=${encodeURIComponent(
          language
        )}`,
        "path=/",
        "max-age=31536000",
        "SameSite=Lax",
      ].join("; ");

      document.documentElement.lang =
        language;
    } catch {
      // best effort only
    }

    const persist = async () => {
      try {
        const response = await fetch(
          "/api/profile/language",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              language,
            }),
          }
        );

        if (!response.ok) {
          return;
        }

        const payload =
          await response.json();

        if (payload?.user) {
          try {
            localStorage.setItem(
              erpUserStorageKey,
              JSON.stringify(payload.user)
            );
          } catch {
            // ignore local storage failures
          }
        }
      } catch {
        // allow offline / unauthenticated pages
      }
    };

    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem(
            erpUserStorageKey
          )
        : null;

    if (storedUser) {
      void persist();
    }
  }, [hydrated, language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: string) => {
        setLanguageState(
          normalizeLanguage(next)
        );
      },
      t: (key: string, fallback?: string) =>
        translate(language, key, fallback),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(
    LanguageContext
  );

  if (!context) {
    return {
      language: defaultLanguage,
      setLanguage: (_language: string) => {},
      t: (
        key: string,
        fallback?: string
      ) => translate(defaultLanguage, key, fallback),
    };
  }

  return context;
}
