import React, { useState } from "react";
import api from "../services/api.js";

const Login = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const response = await api.post(endpoint, form);
      onAuth(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>KSA Logistics SaaS</h1>
        <p>Real-time shipment intelligence for Saudi Arabia.</p>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          {isRegister && (
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Work email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="primary-btn">
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
        <button
          type="button"
          className="link-btn"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Already have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  );
};

export default Login;
