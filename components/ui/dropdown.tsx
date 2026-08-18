"use client";

import classNames from "classnames";
import { Check } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onSelect: () => void;
}

interface Props {
  label: string;
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
}

/**
 * WAI-ARIA menu button. The menu is portalled and positioned from the trigger's
 * box so an ancestor's overflow can't clip it.
 */
export function Dropdown({ label, trigger, items, className }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, minWidth: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const menuWidth = Math.max(menuRef.current?.offsetWidth ?? 0, 160);
    const gap = 4;

    // Align the menu's end edge to the trigger's, then keep it on screen.
    const preferred =
      document.documentElement.dir === "rtl"
        ? rect.left
        : rect.right - menuWidth;

    setPosition({
      top: rect.bottom + gap,
      left: Math.min(Math.max(8, preferred), window.innerWidth - menuWidth - 8),
      minWidth: Math.max(rect.width, 160),
    });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    menuRef.current?.focus();

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    const reflow = () => place();

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", reflow);
    window.addEventListener("scroll", reflow, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", reflow);
      window.removeEventListener("scroll", reflow, true);
    };
  }, [open, place]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function choose(index: number) {
    items[index]?.onSelect();
    close();
  }

  function openMenu() {
    setActiveIndex(Math.max(0, items.findIndex((item) => item.selected)));
    setOpen(true);
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
      case "Tab":
        close();
        break;
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter") {
            event.preventDefault();
            openMenu();
          }
        }}
        className={classNames(
          "inline-flex h-9 items-center gap-1.5 rounded-control border border-border bg-surface px-2.5 text-xs font-medium transition-colors hover:border-primary/50",
          className,
        )}
      >
        {trigger}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            aria-label={label}
            aria-activedescendant={`${id}-item-${activeIndex}`}
            onKeyDown={onMenuKeyDown}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              minWidth: position.minWidth,
            }}
            className="z-[60] rounded-card border border-border bg-card p-1 shadow-xl outline-none"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                id={`${id}-item-${index}`}
                role="menuitem"
                type="button"
                onClick={() => choose(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={classNames(
                  "flex w-full items-center gap-2 rounded-control px-3 py-2 text-start text-sm transition-colors",
                  index === activeIndex && "bg-primary/10",
                  item.selected ? "font-medium text-fg" : "text-muted-fg",
                )}
              >
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.selected && (
                  <Check size={14} aria-hidden className="shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
