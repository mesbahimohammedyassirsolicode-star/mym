import ServicesHero from "./components/ServicesHero";
import ServiceSections from "./components/ServiceSections";
import ServicesClosingCta from "./components/ServicesClosingCta";
import "./services.css";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceSections />
      <ServicesClosingCta />
    </>
  );
}