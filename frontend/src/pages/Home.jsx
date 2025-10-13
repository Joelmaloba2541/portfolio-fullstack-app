import React, { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../axiosConfig";
import ProjectCard from "../components/ProjectCard";
import ContactFormComponent from "../components/ContactFormComponent";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("");
  const [tags, setTags] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    axiosInstance
      .get("/projects") // base URL set in axiosConfig.js
      .then((res) => {
        // Django API returns data in res.data.data
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        // Normalize projects to ensure tags is always an array
        const normalizedProjects = data.map((project) => ({
          ...project,
          tags: Array.isArray(project.tags) ? project.tags : [],
        }));
        setProjects(normalizedProjects);

        const allTags = Array.from(
          new Set(normalizedProjects.flatMap((p) => p.tags))
        );
        setTags(allTags);
      })
      .catch((err) => {
        console.warn("Backend API not reachable:", err);
        setProjects([]);
        setTags([]);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(var(--bs-primary-rgb), 0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Scrolling Message */}
      <motion.div
        className="bg-gradient-primary text-white py-3 mb-2 position-relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25">
          <div className="bg-white rounded-circle position-absolute" style={{ width: '100px', height: '100px', top: '-50px', left: '-50px', animation: 'float 6s ease-in-out infinite' }}></div>
          <div className="bg-white rounded-circle position-absolute" style={{ width: '60px', height: '60px', top: '20px', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
        </div>
        <div className="container text-center">
          <ReactTyped
            strings={["Full-Stack Developer", "Django • React • Node.js • Flask", "Turning ideas into reality", "Building scalable digital solutions"]}
            typeSpeed={50}
            backSpeed={30}
            loop
            className="h4 mb-0 fw-bold"
          />
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="text-center py-5 position-relative">
        <motion.div
          className="position-absolute top-0 end-0 opacity-25"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: '200px', height: '200px' }}
        >
          <div className="bg-primary rounded-circle w-100 h-100"></div>
        </motion.div>

        <div className="container position-relative z-index-1">
          <motion.div
            className="mb-4"
            variants={itemVariants}
          >
            <motion.img 
              src="/profile-logo.png" 
              alt="Joel Maloba" 
              className="rounded-circle shadow-lg mb-3"
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover',
                border: '4px solid var(--bs-primary)'
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </motion.div>
          <motion.h1 
            className="display-4 fw-bold mb-2"
            variants={itemVariants}
          >
            👋 Hi, I’m <span className="text-gradient">Wanjala Joel Maloba Wangila</span>
          </motion.h1>
          <motion.h2 
            className="h3 mb-3"
            variants={itemVariants}
          >
            💻 <span className="text-primary">Full-Stack Developer</span>
          </motion.h2>
          <motion.p 
            className="lead mb-4"
            variants={itemVariants}
          >
            Building scalable digital solutions that merge creativity with clean code.
          </motion.p>
          <motion.p 
            className="mb-5"
            variants={itemVariants}
          >
            I’m a passionate and detail-oriented Full-Stack Developer with experience designing, developing, and deploying modern web applications. I love transforming ideas into practical, elegant solutions using tools like <strong>Django</strong>, <strong>React</strong>, <strong>Node.js</strong>, and <strong>Flask</strong>. Whether it’s a dynamic frontend or a robust backend, I’m dedicated to writing efficient, maintainable, and high-performing code.
          </motion.p>
          <motion.div 
            className="d-flex justify-content-center gap-3"
            variants={itemVariants}
          >
            <motion.a 
              href="/contact" 
              className="btn btn-primary btn-lg px-4 py-3"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Let’s build something amazing together.
            </motion.a>
            <motion.a 
              href="/projects" 
              className="btn btn-outline-primary btn-lg px-4 py-3"
              whileHover={{ scale: 1.05, backgroundColor: "var(--bs-primary)", color: "white" }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-code-square me-2"></i>View My Work
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-5 bg-light"
        variants={containerVariants}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
              >
                <i className="bi bi-code-slash display-4 text-primary mb-3"></i>
                <h3 className="h2 fw-bold text-primary">50+</h3>
                <p className="text-muted">Projects Completed</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
              >
                <i className="bi bi-people display-4 text-success mb-3"></i>
                <h3 className="h2 fw-bold text-success">100+</h3>
                <p className="text-muted">Happy Clients</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
              >
                <i className="bi bi-clock-history display-4 text-info mb-3"></i>
                <h3 className="h2 fw-bold text-info">5+</h3>
                <p className="text-muted">Years Experience</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
              >
                <i className="bi bi-award display-4 text-warning mb-3"></i>
                <h3 className="h2 fw-bold text-warning">24/7</h3>
                <p className="text-muted">Support Available</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <section id="projects" className="container py-5">
        <motion.h2 
          className="text-center mb-5"
          variants={itemVariants}
        >
          🚀 <span className="text-primary">Featured Projects</span>
        </motion.h2>
        
        {/* Search */}
        <motion.div 
          className="mb-4"
          variants={itemVariants}
        >
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control form-control-lg"
              placeholder="Search projects by name or technology..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setFilter("")}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </motion.div>

        {/* Tags Filter */}
        <motion.div 
          className="mb-4"
          variants={itemVariants}
        >
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <AnimatePresence>
              {tags.map((t) => (
                <motion.button
                  key={t}
                  className={`btn ${filter === t ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  variants={tagVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter((prev) => (prev === t ? "" : t))}
                >
                  <i className="bi bi-tag me-1"></i>{t}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Project Cards */}
        <motion.div 
          className="row"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {projects
              .filter((p) => {
                if (!filter) return true
                const q = filter.toLowerCase()
                return (
                  p.title.toLowerCase().includes(q) ||
                  (p.tags || []).some((tag) => tag.toLowerCase().includes(q))
                )
              })
              .map((project, index) => (
                <motion.div 
                  key={project._id} 
                  className="col-md-4 mb-4"
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredProject(project._id)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <motion.div
                    animate={{
                      scale: hoveredProject === project._id ? 1.02 : 1,
                      boxShadow: hoveredProject === project._id 
                        ? "0 20px 40px rgba(0,0,0,0.15)" 
                        : "0 5px 15px rgba(0,0,0,0.08)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Skills Section */}
      <motion.section 
        className="py-5 bg-gradient-primary text-white"
        variants={containerVariants}
      >
        <div className="container">
          <motion.h2 
            className="text-center mb-5"
            variants={itemVariants}
          >
            🛠️ <span className="fw-bold">Technologies I Work With</span>
          </motion.h2>
          <div className="row g-4">
            {[
              { name: "React", icon: "⚛️", color: "#61DAFB" },
              { name: "Django", icon: "🐍", color: "#092E20" },
              { name: "Node.js", icon: "🟢", color: "#339933" },
              { name: "Python", icon: "🐍", color: "#3776AB" },
              { name: "JavaScript", icon: "🟨", color: "#F7DF1E" },
              { name: "PostgreSQL", icon: "🐘", color: "#336791" },
              { name: "MongoDB", icon: "🍃", color: "#47A248" },
              { name: "Docker", icon: "🐳", color: "#2496ED" }
            ].map((tech, index) => (
              <div key={tech.name} className="col-md-3 col-sm-6">
                <motion.div 
                  className="text-center p-4 rounded bg-white bg-opacity-10 backdrop-blur"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="fs-1 mb-3"
                    style={{ filter: `drop-shadow(0 0 10px ${tech.color})` }}
                  >
                    {tech.icon}
                  </div>
                  <h5 className="fw-bold">{tech.name}</h5>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="my-5 container"
        variants={containerVariants}
      >
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.h2 
              className="text-center mb-4"
              variants={itemVariants}
            >
              📬 Get In Touch
            </motion.h2>
            <motion.p 
              className="text-center text-muted mb-4"
              variants={itemVariants}
            >
              Have a project in mind? Let's discuss how we can work together.
            </motion.p>
            <motion.div 
              className="card shadow-lg"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
            >
              <div className="card-body p-5">
                <ContactFormComponent compact={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
