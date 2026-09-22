import BrandManager from "@/components/admin/BrandManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { setRequestLocale } from "next-intl/server";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; setRequestLocale(locale); return <><PageBreadcrumb pageTitle="Marcas" /><BrandManager /></>; }
