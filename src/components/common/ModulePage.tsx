import { useTranslations } from "next-intl";
import ComponentCard from "./ComponentCard";
import PageBreadcrumb from "./PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";

export default function ModulePage({ titleKey }: { titleKey: string }) {
  const t = useTranslations("portal");
  const navigation = useTranslations("sidebar.items");
  const title = navigation(titleKey);
  return (
    <>
      <PageBreadcrumb pageTitle={title} />
      <ComponentCard title={title}>
        <Badge color="warning">{t("planned")}</Badge>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("unavailable")}</p>
      </ComponentCard>
    </>
  );
}
