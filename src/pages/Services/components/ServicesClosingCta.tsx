import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

export default function ServicesClosingCta() {
  return (
    <section className="home-section" aria-labelledby="services-cta-title">
      <Container>
        <Reveal className="cta-panel">
          <SectionHeader
            align="center"
            titleId="services-cta-title"
            title={
              <>
                Let's Build Something That Moves Your Business{" "}
                <span className="hl">Forward.</span>
              </>
            }
          />
          <div className="cta-panel__actions">
            <Button to="/contact" variant="primary" size="lg">
              Discuss Your Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}