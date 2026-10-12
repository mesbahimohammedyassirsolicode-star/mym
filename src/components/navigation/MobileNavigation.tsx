import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { primaryNavigation } from "../../data/navigation";
import Button from "../ui/Button";

interface MobileNavigationProps {
  open: boolean;
  id: string;
  onClose: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileNavigation({
  open,
  id,
  onClose,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div
      className="mobile-nav"
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      hidden={!open}
    >
      <div className="mobile-nav__panel" ref={panelRef}>
        <nav aria-label="Mobile main navigation">
          <ul className="mobile-nav__list">
            {primaryNavigation.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive
                      ? "mobile-nav__link is-active"
                      : "mobile-nav__link"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          to="/contact"
          variant="primary"
          size="lg"
          fullWidth
          className="mobile-nav__cta"
          onClick={onClose}
        >
          Start a Project
        </Button>
      </div>
    </div>
  );
}
