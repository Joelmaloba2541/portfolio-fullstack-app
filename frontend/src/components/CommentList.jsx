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

export default function CommentList({ postId, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/comments?postId=${postId}`);
      const fetchedComments = Array.isArray(res.data.data) ? res.data.data : [];
      // Filter to show only approved comments for regular users
      const filteredComments = user?.is_admin 
        ? fetchedComments 
        : fetchedComments.filter(c => c.status === 'approved');
      setComments(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, refreshTrigger]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    
    try {
      await axiosInstance.delete(`/comments?id=${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h5 className="mb-3">
        <i className="bi bi-chat-left-text me-2"></i>
        Comments ({comments.length})
      </h5>
      
      {comments.length === 0 ? (
        <div className="alert alert-light">
          <i className="bi bi-chat-dots me-2"></i>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <strong className="d-block">{c.username || `User ${c.user_id}`}</strong>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(c.created_at).toLocaleString()}
                      </small>
                      {c.status && c.status !== 'approved' && (
                        <span className={`badge ms-2 bg-${c.status === 'pending' ? 'warning' : 'danger'}`}>
                          {c.status}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {(user?.is_admin || user?.id === c.user_id) && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c.id)}
                      title="Delete comment"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                
                <p className="mb-0 ms-5" style={{ whiteSpace: 'pre-wrap' }}>
                  {c.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
