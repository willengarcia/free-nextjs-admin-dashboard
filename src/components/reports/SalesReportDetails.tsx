"use client";
import { useTranslations } from "next-intl";
import type { SalesReportItem } from "@/lib/admin/report-types";
import { formatReportDate, formatReportMoney } from "@/lib/admin/report-format";
import ReportStatus from "./ReportStatus";
import ReportDialog from "./ReportDialog";

export default function SalesReportDetails({
  item,
  open,
  onClose,
}: {
  item: SalesReportItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("reports");
  if (!item) return null;
  const fields = [
    ["customer", item.customerName],
    ["cpf", item.customerCpf],
    ["orderDate", formatReportDate(item.orderDate, false)],
    ["paidAt", formatReportDate(item.paymentDate)],
    ["amount", formatReportMoney(item.totalAmount)],
    ["paymentMethod", item.paymentMethod],
  ];
  return (
    <ReportDialog
      open={open}
      onClose={onClose}
      title={t("orderNumber", { id: item.orderId })}
    >
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-gray-500 dark:text-gray-400">{t(label!)}</dt>
            <dd className="mt-1 break-words">{value ?? t("unavailable")}</dd>
          </div>
        ))}
        <div>
          <dt className="text-gray-500 dark:text-gray-400">
            {t("paymentStatus")}
          </dt>
          <dd className="mt-1">
            <ReportStatus value={item.paymentStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">
            {t("orderStatus")}
          </dt>
          <dd className="mt-1">
            <ReportStatus value={item.orderStatus} />
          </dd>
        </div>
      </dl>
      <section className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <h3 className="font-semibold">{t("external")}</h3>
        {item.externalProcessingId === null &&
        item.externalProcessingStatus === null ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("historicalDetails")}
          </p>
        ) : (
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt>{t("mode")}</dt>
              <dd>
                {item.externalProcessingMode === null
                  ? t("unavailable")
                  : t.has(`statuses.${item.externalProcessingMode}`)
                    ? t(`statuses.${item.externalProcessingMode}`)
                    : item.externalProcessingMode}
              </dd>
            </div>
            <div>
              <dt>{t("status")}</dt>
              <dd>
                <ReportStatus value={item.externalProcessingStatus} />
              </dd>
            </div>
            <div>
              <dt>{t("reference")}</dt>
              <dd className="break-words">
                {item.externalReference ?? t("notProvided")}
              </dd>
            </div>
            <div>
              <dt>{t("processedAt")}</dt>
              <dd>{formatReportDate(item.processedAt) ?? t("notProcessed")}</dd>
            </div>
          </dl>
        )}
      </section>
    </ReportDialog>
  );
}
