import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import BlogCard from "../components/BlogCard";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosInstance.get("/posts").then(res => {
      setPosts(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !category || (post.categories || []).includes(category);
    const matchesSearch = !search || (`${post.title} ${post.content}`.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-4">
      <h2>Blog</h2>
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter posts={posts} selected={category} onSelect={setCategory} />
      <div className="row">
        {filteredPosts.map(post => (
          <div key={post._id} className="col-md-6 mb-4">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
