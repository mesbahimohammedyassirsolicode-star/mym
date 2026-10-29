import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { m, type HTMLMotionProps } from "motion/react";
import { springSnappy } from "../motion/motionPresets";

const MotionLink = m.create(Link);

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
  const interaction = disabled
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { y: 0, scale: 0.98 },
        transition: springSnappy,
      };

  if (to) {
    return (
      <MotionLink
        to={to}
        viewTransition
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        aria-busy={ariaBusy}
        aria-disabled={disabled}
        {...interaction}
      >
        {children}
      </MotionLink>
    );
  }

  if (href) {
    const anchorProps: HTMLMotionProps<"a"> = {
      href,
      className: classes,
      onClick: onClick as MouseEventHandler<HTMLAnchorElement>,
      "aria-label": ariaLabel,
      "aria-busy": ariaBusy,
    };

    return (
      <m.a {...anchorProps} {...interaction}>
        {children}
      </m.a>
    );
  }

  const buttonProps: HTMLMotionProps<"button"> = {
    type,
    className: classes,
    disabled,
    onClick: onClick as MouseEventHandler<HTMLButtonElement>,
    "aria-label": ariaLabel,
    "aria-busy": ariaBusy,
  };

  return (
    <m.button {...buttonProps} {...interaction}>
      {children}
    </m.button>
  );
}
