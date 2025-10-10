import React, { useState, useEffect } from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axiosInstance from "../axiosConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = getUser();

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [engagementData, setEngagementData] = useState(null);

  // Comment moderation state
  const [comments, setComments] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [commentFilter, setCommentFilter] = useState("all");
  const [selectedComments, setSelectedComments] = useState([]);

  // Activity log state
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityStats, setActivityStats] = useState(null);
  const [logSearch, setLogSearch] = useState("");
  const [logFilter, setLogFilter] = useState("");

  useEffect(() => {
    if (activeTab === "enhanced_analytics") {
      fetchEnhancedAnalytics();
    }
    if (activeTab === "comment_moderation") {
      fetchComments();
    }
    if (activeTab === "activity_log") {
      fetchActivityLogs();
    }
  }, [activeTab, commentFilter]);

  // ==================== ENHANCED ANALYTICS ====================
  const fetchEnhancedAnalytics = async () => {
    try {
      // Fetch overview
      const overviewRes = await axiosInstance.get(`/analytics?action=overview&user_id=${user.id}`);
      setAnalyticsData(overviewRes.data.data);

      // Fetch top posts
      const topPostsRes = await axiosInstance.get(`/analytics?action=top_posts&user_id=${user.id}&limit=5`);
      setTopPosts(topPostsRes.data.data);

      // Fetch engagement
      const engagementRes = await axiosInstance.get(`/analytics?action=engagement&user_id=${user.id}`);
      setEngagementData(engagementRes.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // ==================== COMMENT MODERATION ====================
  const fetchComments = async () => {
    try {
      const status = commentFilter === "all" ? null : commentFilter;
      const url = status 
        ? `/comments?status=${status}&user_id=${user.id}` 
        : `/comments?user_id=${user.id}`;
      
      const res = await axiosInstance.get(url);
      setComments(res.data.data || []);
      setCommentCounts(res.data.counts || {});
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const moderateComment = async (commentId, action) => {
    try {
      await axiosInstance.post(`/comments?action=${action}`, {
        id: commentId,
        user_id: user.id
      });
      fetchComments();
    } catch (error) {
      console.error("Error moderating comment:", error);
    }
  };

  const bulkModerateComments = async (action) => {
    if (selectedComments.length === 0) {
      alert("Please select comments first");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedComments.length} comment(s)?`)) {
      return;
    }

    try {
      await axiosInstance.post(`/comments?bulk_action=${action}`, {
        ids: selectedComments,
        user_id: user.id
      });
      setSelectedComments([]);
      fetchComments();
    } catch (error) {
      console.error("Error bulk moderating:", error);
    }
  };

  const toggleCommentSelection = (commentId) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const selectAllComments = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map(c => c.id));
    }
  };

  // ==================== ACTIVITY LOG ====================
  const fetchActivityLogs = async () => {
    try {
      const params = new URLSearchParams({
        user_id: user.id,
        limit: 50,
        ...(logSearch && { search: logSearch }),
        ...(logFilter && { action_filter: logFilter })
      });

      const res = await axiosInstance.get(`/activity?${params}`);
      setActivityLogs(res.data.data || []);

      // Fetch stats
      const statsRes = await axiosInstance.get(`/activity?action=stats&user_id=${user.id}`);
      setActivityStats(statsRes.data.data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const exportLogs = () => {
    window.open(`${axiosInstance.defaults.baseURL}activity?action=export&user_id=${user.id}`, '_blank');
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      'create': 'success',
      'update': 'primary',
      'delete': 'danger',
      'login': 'info',
      'logout': 'secondary'
    };
    return colors[action] || 'secondary';
  };

  // ==================== RENDER ====================
  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-speedometer2 display-5 text-primary me-3"></i>
        <div>
          <h1 className="display-5 mb-1">Enhanced Admin Dashboard</h1>
          <p className="lead text-muted mb-0">
            Welcome, <span className="fw-bold text-primary">{user?.username || "Admin"}</span>!
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`} 
            onClick={() => setActiveTab("overview")}
          >
            <i className="bi bi-house-door me-2"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "enhanced_analytics" ? "active" : ""}`} 
            onClick={() => setActiveTab("enhanced_analytics")}
          >
            <i className="bi bi-graph-up me-2"></i>Enhanced Analytics
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "comment_moderation" ? "active" : ""}`} 
            onClick={() => setActiveTab("comment_moderation")}
          >
            <i className="bi bi-chat-square-text me-2"></i>Comment Moderation
            {commentCounts.pending > 0 && (
              <span className="badge bg-warning ms-2">{commentCounts.pending}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "activity_log" ? "active" : ""}`} 
            onClick={() => setActiveTab("activity_log")}
          >
            <i className="bi bi-clock-history me-2"></i>Activity Log
          </button>
        </li>
      </ul>

      {/* ==================== OVERVIEW TAB ==================== */}
      {activeTab === "overview" && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-primary">
              <div className="card-body text-center">
                <i className="bi bi-graph-up display-4 text-primary mb-3"></i>
                <h5 className="card-title">Enhanced Analytics</h5>
                <p className="card-text">
                  View detailed insights, top posts, engagement metrics, and user growth.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setActiveTab("enhanced_analytics")}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-warning">
              <div className="card-body text-center">
                <i className="bi bi-chat-square-text display-4 text-warning mb-3"></i>
                <h5 className="card-title">Comment Moderation</h5>
                <p className="card-text">
                  Approve, reject, or mark comments as spam. Bulk actions available.
                </p>
                {commentCounts.pending > 0 && (
                  <div className="alert alert-warning mb-3">
                    <strong>{commentCounts.pending}</strong> pending comment(s)
                  </div>
                )}
                <button 
                  className="btn btn-warning" 
                  onClick={() => setActiveTab("comment_moderation")}
                >
                  Moderate Comments
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-info">
              <div className="card-body text-center">
                <i className="bi bi-clock-history display-4 text-info mb-3"></i>
                <h5 className="card-title">Activity Log</h5>
                <p className="card-text">
                  Track all admin actions, search logs, and export to CSV.
                </p>
                <button 
                  className="btn btn-info" 
                  onClick={() => setActiveTab("activity_log")}
                >
                  View Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ENHANCED ANALYTICS TAB ==================== */}
      {activeTab === "enhanced_analytics" && (
        <div>
          <h3 className="mb-4">
            <i className="bi bi-graph-up me-2"></i>Enhanced Analytics Dashboard
          </h3>

          {analyticsData && (
            <>
              {/* Key Metrics */}
              <div className="row g-3 mb-4">
                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Total Posts</h6>
                      <h2 className="text-primary">{analyticsData.totals.posts}</h2>
                      <small className="text-success">
                        +{analyticsData.recent.posts} this week
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Total Views</h6>
                      <h2 className="text-info">{analyticsData.totals.views}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Total Likes</h6>
                      <h2 className="text-danger">{analyticsData.totals.likes}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Comments</h6>
                      <h2 className="text-warning">{analyticsData.totals.comments}</h2>
                      <small className="text-success">
                        +{analyticsData.recent.comments} this week
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Projects</h6>
                      <h2 className="text-success">{analyticsData.totals.projects}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Users</h6>
                      <h2 className="text-secondary">{analyticsData.totals.users}</h2>
                      <small className="text-success">
                        +{analyticsData.recent.users} this week
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Posts */}
              <div className="card shadow-sm mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-trophy me-2"></i>Top Performing Posts
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th className="text-center">Views</th>
                          <th className="text-center">Likes</th>
                          <th className="text-center">Comments</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPosts.map(post => (
                          <tr key={post.id}>
                            <td>{post.title}</td>
                            <td className="text-center">
                              <span className="badge bg-info">{post.views}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-danger">{post.likes}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning">{post.comments}</span>
                            </td>
                            <td>{new Date(post.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Engagement Chart */}
              {engagementData && (
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-activity me-2"></i>Engagement Over Time (Last 30 Days)
                    </h5>
                  </div>
                  <div className="card-body">
                    <Line
                      data={{
                        labels: engagementData.comments.map(d => new Date(d.date).toLocaleDateString()),
                        datasets: [
                          {
                            label: 'Comments',
                            data: engagementData.comments.map(d => d.count),
                            borderColor: 'rgb(255, 193, 7)',
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                          },
                          {
                            label: 'Likes',
                            data: engagementData.likes.map(d => d.count),
                            borderColor: 'rgb(220, 53, 69)',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ==================== COMMENT MODERATION TAB ==================== */}
      {activeTab === "comment_moderation" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>
              <i className="bi bi-chat-square-text me-2"></i>Comment Moderation
            </h3>
            {selectedComments.length > 0 && (
              <div className="btn-group">
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => bulkModerateComments('approve')}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Approve ({selectedComments.length})
                </button>
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => bulkModerateComments('spam')}
                >
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Spam ({selectedComments.length})
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => bulkModerateComments('delete')}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete ({selectedComments.length})
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="btn-group mb-4" role="group">
            <button
              className={`btn ${commentFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCommentFilter("all")}
            >
              All ({commentCounts.all || 0})
            </button>
            <button
              className={`btn ${commentFilter === "approved" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setCommentFilter("approved")}
            >
              Approved ({commentCounts.approved || 0})
            </button>
            <button
              className={`btn ${commentFilter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setCommentFilter("pending")}
            >
              Pending ({commentCounts.pending || 0})
            </button>
            <button
              className={`btn ${commentFilter === "spam" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setCommentFilter("spam")}
            >
              Spam ({commentCounts.spam || 0})
            </button>
          </div>

          {/* Comments List */}
          <div className="card shadow-sm">
            <div className="card-body">
              {comments.length === 0 ? (
                <div className="alert alert-info">
                  No comments found in this category.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{width: '40px'}}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedComments.length === comments.length && comments.length > 0}
                            onChange={selectAllComments}
                          />
                        </th>
                        <th>Comment</th>
                        <th>Post</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map(comment => (
                        <tr key={comment.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedComments.includes(comment.id)}
                              onChange={() => toggleCommentSelection(comment.id)}
                            />
                          </td>
                          <td>
                            <div style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                              {comment.comment}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">{comment.post_title}</small>
                          </td>
                          <td>{comment.username}</td>
                          <td>
                            <span className={`badge bg-${
                              comment.status === 'approved' ? 'success' :
                              comment.status === 'pending' ? 'warning' : 'danger'
                            }`}>
                              {comment.status}
                            </span>
                          </td>
                          <td>
                            <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {comment.status !== 'approved' && (
                                <button
                                  className="btn btn-success"
                                  onClick={() => moderateComment(comment.id, 'approve')}
                                  title="Approve"
                                >
                                  <i className="bi bi-check"></i>
                                </button>
                              )}
                              {comment.status !== 'spam' && (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => moderateComment(comment.id, 'spam')}
                                  title="Mark as Spam"
                                >
                                  <i className="bi bi-exclamation-triangle"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (window.confirm('Delete this comment?')) {
                                    axiosInstance.delete(`/comments?id=${comment.id}`)
                                      .then(() => fetchComments());
                                  }
                                }}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== ACTIVITY LOG TAB ==================== */}
      {activeTab === "activity_log" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>
              <i className="bi bi-clock-history me-2"></i>Activity Log
            </h3>
            <button className="btn btn-primary" onClick={exportLogs}>
              <i className="bi bi-download me-2"></i>Export to CSV
            </button>
          </div>

          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchActivityLogs()}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={fetchActivityLogs}>
                <i className="bi bi-search me-2"></i>Search
              </button>
            </div>
          </div>

          {/* Activity Stats */}
          {activityStats && (
            <div className="row g-3 mb-4">
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h6 className="mb-0">Activity by Action Type</h6>
                  </div>
                  <div className="card-body">
                    <Bar
                      data={{
                        labels: activityStats.by_action.map(a => a.action),
                        datasets: [{
                          label: 'Count',
                          data: activityStats.by_action.map(a => a.count),
                          backgroundColor: 'rgba(13, 110, 253, 0.5)',
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h6 className="mb-0">Last 7 Days</h6>
                  </div>
                  <div className="card-body">
                    <Line
                      data={{
                        labels: activityStats.daily.map(d => new Date(d.date).toLocaleDateString()),
                        datasets: [{
                          label: 'Activities',
                          data: activityStats.daily.map(d => d.count),
                          borderColor: 'rgb(13, 110, 253)',
                          backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Details</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No activity logs found
                        </td>
                      </tr>
                    ) : (
                      activityLogs.map(log => (
                        <tr key={log.id}>
                          <td>
                            <small>{new Date(log.created_at).toLocaleString()}</small>
                          </td>
                          <td>{log.username || 'System'}</td>
                          <td>
                            <span className={`badge bg-${getActionBadgeColor(log.action)}`}>
                              {log.action}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {log.entity_type} #{log.entity_id}
                            </small>
                          </td>
                          <td>
                            <small>{log.details}</small>
                          </td>
                          <td>
                            <small className="text-muted">{log.ip_address}</small>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
