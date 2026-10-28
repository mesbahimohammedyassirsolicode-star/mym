import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { primaryNavigation } from "../../data/navigation";
import Container from "../layout/Container";
import Button from "../ui/Button";
import MobileNavigation from "./MobileNavigation";

const mobileNavId = "mobile-navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
      <header className="site-header">
        <Container className="site-header__inner">
          <Link
            to="/"
            className="brand-link"
            aria-label="Aurasoli, home"
          >
            <img
              className="brand-logo"
              src="/assets/logo/Aurasoli-logo.png"
              alt="Aurasoli"
              width="1400"
              height="404"
            />
          </Link>

          <nav className="primary-nav" aria-label="Main navigation">
            <ul className="primary-nav__list">
              {primaryNavigation.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      isActive ? "nav-link is-active" : "nav-link"
                    }
                  >
                    {label}
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
