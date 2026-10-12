import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import Container from "../../../components/layout/Container";
import { serviceIcons } from "../../../data/serviceIcons";
import { serviceCategories } from "../../../data/services";
import type { ServiceCategory } from "../../../types/service";
import SectionHeader from "../../../components/ui/SectionHeader";

function ServiceCard({ slug, title, description }: ServiceCategory) {
  const Icon = serviceIcons[slug] ?? Code2;

  return (
    <li className="service-card">
      <span className="service-card__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__text">{description}</p>
      <Link className="service-card__link" to={`/services#${slug}`}>
        Explore {title}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </li>
  );
}

export default function AboutServices() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="about-services-title"
    >
      <Container>
        <SectionHeader
          eyebrow="What We Do"
          titleId="about-services-title"
          title={
            <>
              Seven Disciplines, One <span className="hl">Moving Business.</span>
            </>
          }
          description="From development and automation to marketing and brand design, MYM works across the disciplines that help businesses plan, build, and grow."
        />

        <ul className="services-grid">
          {serviceCategories.map((category) => (
            <ServiceCard key={category.id} {...category} />
          ))}
        </ul>
      </Container>
    </section>
  );
}