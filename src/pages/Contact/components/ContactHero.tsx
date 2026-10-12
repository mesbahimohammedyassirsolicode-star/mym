import Container from "../../../components/layout/Container";
import SectionHeading from "../../../components/ui/SectionHeading";

export default function ContactHero() {
  return (
    <section className="page-hero" aria-labelledby="contact-hero-title">
      <Container>
        <div className="page-hero__inner">
          <p className="eyebrow">Contact MYM</p>
          <SectionHeading
            as="h1"
            id="contact-hero-title"
            className="page-hero__title"
          >
            Let's Talk About <span className="hl">Your Project.</span>
          </SectionHeading>
          <p className="page-hero__lead">
            Tell us what you're planning to build. Share your goals and
            requirements so we can understand how MYM may help.
          </p>
        </div>
      </Container>
    </section>
  );
}