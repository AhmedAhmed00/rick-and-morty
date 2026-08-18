import classNames from "classnames";
import type { ReactNode } from "react";

/** Centres content at the shared max width and applies the page gutter. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={classNames(
        "mx-auto w-full max-w-page px-gutter ",
        className,
      )}
    >
      {children}
    </div>
  );
}
