import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export type RevealPhase = "idle" | "armed" | "visible";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useInViewOnce<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  phase: RevealPhase;
} {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<RevealPhase>("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (
      window.matchMedia(REDUCED_MOTION_QUERY).matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    // Arm only elements that start below the viewport. Anything already on
    // screen stays visible, so hydration cannot fade out visible content.
    if (element.getBoundingClientRect().top <= window.innerHeight) {
      return;
    }

    setPhase("armed");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, phase };
}
