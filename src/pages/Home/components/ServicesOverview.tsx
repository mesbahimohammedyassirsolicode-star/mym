import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import { serviceIcons } from "../../../data/serviceIcons";
import { serviceCategories } from "../../../data/services";
import type { ServiceCategory } from "../../../types/service";
import SectionHeader from "../../../components/ui/SectionHeader";

function ServiceCard({ title, slug, description }: ServiceCategory) {
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

export default function ServicesOverview() {
  return (
    <section className="home-section" aria-labelledby="services-title">
      <Container>
        <SectionHeader
          eyebrow="What We Do"
          titleId="services-title"
          title={
            <>
              Digital Solutions Built to{" "}
              <span className="hl">Move You Forward.</span>
            </>
          }
          description="MYM helps businesses build digital products, improve how they operate, and strengthen their online presence."
        />

        <ul className="services-grid">
          {serviceCategories.map((category) => (
            <ServiceCard key={category.id} {...category} />
          ))}
        </ul>

        <div className="section-actions">
          <Button to="/services" variant="secondary">
            Explore all services
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
