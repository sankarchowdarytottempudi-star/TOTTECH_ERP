import { cookies } from "next/headers";

export async function getCurrentUser() {

  const cookieStore =
    await cookies();

  const cookie =
    cookieStore.get("erpUser");

  if (!cookie) {
    return null;
  }

  try {

    return JSON.parse(
      cookie.value
    );

  } catch {

    return null;

  }

}
