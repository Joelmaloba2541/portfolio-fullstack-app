import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  const skills = {
    languages: ['Django', 'Flask', 'PHP', 'React', 'Vue.js', 'JavaScript', 'C', 'C++', 'Python', 'Node.js'],
    databases: ['MySQL', 'PostgreSQL', 'MongoDB'],
    tools: ['Docker', 'Git', 'GitHub']
  };

  const renderSkillIcon = (category) => {
    switch(category) {
      case 'languages': return 'bi-code-slash';
      case 'databases': return 'bi-database';
      case 'tools': return 'bi-tools';
      default: return 'bi-check-circle';
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: "bi-github",
      url: "https://github.com/joelmaloba",
      color: "text-dark"
    },
    {
      name: "LinkedIn",
      icon: "bi-linkedin",
      url: "https://linkedin.com/in/joelmaloba",
      color: "text-primary"
    },
    {
      name: "Twitter",
      icon: "bi-twitter-x",
      url: "https://twitter.com/joelmaloba",
      color: "text-dark"
    }
  ];

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-8 mb-4">
          <h1 className="display-5 mb-4">👨‍💻 About Me</h1>
          <div className="lead mb-4">
            I'm Wanjala Joel Maloba Wangila, a dedicated Full-Stack Developer from Nairobi, Kenya, 
            with a passion for crafting robust, efficient, and scalable software.
          </div>
          <p className="mb-4">
            My journey into programming began with curiosity about how technology shapes everyday life. 
            Over time, that curiosity evolved into a drive to create intuitive and impactful digital products.
          </p>
          <p className="mb-4">
            I specialize in both frontend and backend development, with a strong focus on performance, 
            security, and user experience. From API design to UI components, I enjoy the entire development 
            cycle — especially solving challenging problems and continuously learning new technologies.
          </p>
          
          <div className="d-flex gap-3 mb-4">
            {socialLinks.map(link => (
              <a key={link.name} 
                 href={link.url}
                 className={`btn btn-lg btn-outline-secondary ${link.color}`}
                 target="_blank"
                 rel="noopener noreferrer">
                <i className={`bi ${link.icon} me-2`}></i>
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Specialty</h3>
              <p className="mb-4">
                Full-Stack Development — from REST APIs and backend logic to responsive frontend interfaces.
              </p>
              <h4 className="h6 mb-3">Quick Facts</h4>
              <ul className="list-unstyled">
                <li className="mb-2">🌍 Based in Nairobi, Kenya</li>
                <li className="mb-2">💼 Full-Stack Developer</li>
                <li className="mb-2">🚀 Available for Projects</li>
                <li>🤝 Open to Collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 mb-4">
          <h2 className="h3 mb-4">Tech Stack</h2>
        </div>
        {Object.entries(skills).map(([category, items]) => (
          <div className="col-md-6 col-lg-4" key={category}>
            <div className="card h-100">
              <div className="card-body">
                <h3 className="h5 mb-3 text-capitalize">
                  {category === 'languages' ? 'Languages & Frameworks' : category}
                </h3>
                <div className="d-flex flex-wrap gap-2">
                  {items.map(skill => (
                    <span key={skill} className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill px-3 py-2">
                      <i className={`bi ${
                        category === 'languages' ? 'bi-code-slash' :
                        category === 'databases' ? 'bi-database' :
                        'bi-tools'
                      } me-2`}></i>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <p className="h5 mb-4">Interested in working together?</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            <i className="bi bi-envelope-paper me-2"></i>
            Let's Discuss Your Project
          </Link>
        </div>
      </div>
    </div>
  );
}
