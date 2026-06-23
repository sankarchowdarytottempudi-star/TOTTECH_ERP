import { cookies } from "next/headers";

export async function getCurrentSchoolId() {

  const cookieStore =
    await cookies();

  const userCookie =
    cookieStore.get("erpUser");

  if (!userCookie)
    return 1;

  const user =
    JSON.parse(
      userCookie.value
    );

  return user.school_id;
}
