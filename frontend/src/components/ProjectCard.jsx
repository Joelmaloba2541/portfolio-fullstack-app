import React from "react";
export default function ProjectCard({ project }) {
  return (
    <div className="card h-100">
      {project.image && <img src={project.image} className="card-img-top" alt={project.title} />}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">{project.description}</p>
        <div className="mt-auto">
          {(project.tags||[]).map(t => <span key={t} className="badge bg-secondary me-1">{t}</span>)}
          {project.link && <a href={project.link} className="btn btn-sm btn-outline-primary float-end" target="_blank" rel="noreferrer">View</a>}
        </div>
      </div>
    </div>
  );
}
