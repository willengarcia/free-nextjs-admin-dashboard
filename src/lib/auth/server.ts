import "server-only";

import { cookies } from "next/headers";
import type {
  AdminSession,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
} from "./types";

export const ADMIN_SESSION_COOKIE = "admin_session";

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("API_BASE_URL is not configured");
  return baseUrl;
}

export async function authenticate(
  credentials: LoginRequest,
): Promise<LoginResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const data: unknown = await response.json();
  return isLoginResponse(data) ? data : null;
}

export async function getCurrentUser(
  token: string,
): Promise<CurrentUserResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/customers/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const data: unknown = await response.json();
  return isCurrentUserResponse(data) ? data : null;
}

export function isActiveAdmin(user: CurrentUserResponse): boolean {
  return user.status === "ATIVO" && user.role === "ADMIN";
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const user = await getCurrentUser(token);
    return user && isActiveAdmin(user)
      ? {
          id: user.id,
          nomeCompleto: user.nomeCompleto,
          email: user.email,
          status: user.status,
          role: user.role,
        }
      : null;
  } catch {
    return null;
  }
}

function isLoginResponse(value: unknown): value is LoginResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as LoginResponse).id === "number" &&
    typeof (value as LoginResponse).nome === "string" &&
    typeof (value as LoginResponse).email === "string" &&
    typeof (value as LoginResponse).status === "string" &&
    typeof (value as LoginResponse).token === "string"
  );
}

function isCurrentUserResponse(value: unknown): value is CurrentUserResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CurrentUserResponse).id === "number" &&
    typeof (value as CurrentUserResponse).nomeCompleto === "string" &&
    typeof (value as CurrentUserResponse).email === "string" &&
    typeof (value as CurrentUserResponse).status === "string" &&
    typeof (value as CurrentUserResponse).role === "string"
  );
}
