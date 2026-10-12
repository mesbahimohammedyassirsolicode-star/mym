import usePageMeta from "../../hooks/usePageMeta";
import ServicesHero from "./components/ServicesHero";
import ServiceSections from "./components/ServiceSections";
import ServicesClosingCta from "./components/ServicesClosingCta";
import "./services.css";

export default function ServicesPage() {
  usePageMeta(
    "Services | MYM — Make Your Move",
    "Explore MYM's services: web development, SaaS platforms, mobile applications, management systems, digital marketing & SEO, automation & integrations, and brand identity.",
  );

  return (
    <>
      <ServicesHero />
      <ServiceSections />
      <ServicesClosingCta />
    </>
  );
}