import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

interface ApproachStep {
  index: string;
  title: string;
  description: string;
}

const approachSteps: ApproachStep[] = [
  {
    index: "01",
    title: "Discover",
    description: "Understand business goals, requirements, and constraints.",
  },
  {
    index: "02",
    title: "Design",
    description: "Plan a clear, usable solution before anything is built.",
  },
  {
    index: "03",
    title: "Build",
    description: "Develop a maintainable digital product, tested as it grows.",
  },
  {
    index: "04",
    title: "Improve",
    description: "Refine the solution according to actual needs and usage.",
  },
];

export default function AboutApproach() {
  return (
    <section className="home-section" aria-labelledby="about-approach-title">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Our Approach"
            titleId="about-approach-title"
            title={
              <>
                A Simple, Purposeful <span className="hl">Process.</span>
              </>
            }
            description="Four steps keep the work focused on the outcome, from first conversation to ongoing improvement."
          />
        </Reveal>

        <ol className="approach-list">
          {approachSteps.map(({ index, title, description }, stepIndex) => (
            <Reveal
              as="li"
              className="approach-step"
              key={index}
              delay={stepIndex * 60}
            >
              <span className="approach-step__index" aria-hidden="true">
                {index}
              </span>
              <h3 className="approach-step__title">{title}</h3>
              <p className="approach-step__text">{description}</p>
            </Reveal>
          ))}
        </ol>

        <p className="approach-note">
          Scope, timelines, and any ongoing support are agreed for each project
          individually.
        </p>
      </Container>
    </section>
  );
}