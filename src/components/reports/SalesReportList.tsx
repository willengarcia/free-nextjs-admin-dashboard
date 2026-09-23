"use client";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import type { SalesReportItem } from "@/lib/admin/report-types";
import { formatReportDate, formatReportMoney } from "@/lib/admin/report-format";
import ReportStatus from "./ReportStatus";

interface Props {
  items: SalesReportItem[];
  onView: (item: SalesReportItem) => void;
}
export default function SalesReportList({ items, onView }: Props) {
  const t = useTranslations("reports");
  const headers = [
    "order",
    "paymentDate",
    "customer",
    "paymentMethod",
    "amount",
    "orderStatus",
    "processing",
    "actions",
  ];
  const extra = (key: string) =>
    ["paymentMethod", "orderStatus"].includes(key)
      ? "hidden xl:table-cell"
      : "";
  return (
    <>
      <div className="hidden md:block">
        <Table className="w-full table-fixed text-sm">
          <TableHeader>
            <TableRow>
              {headers.map((key) => (
                <TableCell
                  key={key}
                  isHeader
                  className={`px-2 py-3 text-start font-medium text-gray-500 dark:text-gray-400 ${extra(key)} ${key === "amount" ? "text-end" : ""}`}
                >
                  {t(key)}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.orderId}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                <TableCell className="px-2 py-4 font-medium break-words">
                  #{item.orderId}
                </TableCell>
                <TableCell className="px-2 py-4">
                  {formatReportDate(item.paymentDate) ?? t("unavailable")}
                </TableCell>
                <TableCell className="px-2 py-4 break-words">
                  {item.customerName}
                </TableCell>
                <TableCell className="hidden px-2 py-4 break-words xl:table-cell">
                  {item.paymentMethod}
                </TableCell>
                <TableCell className="px-2 py-4 text-end break-words tabular-nums">
                  {formatReportMoney(item.totalAmount)}
                </TableCell>
                <TableCell className="hidden px-2 py-4 xl:table-cell">
                  <ReportStatus value={item.orderStatus} />
                </TableCell>
                <TableCell className="px-2 py-4">
                  <ReportStatus value={item.externalProcessingStatus} />
                </TableCell>
                <TableCell className="px-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(item)}
                  >
                    {t("view")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-3 md:hidden">
        {items.map((item) => (
          <article
            key={item.orderId}
            className="min-w-0 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">
                {t("orderNumber", { id: item.orderId })}
              </h3>
              <ReportStatus value={item.externalProcessingStatus} />
            </div>
            <p className="mt-3 font-medium break-words">{item.customerName}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formatReportDate(item.paymentDate) ?? t("unavailable")}
            </p>
            <div className="my-4 flex flex-wrap justify-between gap-2 text-sm">
              <span>{item.paymentMethod}</span>
              <strong className="tabular-nums">
                {formatReportMoney(item.totalAmount)}
              </strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm">
                {t("orderStatus")}: <ReportStatus value={item.orderStatus} />
              </span>
              <Button size="sm" variant="outline" onClick={() => onView(item)}>
                {t("viewDetails")}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
