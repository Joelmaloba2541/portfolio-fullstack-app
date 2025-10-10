import React, { useState } from 'react';
import axiosInstance from "../axiosConfig";

export default function ContactFormComponent({ compact = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    try {
      const response = await axiosInstance.post("/contact", formData);
      
      if (response.data.status === 'success') {
        setStatus("success");
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      {status === 'success' && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Message sent successfully!</strong> I'll get back to you soon.
          <button type="button" className="btn-close" onClick={() => setStatus('')}></button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Failed to send message.</strong> Please try again or email me directly.
          <button type="button" className="btn-close" onClick={() => setStatus('')}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Your Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {!compact && (
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Subject <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              name="subject"
              placeholder="Project Inquiry"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="message" className="form-label">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows={compact ? "4" : "5"}
            placeholder="Tell me about your project..."
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Sending...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
