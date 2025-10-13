import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../axiosConfig"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await axiosInstance.post("/auth/register", { 
        username, 
        email, 
        password,
        remember_me: rememberMe
      })
      
      if (response.data.status === 'success') {
        setSuccess(response.data.message || "Registration successful!")
        setShowWelcomePopup(true)
        
        // Auto-redirect after showing welcome message
        setTimeout(() => {
          window.location.href = '/blog'
        }, 3000)
      } else {
        setError(response.data.message || "Registration failed.")
      }
    } catch (err) {
      if (err.response?.data?.message) {
        if (typeof err.response.data.message === 'string') {
          setError(err.response.data.message)
        } else if (typeof err.response.data.message === 'object') {
          const errors = Object.entries(err.response.data.message)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ')
          setError(errors)
        }
      } else if (err.response?.data) {
        const errorData = err.response.data
        if (typeof errorData === 'object' && !errorData.status) {
          const errors = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ')
          setError(errors || "Registration failed.")
        } else {
          setError("Registration failed.")
        }
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="card shadow-lg"
          >
            <div className="card-body p-5">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="text-center mb-4"
              >
                <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
                <h2 className="mt-3">Join Our Community</h2>
                <p className="text-muted">Create your account and start your journey</p>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="alert alert-danger"
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="alert alert-success"
                  >
                    <i className="bi bi-check-circle me-2"></i>{success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submit}>
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Username
                  </label>
                  <input 
                    className="form-control form-control-lg"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>Email
                  </label>
                  <input 
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="form-label">
                    <i className="bi bi-key me-2"></i>Password
                  </label>
                  <input 
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      <i className="bi bi-check-circle me-2"></i>Remember me
                    </label>
                  </div>
                </motion.div>

                <motion.button
                  className="btn btn-primary btn-lg w-100"
                  type="submit"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>Create Account
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-muted">Already have an account? </span>
                <motion.a
                  href="/login"
                  className="btn btn-link"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login here
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-4 shadow-lg p-5 text-center mx-3"
              style={{ maxWidth: '500px' }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fs-1 mb-4"
              >
                🎉
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-3"
              >
                Welcome to the Community!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted mb-4"
              >
                Thank you for joining us! Your account has been created successfully. We're excited to have you as part of our community.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="d-flex justify-content-center gap-3"
              >
                <motion.button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/blog'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-journal-text me-2"></i>Explore Blog
                </motion.button>
                <motion.button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowWelcomePopup(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-x-lg me-2"></i>Close
                </motion.button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="small text-muted mt-3"
              >
                Redirecting to blog in 3 seconds...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
