import React, { useState } from "react";
import axiosInstance from "../axiosConfig";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.post("/auth/register", { username, email, password });
      if (response.data.status === 'success') {
        setSuccess(response.data.message || "Registration successful! You can now log in.");
        setUsername(""); setEmail(""); setPassword("");
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      // Handle Django validation errors (returns object with field errors)
      if (err.response?.data?.message) {
        // If there's a message field, use it
        if (typeof err.response.data.message === 'string') {
          setError(err.response.data.message);
        } else if (typeof err.response.data.message === 'object') {
          // Format validation errors
          const errors = Object.entries(err.response.data.message)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          setError(errors);
        }
      } else if (err.response?.data) {
        // Handle direct validation error object
        const errorData = err.response.data;
        if (typeof errorData === 'object' && !errorData.status) {
          const errors = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          setError(errors || "Registration failed.");
        } else {
          setError("Registration failed.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container py-5">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary">Register</button>
      </form>
      <div className="mt-3 text-center">
        <span>Already have an account? </span>
        <a href="/login" className="btn btn-link">Login</a>
      </div>
    </div>
  );
}
