import classNames from "classnames";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

interface Props {
  title: string;
  /** Renders a "see all" action next to the heading. */
  seeAllHref?: string;
  seeAllLabel?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Section({
  title,
  seeAllHref,
  seeAllLabel,
  icon,
  className,
  children,
}: Props) {
  return (
    <section className={classNames("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {icon ? (
          <span aria-hidden className="text-primary">
            {icon}
          </span>
        ) : null}
        <h2 className="text-2xl font-bold">{title}</h2>
        {seeAllHref && seeAllLabel ? (
          <Link
            href={seeAllHref}
            className="ms-auto text-sm font-medium text-primary-text transition-colors hover:text-primary"
          >
            {seeAllLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
