import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

export default function ProjectsClosingCta() {
  return (
    <section className="home-section" aria-labelledby="projects-cta-title">
      <Container>
        <Reveal className="cta-panel">
          <SectionHeader
            align="center"
            titleId="projects-cta-title"
            title={
              <>
                Have a Project in <span className="hl">Mind?</span>
              </>
            }
          />
          <div className="cta-panel__actions">
            <Button to="/contact" variant="primary" size="lg">
              Start a Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}