import { useMemo, useState } from "react";
import Container from "../../../components/layout/Container";
import ProjectCard from "../../../components/ui/ProjectCard";
import { projects } from "../../../data/projects";

const ALL_FILTER = "All";

const categories = [
  ALL_FILTER,
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export default function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  const filteredProjects = useMemo(() => {
    if (activeFilter === ALL_FILTER) {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="home-section" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="visually-hidden">
        Project gallery
      </h2>
      <Container>
        <div
          className="filter-bar"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((category) => {
            const isActive = category === activeFilter;
            return (
              <button
                key={category}
                type="button"
                className={isActive ? "filter-button is-active" : "filter-button"}
                aria-pressed={isActive}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredProjects.length > 0 ? (
          <ul className="projects-grid projects-grid--showcase">
            {filteredProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <p className="empty-state__title">
              No projects in this category yet.
            </p>
            <p className="empty-state__text">
              Try another filter to see available examples.
            </p>
          </div>
        )}

        <p className="projects-note">
          Websites are shown as captured from their public homepages. Each case
          study separates verified details from editorial interpretation, and
          the automation project is documented as a workflow rather than a
          public demo.
        </p>
      </Container>
    </section>
  );
}