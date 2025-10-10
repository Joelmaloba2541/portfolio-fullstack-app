import React, { useState, useEffect } from "react";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", content: "", categories: "", image: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", tags: "", link: "", image: "" });
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", is_admin: false });
  const user = getUser();

  const categories = ["Technology", "Design", "Business", "Personal", "Other"];

  useEffect(() => {
    if (activeTab === "blog") fetchPosts();
    if (activeTab === "portfolio") fetchProjects();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "messages") fetchMessages();
    if (activeTab === "analytics") fetchAnalytics();
  }, [activeTab]);

  const fetchPosts = async () => {
    const res = await axiosInstance.get("/posts");
    setPosts(Array.isArray(res.data.data) ? res.data.data : []);
  };

  const fetchProjects = async () => {
    const res = await axiosInstance.get("/projects");
    setProjects(Array.isArray(res.data.data) ? res.data.data : []);
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`auth?action=users&user_id=${user.id}`);
      if (res.data.status === "success") {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([
        { id: 1, username: "admin", email: "admin@example.com", is_admin: 1 },
        { id: 2, username: "joel", email: "joel@example.com", is_admin: 0 },
        { id: 3, username: "mary", email: "mary@example.com", is_admin: 0 },
        { id: 4, username: "john", email: "john@example.com", is_admin: 0 }
      ]);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/contact');
      if (res.data.status === "success") {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const postsRes = await axiosInstance.get("/posts");
      const projectsRes = await axiosInstance.get("/projects");
      const usersRes = await axiosInstance.get(`auth?action=users&user_id=${user.id}`);
      setAnalytics({
        totalPosts: Array.isArray(postsRes.data?.data) ? postsRes.data.data.length : 0,
        totalProjects: Array.isArray(projectsRes.data?.data) ? projectsRes.data.data.length : 0,
        totalUsers: Array.isArray(usersRes.data?.users) ? usersRes.data.users.length : 0,
        totalComments: 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics({ totalPosts: 0, totalProjects: 0, totalUsers: 0, totalComments: 0 });
    }
  };

  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.status === "success") {
      if (type === "post") {
        setPostForm(f => ({ ...f, image: res.data.url }));
      } else {
        setProjectForm(f => ({ ...f, image: res.data.url }));
      }
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...postForm, categories: postForm.categories.split(","), author_id: user.id };
      console.log("Submitting post data:", data);
      if (editingPost) {
        await axiosInstance.put(`/posts?id=${editingPost}`, data);
      } else {
        await axiosInstance.post("/posts", data);
      }
      setEditingPost(null);
      setPostForm({ title: "", content: "", categories: "", image: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Error creating/updating post. Check console for details.");
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (editingProject) {
      await axiosInstance.put(`/projects?id=${editingProject}`, { ...projectForm, tags: projectForm.tags.split(",") });
    } else {
      await axiosInstance.post("/projects", { ...projectForm, tags: projectForm.tags.split(",") });
    }
    setEditingProject(null);
    setProjectForm({ title: "", description: "", tags: "", link: "", image: "" });
    fetchProjects();
  };

  const handlePostEdit = (post) => {
    setEditingPost(post.id);
    setPostForm({ title: post.title, content: post.content, categories: (post.categories || []).join(", "), image: post.image || "" });
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project.id);
    setProjectForm({ title: project.title, description: project.description, tags: (project.tags || []).join(", "), link: project.link, image: project.image || "" });
  };

  const handlePostDelete = async (id) => {
    await axiosInstance.delete(`/posts?id=${id}`);
    fetchPosts();
  };

  const handleProjectDelete = async (id) => {
    await axiosInstance.delete(`/projects?id=${id}`);
    fetchProjects();
  };

  const handleMakeAdmin = async (targetUserId) => {
    await axiosInstance.post("auth?action=make_admin", { requesting_user_id: user.id, target_user_id: targetUserId });
    fetchUsers();
  };

  const handleRevokeAdmin = async (targetUserId) => {
    await axiosInstance.post("auth?action=revoke_admin", { requesting_user_id: user.id, target_user_id: targetUserId });
    fetchUsers();
  };

  const handleDeleteUser = async (targetUserId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await axiosInstance.delete(`auth?action=delete_user&user_id=${targetUserId}&requesting_user_id=${user.id}`);
      fetchUsers();
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("auth?action=register", userForm);
    setUserForm({ username: "", email: "", password: "", is_admin: false });
    fetchUsers();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <i className="bi bi-speedometer2 display-5 text-primary me-3"></i>
          <div>
            <h1 className="display-5 mb-1">Admin Dashboard</h1>
            <p className="lead text-muted mb-0">Welcome, <span className="fw-bold text-primary">{user?.username || "Admin"}</span>! Manage your app features below.</p>
          </div>
        </div>
        <a href="/admin/enhanced" className="btn btn-lg btn-success">
          <i className="bi bi-rocket-takeoff me-2"></i>
          Enhanced Dashboard
          <span className="badge bg-warning text-dark ms-2">NEW</span>
        </a>
      </div>
      
      {/* Alert banner for Enhanced Dashboard */}
      <div className="alert alert-info alert-dismissible fade show mb-4" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-info-circle-fill me-3 fs-4"></i>
          <div className="flex-grow-1">
            <strong>New Features Available!</strong> Check out the Enhanced Dashboard with Analytics, Comment Moderation, and Activity Logs.
          </div>
          <a href="/admin/enhanced" className="btn btn-info btn-sm ms-3">
            Try Now
          </a>
        </div>
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "blog" ? "active" : ""}`} onClick={() => setActiveTab("blog")}>Blog Management</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "portfolio" ? "active" : ""}`} onClick={() => setActiveTab("portfolio")}>Portfolio Management</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>User Management</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>Messages</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>Analytics</button>
        </li>
      </ul>

      {activeTab === "overview" && (
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card shadow h-100 border-primary">
              <div className="card-body">
                <h5 className="card-title"><i className="bi bi-journal-text me-2 text-primary"></i>Blog Management</h5>
                <p className="card-text">Create, edit, and delete blog posts and comments.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("blog")}>Go to Blog Admin</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow h-100 border-success">
              <div className="card-body">
                <h5 className="card-title"><i className="bi bi-briefcase me-2 text-success"></i>Portfolio Management</h5>
                <p className="card-text">Manage portfolio projects and details.</p>
                <button className="btn btn-success btn-sm" onClick={() => setActiveTab("portfolio")}>Go to Portfolio Admin</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow h-100 border-info">
              <div className="card-body">
                <h5 className="card-title"><i className="bi bi-people me-2 text-info"></i>User Management</h5>
                <p className="card-text">View and manage registered users.</p>
                <button className="btn btn-info btn-sm" onClick={() => setActiveTab("users")}>Go to User Admin</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow h-100 border-warning">
              <div className="card-body">
                <h5 className="card-title"><i className="bi bi-bar-chart-line me-2 text-warning"></i>Analytics</h5>
                <p className="card-text">View site analytics and traffic reports.</p>
                <button className="btn btn-warning btn-sm text-white" onClick={() => setActiveTab("analytics")}>View Analytics</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "blog" && (
        <div>
          <h3>Blog Management</h3>
          <form onSubmit={handlePostSubmit} className="mb-4">
            <input className="form-control mb-2" placeholder="Title" value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} required />
            <textarea className="form-control mb-2" placeholder="Content" value={postForm.content} onChange={e => setPostForm(f => ({ ...f, content: e.target.value }))} required />
            <select className="form-control mb-2" value={postForm.categories} onChange={e => setPostForm(f => ({ ...f, categories: e.target.value }))}>
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="mb-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById('postImage').click()}>Choose Image</button>
              <input id="postImage" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files[0], 'post')} />
              {postForm.image && <span className="ms-2">{postForm.image}</span>}
            </div>
            <button className="btn btn-success">{editingPost ? "Update" : "Create"} Post</button>
            {editingPost && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingPost(null); setPostForm({ title: "", content: "", categories: "", image: "" }); }}>Cancel</button>}
          </form>
          <ul className="list-group">
            {posts.map(post => (
              <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{post.title}</span>
                <div>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handlePostEdit(post)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handlePostDelete(post.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "portfolio" && (
        <div>
          <h3>Portfolio Management</h3>
          <form onSubmit={handleProjectSubmit} className="mb-4">
            <input className="form-control mb-2" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} required />
            <textarea className="form-control mb-2" placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} required />
            <input className="form-control mb-2" placeholder="Tags (comma separated)" value={projectForm.tags} onChange={e => setProjectForm(f => ({ ...f, tags: e.target.value }))} />
            <input className="form-control mb-2" placeholder="Project Link" value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} />
            <div className="mb-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById('projectImage').click()}>Choose Image</button>
              <input id="projectImage" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files[0], 'project')} />
              {projectForm.image && <span className="ms-2">{projectForm.image}</span>}
            </div>
            <button className="btn btn-success">{editingProject ? "Update" : "Create"} Project</button>
            {editingProject && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingProject(null); setProjectForm({ title: "", description: "", tags: "", link: "", image: "" }); }}>Cancel</button>}
          </form>
          <ul className="list-group">
            {projects.map(project => (
              <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{project.title}</span>
                <div>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleProjectEdit(project)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleProjectDelete(project.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h3>User Management</h3>
          <form onSubmit={handleUserSubmit} className="mb-4">
            <input className="form-control mb-2" placeholder="Username" value={userForm.username} onChange={e => setUserForm(f => ({ ...f, username: e.target.value }))} required />
            <input className="form-control mb-2" placeholder="Email" type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} required />
            <input className="form-control mb-2" placeholder="Password" type="password" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} required />
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" id="is_admin" checked={userForm.is_admin} onChange={e => setUserForm(f => ({ ...f, is_admin: e.target.checked }))} />
              <label className="form-check-label" htmlFor="is_admin">Admin</label>
            </div>
            <button className="btn btn-success">Create User</button>
          </form>
          <ul className="list-group">
            {users.map(u => (
              <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{u.username} ({u.email})</span>
                <div>
                  {u.is_admin == 1 ? (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleRevokeAdmin(u.id)}>Revoke Admin</button>
                  ) : (
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleMakeAdmin(u.id)}>Make Admin</button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "analytics" && (
        <div>
          <h3>Analytics</h3>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card shadow h-100 border-primary">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{analytics.totalPosts}</h5>
                  <p className="card-text">Total Blog Posts</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow h-100 border-success">
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{analytics.totalProjects}</h5>
                  <p className="card-text">Total Projects</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow h-100 border-info">
                <div className="card-body text-center">
                  <h5 className="card-title text-info">{analytics.totalUsers}</h5>
                  <p className="card-text">Total Users</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow h-100 border-warning">
                <div className="card-body text-center">
                  <h5 className="card-title text-warning">{analytics.totalComments}</h5>
                  <p className="card-text">Total Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div>
          <h3>Inbox Messages</h3>
          <ul className="list-group">
            {messages.length > 0 ? messages.map(msg => (
              <li key={msg.id} className="list-group-item">
                <strong>{msg.name} ({msg.email})</strong>
                <p>{msg.message}</p>
                <small className="text-muted">{new Date(msg.created_at).toLocaleString()}</small>
              </li>
            )) : (
              <li className="list-group-item">No messages found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
