import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('/projects');
      const projectsData = Array.isArray(res.data?.data) ? res.data.data : [];
      // Ensure tags is always an array
      const normalizedProjects = projectsData.map(project => ({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags : []
      }));
      setProjects(normalizedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-5 mb-3">My Projects</h1>
          <p className="lead text-muted">
            Here are some selected works that showcase my development skills and experience.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {projects.length > 0 ? projects.map(project => (
          <div key={project.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              {project.image && (
                <img src={project.image} className="card-img-top" alt={project.title} style={{ height: '200px', objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <h3 className="h5 card-title mb-3">{project.title}</h3>
                <p className="card-text text-muted mb-3">{project.description}</p>
                <div className="mb-3">
                  {(project.tags || []).map(tag => (
                    <span key={tag} className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis me-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <div className="d-flex gap-2">
                    <a href={project.link} 
                       className="btn btn-primary flex-grow-1" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="bi bi-eye me-2"></i>Live Demo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center">
            <p>No projects available yet.</p>
          </div>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <p className="mb-4">Interested in working together?</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            🚀 Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
