import PortalOverview from "@/components/portal/PortalOverview";
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
  return <PortalOverview />;
}
