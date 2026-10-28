import { Gauge, Network, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";

interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

const valueProps: ValueProp[] = [
  {
    icon: Target,
    title: "Tailored Solutions",
    description:
      "Solutions designed around actual business needs, not one-size-fits-all templates.",
  },
  {
    icon: Network,
    title: "Connected Thinking",
    description:
      "Development, automation, and digital presence considered together as one system.",
  },
  {
    icon: Gauge,
    title: "Thoughtful Execution",
    description:
      "A steady emphasis on usability, maintainability, and clear communication.",
  },
];

export default function WhyAurasoli() {
  return (
    <section className="home-section" aria-labelledby="why-title">
      <Container>
        <SectionHeader
          eyebrow="Why Aurasoli"
          titleId="why-title"
          title={
            <>
              Technology With a <span className="hl">Clear Purpose.</span>
            </>
          }
          description="The goal is not technology for its own sake, but digital work that serves the business behind it."
        />

        <ul className="values-grid">
          {valueProps.map(({ icon: Icon, title, description }) => (
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
