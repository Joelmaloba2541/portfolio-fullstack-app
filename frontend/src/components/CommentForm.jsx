import React, { useState } from "react";
import { Link } from "react-router-dom";
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

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const user = getUser();

  const submit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please log in to comment.");
      return;
    }

    if (content.trim().length < 3) {
      setError("Comment must be at least 3 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axiosInstance.post("/comments", { 
        postId, 
        user_id: user.id, 
        comment: content.trim() 
      });
      
      setContent("");
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
      // Trigger refresh in parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card mt-4 bg-light">
        <div className="card-body text-center">
          <i className="bi bi-lock-fill text-muted fs-3 mb-2"></i>
          <p className="mb-3">You must be logged in to comment.</p>
          <Link to="/login" className="btn btn-primary">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Log In
          </Link>
          <span className="mx-2">or</span>
          <Link to="/register" className="btn btn-outline-primary">
            <i className="bi bi-person-plus me-2"></i>
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h6 className="card-title mb-3">
          <i className="bi bi-pencil-square me-2"></i>
          Leave a Comment
        </h6>

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Comment posted successfully!
            <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Your Comment
            </label>
            <textarea 
              id="comment"
              className="form-control" 
              placeholder="Share your thoughts..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              rows="4"
              required 
              disabled={loading}
              maxLength="1000"
            />
            <div className="form-text">
              {content.length}/1000 characters
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Posting as <strong>{user.username}</strong>
            </small>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || content.trim().length < 3}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Posting...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
