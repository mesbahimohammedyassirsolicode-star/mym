import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types/project";

const statusLabels: Record<Project["status"], string> = {
  live: "Live project",
  workflow: "Automation",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { thumbnail } = project;
  const caseStudyPath = `/projects/${project.id}`;

  return (
    <article className="project-card">
      <div className="project-card__visual">
        <img
          className="project-card__image"
          src={thumbnail.src}
          alt={thumbnail.alt}
          width={thumbnail.width}
          height={thumbnail.height}
          loading="lazy"
          decoding="async"
        />
        <span
          className={`project-card__badge project-card__badge--${project.status}`}
        >
          <span className="project-card__badge-dot" aria-hidden="true" />
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="project-card__body">
        <p className="project-card__category">{project.category}</p>
        <h3 className="project-card__title">
          <Link to={caseStudyPath}>{project.title}</Link>
        </h3>
        <p className="project-card__text">{project.description}</p>

        <ul className="tag-list" aria-label={`Topics for ${project.title}`}>
          {project.tags.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>

        <div className="project-card__actions">
          <Link
            className="project-card__action project-card__action--primary"
            to={caseStudyPath}
          >
            {project.status === "workflow"
              ? "Explore automation"
              : "Read case study"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          {project.url ? (
            <a
              className="project-card__action project-card__action--external"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.ctaLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
