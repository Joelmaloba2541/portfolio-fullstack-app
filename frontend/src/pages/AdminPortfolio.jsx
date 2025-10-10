import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", tags: "", link: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projectsData = res.data?.data || res.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch projects: " + (err.response?.data?.message || err.message));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setForm({ 
      title: project.title || "", 
      description: project.description || "", 
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : (project.tags || ""),
      link: project.link || "",
      image: project.image || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      setLoading(true);
      await axiosInstance.delete(`/projects?id=${id}`);
      setError("");
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      const projectData = {
        title: form.title,
        description: form.description,
        tags: form.tags.split(",").map(t => t.trim()).filter(t => t),
        link: form.link,
        image: form.image
      };

      if (editing) {
        await axiosInstance.put(`/projects?id=${editing}`, projectData);
      } else {
        await axiosInstance.post("/projects", projectData);
      }
      
      setEditing(null);
      setForm({ title: "", description: "", tags: "", link: "", image: "" });
      fetchProjects();
    } catch (err) {
      setError("Failed to save project: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Portfolio Management</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">{editing ? "Edit Project" : "Create New Project"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input 
                className="form-control" 
                placeholder="Project Title" 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea 
                className="form-control" 
                placeholder="Project Description" 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                required 
                rows="4"
                disabled={loading}
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags</label>
                <input 
                  className="form-control" 
                  placeholder="Comma separated: React, Node.js, MongoDB" 
                  value={form.tags} 
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Project Link</label>
                <input 
                  className="form-control" 
                  placeholder="https://example.com" 
                  value={form.link} 
                  onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input 
                className="form-control" 
                placeholder="https://example.com/project-image.jpg" 
                value={form.image} 
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                disabled={loading}
              />
              <small className="form-text text-muted">
                Project screenshot or preview image
              </small>
              {form.image && (
                <div className="mt-2">
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="img-thumbnail"
                    style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update Project" : "Create Project")}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { 
                    setEditing(null); 
                    setForm({ title: "", description: "", tags: "", link: "", image: "" }); 
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">All Projects ({projects.length})</h5>
        </div>
        <div className="card-body">
          {loading && projects.length === 0 ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="alert alert-info">
              No projects yet. Create your first project above!
            </div>
          ) : (
            <ul className="list-group">
              {projects.map(project => (
                <li key={project.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-3 flex-grow-1">
                      {project.image && (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="rounded"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{project.title}</h6>
                        <p className="mb-1 text-muted small">{project.description}</p>
                        {project.tags && project.tags.length > 0 && (
                          <div>
                            {project.tags.map(tag => (
                              <span key={tag} className="badge bg-secondary me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handleEdit(project)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(project.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
