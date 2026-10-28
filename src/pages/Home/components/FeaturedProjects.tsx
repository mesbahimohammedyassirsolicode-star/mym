import { ArrowRight } from "lucide-react";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import ProjectCard from "../../../components/ui/ProjectCard";
import { projects } from "../../../data/projects";
import SectionHeader from "../../../components/ui/SectionHeader";
import Reveal from "../../../components/motion/Reveal";

export default function FeaturedProjects() {
  return (
    <section
      className="home-section home-section--alt"
      aria-labelledby="projects-title"
    >
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Selected Work"
            titleId="projects-title"
            title={
              <>
                Ideas Into <span className="hl">Digital Experiences.</span>
              </>
            }
            description="A look at the kind of digital products Aurasoli designs and builds for growing businesses."
          />
        </Reveal>

        <ul className="projects-grid">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.id} delay={index * 60}>
              <ProjectCard {...project} />
            </Reveal>
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