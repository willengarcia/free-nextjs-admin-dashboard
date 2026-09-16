import CategoryManager from "@/components/admin/CategoryManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <><PageBreadcrumb pageTitle="Categorias" /><CategoryManager /></>;
}
