import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/navigation/Navbar";
import Seo from "../components/seo/Seo";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function MainLayout() {
  const location = useLocation();
  const [routeKey, setRouteKey] = useState(0);
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        element.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  useIsomorphicLayoutEffect(() => {
    if (previousPathname.current === location.pathname) {
      return;
    }

    previousPathname.current = location.pathname;
    if (!("startViewTransition" in document)) {
      setRouteKey((key) => key + 1);
    }
  }, [location.pathname]);

  return (
    <>
      <Seo pathname={location.pathname} />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <div
          key={routeKey}
          className={
            routeKey > 0 ? "route-view route-view--enter" : "route-view"
          }
        >
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
