import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "md" | "lg";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  to?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-label"?: string;
  "aria-busy"?: boolean;
}

function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: Pick<ButtonBaseProps, "variant" | "size" | "fullWidth" | "className">) {
  return [
    "btn",
    `btn--${variant}`,
    size === "lg" && "btn--lg",
    fullWidth && "btn--full",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  children,
  variant,
  size,
  fullWidth,
  className,
  to,
  href,
  type = "button",
  disabled,
  onClick,
  "aria-label": ariaLabel,
  "aria-busy": ariaBusy,
}: ButtonBaseProps) {
  const classes = getButtonClassName({ variant, size, fullWidth, className });

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        aria-busy={ariaBusy}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href,
      className: classes,
      onClick,
      "aria-label": ariaLabel,
      "aria-busy": ariaBusy,
    };

    return <a {...anchorProps}>{children}</a>;
  }

  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type,
    className: classes,
    disabled,
    onClick,
    "aria-label": ariaLabel,
    "aria-busy": ariaBusy,
  };

  return <button {...buttonProps}>{children}</button>;
}
