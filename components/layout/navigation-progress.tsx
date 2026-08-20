"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useNavigationPhase } from "@/hooks/use-navigation-phase";

/**
 * Progress bar along the bottom edge of the header, filling from the start edge
 * to the end edge across a navigation.
 *
 * Detail routes deliberately have no `loading` file — a segment-level boundary
 * would flush the shell, and the 200 with it, before `notFound()` runs — so
 * without this a click on a card has no feedback while the server fetches.
 *
 * A route change reports no real percentage, so the fill is a decelerating
 * guess that stalls near the end; landing is what carries it the rest of the
 * way. Two separate animations rather than an animation handed off to a
 * transition, so the run-out always starts from a known width.
 */
export function NavigationProgress() {
  const phase = useNavigationPhase();
  const t = useTranslations("state");

  if (phase === "idle") return null;

  return (
    // No aria-valuenow: its absence is what marks a progressbar indeterminate,
    // which this is — the width is an estimate, not a measurement.
    <div
      role="progressbar"
      aria-label={t("loading")}
      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden"
    >
      <span
        className={classNames(
          "absolute inset-y-0 start-0 w-0 rounded-full bg-primary",
          // Reduced motion gets the bar's presence without the travel.
          "motion-reduce:w-full motion-reduce:animate-none",
          phase === "loading"
            ? "animate-nav-progress"
            : "animate-nav-progress-done",
        )}
      />
    </div>
  );
}
