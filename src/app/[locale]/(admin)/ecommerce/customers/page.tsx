import AdminTable from "@/components/admin/AdminTable";
import { CustomerRoleSelect } from "@/components/admin/AdminActions";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminCustomer, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
 const {locale}=await params;setRequestLocale(locale);const data=await getAdminData<PageResponse<AdminCustomer>>(`/customers?${getQuery(await searchParams)}`);const field="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700";
 return <AdminTable title="Clientes" data={data} filters={<><input name="name" placeholder="Nome" className={field}/><select name="status" className={field}><option value="">Todos os status</option><option>ATIVO</option><option>INATIVO</option><option>BLOQUEADO</option></select><select name="role" className={field}><option value="">Todos os perfis</option><option>CUSTOMER</option><option>ADMIN</option></select><input name="dataInicio" type="date" className={field}/><input name="dataFim" type="date" className={field}/></>} columns={[{label:"Cliente",value:(item)=>item.nomeCompleto},{label:"E-mail",value:(item)=>item.email},{label:"Telefone",value:(item)=>item.telefone},{label:"Perfil",value:(item)=><CustomerRoleSelect id={item.id} role={item.role}/>},{label:"Status",value:(item)=>item.status},{label:"Criado em",value:(item)=>item.dataCriacao}]}/>;
}
