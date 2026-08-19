import classNames from "classnames";
import type { ElementType, ReactNode } from "react";

interface CardProps {
  as?: ElementType;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={classNames(
        "rounded-card bg-card border border-border",
        interactive &&
          "relative transition-colors hover:border-primary focus-within:border-primary",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
