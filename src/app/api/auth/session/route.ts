import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminSession } from "@/lib/auth/server";

export async function GET() {
  const session = await getAdminSession();
  if (session) return NextResponse.json({ user: session });

  const response = NextResponse.json({ code: "unauthenticated" }, { status: 401 });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
