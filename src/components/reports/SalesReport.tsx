"use client";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ComponentCard from "@/components/common/ComponentCard";
import PaginationControls from "@/components/admin/PaginationControls";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useModal } from "@/hooks/useModal";
import { reportService } from "@/lib/admin/report-service";
import type {
  SalesReportFilters as Filters,
  SalesReportItem,
} from "@/lib/admin/report-types";
import SalesSummaryCards from "./SalesSummaryCards";
import SalesReportFilters from "./SalesReportFilters";
import SalesReportList from "./SalesReportList";
import SalesReportDetails from "./SalesReportDetails";
import ReportFeedback from "./ReportFeedback";
import useReportResource from "./useReportResource";

const emptyFilters: Filters = {
  startDate: "",
  endDate: "",
  processingStatus: "",
};
export default function SalesReport({ revision }: { revision: number }) {
  const t = useTranslations("reports");
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [query, setQuery] = useState({ ...emptyFilters, page: 0, size: 20 });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<SalesReportItem | null>(null);
  const [exporting, setExporting] = useState(false);
  const exportLock = useRef(false);
  const [exportError, setExportError] = useState<unknown>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const modal = useModal();
  const load = useCallback(
    (signal: AbortSignal) => {
      // Both explicit retries and completed external processing invalidate the report.
      void attempt;
      void revision;
      return reportService.getSalesReport(query, signal);
    },
    [query, attempt, revision],
  );
  const { data, error, loading } = useReportResource(load);
  const invalid = !!(
    draft.startDate &&
    draft.endDate &&
    draft.startDate > draft.endDate
  );
  const dirty =
    draft.startDate !== query.startDate ||
    draft.endDate !== query.endDate ||
    draft.processingStatus !== query.processingStatus;
  function apply(filters: Filters) {
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    )
      return;
    setExportError(null);
    setExportSuccess(false);
    setQuery({ ...filters, page: 0, size: 20 });
  }
  function clear() {
    setDraft(emptyFilters);
    apply(emptyFilters);
  }
  async function download() {
    if (exportLock.current || loading || dirty || !data) return;
    exportLock.current = true;
    setExporting(true);
    setExportError(null);
    setExportSuccess(false);
    try {
      const { blob, filename } = await reportService.exportSalesReport(query);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      try {
        anchor.click();
      } finally {
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setExportSuccess(true);
    } catch (error) {
      setExportError(error);
    } finally {
      exportLock.current = false;
      setExporting(false);
    }
  }
  return (
    <div className="space-y-6" aria-busy={loading}>
      {data && <SalesSummaryCards summary={data.summary} />}
      {loading && (
        <p
          role="status"
          className="rounded-xl border border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"
        >
          {t("loading")}
        </p>
      )}
      <SalesReportFilters
        value={draft}
        onChange={setDraft}
        onApply={() => apply(draft)}
        onClear={clear}
        onExport={() => void download()}
        busy={loading}
        exporting={exporting}
        canExport={!!data}
        invalid={invalid}
        dirty={dirty}
      />
      {exportError != null && (
        <ReportFeedback error={exportError} title={t("exportError")} />
      )}
      {exportSuccess && (
        <div role="status">
          <Alert
            variant="success"
            title={t("exportSuccess")}
            message={t("exportSuccessDescription")}
          />
        </div>
      )}
      {error != null && (
        <ReportFeedback
          error={error}
          title={t("loadError")}
          retry={() => setAttempt((value) => value + 1)}
        />
      )}
      {data && (
        <ComponentCard title={t("salesReport")}>
          <>
            {data.items.content.length ? (
              <SalesReportList
                items={data.items.content}
                onView={(item) => {
                  setSelected(item);
                  modal.openModal();
                }}
              />
            ) : (
              <div className="space-y-4 py-6 text-center">
                <p>{t("empty")}</p>
                <Button variant="outline" size="sm" onClick={clear}>
                  {t("clear")}
                </Button>
              </div>
            )}
            <PaginationControls
              page={data.items.number}
              totalPages={data.items.totalPages}
              total={data.items.totalElements}
              first={data.items.first}
              last={data.items.last}
              disabled={loading || exporting}
              onPageChange={(page) =>
                setQuery({ ...query, page, size: data.items.size })
              }
            />
          </>
        </ComponentCard>
      )}
      <SalesReportDetails
        item={selected}
        open={modal.isOpen}
        onClose={modal.closeModal}
      />
    </div>
  );
}
