import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import { recordEvent } from "@/lib/governance/events";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "ai",
      action: "view_usage",
    });

  if (auth.response) {
    return auth.response;
  }

  const providers =
    await prisma.ai_providers.findMany({
      orderBy: {
        priority: "asc",
      },
      select: {
        id: true,
        provider_key: true,
        display_name: true,
        provider_type: true,
        base_url: true,
        is_enabled: true,
        priority: true,
        config: true,
        created_at: true,
        updated_at: true,
      },
    });

  return NextResponse.json({
    providers,
  });
}

export async function POST(
  request: Request
) {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "ai",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();

  const provider =
    await prisma.ai_providers.upsert({
      where: {
        provider_key:
          String(body.provider_key),
      },
      update: {
        display_name:
          String(body.display_name),
        provider_type:
          String(body.provider_type),
        base_url:
          body.base_url ?? null,
        is_enabled:
          Boolean(body.is_enabled),
        priority:
          Number(body.priority ?? 100),
        config:
          body.config ?? {},
        updated_at: new Date(),
      },
      create: {
        provider_key:
          String(body.provider_key),
        display_name:
          String(body.display_name),
        provider_type:
          String(body.provider_type),
        base_url:
          body.base_url ?? null,
        is_enabled:
          Boolean(body.is_enabled),
        priority:
          Number(body.priority ?? 100),
        config:
          body.config ?? {},
        created_by:
          auth.user?.id ?? null,
      },
    });

  await recordEvent({
    school_id:
      auth.user?.school_id ?? null,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "ai",
    event_type: "AI_PROVIDER_UPDATED",
    action: "upsert",
    entity_type: "ai_provider",
    entity_id: provider.id,
    summary:
      "AI provider configuration updated",
    payload: {
      provider_key:
        provider.provider_key,
      is_enabled:
        provider.is_enabled,
    },
  });

  return NextResponse.json({
    provider,
  });
}
