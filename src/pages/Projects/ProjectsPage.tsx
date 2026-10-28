import ProjectsHero from "./components/ProjectsHero";
import ProjectGallery from "./components/ProjectGallery";
import ProjectsClosingCta from "./components/ProjectsClosingCta";
import "./projects.css";

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectGallery />
      <ProjectsClosingCta />
    </>
  );
}