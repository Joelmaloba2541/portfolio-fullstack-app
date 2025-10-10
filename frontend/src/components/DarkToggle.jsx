import React, { useState, useEffect } from "react";

export default function DarkToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="btn btn-link nav-link d-flex align-items-center gap-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <>
          <i className="bi bi-sun-fill"></i>
          <span className="d-none d-md-inline">Light Mode</span>
        </>
      ) : (
        <>
          <i className="bi bi-moon-fill"></i>
          <span className="d-none d-md-inline">Dark Mode</span>
        </>
      )}
    </button>
  );
}
