"use client";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import PaginationControls from "./PaginationControls";
import {
  completeExternalProcessing,
  getExternalProcessingById,
  listExternalProcessings,
} from "@/lib/admin/external-processing-client";
import { requireReportResponse } from "@/lib/admin/report-service";
import { formatReportDate } from "@/lib/admin/report-format";
import type { ExternalProcessingResponse } from "@/lib/admin/types";
import ReportDialog from "@/components/reports/ReportDialog";
import ReportStatus from "@/components/reports/ReportStatus";
import ReportFeedback from "@/components/reports/ReportFeedback";
import useReportResource from "@/components/reports/useReportResource";

export default function ExternalProcessings({
  onCompleted,
}: {
  onCompleted: () => void;
}) {
  const t = useTranslations("reports");
  const [query, setQuery] = useState({ status: "", page: 0, size: 20 });
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<ExternalProcessingResponse | null>(
    null,
  );
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [detailBusy, setDetailBusy] = useState(false);
  const [actionError, setActionError] = useState<unknown>(null);
  const [completed, setCompleted] = useState(false);
  const modal = useModal();
  const load = useCallback(
    (signal: AbortSignal) => {
      void revision;
      return listExternalProcessings(query, signal);
    },
    [query, revision],
  );
  const { data, error, loading } = useReportResource(load);

  async function view(item: ExternalProcessingResponse) {
    if (busyRef.current) return;
    busyRef.current = true;
    setDetailBusy(true);
    setActionError(null);
    setSelected(null);
    setCompleted(false);
    modal.openModal();
    try {
      const response = await requireReportResponse(
        await getExternalProcessingById(item.id),
      );
      const fresh: ExternalProcessingResponse = await response.json();
      setSelected(fresh);
      setReference(fresh.externalReference ?? "");
    } catch (error) {
      setActionError(error);
    } finally {
      setDetailBusy(false);
      busyRef.current = false;
    }
  }
  async function complete() {
    if (
      !selected ||
      selected.mode !== "MANUAL" ||
      selected.status !== "PENDING" ||
      busyRef.current
    )
      return;
    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    try {
      await requireReportResponse(
        await completeExternalProcessing(selected.id, reference.trim() || null),
      );
      modal.closeModal();
      setSelected(null);
      setCompleted(true);
      setQuery((previous) => ({ ...previous, page: 0 }));
      setRevision((value) => value + 1);
      onCompleted();
    } catch (error) {
      setActionError(error);
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }
  const mode = (value: string) =>
    t.has(`statuses.${value}`) ? t(`statuses.${value}`) : value;
  return (
    <ComponentCard title={t("external")} desc={t("externalDescription")}>
      <div className="flex flex-wrap gap-2" aria-label={t("processing")}>
        {[
          ["", "all"],
          ["PENDING", "pending"],
          ["PROCESSED", "processed"],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={query.status === value ? "primary" : "outline"}
            disabled={busy}
            onClick={() => setQuery({ ...query, status: value, page: 0 })}
          >
            {t(label)}
          </Button>
        ))}
      </div>
      {completed && (
        <div role="status">
          <Alert
            variant="success"
            title={t("completeSuccess")}
            message={t("completeSuccessDescription")}
          />
        </div>
      )}
      {loading && (
        <p role="status" className="text-sm text-gray-500 dark:text-gray-400">
          {t("loadingExternal")}
        </p>
      )}
      {error != null && (
        <ReportFeedback
          error={error}
          title={t("externalLoadError")}
          retry={() => setRevision((value) => value + 1)}
        />
      )}
      {data && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.content.map((item) => (
              <article
                key={item.id}
                className="min-w-0 space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">
                    {t("orderNumber", { id: item.orderId })}
                  </h3>
                  <ReportStatus value={item.status} />
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">
                      {t("mode")}
                    </dt>
                    <dd>{mode(item.mode)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">
                      {t("reference")}
                    </dt>
                    <dd className="break-words">
                      {item.externalReference ?? t("notProvided")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">
                      {t("createdAt")}
                    </dt>
                    <dd>
                      {formatReportDate(item.createdAt) ?? t("unavailable")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">
                      {t("processedAt")}
                    </dt>
                    <dd>
                      {formatReportDate(item.processedAt) ?? t("notProcessed")}
                    </dd>
                  </div>
                </dl>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={detailBusy || busy}
                  onClick={() => void view(item)}
                >
                  {item.mode === "MANUAL" && item.status === "PENDING"
                    ? t("viewAndComplete")
                    : t("viewDetails")}
                </Button>
              </article>
            ))}
          </div>
          {data.content.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {t("emptyExternal")}
            </p>
          )}
          <PaginationControls
            page={data.number}
            totalPages={data.totalPages}
            total={data.totalElements}
            onPageChange={(page) =>
              setQuery({ ...query, page, size: data.size })
            }
            disabled={busy}
          />
        </>
      )}
      <ReportDialog
        open={modal.isOpen}
        onClose={modal.closeModal}
        busy={busy || detailBusy}
        title={
          selected ? t("processingNumber", { id: selected.id }) : t("external")
        }
      >
        {detailBusy && <p role="status">{t("loadingExternal")}</p>}
        {actionError != null && (
          <ReportFeedback error={actionError} title={t("actionError")} />
        )}
        {selected && (
          <>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt>{t("order")}</dt>
                <dd>#{selected.orderId}</dd>
              </div>
              <div>
                <dt>{t("mode")}</dt>
                <dd>{mode(selected.mode)}</dd>
              </div>
              <div>
                <dt>{t("status")}</dt>
                <dd>
                  <ReportStatus value={selected.status} />
                </dd>
              </div>
              <div>
                <dt>{t("reference")}</dt>
                <dd className="break-words">
                  {selected.externalReference ?? t("notProvided")}
                </dd>
              </div>
              {(["createdAt", "updatedAt", "processedAt"] as const).map(
                (key) => (
                  <div key={key}>
                    <dt>{t(key)}</dt>
                    <dd>
                      {formatReportDate(selected[key]) ?? t("notProcessed")}
                    </dd>
                  </div>
                ),
              )}
            </dl>
            {selected.mode === "MANUAL" && selected.status === "PENDING" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void complete();
                }}
                className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("completeDescription")}
                </p>
                <div>
                  <Label htmlFor="external-reference">
                    {t("optionalReference")}
                  </Label>
                  <Input
                    id="external-reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    disabled={busy}
                  />
                </div>
                <Button type="submit" size="sm" disabled={busy}>
                  {busy ? t("completing") : t("complete")}
                </Button>
              </form>
            )}
          </>
        )}
      </ReportDialog>
    </ComponentCard>
  );
}
