"use client";
import { useTranslations } from "next-intl";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import type { SalesReportFilters as Filters } from "@/lib/admin/report-types";

interface Props {
  value: Filters;
  onChange: (value: Filters) => void;
  onApply: () => void;
  onClear: () => void;
  onExport: () => void;
  busy: boolean;
  exporting: boolean;
  canExport: boolean;
  invalid: boolean;
  dirty: boolean;
}
export default function SalesReportFilters({
  value,
  onChange,
  onApply,
  onClear,
  onExport,
  busy,
  exporting,
  canExport,
  invalid,
  dirty,
}: Props) {
  const t = useTranslations("reports");
  return (
    <ComponentCard title={t("filters")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onApply();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="sales-start">{t("startDate")}</Label>
            <Input
              id="sales-start"
              type="date"
              value={value.startDate}
              onChange={(e) =>
                onChange({ ...value, startDate: e.target.value })
              }
              error={invalid}
              aria-describedby={invalid ? "sales-date-error" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="sales-end">{t("endDate")}</Label>
            <Input
              id="sales-end"
              type="date"
              value={value.endDate}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              error={invalid}
              aria-describedby={invalid ? "sales-date-error" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="sales-processing">{t("processing")}</Label>
            <select
              id="sales-processing"
              value={value.processingStatus}
              onChange={(e) =>
                onChange({
                  ...value,
                  processingStatus: e.target
                    .value as Filters["processingStatus"],
                })
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">{t("all")}</option>
              <option value="PENDING">{t("pending")}</option>
              <option value="PROCESSED">{t("processed")}</option>
            </select>
          </div>
        </div>
        {invalid && (
          <p
            id="sales-date-error"
            role="alert"
            className="text-sm text-error-600 dark:text-error-400"
          >
            {t("invalidDates")}
          </p>
        )}
        {dirty && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("unappliedFilters")}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={busy || exporting}
          >
            {t("clear")}
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={busy || exporting || invalid}
          >
            {t("apply")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:ms-auto"
            onClick={onExport}
            disabled={!canExport || busy || exporting || dirty}
          >
            {exporting ? t("exporting") : t("export")}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
