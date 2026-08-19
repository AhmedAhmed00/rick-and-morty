"use client";

import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { buildRange } from "@/utils/pagination";

function isPlainClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

const ITEM =
  "inline-flex size-9 items-center justify-center rounded-control text-sm transition-colors";

interface Props {
  page: number;
  pages: number;
  /** Real destination, so pages are shareable and open in a new tab. */
  hrefFor: (page: number) => string;
  /** Called for plain left clicks only; the component preventDefaults first. */
  onNavigate?: (page: number) => void;
  onPrefetch?: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pages,
  hrefFor,
  onNavigate,
  onPrefetch,
  className,
}: Props) {
  const t = useTranslations("pagination");
  const range = buildRange(page, pages);

  if (range.length === 0) return null;

  function linkProps(target: number) {
    return {
      href: hrefFor(target),
      onMouseEnter: () => onPrefetch?.(target),
      onFocus: () => onPrefetch?.(target),
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        // Let modified and middle clicks fall through to the browser.
        if (!onNavigate || !isPlainClick(event)) return;
        event.preventDefault();
        onNavigate(target);
      },
    };
  }

  const atStart = page <= 1;
  const atEnd = page >= pages;

  return (
    <nav
      aria-label={t("label")}
      className={classNames("flex items-center justify-center gap-1", className)}
    >
      {atStart ? (
        <span
          aria-hidden
          className={classNames(ITEM, "text-muted-fg opacity-40")}
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
        </span>
      ) : (
        <Link
          {...linkProps(page - 1)}
          aria-label={t("previous")}
          className={classNames(ITEM, "text-muted-fg hover:bg-card")}
        >
          <ChevronLeft size={18} className="rtl:rotate-180" aria-hidden />
        </Link>
      )}

      {range.map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="px-1 text-sm text-muted-fg"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            {...linkProps(item)}
            aria-label={
              item === page
                ? t("current", { page: item })
                : t("page", { page: item })
            }
            aria-current={item === page ? "page" : undefined}
            className={classNames(
              ITEM,
              item === page
                ? "bg-primary font-semibold text-on-primary"
                : "text-fg hover:bg-card",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {atEnd ? (
        <span
          aria-hidden
          className={classNames(ITEM, "text-muted-fg opacity-40")}
        >
          <ChevronRight size={18} className="rtl:rotate-180" />
        </span>
      ) : (
        <Link
          {...linkProps(page + 1)}
          aria-label={t("next")}
          className={classNames(ITEM, "text-muted-fg hover:bg-card")}
        >
          <ChevronRight size={18} className="rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
