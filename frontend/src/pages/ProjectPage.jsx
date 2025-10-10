import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/projects");
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-5 mb-3">My Projects</h1>
          <p className="lead text-muted">
            Explore my portfolio of web development projects
          </p>
        </div>
      </div>

      <div className="row g-4">
        {projects.length > 0 ? projects.map((project) => (
          <div key={project.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              {project.image && (
                <img 
                  src={project.image} 
                  className="card-img-top" 
                  alt={project.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text text-muted flex-grow-1">{project.description}</p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="badge bg-secondary me-2 mb-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {project.link && (
                  <a 
                    href={project.link} 
                    className="btn btn-primary btn-sm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    View Project
                  </a>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              No projects available yet. Check back soon!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
