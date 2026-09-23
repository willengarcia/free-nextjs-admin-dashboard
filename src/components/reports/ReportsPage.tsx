"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ExternalProcessings from "@/components/admin/ExternalProcessings";
import SalesReport from "./SalesReport";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const [tab, setTab] = useState("sales");
  const [revision, setRevision] = useState(0);
  return (
    <div className="min-w-0 space-y-6 text-gray-800 dark:text-white/90">
      <div>
        <PageBreadcrumb pageTitle={t("title")} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("description")}
        </p>
      </div>
      <nav
        aria-label={t("sections")}
        className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 sm:flex-row dark:border-gray-800 dark:bg-white/3"
      >
        {["sales", "external"].map((key) => (
          <button
            type="button"
            key={key}
            aria-current={tab === key ? "page" : undefined}
            aria-controls={`reports-${key}`}
            onClick={() => setTab(key)}
            className={`rounded-lg px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand-500 ${tab === key ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
          >
            {t(key)}
          </button>
        ))}
      </nav>
      <section
        id="reports-sales"
        aria-label={t("sales")}
        hidden={tab !== "sales"}
      >
        <SalesReport revision={revision} />
      </section>
      {tab === "external" && (
        <section id="reports-external" aria-label={t("external")}>
          <ExternalProcessings
            onCompleted={() => setRevision((value) => value + 1)}
          />
        </section>
      )}
    </div>
  );
}
