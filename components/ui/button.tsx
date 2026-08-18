import classNames from "classnames";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const VARIANTS: Record<ButtonVariant, string> = {
  // Near-black ink on the cyan fill: white would only reach 2.6:1.
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-card text-fg border border-border hover:border-primary",
  ghost: "text-primary-text hover:bg-card",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

const BASE =
  "inline-flex items-center justify-center rounded-control font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: StyleProps) {
  return classNames(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = StyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass({ variant, size, className })}
      {...props}
    />
  );
}

type LinkButtonProps = StyleProps &
  Omit<ComponentProps<typeof Link>, "className"> & { children: ReactNode };

/** A link styled as a button — kept separate so `href` stays type-checked. */
export function LinkButton({
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
