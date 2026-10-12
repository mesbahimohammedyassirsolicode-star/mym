import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import HeroVisual from "../../../components/hero/HeroVisual";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container className="hero__inner">
        <div className="hero__content">
          <p className="eyebrow">Digital Solutions for Modern Businesses</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__title-line">Make Your</span>
            <span className="hero__title-line hl">Move.</span>
          </h1>
          <p className="hero__lead">
            We build digital solutions that help businesses develop their ideas,
            automate operations, and grow their digital presence.
          </p>
          <div className="hero__actions">
            <Button to="/contact" variant="primary" size="lg">
              Start a Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              Explore Services
            </Button>
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
