import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminProduct, PageResponse } from "@/lib/admin/types";
import { ProductActions } from "@/components/admin/AdminActions";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = getQuery(await searchParams);
  const data = await getAdminData<PageResponse<AdminProduct>>(`/products?${query}`);
  return <AdminTable title="Products" data={data} filters={<><input name="name" placeholder="Name" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All statuses</option><option>ATIVO</option><option>INATIVO</option><option>SEM_ESTOQUE</option></select><select name="estoqueBaixo" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All stock levels</option><option value="true">Low stock</option></select></>} columns={[{ label: "Product", value: (item) => item.nome }, { label: "SKU", value: (item) => item.sku }, { label: "Category", value: (item) => item.categoriaNome ?? "—" }, { label: "Price", value: (item) => new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(item.precoPromocional ?? item.preco) }, { label: "Available stock", value: (item) => item.quantidadeDisponivel }, { label: "Status", value: (item) => item.status }, { label: "Action", value: (item) => <ProductActions id={item.id} /> }]} />;
}
