"use client";
import { useTranslations } from "next-intl";
import Badge from "@/components/ui/badge/Badge";

export default function ReportStatus({ value }: { value: string | null }) {
  const t = useTranslations("reports");
  const color =
    value === null
      ? "light"
      : ["PROCESSED", "PAGO", "PROCESSADO", "ENTREGUE", "APROVADO"].includes(
            value,
          )
        ? "success"
        : ["FAILED", "CANCELADO", "RECUSADO", "REJEITADO"].includes(value)
          ? "error"
          : "warning";
  const label =
    value === null
      ? t("historical")
      : t.has(`statuses.${value}`)
        ? t(`statuses.${value}`)
        : value;
  return (
    <span title={value === null ? t("historicalDescription") : undefined}>
      <Badge color={color} size="sm">
        {label}
      </Badge>
    </span>
  );
}
