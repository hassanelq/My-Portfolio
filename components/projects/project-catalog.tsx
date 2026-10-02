"use client";
import { useState } from "react";
import { ArrowUpRight, CodeXml, FileText } from "lucide-react";
import { projects, categories, type ProjectCategory } from "@/content/projects";
import { ProjectMark } from "./project-mark";
export function ProjectCatalog() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const filtered = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );
  return (
    <>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects"
      >
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            aria-pressed={filter === category.id}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
            <span>
              {projects
                .filter(
                  (p) => category.id === "all" || p.category === category.id,
                )
                .length.toString()
                .padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} projects shown
      </p>
      <div className="project-catalog">
        {filtered.map((project) => (
          <article key={project.id} id={project.id} className="project-entry">
            <div className="project-entry-index mono">
              {(projects.indexOf(project) + 1).toString().padStart(2, "0")}
              <span>{project.year}</span>
            </div>
            <div className="project-entry-main">
              <p className="eyebrow">{project.label}</p>
              <h2>{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <ul className="project-highlights">
                {project.highlights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <div className="stack-tags">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <CodeXml size={15} /> GitHub repository{" "}
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="muted">Private client project</span>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live demo <ArrowUpRight size={14} />
                  </a>
                )}
                {project.reportUrl && (
                  <a href={project.reportUrl} target="_blank" rel="noreferrer">
                    <FileText size={14} /> Research report
                  </a>
                )}
              </div>
            </div>
            <div className="project-entry-visual">
              <ProjectMark variant={projects.indexOf(project)} />
              {project.metric && (
                <div className="project-metric">
                  <span>{project.metric.value}</span>
                  <small>{project.metric.label}</small>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
