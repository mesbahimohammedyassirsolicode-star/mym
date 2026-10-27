import usePageMeta from "../../hooks/usePageMeta";
import ProjectsHero from "./components/ProjectsHero";
import ProjectGallery from "./components/ProjectGallery";
import ProjectsClosingCta from "./components/ProjectsClosingCta";
import "./projects.css";

export default function ProjectsPage() {
  usePageMeta(
    "Projects | Aurasoli",
    "A look at the digital products, applications, and business solutions Aurasoli designs and builds — currently shown as neutral conceptual examples.",
  );

  return (
    <>
      <ProjectsHero />
      <ProjectGallery />
      <ProjectsClosingCta />
    </>
  );
}