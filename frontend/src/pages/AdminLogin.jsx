import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/auth?action=login", {
        username: identifier,
        password,
      });
      const { user } = res.data;
      if (!user.is_admin) {
        setError("You must be an admin to access this page.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(user));
      nav("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-6">
        <h3>Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={login}>
          <div className="mb-2">
            <input
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div className="mb-2">
            <input
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              required
            />
          </div>
          <button className="btn btn-primary">Login as Admin</button>
        </form>
      </div>
    </div>
  );
}
