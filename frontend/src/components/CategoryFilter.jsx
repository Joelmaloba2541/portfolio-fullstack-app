import React from "react";

export default function CategoryFilter({ posts, selected, onSelect }) {
  const categories = Array.from(new Set((Array.isArray(posts) ? posts : []).flatMap(p => p.categories || [])));
  return (
    <div className="mb-3">
      <strong>Categories:</strong>
      {categories.map(c => (
        <button key={c} className={`btn btn-sm btn-outline-secondary ms-2${selected === c ? " active" : ""}`} onClick={() => onSelect(c)}>
          {c}
        </button>
      ))}
      <button className={`btn btn-sm btn-outline-dark ms-2${!selected ? " active" : ""}`} onClick={() => onSelect("")}>All</button>
    </div>
  );
}
