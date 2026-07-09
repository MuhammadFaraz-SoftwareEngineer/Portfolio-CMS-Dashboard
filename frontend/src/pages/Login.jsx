import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { validateLogin, mapServerErrors } from "../utils/validators";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const clientErrors = validateLogin(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && apiErrors.length > 0) {
        setErrors(mapServerErrors(apiErrors));
      } else {
        setServerMessage(err.response?.data?.message || "Could not log in. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow" />

      <div className="auth-card">
        <p className="section-label">Welcome Back</p>
        <h1 className="auth-title">
          Sign In to <span>Dashboard</span>
        </h1>
        <div className="section-divider" />

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {serverMessage && <p className="auth-server-error">{serverMessage}</p>}

          <button type="submit" className="form-submit auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Register your account</Link>
        </p>
      </div>
    </section>
  );
}
