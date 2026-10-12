import usePageMeta from "../../hooks/usePageMeta";
import Hero from "./components/Hero";
import ServicesOverview from "./components/ServicesOverview";
import Approach from "./components/Approach";
import WhyMym from "./components/WhyMym";
import FeaturedProjects from "./components/FeaturedProjects";
import FinalCta from "./components/FinalCta";
import "./homepage.css";

export default function HomePage() {
  usePageMeta(
    "MYM — Make Your Move | Digital Solutions for Modern Businesses",
    "MYM builds digital solutions that help businesses develop their ideas, automate operations, and grow their digital presence.",
  );

  return (
    <>
      <Hero />
      <ServicesOverview />
      <Approach />
      <WhyMym />
      <FeaturedProjects />
      <FinalCta />
    </>
  );
}