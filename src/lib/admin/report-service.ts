import type { SalesReportFilters, SalesReportResponse } from "./report-types";

export class ReportRequestError extends Error {
  constructor(public readonly status: number) {
    super("Report request failed");
  }
}

export async function requireReportResponse(
  response: Response,
): Promise<Response> {
  if (!response.ok) throw new ReportRequestError(response.status);
  return response;
}

export function reportErrorKey(error: unknown) {
  if (error instanceof ReportRequestError) {
    if (error.status === 401) return "sessionExpired";
    if (error.status === 403) return "forbidden";
    if (error.status === 400) return "invalidRequest";
    if (error.status === 409) return "conflict";
  }
  return "requestFailed";
}

export function salesReportQuery(filters: SalesReportFilters): URLSearchParams {
  const query = new URLSearchParams();
  if (filters.startDate) query.set("startDate", filters.startDate);
  if (filters.endDate) query.set("endDate", filters.endDate);
  if (filters.processingStatus)
    query.set("processingStatus", filters.processingStatus);
  return query;
}

function exportFilename(disposition: string | null): string {
  const encoded = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = disposition?.match(/filename="([^"]+)"|filename=([^;]+)/i);
  let name = plain?.[1] ?? plain?.[2] ?? "relatorio-vendas.csv";
  if (encoded) {
    try {
      name = decodeURIComponent(encoded);
    } catch {
      /* Use the plain filename. */
    }
  }
  return (
    name.replace(/[\\/\u0000-\u001f\u007f]/g, "_").trim() ||
    "relatorio-vendas.csv"
  );
}

export const reportService = {
  async getSalesReport(
    filters: SalesReportFilters & { page: number; size: number },
    signal?: AbortSignal,
  ): Promise<SalesReportResponse> {
    const query = salesReportQuery(filters);
    query.set("page", String(filters.page));
    query.set("size", String(filters.size));
    const response = await requireReportResponse(
      await fetch(`/api/commerce/admin/reports/sales?${query}`, {
        signal,
        cache: "no-store",
      }),
    );
    return response.json();
  },
  async exportSalesReport(
    filters: SalesReportFilters,
  ): Promise<{ blob: Blob; filename: string }> {
    const response = await requireReportResponse(
      await fetch(
        `/api/commerce/admin/reports/sales/export?${salesReportQuery(filters)}`,
        { headers: { Accept: "text/csv" }, cache: "no-store" },
      ),
    );
    return {
      blob: await response.blob(),
      filename: exportFilename(response.headers.get("Content-Disposition")),
    };
  },
};
