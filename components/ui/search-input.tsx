"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: Props) {
  const t = useTranslations("search");
  const id = useId();

  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {t("label")}
      </label>

      <Search
        size={18}
        aria-hidden
        className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-muted-fg"
      />

      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t("placeholder")}
        className="h-11 w-full rounded-control border border-border bg-surface ps-10 pe-10 text-sm outline-none transition-colors placeholder:text-muted-fg focus:border-primary"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("clear")}
          className="absolute top-1/2 end-2 -translate-y-1/2 rounded-control p-1 text-muted-fg transition-colors hover:text-fg"
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
