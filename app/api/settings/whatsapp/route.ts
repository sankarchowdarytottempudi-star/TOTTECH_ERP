import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import {
  requireCurrentUser,
  requirePermission,
} from "@/lib/governance/rbac";
import {
  getWhatsAppDashboard,
  processWhatsAppQueue,
  queueMonthlyAttendanceReport,
  queuePaymentDueReminder,
  queueWhatsAppMessage,
  setWhatsAppEnabled,
  setWhatsAppTemplateEnabled,
} from "@/lib/notifications/whatsapp";

const toNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

export async function GET(
  request: Request
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const context =
    await resolvePlatformContext(
      request
    );

  if (!context) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const dashboard =
    await getWhatsAppDashboard(
      context.schoolId,
      context.academicYearId
    );

  return NextResponse.json(
    dashboard
  );
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "governance",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const context =
    await resolvePlatformContext(
      request
    );

  if (!context) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();
  const action = String(
    body.action || ""
  )
    .trim()
    .toLowerCase();
  let result: unknown = null;

  if (action === "set_enabled") {
    await setWhatsAppEnabled(
      Boolean(body.enabled),
      auth.user?.id ?? null,
      context.schoolId
    );
    result = {
      enabled: Boolean(
        body.enabled
      ),
    };
  } else if (
    action === "toggle_template"
  ) {
    const templateName = String(
      body.template_name || ""
    ).trim();

    if (!templateName) {
      return NextResponse.json(
        {
          error:
            "Template name is required.",
        },
        {
          status: 400,
        }
      );
    }

    await setWhatsAppTemplateEnabled(
      templateName,
      Boolean(body.enabled)
    );
    result = {
      template_name:
        templateName,
      enabled: Boolean(
        body.enabled
      ),
    };
  } else if (action === "retry") {
    result =
      await processWhatsAppQueue(
        toNumber(body.limit) || 25
      );
  } else if (action === "test") {
    const recipient = String(
      body.recipient || ""
    ).trim();

    if (!recipient) {
      return NextResponse.json(
        {
          error:
            "Recipient phone number is required for a test message.",
        },
        {
          status: 400,
        }
      );
    }

    result =
      await queueWhatsAppMessage({
        templateName:
          String(
            body.template_name ||
              "student_created"
          ),
        recipient,
        schoolId:
          context.schoolId,
        academicYearId:
          context.academicYearId,
        userId:
          auth.user?.id ?? null,
        variables:
          Array.isArray(
            body.variables
          ) &&
          body.variables.length
            ? body.variables
            : [
                "Test Student",
                "TEST-001",
                "TOTTECH ONE",
              ],
        triggeredBy:
          "WHATSAPP_TEST_MESSAGE",
        entityType:
          "whatsapp_message",
        entityId: null,
      });
  } else if (
    action === "payment_due_reminder"
  ) {
    const invoiceId = toNumber(
      body.invoice_id
    );

    if (!invoiceId) {
      return NextResponse.json(
        {
          error:
            "Invoice is required before sending a due reminder.",
        },
        {
          status: 400,
        }
      );
    }

    result =
      await queuePaymentDueReminder(
        invoiceId,
        String(
          body.reminder_message ||
            "Please clear the pending fee before the due date."
        ),
        auth.user?.id ?? null
      );
  } else if (
    action === "attendance_report"
  ) {
    const studentId = toNumber(
      body.student_id
    );

    if (!studentId) {
      return NextResponse.json(
        {
          error:
            "Student is required before sending an attendance report.",
        },
        {
          status: 400,
        }
      );
    }

    result =
      await queueMonthlyAttendanceReport(
        {
          studentId,
          month:
            String(
              body.month || ""
            ) ||
            new Date().toLocaleString(
              "en-IN",
              {
                month: "long",
                year: "numeric",
              }
            ),
          present:
            Number(
              body.present || 0
            ),
          absent:
            Number(
              body.absent || 0
            ),
          late:
            Number(body.late || 0),
          leave:
            Number(
              body.leave || 0
            ),
          userId:
            auth.user?.id ?? null,
        }
      );
  } else {
    return NextResponse.json(
      {
        error:
          "Unknown WhatsApp settings action.",
      },
      {
        status: 400,
      }
    );
  }

  const dashboard =
    await getWhatsAppDashboard(
      context.schoolId,
      context.academicYearId
    );

  return NextResponse.json({
    result,
    dashboard,
  });
}
