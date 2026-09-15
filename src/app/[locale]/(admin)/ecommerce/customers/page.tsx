import AdminTable from "@/components/admin/AdminTable";
import { getAdminData, getQuery } from "@/lib/admin/server";
import type { AdminCustomer, PageResponse } from "@/lib/admin/types";
import { CustomerRoleSelect } from "@/components/admin/AdminActions";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = getQuery(await searchParams);
  const data = await getAdminData<PageResponse<AdminCustomer>>(`/customers?${query}`);
  return <AdminTable title="Customers" data={data} filters={<><input name="name" placeholder="Name" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700" /><select name="status" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All statuses</option><option>ATIVO</option><option>INATIVO</option><option>BLOQUEADO</option></select><select name="role" className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">All roles</option><option>CUSTOMER</option><option>ADMIN</option></select></>} columns={[{ label: "Customer", value: (item) => item.nomeCompleto }, { label: "Email", value: (item) => item.email }, { label: "Phone", value: (item) => item.telefone }, { label: "Role", value: (item) => <CustomerRoleSelect id={item.id} role={item.role} /> }, { label: "Status", value: (item) => item.status }, { label: "Created", value: (item) => item.dataCriacao }]} />;
}
