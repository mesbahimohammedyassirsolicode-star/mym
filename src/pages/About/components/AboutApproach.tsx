import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";

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

        <ol className="approach-list">
          {approachSteps.map(({ index, title, description }) => (
            <li className="approach-step" key={index}>
              <span className="approach-step__index" aria-hidden="true">
                {index}
              </span>
              <h3 className="approach-step__title">{title}</h3>
              <p className="approach-step__text">{description}</p>
            </li>
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