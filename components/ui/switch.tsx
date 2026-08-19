"use client";

import classNames from "classnames";
import type { ReactNode } from "react";

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Accessible name — the icons inside the track are decorative. */
  label: string;
  /** Shown on the left of the track (right in RTL), i.e. the unchecked side. */
  offContent: ReactNode;
  onContent: ReactNode;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  offContent,
  onContent,
  className,
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={classNames(
        "relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-surface transition-colors hover:border-primary/50",
        className,
      )}
    >
      <span
        aria-hidden
        className={classNames(
          "absolute top-1/2 start-1 size-7 -translate-y-1/2 rounded-full bg-primary transition-transform duration-200 ease-out",
          checked && "translate-x-7 rtl:-translate-x-7",
        )}
      />

      <span className="relative z-10 flex w-full items-center justify-around text-[11px] font-medium">
        <span
          className={classNames(
            "flex size-7 items-center justify-center transition-colors",
            checked ? "text-muted-fg" : "text-on-primary",
          )}
        >
          {offContent}
        </span>
        <span
          className={classNames(
            "flex size-7 items-center justify-center transition-colors",
            checked ? "text-on-primary" : "text-muted-fg",
          )}
        >
          {onContent}
        </span>
      </span>
    </button>
  );
}
