import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { AdminDashboard as DashboardData, AdminOrder, PageResponse } from "@/lib/admin/types";

const sections = [
  ["Pedidos", "pedidos"],
  ["Pagamentos", "pagamentos"],
  ["Usuários", "clientes"],
  ["Produtos", "produtos"],
] as const;

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function label(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "brand" | "success" | "warning" | "purple" }) {
  const tones = { brand: "bg-brand-50 text-brand-500 dark:bg-brand-500/15", success: "bg-success-50 text-success-600 dark:bg-success-500/15", warning: "bg-orange-50 text-orange-600 dark:bg-orange-500/15", purple: "bg-theme-purple-50 text-theme-purple-500 dark:bg-theme-purple-500/15" };
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"><div className={`mb-6 flex size-8 items-center justify-center rounded-lg text-sm font-bold ${tones[tone]}`}>{label.slice(0, 1)}</div><p className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{value.toLocaleString()}</p><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p></div>;
}

export default function AdminDashboard({ data, orders }: { data: DashboardData | null; orders: PageResponse<AdminOrder> | null }) {
  return (
    <>
      <PageBreadcrumb pageTitle="Dashboard" />
      {!data ? (
        <ComponentCard title="Painel indisponível">
          <p className="text-sm text-gray-500 dark:text-gray-400">Não foi possível carregar o resumo administrativo. Verifique sua sessão e tente novamente.</p>
        </ComponentCard>
      ) : (
        <>
          <div className="mb-6"><h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">Comércio eletrônico</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Acompanhe pedidos, pagamentos, usuários e estoque.</p></div>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total de pedidos" value={data.pedidos.total} tone="brand" />
            <Metric label="Pagamentos aprovados" value={data.pagamentos.aprovados} tone="success" />
            <Metric label="Usuários ativos" value={data.clientes.ativos} tone="purple" />
            <Metric label="Produtos com estoque baixo" value={data.produtos.estoqueBaixo} tone="warning" />
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {sections.map(([title, key]) => (
              <ComponentCard key={key} title={`Visão de ${title.toLowerCase()}`}>
                <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {Object.entries(data[key]).map(([name, total]) => <div key={name}><dt className="text-theme-xs text-gray-500 dark:text-gray-400">{label(name)}</dt><dd className="mt-1 text-title-sm font-semibold text-gray-800 dark:text-white/90">{total.toLocaleString()}</dd></div>)}
                </dl>
              </ComponentCard>
            ))}
          </div>
          <ComponentCard title="Últimos pedidos">
            {!orders ? <p className="text-sm text-gray-500 dark:text-gray-400">Não foi possível carregar os pedidos recentes.</p> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">{orders.content.map((order) => { const info = order.status === "CANCELADO" ? ["C", "Cancelado", "bg-error-50 text-error-600 dark:bg-error-500/15"] : order.status === "PAGO" ? ["P", "Pago", "bg-brand-50 text-brand-600 dark:bg-brand-500/15"] : order.status === "ENTREGUE" ? ["E", "Entregue", "bg-success-50 text-success-600 dark:bg-success-500/15"] : order.status === "REEMBOLSADO" ? ["R", "Reembolsado", "bg-orange-50 text-orange-600 dark:bg-orange-500/15"] : [order.status.slice(0, 1), order.status, "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"]; return <article key={order.orderId} className="rounded-xl border border-gray-200 p-3 dark:border-white/[0.05]"><div className="flex items-start justify-between"><span className="font-semibold">#{order.orderId}</span><span title={info[1]} className={`flex size-7 cursor-help items-center justify-center rounded-md text-xs font-bold ${info[2]}`}>{info[0]}</span></div><p className="mt-3 text-sm font-medium">{money(order.valorTotal)}</p><p className="mt-1 text-theme-xs text-gray-500">{info[1]}</p></article>; })}</div>}
          </ComponentCard>
        </>
      )}
    </>
  );
}
