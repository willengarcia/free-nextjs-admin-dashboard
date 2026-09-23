import type { ProductStockSummary, ProductStockUpdateRequest } from "./types";

export async function updateProductStock(productId: number, payload: ProductStockUpdateRequest): Promise<Response> {
  return fetch(`/api/commerce/admin/products/${productId}/stock`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function removeProductImage(imageId: number): Promise<Response> {
  return fetch(`/api/commerce/admin/products/images/${imageId}`, { method: "DELETE" });
}

export function stockSummary(value: ProductStockSummary) {
  return { ...value, quantidadeDisponivel: value.quantidadeEstoque - value.quantidadeReservada };
}
