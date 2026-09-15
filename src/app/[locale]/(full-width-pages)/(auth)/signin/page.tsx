import SignInForm from "@/components/auth/SignInForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.signIn" });
  return { title: t("title"), description: t("description") };
}

export default async function SignIn({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignInForm />;
}
