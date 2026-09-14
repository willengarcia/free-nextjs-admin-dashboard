import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { navItems } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function PortalOverview() {
  const t = useTranslations("portal");
  const navigation = useTranslations("sidebar.items");
  return (
    <>
      <PageBreadcrumb pageTitle={t("title")} />
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{t("description")}</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {navItems.filter((item) => item.key !== "dashboard").map((item) => (
          <ComponentCard key={item.key} title={navigation(item.key)}>
            <Badge color="warning">{t("planned")}</Badge>
            <ul className="space-y-3">
              {(item.subItems || (item.path ? [{ key: item.key, path: item.path }] : [])).map((link) => (
                <li key={link.key}>
                  <Link href={link.path} className="text-sm font-medium text-brand-500 hover:underline dark:text-brand-400">
                    {navigation(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
