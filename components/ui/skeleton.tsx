import classNames from "classnames";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={classNames("animate-pulse rounded-control bg-border", className)}
    />
  );
}
