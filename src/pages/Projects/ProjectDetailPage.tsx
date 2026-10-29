import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";
import { projects } from "../../data/projects";
import usePageMeta from "../../hooks/usePageMeta";
import "./projects.css";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const index = projects.findIndex((item) => item.id === projectId);
  const project = index >= 0 ? projects[index] : undefined;
  const metaTitle = project
    ? project.title.length > 34
      ? `${project.title} | Aurasoli`
      : `${project.title} Case Study | Aurasoli`
    : "Project not found | Aurasoli";

  usePageMeta(
    metaTitle,
    project
      ? project.seoDescription
      : "The project you requested could not be found.",
  );

  if (!project) {
    return (
      <section className="page-hero" aria-labelledby="page-title">
        <Container>
          <div className="page-hero__inner">
            <p className="eyebrow">404</p>
            <SectionHeading
              as="h1"
              id="page-title"
              className="page-hero__title"
            >
              Project not found
            </SectionHeading>
            <p className="page-hero__lead">
              The project you requested does not exist or may have moved.
            </p>
            <Button to="/projects" variant="primary" size="lg">
              <ArrowLeft size={18} aria-hidden="true" />
              Back to projects
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const { caseStudy } = project;
  const isLive = project.status === "live";

  return (
    <article>
      <header className="project-detail">
        <Container>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb__list">
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <div className="project-detail__hero">
            <div className="project-detail__intro">
              <p className="eyebrow">{project.category}</p>
              <SectionHeading
                as="h1"
                id="project-title"
                className="project-detail__title"
              >
                {project.title}
              </SectionHeading>
              <p className="project-detail__lead">{project.description}</p>

              <div className="project-detail__actions">
                {project.url ? (
                  <Button
                    href={project.url}
                    external
                    variant="primary"
                    size="lg"
                  >
                    {project.ctaLabel}
                    <ArrowUpRight size={18} aria-hidden="true" />
                    <span className="visually-hidden">
                      {" "}
                      (opens in a new tab)
                    </span>
                  </Button>
                ) : (
                  <Button href="#workflow" variant="primary" size="lg">
                    View workflow
                    <ArrowRight size={18} aria-hidden="true" />
                  </Button>
                )}

                <Button to="/projects" variant="secondary" size="lg">
                  <ArrowLeft size={18} aria-hidden="true" />
                  All projects
                </Button>
              </div>
            </div>

            <aside className="project-facts" aria-labelledby="facts-title">
              <h2 className="project-facts__title" id="facts-title">
                Project facts
              </h2>
              <dl className="project-facts__list">
                <div className="project-facts__row">
                  <dt>Category</dt>
                  <dd>{project.category}</dd>
                </div>
                <div className="project-facts__row">
                  <dt>Format</dt>
                  <dd>
                    {isLive ? "Live website" : "Automation workflow"}
                  </dd>
                </div>
                {caseStudy.technologies.length > 0 ? (
                  <div className="project-facts__row">
                    <dt>Platforms</dt>
                    <dd>{caseStudy.technologies.join(", ")}</dd>
                  </div>
                ) : null}
                <div className="project-facts__row">
                  <dt>Status</dt>
                  <dd className="project-facts__status">
                    <span
                      className={`status-dot status-dot--${project.status}`}
                      aria-hidden="true"
                    />
                    {isLive ? "Live" : "Documented workflow"}
                  </dd>
                </div>
              </dl>

              {project.url ? (
                <a
                  className="project-facts__link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit the live project
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="visually-hidden">
                    {" "}
                    (opens in a new tab)
                  </span>
                </a>
              ) : null}
            </aside>
          </div>
        </Container>
      </header>

      <div className="project-media">
        <Container>
          {caseStudy.screenshots.map((screenshot) => (
            <figure className="project-shot" key={screenshot.src}>
              <img
                className="project-shot__image"
                src={screenshot.src}
                alt={screenshot.alt}
                width={screenshot.width}
                height={screenshot.height}
                loading="lazy"
                decoding="async"
              />
              {screenshot.caption ? (
                <figcaption className="project-shot__caption">
                  {screenshot.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </Container>
      </div>

      <div className="project-body">
        <Container>
          <div className="case-study">
            <section
              className="case-block"
              aria-labelledby="overview-title"
            >
              <h2 id="overview-title">Overview</h2>
              {caseStudy.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section
              className="case-block"
              aria-labelledby="objective-title"
            >
              <h2 id="objective-title">Project objective</h2>
              <p>{caseStudy.objective}</p>
            </section>

            <section className="case-block" aria-labelledby="problem-title">
              <h2 id="problem-title">The problem addressed</h2>
              <p>{caseStudy.problem}</p>
            </section>

            <section className="case-block" aria-labelledby="solution-title">
              <h2 id="solution-title">Solution and implementation</h2>
              <ul className="case-points">
                {caseStudy.solution.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="case-block" aria-labelledby="features-title">
              <h2 id="features-title">Key features</h2>
              <ul className="case-features">
                {caseStudy.features.map((feature, featureIndex) => (
                  <li className="case-feature" key={feature.title}>
                    <span className="case-feature__index" aria-hidden="true">
                      {String(featureIndex + 1).padStart(2, "0")}
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            {caseStudy.workflow ? (
              <section
                className="case-block"
                id="workflow"
                aria-labelledby="workflow-title"
              >
                <h2 id="workflow-title">Workflow steps</h2>
                <p>
                  The pipeline runs in a fixed order so every lead is handled
                  the same way and the output stays consistent.
                </p>
                <ol className="workflow-list">
                  {caseStudy.workflow.map((step, stepIndex) => (
                    <li className="workflow-step" key={step.label}>
                      <span className="workflow-step__index" aria-hidden="true">
                        {String(stepIndex + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{step.label}</h3>
                        <p>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <aside
              className="verified-note"
              aria-labelledby="verified-title"
            >
              <h2 className="verified-note__title" id="verified-title">
                What is verified
              </h2>
              <p>{caseStudy.verifiedNote}</p>
            </aside>
          </div>
        </Container>
      </div>

      <nav className="project-pager" aria-label="More projects">
        <Container className="project-pager__inner">
          <Link
            className="project-pager__item"
            to={`/projects/${previous.id}`}
            rel="prev"
          >
            <span className="project-pager__label">
              <ArrowLeft size={16} aria-hidden="true" />
              Previous project
            </span>
            <span className="project-pager__title">{previous.title}</span>
          </Link>
          <Link
            className="project-pager__item project-pager__item--next"
            to={`/projects/${next.id}`}
            rel="next"
          >
            <span className="project-pager__label">
              Next project
              <ArrowRight size={16} aria-hidden="true" />
            </span>
            <span className="project-pager__title">{next.title}</span>
          </Link>
        </Container>
      </nav>
    </article>
  );
}
