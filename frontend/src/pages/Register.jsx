import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { validateRegister, mapServerErrors } from "../utils/validators";
import "./Auth.css";
import FieldError from "../components/FieldError";

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);

const DEFAULT_ROLES = [
  "MERN Stack Developer",
  "Flutter Developer",
  "Java Developer",
  "Python Developer",
  "Software Engineer",
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    title: "Software Engineering Student",
    bio: "",
    location: "",
  });
  const [roles, setRoles] = useState([...DEFAULT_ROLES]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleRoleChange = (index, value) => {
    const next = [...roles];
    next[index] = value;
    setRoles(next);
    setErrors({ ...errors, roles: undefined });
  };

  const addRole = () => setRoles([...roles, ""]);

  const removeRole = (index) => {
    if (roles.length <= 1) return;
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const cleanRoles = roles.map((r) => r.trim()).filter(Boolean);
    const clientErrors = validateRegister({ ...form, roles: cleanRoles });
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        title: form.title,
        bio: form.bio,
        location: form.location,
        roles: cleanRoles,
      });
      navigate("/dashboard");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && apiErrors.length > 0) {
        setErrors(mapServerErrors(apiErrors));
      } else {
        setServerMessage(
          err.response?.data?.message || "Could not create account. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow" />

      <div className="auth-card auth-card-wide">
        <p className="section-label">Get Started</p>
        <h1 className="auth-title">
          Create Your <span>Admin Account</span>
        </h1>
        <div className="section-divider" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-row">
            <FormField
              label="Full Name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="auth-form-row">
            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <p className="auth-section-heading">Your Portfolio Identity</p>

          <FormField
            label="Title"
            name="title"
            placeholder="e.g. Software Engineering Student"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            required={false}
          />

          <div className="form-group">
            <label>
              Rotating Roles
              <span className="required-mark">*</span>
            </label>
            <div className="auth-roles-list">
              {roles.map((role, i) => (
                <div className="auth-role-row" key={i}>
                  <input
                    value={role}
                    onChange={(e) => handleRoleChange(i, e.target.value)}
                    placeholder={`Role ${i + 1}, e.g. MERN Stack Developer`}
                  />
                  <button
                    type="button"
                    className="auth-role-remove"
                    onClick={() => removeRole(i)}
                    aria-label="Remove role"
                    disabled={roles.length <= 1}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
            <FieldError message={errors.roles} />
            <button type="button" className="auth-role-add" onClick={addRole}>
              <PlusIcon /> Add another role
            </button>
          </div>

          <FormField
            label="Location"
            name="location"
            placeholder="e.g. Karachi, Pakistan"
            value={form.location}
            onChange={handleChange}
            error={errors.location}
            required={false}
          />

          <FormField
            label="Short Bio"
            name="bio"
            as="textarea"
            rows={3}
            placeholder="A sentence or two about yourself — you can refine this later in the dashboard."
            value={form.bio}
            onChange={handleChange}
            error={errors.bio}
            required={false}
          />

          {serverMessage && <p className="auth-server-error">{serverMessage}</p>}

          <button type="submit" className="form-submit auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
