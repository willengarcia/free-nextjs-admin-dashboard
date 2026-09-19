"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import Alert from "@/components/ui/alert/Alert";

type Notice = { variant: "success" | "error"; title: string; message: string };
type Field = { key: string; label: string; required?: boolean; type?: "text" | "number"; step?: string; hint?: string };
const fields: Field[] = [
  { key: "nome", label: "Nome", required: true, hint: "De 3 a 150 caracteres" }, { key: "slug", label: "Slug", required: true, hint: "De 3 a 150 caracteres" },
  { key: "descricaoCurta", label: "Descrição curta", required: true, hint: "Máximo de 255 caracteres" }, { key: "descricao", label: "Descrição", required: true },
  { key: "preco", label: "Preço", required: true, type: "number", step: "0.01" }, { key: "precoPromocional", label: "Preço promocional", type: "number", step: "0.01", hint: "Opcional" },
  { key: "quantidadeEstoque", label: "Quantidade em estoque", required: true, type: "number", step: "1" }, { key: "estoqueMinimo", label: "Estoque mínimo", required: true, type: "number", step: "1" },
  { key: "sku", label: "SKU", required: true, hint: "Máximo de 100 caracteres" }, { key: "peso", label: "Peso", required: true, type: "number", step: "0.01" },
  { key: "altura", label: "Altura", required: true, type: "number", step: "0.01" }, { key: "largura", label: "Largura", required: true, type: "number", step: "0.01" }, { key: "comprimento", label: "Comprimento", required: true, type: "number", step: "0.01" },
];
const initial = Object.fromEntries([...fields.map((field) => [field.key, ""]), ["categoriaId", ""], ["status", "ATIVO"]]) as Record<string, string>;

function validate(data: Record<string, string>) {
  if (data.nome.trim().length < 3 || data.nome.length > 150) return "Nome deve ter entre 3 e 150 caracteres.";
  if (data.slug.trim().length < 3 || data.slug.length > 150) return "Slug deve ter entre 3 e 150 caracteres.";
  if (!data.descricaoCurta.trim() || data.descricaoCurta.length > 255) return "Descrição curta é obrigatória e deve ter até 255 caracteres.";
  if (!data.descricao.trim()) return "Descrição é obrigatória.";
  if (Number(data.preco) < 0.01) return "Preço deve ser maior que zero.";
  if (data.precoPromocional && Number(data.precoPromocional) < 0) return "Preço promocional não pode ser negativo.";
  if (!Number.isInteger(Number(data.quantidadeEstoque)) || Number(data.quantidadeEstoque) < 0) return "Quantidade em estoque deve ser um número inteiro não negativo.";
  if (!Number.isInteger(Number(data.estoqueMinimo)) || Number(data.estoqueMinimo) < 0) return "Estoque mínimo deve ser um número inteiro não negativo.";
  if (!data.sku.trim() || data.sku.length > 100) return "SKU é obrigatório e deve ter até 100 caracteres.";
  if (["peso", "altura", "largura", "comprimento"].some((key) => Number(data[key]) <= 0)) return "Peso, altura, largura e comprimento devem ser maiores que zero.";
  if (!data.categoriaId || Number(data.categoriaId) <= 0) return "Selecione uma categoria.";
  return null;
}

export default function ProductAdminTools() {
  const router = useRouter(); const inputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<Notice | null>(null); const [open, setOpen] = useState(false);
  const [data, setData] = useState<Record<string, string>>(initial); const [categories, setCategories] = useState<Array<{ categoryId: number; name: string }>>([]);
  const show = (notice: Notice) => { setNotice(notice); window.setTimeout(() => setNotice(null), 5000); };
  async function openCreate() { const response = await fetch("/api/commerce/categories?name="); if (response.ok) setCategories(await response.json()); else show({ variant: "error", title: "Categorias indisponíveis", message: "Não foi possível carregar as categorias." }); setOpen(true); }
  async function create() { const error = validate(data); if (error) return show({ variant: "error", title: "Revise o formulário", message: error }); const body = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== "" || key === "status")); const response = await fetch("/api/commerce/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (response.ok) { setOpen(false); setData(initial); show({ variant: "success", title: "Produto cadastrado", message: "O produto foi cadastrado com sucesso." }); router.refresh(); } else show({ variant: "error", title: "Não foi possível cadastrar", message: "Confira os dados informados e tente novamente." }); }
  async function importCsv(file: File) {
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/commerce/admin/imports/products", { method: "POST", body: form });
    if (response.ok) { show({ variant: "success", title: "Importação concluída", message: "Arquivo processado com sucesso." }); router.refresh(); return; }
    const raw = await response.text();
    let message = "Não foi possível processar o arquivo.";
    try { const parsed = JSON.parse(raw); message = parsed.message ?? parsed.detail ?? parsed.error ?? message; } catch { if (raw.trim()) message = raw; }
    show({ variant: "error", title: "Falha na importação", message });
  }
  return <><div className="mb-4 flex flex-wrap justify-end gap-3"><input ref={inputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCsv(file); }} /><button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-700">Importar CSV</button><button type="button" onClick={() => void openCreate()} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Novo produto</button></div>{notice && <div className="fixed right-5 top-5 z-[100000] w-[min(24rem,calc(100vw-2.5rem))]"><Alert {...notice} /></div>}{open && <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-950/60 p-4"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"><div className="mb-5 flex items-start justify-between"><div><h2 className="font-semibold">Cadastrar produto</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-error-500">*</span> Campos obrigatórios</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Fechar">×</button></div><div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="text-sm font-medium">{field.label}{field.required && <span className="ms-1 text-error-500">*</span>}<input type={field.type ?? "text"} step={field.step} value={data[field.key]} onChange={(event) => setData({ ...data, [field.key]: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700" />{field.hint && <span className="mt-1 block text-xs font-normal text-gray-500 dark:text-gray-400">{field.hint}</span>}</label>)}<label className="text-sm font-medium">Categoria<span className="ms-1 text-error-500">*</span><select value={data.categoriaId} onChange={(event) => setData({ ...data, categoriaId: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"><option value="">Selecione uma categoria</option>{categories.map((category) => <option key={category.categoryId} value={category.categoryId}>{category.name}</option>)}</select></label><label className="text-sm font-medium">Status<span className="ms-1 text-error-500">*</span><select value={data.status} onChange={(event) => setData({ ...data, status: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"><option>ATIVO</option><option>INATIVO</option><option>SEM_ESTOQUE</option></select></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">Cancelar</button><button type="button" onClick={() => void create()} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Cadastrar</button></div></div></div>}</>;
}
