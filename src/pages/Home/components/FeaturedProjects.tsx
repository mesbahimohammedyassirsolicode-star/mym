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
          description="A look at the kind of digital products MYM designs and builds for growing businesses."
        />

        <ul className="projects-grid">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard {...project} />
            </li>
          ))}
        </ul>

        <p className="projects-note">
          The examples above are neutral conceptual illustrations, not completed
          client work.
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