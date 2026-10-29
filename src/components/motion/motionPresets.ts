import type { Transition } from "motion/react";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.7,
};

export const springLayout: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.8,
};

export const springMenu: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};
