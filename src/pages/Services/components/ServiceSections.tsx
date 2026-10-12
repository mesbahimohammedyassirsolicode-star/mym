import { ArrowRight, Check, Code2 } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import { serviceIcons } from "../../../data/serviceIcons";
import { serviceCategories } from "../../../data/services";
import type { ServiceCategory } from "../../../types/service";

interface ServiceDetailProps {
  category: ServiceCategory;
  index: number;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li className="check-list__item" key={item}>
          <Check
            className="check-list__icon"
            size={16}
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceDetail({ category, index }: ServiceDetailProps) {
  const { id, slug, title, description, capabilities, useCases } = category;
  const Icon = serviceIcons[slug] ?? Code2;
  const sectionIndex = String(index + 1).padStart(2, "0");
  const alternate = index % 2 !== 0;

  return (
    <section
      id={id}
      className={
        alternate ? "home-section home-section--alt" : "home-section"
      }
      aria-labelledby={`${id}-title`}
    >
      <Container>
        <div className="service-detail">
          <header className="service-detail__header">
            <span className="service-detail__icon" aria-hidden="true">
              <Icon size={26} strokeWidth={1.75} />
            </span>
            <div className="service-detail__intro">
              <p className="service-detail__index" aria-hidden="true">
                {sectionIndex}
              </p>
              <h2 id={`${id}-title`} className="service-detail__title">
                {title}
              </h2>
              <p className="service-detail__lead">{description}</p>
            </div>
          </header>

          <div className="service-detail__lists">
            <div className="service-detail__list">
              <h3 className="service-detail__subtitle">Capabilities</h3>
              <CheckList items={capabilities} />
            </div>
            <div className="service-detail__list">
              <h3 className="service-detail__subtitle">Common use cases</h3>
              <CheckList items={useCases} />
            </div>
          </div>

          <Button
            to="/contact"
            variant="secondary"
            aria-label={`Discuss ${title}`}
          >
            Discuss this service
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default function ServiceSections() {
  return (
    <>
      {serviceCategories.map((category, index) => (
        <ServiceDetail
          key={category.id}
          category={category}
          index={index}
        />
      ))}
    </>
  );
}