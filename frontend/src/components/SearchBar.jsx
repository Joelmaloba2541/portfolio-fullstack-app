import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-3">
      <input
        className="form-control"
        placeholder="Search posts..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
