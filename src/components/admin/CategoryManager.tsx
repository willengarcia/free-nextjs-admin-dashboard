"use client";

import { useState } from "react";

type Category = { categoryId: number; name: string; description: string; ativo: boolean };

export default function CategoryManager() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  async function search() { const r = await fetch(`/api/commerce/categories?name=${encodeURIComponent(name)}`); setItems(r.ok ? await r.json() : []); setMessage(r.ok ? "" : "Não foi possível buscar as categorias."); }
  async function create() { const r = await fetch("/api/commerce/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description, ativo: true }) }); setMessage(r.ok ? "Categoria cadastrada." : "Não foi possível cadastrar a categoria."); if (r.ok) search(); }
  async function remove(id: number) { if (!window.confirm("Excluir esta categoria?")) return; const r = await fetch(`/api/commerce/categories/${id}`, { method: "DELETE" }); if (r.ok) setItems(items.filter((item) => item.categoryId !== id)); else setMessage("Não foi possível excluir a categoria."); }
  return <div className="space-y-6"><section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"><h2 className="mb-4 font-semibold">Nova categoria</h2><div className="grid gap-3 md:grid-cols-3"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700" /><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700" /><button onClick={create} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">Cadastrar</button></div></section><section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"><div className="mb-4 flex gap-3"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Buscar por nome" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700" /><button onClick={search} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Buscar</button></div>{message && <p className="mb-3 text-sm text-error-500">{message}</p>}<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th className="text-start">Nome</th><th className="text-start">Descrição</th><th className="text-start">Status</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item.categoryId} className="border-t border-gray-100 dark:border-white/[0.05]"><td className="py-3">{item.name}</td><td className="py-3">{item.description}</td><td className="py-3">{item.ativo ? "Ativa" : "Inativa"}</td><td className="py-3 text-end"><button onClick={() => remove(item.categoryId)} className="text-error-500">Excluir</button></td></tr>)}</tbody></table></div></section></div>;
}
