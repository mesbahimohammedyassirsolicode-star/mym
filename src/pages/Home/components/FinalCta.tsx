import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function FinalCta() {
  return (
    <section className="home-section" aria-labelledby="cta-title">
      <Container>
        <div className="cta-panel">
          <SectionHeader
            align="center"
            titleId="cta-title"
            title={
              <>
                Ready to Make Your <span className="hl">Move?</span>
              </>
            }
            description="Tell us what you're building. Let's explore the right digital solution for your business."
          />
          <div className="cta-panel__actions">
            <Button to="/contact" variant="primary" size="lg">
              Start a Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              Explore Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}