import React, { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import axiosInstance from "../axiosConfig";
import ProjectCard from "../components/ProjectCard";
import ContactFormComponent from "../components/ContactFormComponent";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/projects") // base URL set in axiosConfig.js
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.projects || [];
        setProjects(data);

        const allTags = Array.from(new Set(data.flatMap((p) => p.tags || [])));
        setTags(allTags);
      })
      .catch(() => {
        console.warn("Backend API not reachable");
      });
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Scrolling Message */}
      <div className="bg-light py-2 mb-2">
        <ReactTyped
          strings={["Full-Stack Developer", "Django • React • Node.js • Flask", "Turning ideas into reality", "Building scalable digital solutions"]}
          typeSpeed={50}
          backSpeed={30}
          loop
          className="h4 text-primary"
        />
      </div>
      {/* Hero Section */}
      <section className="text-center py-5">
        <h1 className="display-4 fw-bold mb-2">👋 Hi, I’m Wanjala Joel Maloba Wangila</h1>
        <h2 className="h3 mb-3">💻 Full-Stack Developer</h2>
        <p className="lead mb-4">Building scalable digital solutions that merge creativity with clean code.</p>
        <p className="mb-5">
          I’m a passionate and detail-oriented Full-Stack Developer with experience designing, developing, and deploying modern web applications. I love transforming ideas into practical, elegant solutions using tools like Django, React, Node.js, and Flask. Whether it’s a dynamic frontend or a robust backend, I’m dedicated to writing efficient, maintainable, and high-performing code.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <a href="/contact" className="btn btn-primary btn-lg">
            🚀 Let’s build something amazing together.
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container">
        <h2>Projects</h2>
        {/* Search */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {/* Tags Filter */}
        <div className="mb-3">
          <strong>Filter by tags:</strong>
          <div className="mt-2">
            {tags.map((t) => (
              <button
                key={t}
                className="btn btn-sm btn-outline-secondary me-2 mb-2"
                onClick={() => setFilter((prev) => (prev === t ? "" : t))}
              >
                {t}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline-dark mb-2"
              onClick={() => setFilter("")}
            >
              Clear
            </button>
          </div>
        </div>
        {/* Project Cards */}
        <div className="row">
          {projects
            .filter((p) => {
              if (!filter) return true;
              const q = filter.toLowerCase();
              return (
                p.title.toLowerCase().includes(q) ||
                (p.tags || []).some((tag) => tag.toLowerCase().includes(q))
              );
            })
            .map((project) => (
              <div key={project._id} className="col-md-4 mb-4">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{ delay: 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              </div>
            ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="my-5 container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-center mb-4">Get In Touch</h2>
            <p className="text-center text-muted mb-4">
              Have a project in mind? Let's discuss how we can work together.
            </p>
            <div className="card shadow-sm">
              <div className="card-body">
                <ContactFormComponent compact={true} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
