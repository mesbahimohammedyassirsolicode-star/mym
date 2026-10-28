import { Link } from "react-router-dom";
import Container from "./Container";
import Button from "../ui/Button";
import BrandLogo from "../ui/BrandLogo";
import { primaryNavigation } from "../../data/navigation";
import { serviceCategories } from "../../data/services";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link
              to="/"
              viewTransition
              className="brand-link"
              aria-label="Aurasoli, home"
            >
              <BrandLogo loading="lazy" />
            </Link>
            <p>
              Aurasoli provides digital solutions to help businesses and
              entrepreneurs make their move.
            </p>
            <p className="footer-tagline">
              Make Your <span className="hl">Move.</span>
            </p>
            <Button to="/contact" variant="primary">
              Start a Project
            </Button>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-list">
              {primaryNavigation.map(({ label, to }) => (
                <li key={to}>
                  <Link className="footer-link" to={to} viewTransition>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Service categories">
            <h2 className="footer-heading">Services</h2>
            <ul className="footer-list">
              {serviceCategories.map(({ id, slug, title }) => (
                <li key={id}>
                  <Link className="footer-link" to={`/services#${slug}`} viewTransition>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p suppressHydrationWarning>
            &copy; {currentYear} Aurasoli. All rights reserved.
          </p>
          <p>Build. Automate. Grow. Forward.</p>
        </div>
      </Container>
    </footer>
  );
}
