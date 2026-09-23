import type { ExternalProcessingResponse } from "./types";

export async function getExternalProcessingById(id: number): Promise<Response> {
  return fetch(`/api/commerce/admin/external-processings/${id}`);
}
export async function getExternalProcessingByOrderId(
  orderId: number,
): Promise<Response> {
  return fetch(`/api/commerce/admin/external-processings/orders/${orderId}`);
}
export async function completeExternalProcessing(
  id: number,
  externalReference: string | null,
): Promise<Response> {
  return fetch(`/api/commerce/admin/external-processings/${id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalReference }),
  });
}
export async function readExternalProcessing(
  response: Response,
): Promise<ExternalProcessingResponse | null> {
  if (!response.ok) return null;
  return response.json() as Promise<ExternalProcessingResponse>;
}

export async function listExternalProcessings(
  query: { status: string; page: number; size: number },
  signal?: AbortSignal,
): Promise<import("./types").PageResponse<ExternalProcessingResponse>> {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  if (query.status) params.set("status", query.status);
  const { requireReportResponse } = await import("./report-service");
  const response = await requireReportResponse(
    await fetch(`/api/commerce/admin/external-processings?${params}`, {
      signal,
      cache: "no-store",
    }),
  );
  return response.json();
}
