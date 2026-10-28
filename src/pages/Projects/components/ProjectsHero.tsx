import Container from "../../../components/layout/Container";
import SectionHeading from "../../../components/ui/SectionHeading";

export default function ProjectsHero() {
  return (
    <section className="page-hero" aria-labelledby="projects-hero-title">
      <Container>
        <div className="page-hero__inner">
          <p className="eyebrow">Our Work</p>
          <SectionHeading
            as="h1"
            id="projects-hero-title"
            className="page-hero__title"
          >
            Ideas Into <span className="hl">Digital Experiences.</span>
          </SectionHeading>
          <p className="page-hero__lead">
            Aurasoli turns needs into digital products, applications, and business
            solutions — from the first idea to a working, maintained system.
          </p>
        </div>
      </Container>
    </section>
  );
}