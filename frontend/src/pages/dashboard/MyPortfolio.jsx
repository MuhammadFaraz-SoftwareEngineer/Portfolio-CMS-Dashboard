import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import skillService from "../../services/skill.service";
import projectService from "../../services/project.service";
import FieldError from "../../components/FieldError";
import api from "../../services/api";
import "./MyPortfolio.css";
import "../../components/FormField.css";

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

function TypingRoles({ roles }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const current = roles[roleIndex % roles.length];
    let timeout;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, roles]);

  if (!roles.length) return null;

  return (
    <div className="mp-role">
      {displayed}
      <span className="mp-cursor" />
    </div>
  );
}

export default function MyPortfolio() {
  const { user } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const [skillGroups, setSkillGroups] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    skillService
      .getSkills()
      .then((skills) => {
        const grouped = {};
        skills.forEach((s) => {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s);
        });
        setSkillGroups(Object.entries(grouped).map(([category, items]) => ({ category, skills: items })));
      })
      .finally(() => setLoadingSkills(false));
  }, [refreshKey]);

  useEffect(() => {
    projectService.getProjects({}).then((all) => {
      setCategories([...new Set(all.map((p) => p.category))]);
    });
  }, [refreshKey]);

  useEffect(() => {
    setLoadingProjects(true);
    const timeout = setTimeout(() => {
      projectService
        .getProjects({ search, category: filterCategory })
        .then(setProjects)
        .finally(() => setLoadingProjects(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, filterCategory, refreshKey]);

  if (!user) return null;

  const roles = (user.roles || []).filter(Boolean);
  const [firstName, ...restName] = (user.name || "").split(" ");
  const lastName = restName.join(" ");
  const email = user.facts?.find((f) => f.label.toLowerCase() === "email")?.value;
  const github = user.socials?.github;
  const linkedin = user.socials?.linkedin;

  const contactLinks = [];
  if (email) {
    contactLinks.push({
      icon: <EmailIcon />,
      label: "Email",
      value: email,
      href: `https://mail.google.com/mail/?view=cm&to=${email}`,
    });
  }

  const ensureAbsolute = (url) =>
  url && !url.startsWith("http") ? `https://${url}` : url;

  if (linkedin) {
    contactLinks.push({
      icon: <LinkedInIcon />,
      label: "LinkedIn",
      value: linkedin.replace(/^https?:\/\//, ""),
      href: ensureAbsolute(linkedin),
    });
  }
  if (github) {
    contactLinks.push({
      icon: <GitHubIcon />,
      label: "GitHub",
      value: github.replace(/^https?:\/\//, ""),
      href: ensureAbsolute(github),
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleFocus = (e) => {
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please fill in this field";
    if (!form.email.trim()) errs.email = "Please fill in this field";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address";
    if (!form.subject.trim()) errs.subject = "Please fill in this field";
    if (!form.message.trim()) errs.message = "Please fill in this field";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSending(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Could not connect to server. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mp-page">
      <section className="mp-hero">
        {user.name && (
          <h1 className="mp-name">
            {firstName} <span>{lastName}</span>
          </h1>
        )}
        <TypingRoles roles={roles} />
        {user.bio && <p className="mp-bio">{user.bio}</p>}
        {user.location && <p className="mp-location">{user.location}</p>}
        <button className="mp-refresh-btn" onClick={refresh}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Refresh Preview
        </button>
      </section>

      {(user.aboutParagraphs?.length > 0 || user.facts?.length > 0) && (
        <section className="mp-section">
          <p className="section-label">Who I Am</p>
          <h2 className="mp-section-title">About Me</h2>
          <div className="section-divider" />

          <div className="mp-about-grid">
            {user.aboutParagraphs?.length > 0 && (
              <div className="mp-about-text">
                {user.aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}
            {user.facts?.length > 0 && (
              <div className="mp-facts">
                {user.facts.map((f, i) => (
                  <div className="mp-fact" key={i}>
                    <h4>{f.label}</h4>
                    <p>{f.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mp-section">
        <p className="section-label">What I Work With</p>
        <h2 className="mp-section-title">Technical Skills</h2>
        <div className="section-divider" />

        {!loadingSkills && skillGroups.length === 0 && (
          <p className="mp-empty">No skills yet.</p>
        )}

        <div className="mp-skills-groups">
          {skillGroups.map((group) => (
            <div className="mp-skill-group" key={group.category}>
              <p className="mp-skill-group-title">{group.category}</p>
              <div className="mp-skill-tags">
                {group.skills.map((s) => (
                  <span className="mp-skill-tag" key={s._id}>{s.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mp-section">
        <p className="section-label">What I've Built</p>
        <h2 className="mp-section-title">Projects</h2>
        <div className="section-divider" />

        {categories.length === 0 && !loadingProjects ? (
          <p className="mp-empty">No projects yet.</p>
        ) : (
          <>
            <div className="mp-toolbar">
              <div className="mp-search">
                <SearchIcon />
                <input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="mp-filters">
                <button className={`mp-chip ${filterCategory === "All" ? "active" : ""}`} onClick={() => setFilterCategory("All")}>
                  All
                </button>
                {categories.map((cat) => (
                  <button key={cat} className={`mp-chip ${filterCategory === cat ? "active" : ""}`} onClick={() => setFilterCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {!loadingProjects && projects.length === 0 && (
              <p className="mp-empty">No projects match your search.</p>
            )}

            <div className="mp-projects-grid">
              {projects.map((p) => (
                <div className="mp-project-card" key={p._id}>
                  <div className="mp-project-header">
                    <span className="mp-project-type">{p.type || p.category}</span>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="mp-project-link">
                        <GitHubIcon />
                      </a>
                    )}
                  </div>
                  <h3 className="mp-project-title">{p.title}</h3>
                  <p className="mp-project-desc">{p.description}</p>
                  <div className="mp-project-tech">
                    {p.tech?.map((t, i) => <span key={i} className="mp-tech-tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mp-section mp-contact-section">
        <p className="section-label">Let's Talk</p>
        <h2 className="mp-section-title">Get In Touch</h2>
        <div className="section-divider" />

        <div className="mp-contact-grid">
          <div className="mp-contact-info">
            <p>
              I'm actively looking for a Software Engineering Internship and open to
              freelance collaborations. Whether you have a project in mind, a role to
              discuss, or just want to connect — my inbox is always open.
            </p>

            <div className="mp-contact-links">
              {contactLinks.length === 0 ? (
                <p className="mp-empty">Add your email in Profile to show contact info here.</p>
              ) : (
                contactLinks.map((item, i) => (
                  <a
                    key={i}
                    className="mp-contact-link-item"
                    href={item.href}
                    target={item.href.startsWith("mailto") ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                  >
                    <span className="mp-icon">{item.icon}</span>
                    <div>
                      <div className="mp-contact-label">{item.label}</div>
                      <div className="mp-contact-value">{item.value}</div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          <form className="mp-contact-form" onSubmit={handleSubmit} noValidate>
            <div className="mp-form-row">
              <div className="form-group">
                <label htmlFor="mp-name">Name</label>
                <input
                  id="mp-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={errors.name ? "field-error" : ""}
                />
                <FieldError message={errors.name} />
              </div>
              <div className="form-group">
                <label htmlFor="mp-email">Email</label>
                <input
                  id="mp-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={errors.email ? "field-error" : ""}
                />
                <FieldError message={errors.email} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mp-subject">Subject</label>
              <input
                id="mp-subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
                onFocus={handleFocus}
                className={errors.subject ? "field-error" : ""}
              />
              <FieldError message={errors.subject} />
            </div>

            <div className="form-group">
              <label htmlFor="mp-message">Message</label>
              <textarea
                id="mp-message"
                name="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                className={errors.message ? "field-error" : ""}
              />
              <FieldError message={errors.message} />
            </div>

            {serverMessage && <p className="auth-server-error">{serverMessage}</p>}

            {submitted ? (
              <div className="mp-form-success">
                ✅ Message sent! I'll get back to you soon.
              </div>
            ) : (
              <button type="submit" className="form-submit" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
                {!sending && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                )}
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
