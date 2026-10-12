import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function AboutClosingCta() {
  return (
    <section className="home-section" aria-labelledby="about-cta-title">
      <Container>
        <div className="cta-panel">
          <SectionHeader
            align="center"
            titleId="about-cta-title"
            title={
              <>
                Have an Idea to <span className="hl">Build?</span>
              </>
            }
          />
          <div className="cta-panel__actions">
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