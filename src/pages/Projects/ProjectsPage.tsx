import usePageMeta from "../../hooks/usePageMeta";
import ProjectsHero from "./components/ProjectsHero";
import ProjectGallery from "./components/ProjectGallery";
import ProjectsClosingCta from "./components/ProjectsClosingCta";
import "./projects.css";

export default function ProjectsPage() {
  usePageMeta(
    "Websites, E-commerce & AI Automation Projects | Aurasoli",
    "Explore Aurasoli projects: web platforms, e-commerce, event websites, and AI automation — with verified case studies, screenshots, and live links.",
  );

  return (
    <>
      <ProjectsHero />
      <ProjectGallery />
      <ProjectsClosingCta />
    </>
  );
}