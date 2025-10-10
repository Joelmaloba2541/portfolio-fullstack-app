import React from 'react';
import ContactFormComponent from '../components/ContactFormComponent';

export default function Contact() {

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-5 mb-3">Get in Touch</h1>
            <p className="lead mb-0">
              Whether you're looking to collaborate on a project, hire a developer, or just want to connect — 
              I'd love to hear from you!
            </p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center gx-5">
        <div className="col-md-5 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h4 mb-4">Contact Information</h2>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-envelope text-primary fs-5"></i>
                </div>
                <div>
                  <h3 className="h6 mb-1">Email</h3>
                  <a href="mailto:malobajoel011@gmail.com" className="text-decoration-none d-flex align-items-center">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    <span>malobajoel011@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-phone text-primary fs-5"></i>
                </div>
                <div>
                  <h3 className="h6 mb-1">Phone</h3>
                  <a href="tel:+254742705858" className="text-decoration-none d-flex align-items-center">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <span>+254 742 705 858</span>
                  </a>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-geo-alt text-primary fs-5"></i>
                </div>
                <div>
                  <h3 className="h6 mb-1">Location</h3>
                  <p className="mb-0 d-flex align-items-center">
                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                    <span>Nairobi, Kenya</span>
                  </p>
                </div>
              </div>

              <h3 className="h5 mb-3">Connect with me</h3>
              <div className="d-flex gap-3">
                <a href="https://github.com/Joelmaloba2541" 
                   className="btn btn-outline-primary rounded-circle p-2"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="GitHub Profile">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://linkedin.com/in/joelmaloba" 
                   className="btn btn-outline-primary rounded-circle p-2"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="LinkedIn Profile">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="mailto:malobajoel011@gmail.com" 
                   className="btn btn-outline-primary rounded-circle p-2"
                   aria-label="Email Me">
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-4">Send a Message</h2>
              <ContactFormComponent />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <p className="mb-0">
            Let's connect and turn your vision into clean, functional, and scalable code.
          </p>
        </div>
      </div>
    </div>
  );
}
