import { redirect } from "@/i18n/navigation";
import AdminShell from "@/layout/AdminShell";
import { getAdminSession } from "@/lib/auth/server";
import { setRequestLocale } from "next-intl/server";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminSession();
  if (!session) {
    redirect({ href: "/signin", locale });
    return null;
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}
