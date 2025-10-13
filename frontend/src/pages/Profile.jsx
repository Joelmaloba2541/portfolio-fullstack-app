import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../axiosConfig"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0 })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null")
    if (userData) {
      setUser(userData)
      setEditForm({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || "",
        website: userData.website || "",
        location: userData.location || ""
      })
      fetchUserStats(userData.id)
    }
    setIsLoading(false)
  }, [])

  const fetchUserStats = async (userId) => {
    try {
      const [postsRes, commentsRes, likesRes] = await Promise.all([
        axiosInstance.get(`/posts/?user_id=${userId}`),
        axiosInstance.get(`/comments/?user_id=${userId}`),
        axiosInstance.get(`/posts/likes/?user_id=${userId}`)
      ])

      setStats({
        posts: postsRes.data?.data?.length || 0,
        comments: commentsRes.data?.data?.length || 0,
        likes: likesRes.data?.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(`/auth/user`, editForm)
      if (response.data.status === 'success') {
        const updatedUser = { ...user, ...editForm }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsEditing(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setEditForm({
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      website: user.website || "",
      location: user.location || ""
    })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <i className="bi bi-person-x display-1 text-muted mb-4"></i>
          <h3>Please login to view your profile</h3>
          <a href="/login" className="btn btn-primary mt-3">
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show"
              style={{ zIndex: 9999 }}
            >
              <i className="bi bi-check-circle me-2"></i>
              Profile updated successfully!
              <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="row">
          {/* Profile Card */}
          <div className="col-lg-4 mb-4">
            <motion.div
              className="card shadow-lg"
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card-body text-center p-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '100px', height: '100px' }}>
                    <i className="bi bi-person-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </motion.div>

                <h3 className="card-title mb-2">{user.username}</h3>
                <p className="text-muted mb-3">{user.email}</p>

                {/* User Stats */}
                <div className="row text-center g-3 mb-4">
                  <div className="col-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded bg-light"
                    >
                      <div className="fw-bold text-primary">{stats.posts}</div>
                      <small className="text-muted">Posts</small>
                    </motion.div>
                  </div>
                  <div className="col-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded bg-light"
                    >
                      <div className="fw-bold text-success">{stats.comments}</div>
                      <small className="text-muted">Comments</small>
                    </motion.div>
                  </div>
                  <div className="col-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded bg-light"
                    >
                      <div className="fw-bold text-warning">{stats.likes}</div>
                      <small className="text-muted">Likes</small>
                    </motion.div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  {!isEditing ? (
                    <>
                      <motion.button
                        className="btn btn-primary"
                        onClick={handleEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-pencil me-2"></i>Edit Profile
                      </motion.button>
                      <motion.button
                        className="btn btn-outline-secondary"
                        onClick={() => window.location.href = '/dashboard'}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-speedometer2 me-2"></i>My Dashboard
                      </motion.button>
                    </>
                  ) : (
                    <div className="d-flex gap-2">
                      <motion.button
                        className="btn btn-success"
                        onClick={handleSave}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-check-lg me-1"></i>Save
                      </motion.button>
                      <motion.button
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-x-lg me-1"></i>Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="col-lg-8">
            <motion.div
              className="card shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-person-gear me-2"></i>
                  Profile Information
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-person me-2"></i>Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">{user.username}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-envelope me-2"></i>Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">{user.email}</p>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">
                      <i className="bi bi-card-text me-2"></i>Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about yourself..."
                        value={editForm.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">
                        {user.bio || "No bio added yet. Click edit to add one!"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-globe me-2"></i>Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://yourwebsite.com"
                        value={editForm.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                          </a>
                        ) : (
                          "No website added yet."
                        )}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-geo-alt me-2"></i>Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your location"
                        value={editForm.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">
                        {user.location || "No location added yet."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-info-circle me-2"></i>Account Information
                  </h6>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <small className="text-muted d-block">Member Since</small>
                      <span className="fw-semibold">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted d-block">Account Type</small>
                      <span className={`badge ${user.is_admin ? 'bg-success' : 'bg-primary'}`}>
                        {user.is_admin ? 'Administrator' : 'Regular User'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
