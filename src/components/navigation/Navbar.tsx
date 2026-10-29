import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { m } from "motion/react";
import { primaryNavigation } from "../../data/navigation";
import { springLayout } from "../motion/motionPresets";
import Container from "../layout/Container";
import Button from "../ui/Button";
import BrandLogo from "../ui/BrandLogo";
import MobileNavigation from "./MobileNavigation";

const mobileNavId = "mobile-navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeMenuAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 8);
    };

    const handleScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenuAndRestoreFocus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenuAndRestoreFocus]);

  return (
    <>
      <header className={isScrolled ? "site-header is-scrolled" : "site-header"}>
        <Container className="site-header__inner">
          <Link
            to="/"
            viewTransition
            className="brand-link"
            aria-label="Aurasoli, home"
          >
            <BrandLogo loading="eager" fetchPriority="high" />
          </Link>

          <nav className="primary-nav" aria-label="Main navigation">
            <ul className="primary-nav__list">
              {primaryNavigation.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    viewTransition
                    className={({ isActive }) =>
                      isActive ? "nav-link is-active" : "nav-link"
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && (
                          <m.span
                            layoutId="nav-active-indicator"
                            className="nav-link__indicator"
                            aria-hidden="true"
                            transition={springLayout}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Button to="/contact" variant="primary" className="nav-cta">
              Start a Project
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={isOpen}
              aria-controls={mobileNavId}
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              onClick={() => setIsOpen((open) => !open)}
            >
              {isOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </header>

      <MobileNavigation open={isOpen} id={mobileNavId} onClose={closeMenu} />
    </>
  );
}
