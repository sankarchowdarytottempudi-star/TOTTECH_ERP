import { cookies } from "next/headers";

export async function getCurrentSchool() {

  const cookieStore =
    await cookies();

  const activeSchool =
    cookieStore.get(
      "active_school_id"
    );

  if (activeSchool) {
    return Number(
      activeSchool.value
    );
  }

  const userCookie =
    cookieStore.get("erpUser");

  if (!userCookie) {
    return null;
  }

  const user =
    JSON.parse(
      userCookie.value
    );

  return user.school_id;
}
