import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  authenticate,
  getCurrentUser,
  isActiveAdmin,
} from "@/lib/auth/server";

export async function POST(request: Request) {
  let credentials: { email?: unknown; senha?: unknown };
  try {
    credentials = await request.json();
  } catch {
    return deniedResponse("invalidCredentials", 400);
  }

  if (typeof credentials.email !== "string" || typeof credentials.senha !== "string") {
    return deniedResponse("invalidCredentials", 400);
  }

  try {
    const login = await authenticate({ email: credentials.email, senha: credentials.senha });
    if (!login) return deniedResponse("invalidCredentials", 401);

    const user = await getCurrentUser(login.token);
    if (!user || !isActiveAdmin(user)) {
      return deniedResponse("noAdminAccess", 403);
    }

    const response = NextResponse.json({
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email },
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, login.token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  } catch {
    return deniedResponse("serviceUnavailable", 503);
  }
}

function deniedResponse(code: string, status: number) {
  const response = NextResponse.json({ code }, { status });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
