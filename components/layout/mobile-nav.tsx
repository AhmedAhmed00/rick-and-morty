"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "./locale-switcher";
import { NAV_LINKS } from "./nav-links";
import { Sheet } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logo from "@/public/LogoA.png";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className="inline-flex size-10 items-center justify-center rounded-control text-fg transition-colors hover:bg-card"
      >
        <Menu size={22} aria-hidden />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("menu")}
        closeLabel={t("closeMenu")}
        header={
          <Link href="/" onClick={() => setOpen(false)} aria-label={t("home")}>
            <Image src={logo} alt="Rick and Morty" height={24} />
          </Link>
        }
      >
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-control px-3 py-2.5 text-base font-medium text-fg transition-colors hover:bg-card"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-fg">{t("language")}</span>
            <LocaleSwitcher />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-fg">{t("toggleTheme")}</span>
            <ThemeToggle />
          </div>
        </div>
      </Sheet>
    </div>
  );
}
