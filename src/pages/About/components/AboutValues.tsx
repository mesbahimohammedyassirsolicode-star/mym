import { Lightbulb, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";

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
        <SectionHeader
          eyebrow="Our Values"
          titleId="about-values-title"
          title={
            <>
              What Guides <span className="hl">Every Project.</span>
            </>
          }
          description="The principles behind how MYM thinks about its work, its clients, and the products it builds."
        />

        <ul className="values-grid">
          {values.map(({ icon: Icon, title, description }) => (
            <li className="value-card" key={title}>
              <span className="value-card__icon" aria-hidden="true">
                <Icon size={24} strokeWidth={1.75} />
              </span>
              <h3 className="value-card__title">{title}</h3>
              <p className="value-card__text">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}