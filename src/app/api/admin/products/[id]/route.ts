import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminSession } from "@/lib/auth/server";

type Context = { params: Promise<{ id: string }> };

async function forwardProductRequest(method: "PATCH" | "DELETE", input: Request, { params }: Context) {
  const session = await getAdminSession();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const { id } = await params;
  if (!session || !token) return NextResponse.json({ code: "unauthorized" }, { status: 401 });

  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return NextResponse.json({ code: "serviceUnavailable" }, { status: 503 });

  const response = await fetch(`${baseUrl}/api/v1/admin/products/${id}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(method === "PATCH" ? { "Content-Type": "application/json" } : {}) },
    body: method === "PATCH" ? JSON.stringify(await input.json()) : undefined,
  });
  if (response.status === 204) return new NextResponse(null, { status: 204 });
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
}

export async function PATCH(request: Request, context: Context) { return forwardProductRequest("PATCH", request, context); }
export async function DELETE(request: Request, context: Context) { return forwardProductRequest("DELETE", request, context); }
