import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminPayment, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = getQuery(await searchParams);
  const data = await getAdminData<PageResponse<AdminPayment>>(`/payments?${query}`);
  return <AdminTable title="Payments" data={data} filters={<><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All statuses</option><option>PENDENTE</option><option>APROVADO</option><option>RECUSADO</option><option>CANCELADO</option><option>EXPIRADO</option><option>REEMBOLSADO</option></select><select name="provider" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All providers</option><option>MERCADO_PAGO</option><option>STRIPE</option><option>PAGSEGURO</option></select><select name="metodoPagamento" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All methods</option><option>PIX</option><option>CARTAO_CREDITO</option><option>CARTAO_DEBITO</option></select></>} columns={[{ label: "Payment", value: (item) => `#${item.id}` }, { label: "Order", value: (item) => `#${item.orderId}` }, { label: "Method", value: (item) => item.metodoPagamento }, { label: "Provider", value: (item) => item.provider }, { label: "Amount", value: (item) => new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(item.valor) }, { label: "Status", value: (item) => item.statusPagamento }]} />;
}
