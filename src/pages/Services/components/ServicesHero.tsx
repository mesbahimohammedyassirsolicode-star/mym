import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeading from "../../../components/ui/SectionHeading";

export default function ServicesHero() {
  return (
    <section className="page-hero" aria-labelledby="services-hero-title">
      <Container>
        <div className="page-hero__inner">
          <p className="eyebrow">Our Services</p>
          <SectionHeading
            as="h1"
            id="services-hero-title"
            className="page-hero__title"
          >
            Digital Solutions Built Around{" "}
            <span className="hl">Your Business.</span>
          </SectionHeading>
          <p className="page-hero__lead">
            MYM helps businesses build digital products, improve operations,
            strengthen their online presence, and develop their brand identity.
          </p>
          <div className="page-hero__actions">
            <Button to="/contact" variant="primary" size="lg">
              Start a Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}