"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  // Undefined until next-themes resolves in the browser, so the server render
  // and the first client render agree on the unchecked position.
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Switch
      className={className}
      checked={resolvedTheme === "dark"}
      onCheckedChange={(dark) => setTheme(dark ? "dark" : "light")}
      label={t("toggleTheme")}
      offContent={<Sun size={14} />}
      onContent={<Moon size={14} />}
    />
  );
}
