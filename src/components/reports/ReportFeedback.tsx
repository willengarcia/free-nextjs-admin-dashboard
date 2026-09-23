"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { reportErrorKey } from "@/lib/admin/report-service";

export default function ReportFeedback({
  error,
  title,
  retry,
}: {
  error: unknown;
  title: string;
  retry?: () => void;
}) {
  const t = useTranslations("reports");
  const key = reportErrorKey(error);
  return (
    <div role="alert" className="space-y-3">
      <Alert variant="error" title={title} message={t(key)} />
      {key === "sessionExpired" ? (
        <Link
          href="/signin"
          className="inline-block rounded-lg px-4 py-3 text-brand-600 underline focus-visible:ring-2 dark:text-brand-400"
        >
          {t("signIn")}
        </Link>
      ) : key !== "forbidden" && retry ? (
        <Button variant="outline" size="sm" onClick={retry}>
          {t("retry")}
        </Button>
      ) : null}
    </div>
  );
}
