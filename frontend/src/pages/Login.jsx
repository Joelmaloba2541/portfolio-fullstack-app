import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password
      });
      
      if (response.data.status === 'success') {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.user.is_admin) {
          nav("/admin/dashboard");
        } else {
          nav("/");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Login</h3>
        <form onSubmit={login}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
        <div className="mt-3 text-center">
          <span>Don't have an account? </span>
          <a href="/register" className="btn btn-link">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
