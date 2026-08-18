"use client";

import classNames from "classnames";
import { SearchX, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "./button";

interface StateProps {
  title: string;
  body: string;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
}

function State({ title, body, icon, action, className }: StateProps) {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-card px-6 py-16 text-center",
        className,
      )}
    >
      <span aria-hidden className="text-muted-fg">
        {icon}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-fg">{body}</p>
      {action}
    </div>
  );
}

export function EmptyState({ action }: { action?: ReactNode }) {
  const t = useTranslations("state");
  return (
    <State
      icon={<SearchX size={32} strokeWidth={1.5} />}
      title={t("emptyTitle")}
      body={t("emptyBody")}
      action={action}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const t = useTranslations("state");
  return (
    <State
      icon={<TriangleAlert size={32} strokeWidth={1.5} />}
      title={t("errorTitle")}
      body={t("errorBody")}
      action={
        onRetry ? (
          <Button size="sm" onClick={onRetry}>
            {t("retry")}
          </Button>
        ) : undefined
      }
    />
  );
}
