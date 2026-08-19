"use client";

import classNames from "classnames";
import { Globe, MonitorPlay, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useRouter } from "@/i18n/navigation";

const TARGETS = [
  { key: "characters", path: "/characters", Icon: Users },
  { key: "locations", path: "/locations", Icon: Globe },
  { key: "episodes", path: "/episodes", Icon: MonitorPlay },
] as const;

export function GlobalSearch() {
  const t = useTranslations("search");
  const tNav = useTranslations("nav");
  const router = useRouter();

  const [term, setTerm] = useState("");
  const [target, setTarget] = useState<(typeof TARGETS)[number]>(TARGETS[0]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = term.trim() ? `?name=${encodeURIComponent(term.trim())}` : "";
    router.push(`${target.path}${query}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4  ">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-fg">{t("filterBy")}</span>
        {TARGETS.map((option) => {
          const isActive = option.key === target.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTarget(option)}
              aria-pressed={isActive}
              className={classNames(
                "inline-flex items-center gap-1.5 rounded-control border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border text-muted-fg hover:text-fg",
              )}
            >
              <option.Icon size={14} aria-hidden />
              {tNav(option.key)}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 -mb-8">
        <SearchInput value={term} onChange={setTerm} />
        <Button type="submit" className="h-11 px-5">
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
