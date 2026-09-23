"use client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  first?: boolean;
  last?: boolean;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
}
export default function PaginationControls({
  page,
  totalPages,
  total,
  first,
  last,
  disabled = false,
  onPageChange,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("reports");
  function go(next: number) {
    if (onPageChange) {
      onPageChange(next);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(next));
    params.set("size", "20");
    router.push(`${pathname}?${params}`);
  }
  const style =
    "rounded-lg border border-gray-300 px-3 py-3 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700";
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
      <span>
        {t("pagination", {
          page: page + 1,
          pages: Math.max(totalPages, 1),
          total,
        })}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || (first ?? page === 0)}
          onClick={() => go(page - 1)}
          className={style}
        >
          {t("previous")}
        </button>
        <button
          type="button"
          disabled={disabled || (last ?? page + 1 >= totalPages)}
          onClick={() => go(page + 1)}
          className={style}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
