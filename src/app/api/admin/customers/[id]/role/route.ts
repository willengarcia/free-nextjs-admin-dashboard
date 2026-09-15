import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminSession } from "@/lib/auth/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const { id } = await params;
  const body = await request.json();
  if (!session || !token) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  if (body?.role !== "ADMIN" && body?.role !== "CUSTOMER") return NextResponse.json({ code: "invalidRole" }, { status: 400 });
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return NextResponse.json({ code: "serviceUnavailable" }, { status: 503 });
  const response = await fetch(`${baseUrl}/api/v1/admin/customers/${id}/role`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ role: body.role }) });
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
}
