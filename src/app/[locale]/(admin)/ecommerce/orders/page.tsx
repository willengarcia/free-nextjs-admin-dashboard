import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminOrder, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = getQuery(await searchParams);
  const data = await getAdminData<PageResponse<AdminOrder>>(`/orders?${query}`);
  return <AdminTable title="Orders" data={data} filters={<><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All statuses</option><option>AGUARDANDO_PAGAMENTO</option><option>PAGO</option><option>PROCESSADO</option><option>ENVIADO</option><option>ENTREGUE</option><option>CANCELADO</option></select><input name="customerId" placeholder="Customer ID" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /><input name="dataInicio" type="date" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /></>} columns={[{ label: "Order", value: (item) => `#${item.orderId}` }, { label: "Customer", value: (item) => item.customer.nomeCompleto }, { label: "Email", value: (item) => item.customer.email }, { label: "Items", value: (item) => item.items.map((product) => `${product.nomeProduto} × ${product.quantidade}`).join(", ") }, { label: "Total", value: (item) => new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(item.valorTotal) }, { label: "Status", value: (item) => item.status }]} />;
}
