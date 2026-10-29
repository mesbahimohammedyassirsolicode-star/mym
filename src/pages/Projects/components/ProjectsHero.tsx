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
            Websites, online stores, event platforms, and AI workflows — a
            closer look at the work, the thinking behind it, and what each
            project sets out to do.
          </p>
        </div>
      </Container>
    </section>
  );
}