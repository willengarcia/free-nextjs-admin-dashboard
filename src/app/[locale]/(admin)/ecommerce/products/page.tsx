import AdminTable from "@/components/admin/AdminTable";
import { ProductActions } from "@/components/admin/AdminActions";
import ProductAdminTools from "@/components/admin/ProductAdminTools";
import ProductEditButton from "@/components/admin/ProductEditButton";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { Link } from "@/i18n/navigation";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminBrand, AdminProduct, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
 const { locale } = await params; setRequestLocale(locale); const query=getQuery(await searchParams); const [data,brands]=await Promise.all([getAdminData<PageResponse<AdminProduct>>(`/products?${query}`),getAdminData<AdminBrand[]>("/brands")]); const money=(value:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value); const field="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700";
 return <AdminTable title="Produtos" data={data} tools={<ProductAdminTools/>} filters={<><input name="name" placeholder="Nome" className={field}/><input name="sku" placeholder="SKU" className={field}/><select name="brandId" className={field}><option value="">Todas as marcas</option>{brands?.map((brand)=><option key={brand.id} value={brand.id}>{brand.name}</option>)}</select><select name="status" className={field}><option value="">Todos os status</option><option>ATIVO</option><option>INATIVO</option><option>SEM_ESTOQUE</option></select><select name="estoqueBaixo" className={field}><option value="">Todo o estoque</option><option value="true">Estoque baixo</option></select></>} columns={[{label:"Produto",value:(item)=><Link href={`/ecommerce/products/${item.id}`} className="font-medium text-brand-500 hover:underline">{item.nome}</Link>},{label:"SKU",value:(item)=>item.sku},{label:"Categoria",value:(item)=>item.categoriaNome??"—"},{label:"Marca",value:(item)=>item.brandName??"—"},{label:"Preço",value:(item)=>money(item.precoPromocional??item.preco)},{label:"Estoque disponível",value:(item)=>item.quantidadeDisponivel},{label:"Status",value:(item)=>item.status},{label:"Ações",value:(item)=><div className="flex gap-3"><ProductEditButton id={item.id}/><ProductImageUpload productId={item.id}/><ProductActions id={item.id}/></div>}]}/>;
}
