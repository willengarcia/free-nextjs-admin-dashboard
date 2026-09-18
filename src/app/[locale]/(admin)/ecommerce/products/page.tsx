import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminProduct, PageResponse } from "@/lib/admin/types";
import { ProductActions } from "@/components/admin/AdminActions";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import ProductEditButton from "@/components/admin/ProductEditButton";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = getQuery(await searchParams);
  const data = await getAdminData<PageResponse<AdminProduct>>(`/products?${query}`);
  return <AdminTable title="Produtos" data={data} filters={<><input name="name" placeholder="Nome" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">Todos os status</option><option>ATIVO</option><option>INATIVO</option><option>SEM_ESTOQUE</option></select><select name="estoqueBaixo" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">Todo o estoque</option><option value="true">Estoque baixo</option></select></>} columns={[{ label: "Produto", value: (item) => item.nome }, { label: "SKU", value: (item) => item.sku }, { label: "Categoria", value: (item) => item.categoriaNome ?? "—" }, { label: "Preço", value: (item) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.precoPromocional ?? item.preco) }, { label: "Estoque disponível", value: (item) => item.quantidadeDisponivel }, { label: "Status", value: (item) => item.status }, { label: "Ações", value: (item) => <div className="flex gap-3"><ProductEditButton id={item.id} /><ProductImageUpload productId={item.id} /><ProductActions id={item.id} /></div> }]} />;
}
