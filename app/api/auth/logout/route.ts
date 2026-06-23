import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.delete("erpUser");
  response.cookies.delete("platform_type");
  response.cookies.delete("active_school_id");
  response.cookies.delete("module_access");
  response.cookies.delete("user_module_access");
  response.cookies.delete("parent_student_ids");

  return response;
}
