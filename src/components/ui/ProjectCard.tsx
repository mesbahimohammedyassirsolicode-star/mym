import type { Project } from "../../types/project";

const statusLabels: Record<Project["status"], string> = {
  concept: "Concept",
};

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: Project["status"];
}

export default function ProjectCard({
  title,
  description,
  category,
  tags,
  status,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__visual" aria-hidden="true">
        <div className="project-card__window">
          <span className="project-card__dot" />
          <span className="project-card__dot" />
          <span className="project-card__dot" />
        </div>
        <div className="project-card__layout">
          <span className="project-card__skeleton" />
          <div className="project-card__tiles">
            <span className="project-card__tile" />
            <span className="project-card__tile" />
            <span className="project-card__tile" />
            <span className="project-card__tile" />
          </div>
        </div>
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