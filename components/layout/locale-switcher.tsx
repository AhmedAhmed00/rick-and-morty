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

interface Props {
  className?: string;
  /**
   * "inline" lays the locales out as a segmented control instead of a menu.
   * Used inside the mobile sheet, where a portalled menu would float over the
   * rows beneath it and sit outside the sheet's focus trap.
   */
  variant?: "dropdown" | "inline";
}

export function LocaleSwitcher({ className, variant = "dropdown" }: Props) {
  const t = useTranslations("nav");
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // `pathname` excludes the locale segment, so the same page is kept.
  const select = (locale: string) =>
    startTransition(() => router.replace(pathname, { locale }));

  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={t("language")}
        className={classNames(
          "inline-flex gap-0.5 rounded-control border border-border bg-surface p-0.5",
          isPending && "opacity-60",
          className,
        )}
      >
        {locales.map((locale) => {
          const selected = locale === active;
          return (
            <button
              key={locale}
              type="button"
              lang={locale}
              aria-pressed={selected}
              onClick={() => !selected && select(locale)}
              className={classNames(
                "rounded-control px-2.5 py-1.5 text-xs font-medium transition-colors",
                selected
                  ? "bg-primary text-on-primary"
                  : "text-muted-fg hover:text-fg",
              )}
            >
              {NAMES[locale] ?? locale}
            </button>
          );
        })}
      </div>
    );
  }

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
        onSelect: () => select(locale),
      }))}
    />
  );
}
