"use client";

import classNames from "classnames";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

const NAMES: Record<string, string> = { en: "English", ar: "العربية" };
const SHORT: Record<string, string> = { en: "EN", ar: "ع" };

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <Dropdown
      className={classNames(className, isPending && "opacity-60")}
      label={t("language")}
      trigger={
        <>
          <Globe size={15} aria-hidden />
          {SHORT[active] ?? active.toUpperCase()}
          <ChevronDown size={14} aria-hidden className="text-muted-fg" />
        </>
      }
      items={locales.map((locale) => ({
        id: locale,
        label: NAMES[locale] ?? locale,
        selected: locale === active,
        // `pathname` excludes the locale segment, so the same page is kept.
        onSelect: () =>
          startTransition(() => router.replace(pathname, { locale })),
      }))}
    />
  );
}
