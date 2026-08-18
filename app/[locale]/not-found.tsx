import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("state");

  return (
    <Container className="flex flex-col items-center gap-4 py-section text-center">
      <p className="font-mono text-5xl font-bold text-primary-text">404</p>
      <h1 className="text-2xl font-bold">{t("emptyTitle")}</h1>
      <p className="max-w-sm text-sm text-muted-fg">{t("emptyBody")}</p>
      <LinkButton href="/">{t("backHome")}</LinkButton>
    </Container>
  );
}
