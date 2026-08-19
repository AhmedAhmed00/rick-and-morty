import classNames from "classnames";
import type { ReactNode } from "react";

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
