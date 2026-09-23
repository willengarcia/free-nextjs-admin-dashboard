import type { PageResponse } from "./types";

export type SalesReportSummary = {
  totalOrders: number;
  totalSales: number;
  pendingExternalProcessing: number;
  processedExternalProcessing: number;
};

export type SalesReportItem = {
  orderId: number;
  orderDate: string;
  paymentDate: string;
  customerId: number;
  customerName: string;
  customerCpf: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  externalProcessingId: number | null;
  externalProcessingMode: string | null;
  externalProcessingStatus: string | null;
  externalReference: string | null;
  processedAt: string | null;
};

export type SalesReportResponse = {
  summary: SalesReportSummary;
  items: PageResponse<SalesReportItem> & {
    empty: boolean;
    first: boolean;
    last: boolean;
    numberOfElements: number;
  };
};

export type SalesReportFilters = {
  startDate: string;
  endDate: string;
  processingStatus: "" | "PENDING" | "PROCESSED";
};
