import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import ProjectCard from "../../../components/ui/ProjectCard";
import { projects } from "../../../data/projects";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function FeaturedProjects() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="projects-title"
    >
      <Container>
        <SectionHeader
          eyebrow="Selected Work"
          titleId="projects-title"
          title={
            <>
              Ideas Into <span className="hl">Digital Experiences.</span>
            </>
          }
          description="Websites, an online store, an event experience, and an AI workflow — selected work that solves a clear, specific need."
        />

        <ul className="projects-grid projects-grid--showcase">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        <p className="projects-note">
          Live sites are shown as captured from their public homepages. Case
          studies state only what is publicly verifiable.
        </p>

        <div className="section-actions">
          <Button to="/projects" variant="secondary">
            View all projects
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}