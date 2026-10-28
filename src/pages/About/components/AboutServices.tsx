import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import Container from "../../../components/layout/Container";
import { serviceIcons } from "../../../data/serviceIcons";
import { serviceCategories } from "../../../data/services";
import type { ServiceCategory } from "../../../types/service";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

interface ServiceCardProps extends ServiceCategory {
  delay: number;
}

function ServiceCard({ slug, title, description, delay }: ServiceCardProps) {
  const Icon = serviceIcons[slug] ?? Code2;

  return (
    <Reveal as="li" className="service-card" delay={delay}>
      <span className="service-card__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__text">{description}</p>
      <Link className="service-card__link" to={`/services#${slug}`} viewTransition>
        Explore {title}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

export default function AboutServices() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="about-services-title"
    >
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="What We Do"
            titleId="about-services-title"
            title={
              <>
                Seven Disciplines, One{" "}
                <span className="hl">Moving Business.</span>
              </>
            }
            description="From development and automation to marketing and brand design, Aurasoli works across the disciplines that help businesses plan, build, and grow."
          />
        </Reveal>

        <ul className="services-grid">
          {serviceCategories.map((category, index) => (
            <ServiceCard
              key={category.id}
              {...category}
              delay={index * 60}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}