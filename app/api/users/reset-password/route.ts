import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma }
from "@/lib/prisma";

import bcrypt
from "bcryptjs";

export async function POST(
  req: NextRequest
) {

  try {

    const body =
      await req.json();

    const hashedPassword =
      await bcrypt.hash(
        body.password,
        10
      );

    await prisma.users.update({

      where: {
        id: Number(
          body.userId
        ),
      },

      data: {

        password_hash:
          hashedPassword,

      },

    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Password reset failed",
      },
      {
        status: 500,
      }
    );

  }

}
