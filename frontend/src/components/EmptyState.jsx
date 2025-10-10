import React from "react";

export default function EmptyState({ message }) {
  return (
    <div className="text-center py-5 text-muted">
      <p>{message || "No data available."}</p>
    </div>
  );
}
