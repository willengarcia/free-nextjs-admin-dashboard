"use client";

import { useRef, useState } from "react";
import Alert from "@/components/ui/alert/Alert";

type Notice = { variant: "success" | "error"; title: string; message: string };

export default function CategoryImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const show = (value: Notice) => { setNotice(value); window.setTimeout(() => setNotice(null), 6000); };
  async function upload(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv")) return show({ variant: "error", title: "Arquivo inválido", message: "Selecione um arquivo CSV." });
    setBusy(true); const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/commerce/manager/categories/import", { method: "POST", body: form });
    const raw = await response.text(); setBusy(false); inputRef.current && (inputRef.current.value = "");
    if (!response.ok) return show({ variant: "error", title: "Importação não concluída", message: apiMessage(raw) });
    show({ variant: "success", title: "Categorias importadas", message: raw || "Categorias importadas com sucesso" });
    window.dispatchEvent(new Event("categories-imported"));
  }
  return <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-semibold">Importar categorias</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Envie um CSV UTF-8 separado por ponto e vírgula, com até 2 MB e 1.000 registros.</p><code className="mt-3 block max-w-full overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-700 dark:bg-white/[0.05] dark:text-gray-300">name;description;ativo;parentCategoryId</code></div><div><input ref={inputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /><button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-600 disabled:opacity-50 dark:border-brand-500/40 dark:text-brand-300">{busy ? "Importando..." : "Importar categorias"}</button></div></div>{notice && <div className="mt-4"><Alert {...notice} /></div>}</section>;
}
function apiMessage(raw: string) { try { const json: unknown = JSON.parse(raw); if (typeof json === "object" && json) { if ("message" in json && typeof json.message === "string") return json.message; if ("erro" in json && typeof json.erro === "string") return json.erro; if ("campos" in json && typeof json.campos === "object" && json.campos) return Object.values(json.campos).filter((value): value is string => typeof value === "string").join(" "); } } catch { /* response is plain text */ } return raw || "Não foi possível importar as categorias."; }
