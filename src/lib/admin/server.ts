import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/server";
import type { AdminDashboard, PageResponse } from "./types";

function baseUrl() {
  const url = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!url) throw new Error("API_BASE_URL is not configured");
  return url;
}

async function token() {
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
}

export async function getAdminData<T>(path: string): Promise<T | null> {
  const sessionToken = await token();
  if (!sessionToken) return null;

  try {
    const response = await fetch(`${baseUrl()}/api/v1/admin${path}`, {
      headers: { Authorization: `Bearer ${sessionToken}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCommerceData<T>(path: string): Promise<T | null> {
  const sessionToken = await token();
  if (!sessionToken) return null;
  try { const response = await fetch(`${baseUrl()}/api/v1${path}`, { headers: { Authorization: `Bearer ${sessionToken}` }, cache: "no-store" }); return response.ok ? await response.json() as T : null; } catch { return null; }
}

export function getQuery(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.trim()) params.set(key, value);
  }
  if (!params.has("page")) params.set("page", "0");
  if (!params.has("size")) params.set("size", "20");
  if (!params.has("sort")) params.set("sort", "dataCriacao,desc");
  return params.toString();
}

export type { AdminDashboard, PageResponse };
