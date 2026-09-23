import type { ExternalProcessingResponse } from "./types";

export async function getExternalProcessingById(id: number): Promise<Response> { return fetch(`/api/commerce/admin/external-processings/${id}`); }
export async function getExternalProcessingByOrderId(orderId: number): Promise<Response> { return fetch(`/api/commerce/admin/external-processings/orders/${orderId}`); }
export async function completeExternalProcessing(id: number, externalReference: string | null): Promise<Response> { return fetch(`/api/commerce/admin/external-processings/${id}/complete`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ externalReference }) }); }
export async function readExternalProcessing(response: Response): Promise<ExternalProcessingResponse | null> { if (!response.ok) return null; return response.json() as Promise<ExternalProcessingResponse>; }
