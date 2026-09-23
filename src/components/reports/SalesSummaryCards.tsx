"use client";
import { useTranslations } from "next-intl";
import type { SalesReportSummary } from "@/lib/admin/report-types";
import { formatReportMoney } from "@/lib/admin/report-format";

export default function SalesSummaryCards({
  summary,
}: {
  summary: SalesReportSummary;
}) {
  const t = useTranslations("reports");
  const cards = [
    ["approvedSales", summary.totalOrders.toLocaleString("pt-BR")],
    ["totalSales", formatReportMoney(summary.totalSales)],
    [
      "pendingProcessing",
      summary.pendingExternalProcessing.toLocaleString("pt-BR"),
    ],
    ["processed", summary.processedExternalProcessing.toLocaleString("pt-BR")],
  ];
  return (
    <dl className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([key, value]) => (
        <div
          key={key}
          className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
        >
          <dt className="text-sm text-gray-500 dark:text-gray-400">{t(key)}</dt>
          <dd className="mt-3 text-2xl font-semibold break-words text-gray-800 tabular-nums dark:text-white/90">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
