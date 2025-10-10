import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Helper to detect if content contains HTML
function isHTML(str) {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
}

// Helper to convert URLs in text to clickable image tags
function convertImageURLsToTags(text) {
  if (!text) return text;
  
  // Match image URLs (ending in common image extensions)
  const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi;
  
  return text.replace(imageUrlRegex, (url) => {
    return `\n\n<img src="${url}" alt="Blog image" />\n\n`;
  });
}

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [refreshComments, setRefreshComments] = useState(0);
  const user = getUser();

  useEffect(() => {
    fetchPost();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchPostSilently();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/posts?id=${id}`);
      const p = res.data.data;
      setPost(p);
      setLikeCount(p.likes || 0);
      setCommentCount(p.comments?.length || 0);
      
      if (user) {
        // Check if user has liked this post
        checkUserLike();
      }
      setError("");
    } catch (err) {
      setError("Failed to load post: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch post data without showing loading spinner
  const fetchPostSilently = async () => {
    try {
      const res = await axiosInstance.get(`/posts?id=${id}`);
      const p = res.data.data;
      setLikeCount(p.likes || 0);
      setCommentCount(p.comments?.length || 0);
    } catch (err) {
      console.error("Error refreshing post data:", err);
    }
  };

  const checkUserLike = async () => {
    try {
      const res = await axiosInstance.get(`/posts?action=check_like&post_id=${id}&user_id=${user.id}`);
      setLiked(res.data.liked || false);
    } catch (err) {
      console.error("Error checking like status:", err);
      setLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like this post.");
      navigate("/login");
      return;
    }
    
    try {
      if (liked) {
        await axiosInstance.delete(`/posts?action=like&post_id=${post.id}&user_id=${user.id}`);
        setLikeCount(prev => Math.max(0, prev - 1));
        setLiked(false);
      } else {
        await axiosInstance.post("/posts?action=like", { post_id: post.id, user_id: user.id });
        setLikeCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Failed to like/unlike:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleCommentAdded = () => {
    setRefreshComments(prev => prev + 1);
    setCommentCount(prev => prev + 1);
    fetchPostSilently();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/posts?id=${id}`);
      alert("Post deleted successfully!");
      navigate("/blog");
    } catch (err) {
      alert("Failed to delete post: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Post not found</div>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const isAdmin = user && user.is_admin;
  const isAuthor = user && post.author_id === user.id;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <Link to="/blog" className="btn btn-sm btn-outline-secondary mb-3">
            <i className="bi bi-arrow-left"></i> Back to Blog
          </Link>
          
          <article className="card p-4 shadow-sm">
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title} 
                className="img-fluid mb-4 rounded" 
                style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
              />
            )}
            
            <h1 className="mb-3">{post.title}</h1>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-muted mb-0">
                by {post.author_name || `User ${post.author_id}`} • {new Date(post.created_at).toLocaleDateString()}
                {post.category && <span className="badge bg-secondary ms-2">{post.category}</span>}
              </p>
              
              {(isAdmin || isAuthor) && (
                <div className="btn-group">
                  <Link to={`/admin/blog`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mb-3">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-light text-dark me-2">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div 
              className="post-content mb-4" 
              style={{ 
                whiteSpace: isHTML(post.content) ? 'normal' : 'pre-wrap',
                lineHeight: '1.8',
                fontSize: '1.05rem'
              }}
            >
              {isHTML(post.content) ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: convertImageURLsToTags(post.content) }} />
              )}
            </div>
            
            <style>{`
              .post-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 20px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .post-content a {
                color: #0d6efd;
                text-decoration: underline;
              }
              .post-content p {
                margin-bottom: 1rem;
              }
              .post-content h1, .post-content h2, .post-content h3 {
                margin-top: 1.5rem;
                margin-bottom: 1rem;
              }
            `}</style>
            
            <div className="border-top pt-3 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-3">
                  <button 
                    className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'}`} 
                    onClick={handleLike}
                    title={liked ? "Unlike this post" : "Like this post"}
                  >
                    <i className={`bi bi-heart${liked ? '-fill' : ''} me-2`}></i>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                  </button>
                  
                  <div className="btn btn-outline-primary" style={{ cursor: 'default' }}>
                    <i className="bi bi-chat-left-text me-2"></i>
                    {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                  </div>
                </div>
                
                {likeCount > 0 && (
                  <small className="text-muted">
                    <i className="bi bi-people-fill me-1"></i>
                    {likeCount} {likeCount === 1 ? 'person likes' : 'people like'} this
                  </small>
                )}
              </div>
            </div>
          </article>

          <hr className="my-4" />
          
          <div className="comments-section">
            <CommentList postId={post.id} refreshTrigger={refreshComments} />
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}
