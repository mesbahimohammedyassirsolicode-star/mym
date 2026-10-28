import type { ComponentType, CSSProperties, ReactNode, Ref } from "react";
import {
  useInViewOnce,
  type RevealPhase,
} from "../../hooks/useInViewOnce";

const MAX_REVEAL_DELAY = 240;

interface RevealProps {
  children: ReactNode;
  as?: "div" | "li";
  className?: string;
  delay?: number;
}

interface RevealElementProps {
  ref: Ref<HTMLElement | null>;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}

const phaseClasses: Record<RevealPhase, string | null> = {
  idle: null,
  armed: "is-armed",
  visible: "is-visible",
};

export default function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
}: RevealProps) {
  const { ref, phase } = useInViewOnce<HTMLElement>();
  const appliedDelay = Math.min(Math.max(delay, 0), MAX_REVEAL_DELAY);
  const Element = as as unknown as ComponentType<RevealElementProps>;
  const classes = ["reveal", phaseClasses[phase], className]
    .filter(Boolean)
    .join(" ");
  const style =
    appliedDelay > 0
      ? ({
          "--reveal-delay": `${appliedDelay}ms`,
        } as CSSProperties)
      : undefined;

  return (
    <Element ref={ref} className={classes} style={style}>
      {children}
    </Element>
  );
}
