import { Link } from 'react-router-dom';
import useMenus from '../hooks/useMenus';

function Footer() {
  const { menus } = useMenus();
  const footerMenus = menus.footer || [];

  return (
    <footer className="footer mt-auto pt-5 bg-dark">
      <div className="container pb-5">
        <div className="row gy-4 gx-5">
          {/* About Column */}
          <div className="col-12 col-lg-4">
            <div className="pe-lg-5">
              <h5 className="h4 mb-4 text-white">Joel Maloba</h5>
              <p className="text-white-50 mb-4">
                Passionate Full-Stack Developer from Nairobi, Kenya. Specializing in modern web development
                with React, Node.js, and Django. Let's build something amazing together!
              </p>
              <div className="d-flex gap-3">
                <a href="https://github.com/Joelmaloba2541" 
                   className="btn btn-outline-light btn-sm rounded-circle" 
                   target="_blank" rel="noopener noreferrer" 
                   aria-label="GitHub Profile">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://linkedin.com/in/joelmaloba" 
                   className="btn btn-outline-light btn-sm rounded-circle" 
                   target="_blank" rel="noopener noreferrer" 
                   aria-label="LinkedIn Profile">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="mailto:malobajoel011@gmail.com" 
                   className="btn btn-outline-light btn-sm rounded-circle" 
                   target="_blank" rel="noopener noreferrer" 
                   aria-label="Email">
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="col-6 col-md-4 col-lg-2">
            <h5 className="h6 mb-3 text-white">Navigation</h5>
            <ul className="list-unstyled">
              {(footerMenus.length ? footerMenus : [
                { id: 'projects', title: 'Projects', url: '/projects', icon: 'bi bi-arrow-right' },
                { id: 'blog', title: 'Blog', url: '/blog', icon: 'bi bi-arrow-right' },
                { id: 'about', title: 'About', url: '/about', icon: 'bi bi-arrow-right' },
                { id: 'contact', title: 'Contact', url: '/contact', icon: 'bi bi-arrow-right' },
              ]).map((item) => {
                const isExternal = item.url?.startsWith('http');
                const iconClass = item.icon || 'bi bi-arrow-right';
                const content = (
                  <>
                    <i className={`${iconClass} me-2`}></i>
                    {item.title}
                  </>
                );

                return (
                  <li className="mb-2" key={item.id}>
                    {isExternal ? (
                      <a
                        href={item.url}
                        className="text-white-50 text-decoration-none hover-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link to={item.url || '#'} className="text-white-50 text-decoration-none hover-white">
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services Column */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className="h6 mb-3 text-white">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50">
                <i className="bi bi-check2-circle me-2"></i>Web Development
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-check2-circle me-2"></i>API Development
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-check2-circle me-2"></i>Database Design
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-check2-circle me-2"></i>UI/UX Implementation
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-12 col-md-4 col-lg-3">
            <h5 className="h6 mb-3 text-white">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="mailto:malobajoel011@gmail.com" 
                   className="text-white-50 text-decoration-none d-flex align-items-center hover-white">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <span>malobajoel011@gmail.com</span>
                </a>
              </li>
              <li className="mb-3">
                <a href="tel:+254742705858" 
                   className="text-white-50 text-decoration-none d-flex align-items-center hover-white">
                  <i className="bi bi-phone-fill me-2"></i>
                  <span>+254 742 705 858</span>
                </a>
              </li>
              <li>
                <span className="text-muted d-flex align-items-center">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  <span>Nairobi, Kenya</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="row mt-5 py-4 border-top border-light">
          <div className="col-12 text-center">
            <p className="mb-1 text-white fw-semibold">
              © 2025 Wanjala Joel Maloba Wangila<br />
              All rights reserved.
            </p>
            <p className="mb-2 text-white-50">
              🌍 Crafted with passion in Nairobi, Kenya.
            </p>
            <div className="d-flex justify-content-center gap-3 mb-2">
              <a href="https://github.com/Joelmaloba2541" className="text-white-50 text-decoration-none hover-white" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-github me-1"></i>GitHub
              </a>
              <span className="text-white-50">|</span>
              <a href="https://linkedin.com/in/joelmaloba" className="text-white-50 text-decoration-none hover-white" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-linkedin me-1"></i>LinkedIn
              </a>
              <span className="text-white-50">|</span>
              <a href="mailto:malobajoel011@gmail.com" className="text-white-50 text-decoration-none hover-white">
                <i className="bi bi-envelope me-1"></i>Email
              </a>
            </div>
            <blockquote className="blockquote text-white-50 mt-3 mb-0" style={{fontStyle: 'italic'}}>
              “Code is the art of turning ideas into impact.”
            </blockquote>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
