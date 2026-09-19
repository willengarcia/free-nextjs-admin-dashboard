import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminPayment, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params; setRequestLocale(locale);
  const data = await getAdminData<PageResponse<AdminPayment>>(`/payments?${getQuery(await searchParams)}`);
  const field = "rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700";
  return <AdminTable title="Pagamentos" data={data} filters={<><select name="status" className={field}><option value="">Todos os status</option><option>PENDENTE</option><option>APROVADO</option><option>RECUSADO</option><option>CANCELADO</option><option>EXPIRADO</option><option>REEMBOLSADO</option></select><select name="provider" className={field}><option value="">Todos os provedores</option><option>MERCADO_PAGO</option><option>STRIPE</option><option>PAGSEGURO</option></select><select name="metodoPagamento" className={field}><option value="">Todos os métodos</option><option>PIX</option><option>CARTAO_CREDITO</option><option>CARTAO_DEBITO</option></select><input name="orderId" placeholder="ID do pedido" className={field} /><input name="reconciliationStatus" placeholder="Status de reconciliação" className={field} /><input name="dataInicio" type="date" className={field} /><input name="dataFim" type="date" className={field} /></>} columns={[{ label: "Pagamento", value: (item) => `#${item.id}` }, { label: "Pedido", value: (item) => `#${item.orderId}` }, { label: "Método", value: (item) => item.metodoPagamento }, { label: "Provedor", value: (item) => item.provider }, { label: "Valor", value: (item) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor) }, { label: "Status", value: (item) => item.statusPagamento }]} />;
}
