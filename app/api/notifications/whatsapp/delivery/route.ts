import { NextResponse } from "next/server";

import { registerWhatsAppDeliveryEvent } from "@/lib/notifications/whatsapp";

function authorized(
  request: Request
) {
  const expected = String(
    process.env.WHATSAPP_API_KEY || ""
  ).trim();

  if (!expected) {
    return false;
  }

  const header =
    request.headers.get(
      "authorization"
    ) || "";
  const token = header
    .replace(/^Bearer\s+/i, "")
    .trim();

  return token === expected;
}

export async function POST(
  request: Request
) {
  if (!authorized(request)) {
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
  const result =
    await registerWhatsAppDeliveryEvent(
      {
        providerMessageId:
          body.provider_message_id ||
          body.message_id ||
          body.id ||
          null,
        messageId:
          Number(
            body.local_message_id ||
              body.tottech_message_id ||
              0
          ) || null,
        deliveryStatus:
          String(
            body.delivery_status ||
              body.status ||
              "UNKNOWN"
          ).toUpperCase(),
        providerResponse: body,
        metadata: {
          source:
            "whatsapp_delivery_webhook",
        },
      }
    );

  if (!result) {
    return NextResponse.json(
      {
        error:
          "WhatsApp message not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    result
  );
}
