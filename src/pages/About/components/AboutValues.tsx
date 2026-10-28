import { Lightbulb, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const values: ValueItem[] = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "New tools and ideas are only worth pursuing when they serve a real business need.",
  },
  {
    icon: ShieldCheck,
    title: "Quality",
    description:
      "Careful, tested work that stays maintainable long after it first launches.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Close communication with clients throughout the project, so the result matches expectations.",
  },
  {
    icon: RefreshCcw,
    title: "Continuous Improvement",
    description:
      "Solutions grow with the business, refined through feedback and real-world usage.",
  },
];

export default function AboutValues() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="about-values-title"
    >
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Our Values"
            titleId="about-values-title"
            title={
              <>
                What Guides <span className="hl">Every Project.</span>
              </>
            }
            description="The principles behind how Aurasoli thinks about its work, its clients, and the products it builds."
          />
        </Reveal>

        <ul className="values-grid">
          {values.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              as="li"
              className="value-card"
              key={title}
              delay={index * 60}
            >
              <span className="value-card__icon" aria-hidden="true">
                <Icon size={24} strokeWidth={1.75} />
              </span>
              <h3 className="value-card__title">{title}</h3>
              <p className="value-card__text">{description}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}