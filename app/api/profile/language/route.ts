import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  normalizeLanguage,
  translate,
  type SupportedLanguage,
} from "@/lib/i18n";

function parseErpUserCookie(raw: string | undefined) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

export async function POST(
  request: Request
) {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body =
      await request.json().catch(() => ({}));
    const language = normalizeLanguage(
      body.language as
        | string
        | null
        | undefined
    );

    const user =
      await prisma.users.update({
        where: {
          id: Number(currentUser.id),
        },
        data: {
          preferred_language: language,
          updated_at: new Date(),
        },
        select: {
          id: true,
          school_id: true,
          username: true,
          full_name: true,
          email: true,
          role: true,
          platform_type: true,
          status: true,
          is_active: true,
          is_deleted: true,
          preferred_language: true,
          phone: true,
          whatsapp_number: true,
          alternative_mobile: true,
          emergency_contact_number: true,
          last_login: true,
          created_at: true,
          updated_at: true,
        },
      });

    const response = NextResponse.json({
      success: true,
      language,
      message: translate(
        language as SupportedLanguage,
        "language",
        "Language updated"
      ),
      user,
    });

    const isSecureRequest =
      request.headers.get("x-forwarded-proto") ===
        "https" ||
      request.url.startsWith("https://");
    const useSecureCookie =
      process.env.NODE_ENV === "production" &&
      isSecureRequest;

    response.cookies.set(
      "app_language",
      language,
      {
        httpOnly: false,
        secure: useSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      }
    );

    const erpCookie =
      parseErpUserCookie(
        request.headers.get(
          "cookie"
        )?.match(/(?:^|;\s*)erpUser=([^;]+)/)?.[1]
          ? decodeURIComponent(
              request.headers
                .get("cookie")
                ?.match(
                  /(?:^|;\s*)erpUser=([^;]+)/
                )?.[1] || ""
            )
          : undefined
      ) || {};

    response.cookies.set(
      "erpUser",
      JSON.stringify({
        ...erpCookie,
        preferred_language: language,
      }),
      {
        httpOnly: true,
        secure: useSecureCookie,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Language update failed",
      },
      {
        status: 500,
      }
    );
  }
}
