import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Link } from "@/i18n/navigation";
import logo from "@/public/LogoA.png";

export async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-6">
        <Link href="/" aria-label={t("home")} className="shrink-0">
          <Image src={logo} alt="Rick and Morty" height={28} loading="eager" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="rounded-control px-3 py-2 text-sm font-medium text-muted-fg transition-colors hover:text-fg"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
