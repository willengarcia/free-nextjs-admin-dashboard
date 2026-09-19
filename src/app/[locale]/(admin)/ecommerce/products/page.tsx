import AdminTable from "@/components/admin/AdminTable";
import { ProductActions } from "@/components/admin/AdminActions";
import ProductAdminTools from "@/components/admin/ProductAdminTools";
import ProductEditButton from "@/components/admin/ProductEditButton";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { Link } from "@/i18n/navigation";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminProduct, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData<PageResponse<AdminProduct>>(`/products?${getQuery(await searchParams)}`);
  const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  return <AdminTable title="Produtos" data={data} tools={<ProductAdminTools />} filters={<><input name="name" placeholder="Nome" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">Todos os status</option><option>ATIVO</option><option>INATIVO</option><option>SEM_ESTOQUE</option></select><select name="estoqueBaixo" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">Todo o estoque</option><option value="true">Estoque baixo</option></select></>} columns={[{ label: "Produto", value: (item) => <Link href={`/ecommerce/products/${item.id}`} className="font-medium text-brand-500 hover:underline">{item.nome}</Link> }, { label: "SKU", value: (item) => item.sku }, { label: "Categoria", value: (item) => item.categoriaNome ?? "—" }, { label: "Preço", value: (item) => money(item.precoPromocional ?? item.preco) }, { label: "Estoque disponível", value: (item) => item.quantidadeDisponivel }, { label: "Status", value: (item) => item.status }, { label: "Ações", value: (item) => <div className="flex gap-3"><ProductEditButton id={item.id} /><ProductImageUpload productId={item.id} /><ProductActions id={item.id} /></div> }]} />;
}
