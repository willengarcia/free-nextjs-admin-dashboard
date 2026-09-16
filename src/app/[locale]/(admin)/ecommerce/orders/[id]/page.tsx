import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getCommerceData } from "@/lib/admin/server";
import type { AdminOrder } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderFulfillment } from "@/components/admin/AdminActions";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const order = await getCommerceData<AdminOrder>(`/orders/${id}`);
  if (!order) return <><PageBreadcrumb pageTitle="Pedido" /><ComponentCard title="Pedido indisponível">Não foi possível carregar este pedido.</ComponentCard></>;
  return <><Link href="/ecommerce/orders" className="text-sm font-medium text-brand-500">← Pedidos</Link><div className="mt-4 flex items-center justify-between"><div><h1 className="text-title-md font-semibold">Pedido #{order.orderId}</h1><p className="text-sm text-gray-500">Total {money(order.valorTotal)}</p></div><span className="rounded-full bg-success-50 px-3 py-1 text-sm text-success-600">{order.status}</span></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><ComponentCard title="Resumo do pedido"><div className="flex justify-between"><span>Subtotal</span><b>{money(order.valorTotal)}</b></div><div className="mt-3 flex justify-between"><span>Total</span><b>{money(order.valorTotal)}</b></div></ComponentCard><ComponentCard title="Cliente"><p>{order.customer.nomeCompleto}</p><p className="text-sm text-gray-500">{order.customer.email}</p><p className="mt-3 text-sm">CPF: ***<br />Telefone: ***</p></ComponentCard></div><div className="mt-6"><ComponentCard title="Produtos"><table className="min-w-full"><thead><tr><th className="py-3 text-start">Produto</th><th className="text-start">Qtd.</th><th className="text-start">Unitário</th><th className="text-start">Subtotal</th></tr></thead><tbody>{order.items.map((item, index) => <tr key={index} className="border-t"><td className="py-3">{item.nomeProduto}</td><td>{item.quantidade}</td><td>{money(item.precoUnitario)}</td><td>{money(item.subTotal)}</td></tr>)}</tbody></table></ComponentCard></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><ComponentCard title="Endereço de entrega">{order.address ? `${order.address.rua}, ${order.address.numero} · ${order.address.bairro} · ${order.address.cidade}/${order.address.estado} · CEP ${order.address.cep}` : "Endereço não disponível."}</ComponentCard><ComponentCard title="Fulfillment"><p className="mb-4 text-sm">PAGO → PROCESSADO → SEPARADO → PREPARANDO → ENVIADO → ENTREGUE</p><OrderFulfillment id={order.orderId} status={order.status} /></ComponentCard></div></>;
}
