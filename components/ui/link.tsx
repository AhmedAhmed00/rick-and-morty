"use client";

import { useLinkStatus } from "next/link";
import { useEffect } from "react";
import type { ComponentProps } from "react";
import { endNavigation, startNavigation } from "@/hooks/use-navigation-phase";
import { Link as IntlLink } from "@/i18n/navigation";

/**
 * The app's `Link`: next-intl's, plus a reporter feeding the header progress
 * bar. Import this one rather than `@/i18n/navigation` so every navigation
 * shows up in the header.
 */
export function Link({ children, ...props }: ComponentProps<typeof IntlLink>) {
  return (
    <IntlLink {...props}>
      {children}
      <NavigationReporter />
    </IntlLink>
  );
}

/** Renders nothing; exists to read this link's pending state and report it. */
function NavigationReporter() {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    startNavigation();
    // Also runs if the link unmounts while still pending.
    return endNavigation;
  }, [pending]);

  return null;
}
