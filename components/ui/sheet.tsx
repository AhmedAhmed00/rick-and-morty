"use client";

import classNames from "classnames";
import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  /** Rendered opposite the close button, e.g. the logo. */
  header?: ReactNode;
  children: ReactNode;
}

/** The mount state never changes after hydration, so there is nothing to watch. */
const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Slide-in panel used for the mobile navigation. */
export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  header,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // A portal has no server-rendered counterpart, and this one renders whether or
  // not the sheet is open so it can transition both ways. Reporting "not mounted"
  // for the server snapshot and the hydrating render keeps the first client pass
  // matching the server's empty one; the panel appears on the commit after.
  const mounted = useSyncExternalStore(subscribeToNothing, onClient, onServer);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  // Always rendered so it can transition both ways. `invisible` when closed also
  // removes it from the tab order, delayed so the slide-out finishes first.
  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50 transition-[visibility] duration-0 md:hidden",
        open ? "visible delay-0" : "invisible pointer-events-none delay-250",
      )}
    >
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className={classNames(
          "absolute inset-0 bg-black/50 transition-opacity duration-250",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames(
          "absolute inset-y-0 end-0 flex w-72 max-w-[85vw] flex-col gap-6 border-s border-border bg-surface p-6 shadow-xl",
          "transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {header}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="ms-auto rounded-control p-1 text-muted-fg transition-colors hover:text-fg"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}
