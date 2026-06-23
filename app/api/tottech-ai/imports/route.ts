import { NextResponse } from "next/server";

import { isSuperAdmin } from "@/lib/access-control";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  requireCurrentUser,
  userHasPermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import {
  IMPORT_SPECS,
  runTottechAIImport,
  type ImportScope,
} from "@/lib/tottech-ai/imports";

const isImportScope = (
  value: string
): value is ImportScope =>
  value === "tottech-one" ||
  value === "clinical-services";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  return NextResponse.json({
    modules: IMPORT_SPECS.map((spec) => ({
      key: spec.key,
      label: spec.label,
      scope: spec.scope,
      requiredColumns: spec.required,
      recommendedColumns:
        spec.recommended ?? [],
      sampleTemplate: [
        ...spec.required,
        ...(spec.recommended ?? []),
      ].reduce<Record<string, string>>(
        (template, column) => {
          template[column] = "";
          return template;
        },
        {}
      ),
    })),
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
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const allowed =
    isSuperAdmin(auth.user?.role) ||
    (await userHasPermission(
      auth.user,
      {
        module: "imports",
        action: "manage",
      }
    )) ||
    (await userHasPermission(
      auth.user,
      {
        module: "ai",
        action: "action_request",
      }
    ));

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "AI Excel imports are not enabled for this role.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const formData =
      await request.formData();
    const file =
      formData.get("file");
    const scopeValue = String(
      formData.get("scope") ??
        "tottech-one"
    );
    const moduleName = String(
      formData.get("module_name") ??
        ""
    ).trim();
    const commit =
      String(
        formData.get("commit") ?? ""
      ).toLowerCase() === "true";

    if (!isImportScope(scopeValue)) {
      return NextResponse.json(
        {
          error:
            "Select a valid import scope.",
        },
        {
          status: 400,
        }
      );
    }

    if (!moduleName) {
      return NextResponse.json(
        {
          error:
            "Select the module this Excel file should load.",
        },
        {
          status: 400,
        }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Attach an Excel file before running the import.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName =
      file.name || "upload.xlsx";

    if (
      !/\.(xlsx|xls|csv)$/i.test(
        fileName
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Upload an .xlsx, .xls, or .csv file.",
        },
        {
          status: 400,
        }
      );
    }

    const context =
      await resolvePlatformContext(
        request
      );
    const result =
      await runTottechAIImport({
        scope: scopeValue,
        moduleName,
        fileName,
        buffer: await file.arrayBuffer(),
        commit,
        platformContext: {
          schoolId:
            context?.schoolId ?? null,
          academicYearId:
            context?.academicYearId ??
            null,
          user: auth.user,
        },
      });

    return NextResponse.json(result, {
      status:
        result.status === "FAILED"
          ? 400
          : 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI import failed",
      },
      {
        status: 500,
      }
    );
  }
}
