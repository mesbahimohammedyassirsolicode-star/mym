import type { Project, ProjectPreview } from "../../types/project";
import ProjectPreviewGraphic from "./ProjectPreview";

const statusLabels: Record<Project["status"], string> = {
  concept: "Concept",
};

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: Project["status"];
  preview: ProjectPreview;
}

export default function ProjectCard({
  title,
  description,
  category,
  tags,
  status,
  preview,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__visual" aria-hidden="true">
        <ProjectPreviewGraphic variant={preview} />
      </div>

      <div className="project-card__body">
        <span className="project-card__badge">{statusLabels[status]}</span>
        <p className="project-card__category">{category}</p>
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__text">{description}</p>
        <ul className="tag-list" aria-label={`Topics for ${title}`}>
          {tags.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}