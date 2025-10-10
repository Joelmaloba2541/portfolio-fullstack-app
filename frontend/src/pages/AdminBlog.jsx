import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: "", 
    content: "", 
    excerpt: "",
    category: "", 
    tags: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/posts");
      const postsData = res.data?.data || res.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch posts: " + (err.response?.data?.message || err.message));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditing(post.id);
    setForm({ 
      title: post.title || "", 
      content: post.content || "", 
      excerpt: post.excerpt || "",
      category: post.category || "", 
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""),
      image: post.image || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      setLoading(true);
      await axiosInstance.delete(`/posts?id=${id}`);
      setError("");
      fetchPosts();
    } catch (err) {
      setError("Failed to delete post: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      setError("You must be logged in to create or edit posts");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const postData = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        tags: form.tags.split(",").map(t => t.trim()).filter(t => t),
        image: form.image,
        author_id: user.id
      };

      if (editing) {
        await axiosInstance.put(`/posts?id=${editing}`, postData);
      } else {
        await axiosInstance.post("/posts", postData);
      }
      
      setEditing(null);
      setForm({ title: "", content: "", excerpt: "", category: "", tags: "", image: "" });
      fetchPosts();
    } catch (err) {
      setError("Failed to save post: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Blog Management</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">{editing ? "Edit Post" : "Create New Post"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input 
                className="form-control" 
                placeholder="Enter post title" 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Excerpt</label>
              <textarea 
                className="form-control" 
                placeholder="Short summary (optional)" 
                value={form.excerpt} 
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows="2"
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Content *</label>
              <textarea 
                className="form-control" 
                placeholder="Write your blog post content..." 
                value={form.content} 
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))} 
                required 
                rows="8"
                disabled={loading}
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <input 
                  className="form-control" 
                  placeholder="e.g., Technology" 
                  value={form.category} 
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags</label>
                <input 
                  className="form-control" 
                  placeholder="Comma separated: react, php, web" 
                  value={form.tags} 
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Image URL (Header Image)</label>
              <input 
                className="form-control" 
                placeholder="https://picsum.photos/800/400" 
                value={form.image} 
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                disabled={loading}
              />
              <small className="form-text text-muted">
                Featured image displayed at the top of your post. You can also paste image URLs directly in the content field.
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
                {loading ? "Saving..." : (editing ? "Update Post" : "Create Post")}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { 
                    setEditing(null); 
                    setForm({ title: "", content: "", excerpt: "", category: "", tags: "", image: "" }); 
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
          <h5 className="mb-0">All Posts ({posts.length})</h5>
        </div>
        <div className="card-body">
          {loading && posts.length === 0 ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="alert alert-info">
              No posts yet. Create your first blog post above!
            </div>
          ) : (
            <ul className="list-group">
              {posts.map(post => (
                <li key={post.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{post.title}</h6>
                      <small className="text-muted">
                        by {post.author_name || `User ${post.author_id}`} • {new Date(post.created_at).toLocaleDateString()} • {post.likes || 0} likes
                      </small>
                      {post.category && <span className="badge bg-secondary ms-2">{post.category}</span>}
                    </div>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handleEdit(post)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(post.id)}
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
