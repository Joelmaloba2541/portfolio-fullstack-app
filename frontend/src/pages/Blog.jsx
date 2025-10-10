import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchPosts();
    if (user) {
      checkUserLikes();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/posts");
      const apiPosts = Array.isArray(res.data?.data) ? res.data.data : [];
      setPosts(apiPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserLikes = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      const apiPosts = Array.isArray(res.data?.data) ? res.data.data : [];
      const liked = new Set();
      
      for (const post of apiPosts) {
        try {
          const likeRes = await axiosInstance.get(`/posts?action=check_like&post_id=${post.id}&user_id=${user.id}`);
          if (likeRes.data.liked) {
            liked.add(post.id);
          }
        } catch (err) {
          console.error(`Error checking like for post ${post.id}:`, err);
        }
      }
      
      setLikedPosts(liked);
    } catch (err) {
      console.error("Error checking user likes:", err);
    }
  };

  const handleLike = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please log in to like posts.");
      navigate("/login");
      return;
    }
    
    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        await axiosInstance.delete(`/posts?action=like&post_id=${postId}&user_id=${user.id}`);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setPosts(prevPosts => prevPosts.map(p => 
          p.id === postId ? { ...p, likes: Math.max(0, (p.likes || 0) - 1) } : p
        ));
      } else {
        await axiosInstance.post("/posts?action=like", { post_id: postId, user_id: user.id });
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(prevPosts => prevPosts.map(p => 
          p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        ));
      }
    } catch (err) {
      console.error("Failed to like/unlike:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  const categories = Array.from(
    new Set(
      (Array.isArray(posts) ? posts : [])
        .map(p => p.category)
        .filter(c => c)
    )
  );

  const filteredPosts = (Array.isArray(posts) ? posts : []).filter(p => {
    if (q && !(`${p.title} ${p.content} ${p.excerpt}`.toLowerCase()).includes(q.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Blog</h2>
        </div>
        
        <div className="mb-3">
          <input 
            className="form-control" 
            placeholder="Search posts..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
          />
        </div>
        
        {categories.length > 0 && (
          <div className="mb-4">
            <strong>Categories:</strong>
            {categories.map(c => (
              <button 
                key={c} 
                className={`btn btn-sm ${category === c ? 'btn-secondary' : 'btn-outline-secondary'} ms-2 mb-2`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
            <button 
              className={`btn btn-sm ${!category ? 'btn-dark' : 'btn-outline-dark'} ms-2 mb-2`}
              onClick={() => setCategory("")}
            >
              All
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="alert alert-info">
            {posts.length === 0 
              ? "No blog posts yet. Check back soon!" 
              : "No posts match your search criteria."}
          </div>
        ) : (
          filteredPosts.map(post => (
            <article key={post.id} className="mb-4 card p-4 shadow-sm">
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="card-img-top mb-3" 
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              )}
              <h4>{post.title}</h4>
              <p className="text-muted">
                by {post.author_name || `User ${post.author_id}`} • {new Date(post.created_at).toLocaleDateString()}
                {post.category && <span className="badge bg-secondary ms-2">{post.category}</span>}
              </p>
              <div className="mb-3">
                {post.excerpt || (post.content ? post.content.slice(0, 200) + "..." : "")}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <button 
                    className={`btn btn-sm ${likedPosts.has(post.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={(e) => handleLike(post.id, e)}
                    title={likedPosts.has(post.id) ? "Unlike" : "Like"}
                  >
                    <i className={`bi bi-heart${likedPosts.has(post.id) ? '-fill' : ''} me-1`}></i>
                    {post.likes || 0}
                  </button>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-chat-fill me-1"></i>
                    {post.comments?.length || 0}
                  </Link>
                </div>
                <Link to={`/blog/${post.id}`} className="btn btn-sm btn-primary">
                  <i className="bi bi-book-open me-1"></i>Read More
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
