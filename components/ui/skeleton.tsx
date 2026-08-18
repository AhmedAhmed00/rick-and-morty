import classNames from "classnames";

/** Placeholder block. The container that renders these should carry aria-busy. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={classNames("animate-pulse rounded-control bg-border", className)}
    />
  );
}
