import type { ComponentType, CSSProperties, ReactNode, Ref } from "react";
import { m, type TargetAndTransition, type Transition } from "motion/react";
import {
  useInViewOnce,
  type RevealPhase,
} from "../../hooks/useInViewOnce";
import { springSnappy } from "./motionPresets";

const MAX_REVEAL_DELAY = 240;

interface RevealProps {
  children: ReactNode;
  as?: "div" | "li";
  className?: string;
  delay?: number;
  hoverLift?: boolean;
}

interface RevealElementProps {
  ref: Ref<HTMLElement | null>;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  transition?: Transition;
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
  hoverLift = false,
}: RevealProps) {
  const { ref, phase } = useInViewOnce<HTMLElement>();
  const appliedDelay = Math.min(Math.max(delay, 0), MAX_REVEAL_DELAY);
  const Element = (
    hoverLift ? (as === "li" ? m.li : m.div) : as
  ) as unknown as ComponentType<RevealElementProps>;
  const classes = ["reveal", phaseClasses[phase], className]
    .filter(Boolean)
    .join(" ");
  const style =
    appliedDelay > 0
      ? ({
          "--reveal-delay": `${appliedDelay}ms`,
        } as CSSProperties)
      : undefined;
  const interaction = hoverLift
    ? {
        whileHover: { y: -3 },
        transition: springSnappy,
      }
    : {};

  return (
    <Element ref={ref} className={classes} style={style} {...interaction}>
      {children}
    </Element>
  );
}
