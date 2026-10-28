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
    description:
      "Understand the client's goals, challenges, and requirements.",
  },
  {
    index: "02",
    title: "Design",
    description: "Plan a clear, user-focused digital experience.",
  },
  {
    index: "03",
    title: "Build",
    description:
      "Develop the solution using appropriate technologies and maintainable code.",
  },
  {
    index: "04",
    title: "Improve",
    description:
      "Support ongoing improvements based on actual project needs.",
  },
];

export default function Approach() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="approach-title"
    >
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="How We Work"
            titleId="approach-title"
            title={
              <>
                From Idea to <span className="hl">Digital Solution.</span>
              </>
            }
            description="A straightforward process that keeps the work focused on the outcome, from first conversation to launch."
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
