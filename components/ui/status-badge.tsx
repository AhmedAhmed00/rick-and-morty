"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import type { Status } from "@/lib/types";

/**
 * The single place a character status maps to a colour. Class strings are
 * complete literals because Tailwind scans source text and would not see a
 * name assembled at runtime.
 */
const DOT: Record<Status, string> = {
  Alive: "bg-alive",
  Dead: "bg-dead",
  unknown: "bg-unknown",
};

const TEXT: Record<Status, string> = {
  Alive: "text-alive",
  Dead: "text-dead",
  unknown: "text-unknown",
};

interface Props {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  const t = useTranslations("status");

  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        TEXT[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={classNames("size-2 shrink-0 rounded-full", DOT[status])}
      />
      {t(status)}
    </span>
  );
}
