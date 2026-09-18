"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function ProductActions({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function deactivate() {
    if (!window.confirm("Deactivate this product?")) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }
  return <button type="button" disabled={busy} onClick={deactivate} title="Inativar produto" aria-label="Inativar produto" className="font-medium text-error-500 disabled:opacity-50">{busy ? "…" : "⊘"}</button>;
}

export function CustomerRoleSelect({ id, role }: { id: number; role: "ADMIN" | "CUSTOMER" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function update(nextRole: string) {
    setBusy(true);
    await fetch(`/api/admin/customers/${id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: nextRole }) });
    router.refresh();
    setBusy(false);
  }
  return <select aria-label="Customer role" disabled={busy} value={role} onChange={(event) => update(event.target.value)} className="rounded border border-gray-300 bg-transparent px-2 py-1 text-sm dark:border-gray-700"><option>ADMIN</option><option>CUSTOMER</option></select>;
}

export function OrderFulfillment({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const next: Record<string, string> = { PAGO: "PROCESSADO", PROCESSADO: "SEPARADO", SEPARADO: "PREPARANDO", PREPARANDO: "ENVIADO", ENVIADO: "ENTREGUE" };
  const target = next[status];
  async function advance() { if (!target) return; const response = await fetch(`/api/commerce/admin/orders/${id}/fulfillment`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: target }) }); if (response.ok) router.refresh(); }
  return target ? <button type="button" onClick={advance} className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-theme-xs hover:bg-brand-600">Avançar para {target}</button> : <span className="text-xs text-gray-400">Sem ação</span>;
}
