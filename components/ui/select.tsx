"use client";

import classNames from "classnames";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  /** `undefined` means nothing is selected and the placeholder shows. */
  value: string | undefined;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string | undefined) => void;
  /** Renders the label above the trigger instead of only for screen readers. */
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * WAI-ARIA listbox, used instead of a native `<select>` so the panel can be
 * styled. Keyboard support matches a native one.
 */
export function Select({
  label,
  value,
  options,
  placeholder,
  onChange,
  showLabel = false,
  disabled = false,
  className,
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The placeholder is a real row, so `undefined` is selectable.
  const rows: SelectOption[] = [{ value: "", label: placeholder }, ...options];
  const selectedIndex = rows.findIndex((row) => row.value === (value ?? ""));

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  function openAt(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  function commit(index: number) {
    const row = rows[index];
    onChange(row.value === "" ? undefined : row.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, rows.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(rows.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        triggerRef.current?.focus();
        break;
    }
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openAt(selectedIndex === -1 ? 0 : selectedIndex);
    }
  }

  return (
    <div ref={rootRef} className={classNames("relative", className)}>
      <label
        htmlFor={id}
        className={classNames(
          showLabel ? "mb-1.5 block text-xs font-medium text-muted-fg" : "sr-only",
        )}
      >
        {label}
      </label>

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex === -1 ? 0 : selectedIndex))}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={classNames(
          "flex h-11 w-full items-center justify-between gap-2 rounded-control border bg-surface px-3 text-sm transition-colors",
          "disabled:pointer-events-none disabled:opacity-50",
          open ? "border-primary" : "border-border hover:border-primary/50",
          value ? "text-fg" : "text-muted-fg",
        )}
      >
        <span className="min-w-0 truncate">
          {value ? (options.find((o) => o.value === value)?.label ?? value) : placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={classNames(
            "shrink-0 text-muted-fg transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-card border border-border bg-card p-1 shadow-lg outline-none"
        >
          {rows.map((row, index) => {
            const isSelected = index === selectedIndex;

            return (
              <li
                key={row.value || "__placeholder"}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={classNames(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-control px-3 py-2 text-sm",
                  index === activeIndex && "bg-primary/10",
                  isSelected ? "font-medium text-fg" : "text-muted-fg",
                  index === 0 && options.length > 0 && "border-b border-border",
                )}
              >
                <span className="min-w-0 truncate">{row.label}</span>
                {isSelected && (
                  <Check size={14} aria-hidden className="shrink-0 text-primary" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
