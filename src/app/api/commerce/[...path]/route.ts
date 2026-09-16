import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminSession } from "@/lib/auth/server";

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, { params }: Context) {
  const session = await getAdminSession();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const { path } = await params;
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!session || !token) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  if (!baseUrl) return NextResponse.json({ code: "serviceUnavailable" }, { status: 503 });

  const target = new URL(`${baseUrl}/api/v1/${path.join("/")}`);
  new URL(request.url).searchParams.forEach((value, key) => target.searchParams.append(key, value));
  const headers = new Headers({ Authorization: `Bearer ${token}`, Accept: "application/json" });
  const method = request.method;
  const body = method === "GET" || method === "DELETE" ? undefined : await request.arrayBuffer();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const response = await fetch(target, { method, headers, body, cache: "no-store" });
  return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
}

export async function GET(request: Request, context: Context) { return forward(request, context); }
export async function POST(request: Request, context: Context) { return forward(request, context); }
export async function PATCH(request: Request, context: Context) { return forward(request, context); }
export async function DELETE(request: Request, context: Context) { return forward(request, context); }
