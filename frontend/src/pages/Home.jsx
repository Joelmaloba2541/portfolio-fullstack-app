import React, { useEffect, useMemo, useRef, useState } from "react";
import { ReactTyped } from "react-typed";
import { motion, AnimatePresence, useInView } from "framer-motion";
import axiosInstance from "../axiosConfig";
import ProjectCard from "../components/ProjectCard";
import ContactFormComponent from "../components/ContactFormComponent";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("");
  const [tags, setTags] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const marqueeRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-120px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, commentsRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/comments", {
            params: { status: "approved", limit: 6 },
          }),
        ]);

        const projectData = Array.isArray(projectsRes.data?.data)
          ? projectsRes.data.data
          : [];
        const normalizedProjects = projectData.map((project) => ({
          ...project,
          tags: Array.isArray(project.tags) ? project.tags : [],
        }));
        setProjects(normalizedProjects);
        setTags(
          Array.from(new Set(normalizedProjects.flatMap((p) => p.tags)))
        );

        const commentData = Array.isArray(commentsRes.data?.data)
          ? commentsRes.data.data
          : [];
        const formattedRecommendations = commentData.map((comment) => ({
          id: comment.id,
          name: comment.user_full_name || comment.username || "Client",
          project: comment.post_title || "Project",
          comment: comment.comment,
          rating: comment.rating || 5,
          created_at: comment.created_at,
        }));
        setRecommendations(formattedRecommendations);
      } catch (error) {
        console.warn("Failed to load homepage data:", error);
        setProjects([]);
        setTags([]);
        setRecommendations([]);
      }
    };

    fetchData();
  }, []);

  const projectStats = useMemo(() => {
    const totalProjects = projects.length;
    const featured = projects.filter((p) => p.featured).length;
    const categories = new Set(projects.map((p) => p.category).filter(Boolean));
    return {
      total: totalProjects,
      featured,
      categories: categories.size,
    };
  }, [projects]);

  const experienceYears = useMemo(() => {
    const startYear = 2021;
    return Math.max(4, new Date().getFullYear() - startYear);
  }, []);

  const handleAnchorClick = (event, selector) => {
    event.preventDefault();
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.scrollLeft = 0;
    }
  }, [recommendations]);

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
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Scrolling Message */}
      <motion.section
        className="home-marquee bg-dark text-white py-2 position-relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="home-marquee__glow"></div>
        <div className="container">
          <div className="marquee" ref={marqueeRef}>
            <div className="marquee-track">
              {[
                "Full-Stack Developer",
                "Django • React • Node.js • Flask",
                "Turning ideas into reality",
                "Building scalable digital solutions",
                "Available for remote & on-site collaborations",
              ].map((text, index) => (
                <span key={`${text}-${index}`} className="marquee-item">
                  <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

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
              href="#contact" 
              className="btn btn-primary btn-lg px-4 py-3"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(event) => handleAnchorClick(event, "#contact")}
            >
              🚀 Let’s build something amazing together.
            </motion.a>
            <motion.a 
              href="#projects" 
              className="btn btn-outline-primary btn-lg px-4 py-3"
              whileHover={{ scale: 1.05, backgroundColor: "var(--bs-primary)", color: "white" }}
              whileTap={{ scale: 0.95 }}
              onClick={(event) => handleAnchorClick(event, "#projects")}
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
        ref={statsRef}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <i className="bi bi-code-slash display-4 text-primary mb-3"></i>
                <motion.h3 
                  className="display-5 fw-bold text-primary"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {projectStats.total}
                </motion.h3>
                <p className="text-muted">Projects Completed</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <i className="bi bi-people display-4 text-success mb-3"></i>
                <motion.h3 
                  className="display-5 fw-bold text-success"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {recommendations.length}
                </motion.h3>
                <p className="text-muted">Client Recommendations</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <i className="bi bi-clock-history display-4 text-info mb-3"></i>
                <motion.h3 
                  className="display-5 fw-bold text-info"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {experienceYears}
                </motion.h3>
                <p className="text-muted">Years Experience</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div 
                className="p-4 rounded shadow-sm bg-white"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <i className="bi bi-award display-4 text-warning mb-3"></i>
                <motion.h3 
                  className="display-5 fw-bold text-warning"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {`${projectStats.categories || 1}+ Domains`}
                </motion.h3>
                <p className="text-muted">Industries Served</p>
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
            ].map((tech) => (
              <div key={tech.name} className="col-md-3 col-sm-6">
                <motion.div 
                  className="text-center p-4 rounded bg-white bg-opacity-15 backdrop-blur position-relative overflow-hidden text-dark"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.12, 0.3, 0.12] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle at top left, ${tech.color}33, transparent 60%)` }}
                  ></motion.div>
                  <div 
                    className="fs-1 mb-3 position-relative"
                    style={{ filter: `drop-shadow(0 0 10px ${tech.color})` }}
                  >
                    {tech.icon}
                  </div>
                  <h5 className="fw-bold position-relative">{tech.name}</h5>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-5 bg-light" id="testimonials">
        <div className="container">
          <motion.h2 className="text-center mb-4" variants={itemVariants}>
            💬 <span className="text-primary">Client Recommendations</span>
          </motion.h2>
          {recommendations.length === 0 ? (
            <p className="text-center text-muted">
              No testimonials yet. Let’s collaborate and add your success story!
            </p>
          ) : (
            <div className="row g-4">
              {recommendations.map((rec, index) => (
                <div className="col-md-4" key={rec.id || index}>
                  <motion.div
                    className="card border-0 shadow h-100"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: "0 18px 36px rgba(0,0,0,0.12)" }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                          <i className="bi bi-person-heart text-primary"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">{rec.name}</h6>
                          <small className="text-muted">{rec.project}</small>
                        </div>
                      </div>
                      <p className="text-muted mb-3">“{rec.comment}”</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          {[...Array(rec.rating || 5)].map((_, starIndex) => (
                            <i key={starIndex} className="bi bi-star-fill text-warning"></i>
                          ))}
                        </div>
                        <small className="text-muted">
                          {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : ""}
                        </small>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <motion.section 
        className="my-5 container"
        variants={containerVariants}
        id="contact"
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
