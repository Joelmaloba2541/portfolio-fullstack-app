import React from "react";
import PropTypes from "prop-types";

export default function BlogCard({ post }) {
  const { title = "Untitled", excerpt = "No excerpt available", id = "", image = "", likes = 0, comments = [] } = post || {};
  return (
    <article className="card p-3 mb-3" aria-label={title}>
      {image && <img src={image} alt={title} className="card-img-top" />}
      <header>
        <h4>{title}</h4>
      </header>
      <section>
        <p>{excerpt}</p>
      </section>
      <footer>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-heart me-1"></i>{likes} Likes
            <i className="bi bi-chat me-1 ms-3"></i>{comments.length} Comments
          </div>
          <a href={`/blog/${id}`} className="btn btn-sm btn-primary">Read More</a>
        </div>
      </footer>
    </article>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    excerpt: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.array,
  }),
};

BlogCard.defaultProps = {
  post: {
    title: "Untitled",
    excerpt: "No excerpt available",
    id: "",
    image: "",
    likes: 0,
    comments: [],
  },
};
