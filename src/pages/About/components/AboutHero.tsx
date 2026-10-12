import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeading from "../../../components/ui/SectionHeading";

export default function AboutHero() {
  return (
    <section className="page-hero" aria-labelledby="about-hero-title">
      <Container>
        <div className="page-hero__inner">
          <p className="eyebrow">About MYM</p>
          <SectionHeading
            as="h1"
            id="about-hero-title"
            className="page-hero__title"
          >
            Technology With a <span className="hl">Purpose.</span>
          </SectionHeading>
          <p className="page-hero__lead">
            MYM helps businesses turn ideas into digital solutions through
            software development, automation, marketing, and brand design.
          </p>
          <div className="page-hero__actions">
            <Button to="/services" variant="primary" size="lg">
              Explore Our Services
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}