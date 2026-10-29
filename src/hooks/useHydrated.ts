import { useEffect, useState } from "react";

/**
 * Keeps server markup and the first client render identical so Motion can
 * start animating only after hydration.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
