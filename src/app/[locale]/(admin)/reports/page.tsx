import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ExternalProcessings from "@/components/admin/ExternalProcessings";
import { getAdminData } from "@/lib/admin/server";
import type { ExternalProcessingResponse, PageResponse } from "@/lib/admin/types";
import { setRequestLocale } from "next-intl/server";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string,string|string[]|undefined>> }) { const {locale}=await params;setRequestLocale(locale);const search=await searchParams;const status=typeof search.status==="string"?search.status:"";const page=typeof search.page==="string"?search.page:"0";const data=await getAdminData<PageResponse<ExternalProcessingResponse>>(`/external-processings?${new URLSearchParams({page,size:"20",...(status?{status}:{})})}`);return <><PageBreadcrumb pageTitle="Relatórios"/><ComponentCard title="Relatórios de vendas"><p className="text-sm text-gray-500 dark:text-gray-400">Relatórios analíticos e exportações serão disponibilizados posteriormente.</p></ComponentCard><ExternalProcessings data={data} statusFilter={status}/></>; }
