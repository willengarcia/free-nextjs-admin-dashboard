import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminData } from "@/lib/admin/server";
import type { AdminDashboard as AdminDashboardData, AdminOrder, PageResponse } from "@/lib/admin/types";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return { title: t("title"), description: t("description") };
}

export default async function Dashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [data, orders] = await Promise.all([
    getAdminData<AdminDashboardData>("/dashboard"),
    getAdminData<PageResponse<AdminOrder>>("/orders?page=0&size=7&sort=dataCriacao,desc"),
  ]);
  return <AdminDashboard data={data} orders={orders} />;
}
