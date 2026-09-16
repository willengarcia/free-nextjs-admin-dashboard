"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

export default function PaginationControls({ page, totalPages, total }: { page: number; totalPages: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  function go(next: number) { const params = new URLSearchParams(window.location.search); params.set("page", String(next)); params.set("size", "20"); router.push(`${pathname}?${params}`); }
  return <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400"><span>Página {page + 1} de {Math.max(totalPages, 1)} · {total} registros</span><div className="flex gap-2"><button type="button" disabled={page === 0} onClick={() => go(page - 1)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700">Anterior</button><button type="button" disabled={page + 1 >= totalPages} onClick={() => go(page + 1)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700">Próxima</button></div></div>;
}
