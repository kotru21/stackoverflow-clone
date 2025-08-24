import type { ButtonHTMLAttributes, ReactNode } from "react";
import { memo } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline"
  | "link";
type Size = "xs" | "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded whitespace-nowrap font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
  danger:
    "border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950",
  ghost:
    "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
  outline:
    "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 bg-transparent",
  link: "text-blue-600 hover:underline dark:text-blue-400",
};

const sizeClasses: Record<Size, string> = {
  xs: "text-xs px-2 py-1",
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-current"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle className="opacity-25" cx="12" cy="12" r="10" />
      <path d="M22 12a10 10 0 0 1-10 10" className="opacity-75" />
    </svg>
  );
}

export const Button = memo(function Button({
  variant = "secondary",
  size = "sm",
  loading,
  iconLeft,
  iconRight,
  className,
  children,
  fullWidth,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      {...rest}>
      {iconLeft && <span className="mr-1.5 inline-flex">{iconLeft}</span>}
      {loading ? <Spinner /> : children}
      {iconRight && <span className="ml-1.5 inline-flex">{iconRight}</span>}
    </button>
  );
});

export default Button;
