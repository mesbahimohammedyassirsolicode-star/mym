import Hero from "./components/Hero";
import ServicesOverview from "./components/ServicesOverview";
import Approach from "./components/Approach";
import WhyAurasoli from "./components/WhyAurasoli";
import FeaturedProjects from "./components/FeaturedProjects";
import FinalCta from "./components/FinalCta";
import "./homepage.css";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <Approach />
      <WhyAurasoli />
      <FeaturedProjects />
      <FinalCta />
    </>
  );
}