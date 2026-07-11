import { useEffect, useState } from "react";
import api from "../services/api";
import "./PublicPortfolio.css";

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

function TypingRoles({ roles }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const current = roles[index % roles.length];
    let t;
    if (!deleting && displayed.length < current.length)
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 70);
    else if (!deleting && displayed.length === current.length)
      t = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, index, roles]);

  if (!roles.length) return null;
  return (
    <div className="pub-role">
      {displayed}<span className="pub-cursor" />
    </div>
  );
}

function Navbar({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()
    : "MFK";

  const links = ["home", "about", "skills", "projects", "contact"];

  return (
    <>
      <nav className={`pub-nav ${scrolled ? "scrolled" : ""}`}>
        <button className="pub-nav-logo" onClick={() => scrollTo("home")}>{initials}<span>.</span></button>
        <ul className="pub-nav-links">
          {links.map((l) => (
            <li key={l}>
              <button onClick={() => scrollTo(l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</button>
            </li>
          ))}
        </ul>
        <button className="pub-nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={open ? "open" : ""}/><span className={open ? "open" : ""}/><span className={open ? "open" : ""}/>
        </button>
      </nav>
      {open && (
        <div className="pub-nav-mobile">
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</button>
          ))}
        </div>
      )}
    </>
  );
}

export default function PublicPortfolio() {
  const [profile, setProfile] = useState(null);
  const [skillGroups, setSkillGroups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    api.get("/users/public-profile")
      .then((r) => setProfile(r.data.user))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));

    api.get("/skills/public")
      .then((r) => setSkillGroups(r.data.skillGroups || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.get("/projects/public")
      .then((r) => {
        const all = r.data.projects || [];
        setAllProjects(all);
        setProjects(all);
        setCategories([...new Set(all.map((p) => p.category))]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let filtered = allProjects;
    if (filterCat !== "All") filtered = filtered.filter((p) => p.category === filterCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech?.some((t) => t.toLowerCase().includes(q))
      );
    }
    setProjects(filtered);
  }, [search, filterCat, allProjects]);

  if (loadingProfile) {
    return (
      <div className="pub-loading">
        <div className="pub-loading-dot" /><div className="pub-loading-dot" /><div className="pub-loading-dot" />
      </div>
    );
  }

  if (!profile?.name) {
    return (
      <div className="pub-empty-state">
        <div className="pub-empty-card">
          <h2>Portfolio Coming Soon</h2>
          <p>This portfolio is being set up. Check back soon.</p>
        </div>
      </div>
    );
  }

  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  const roles = (profile.roles || []).filter(Boolean);
  const email = profile.facts?.find((f) => f.label.toLowerCase() === "email")?.value;
  const github = profile.socials?.github;
  const linkedin = profile.socials?.linkedin;

  const contactLinks = [];
  if (email) contactLinks.push({ icon: <EmailIcon />, label: "Email", value: email, href: `mailto:${email}` });
  if (linkedin) contactLinks.push({ icon: <LinkedInIcon />, label: "LinkedIn", value: linkedin.replace(/^https?:\/\//, ""), href: linkedin });
  if (github) contactLinks.push({ icon: <GitHubIcon />, label: "GitHub", value: github.replace(/^https?:\/\//, ""), href: github });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: undefined });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please fill in this field";
    if (!form.email.trim()) errs.email = "Please fill in this field";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email";
    if (!form.subject.trim()) errs.subject = "Please fill in this field";
    if (!form.message.trim()) errs.message = "Please fill in this field";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError("");
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSending(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSendError(err.response?.data?.message || "Could not send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar name={profile.name} />

      <main className="pub-main">
        <section className="pub-section pub-hero" id="home">
          <div className="pub-hero-bg-grid" />
          <div className="pub-hero-bg-glow" />
          <div className="pub-hero-content">
            <p className="pub-greeting">Hi there, I'm</p>
            <h1 className="pub-name">{firstName} <span>{lastName}</span></h1>
            <TypingRoles roles={roles} />
            {profile.bio && <p className="pub-bio">{profile.bio}</p>}

            <div className="pub-cta">
              <button className="pub-btn-primary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View My Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="pub-btn-outline" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get In Touch
              </button>
            </div>

            {contactLinks.length > 0 && (
              <div className="pub-socials">
                {contactLinks.map((item, i) => (
                  <a key={i} className="pub-social-icon" href={item.href} target={item.href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer" title={item.label}>
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {(profile.aboutParagraphs?.length > 0 || profile.facts?.length > 0) && (
          <section className="pub-section" id="about">
            <p className="pub-section-label">Who I Am</p>
            <h2 className="pub-section-title">About <span>Me</span></h2>
            <div className="pub-divider" />
            <div className="pub-about-grid">
              {profile.aboutParagraphs?.length > 0 && (
                <div className="pub-about-text">
                  {profile.aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                  <button className="pub-btn-primary" style={{ marginTop: "28px" }} onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                    Let's Connect
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              )}
              {profile.facts?.length > 0 && (
                <div className="pub-facts">
                  {profile.facts.map((f, i) => (
                    <div className="pub-fact" key={i}>
                      <h4>{f.label}</h4>
                      <p>{f.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {skillGroups.length > 0 && (
          <section className="pub-section pub-section-alt" id="skills">
            <p className="pub-section-label">What I Work With</p>
            <h2 className="pub-section-title">Technical <span>Skills</span></h2>
            <div className="pub-divider" />
            <div className="pub-skills-grid">
              {skillGroups.map((group) => (
                <div className="pub-skill-group" key={group.category}>
                  <p className="pub-skill-category">{group.category}</p>
                  <div className="pub-skill-tags">
                    {group.skills.map((s) => <span key={s._id} className="pub-skill-tag">{s.name}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {allProjects.length > 0 && (
          <section className="pub-section" id="projects">
            <p className="pub-section-label">What I've Built</p>
            <h2 className="pub-section-title">Academic <span>Projects</span></h2>
            <div className="pub-divider" />

            <div className="pub-toolbar">
              <div className="pub-search">
                <SearchIcon />
                <input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="pub-filters">
                <button className={`pub-chip ${filterCat === "All" ? "active" : ""}`} onClick={() => setFilterCat("All")}>All</button>
                {categories.map((cat) => (
                  <button key={cat} className={`pub-chip ${filterCat === cat ? "active" : ""}`} onClick={() => setFilterCat(cat)}>{cat}</button>
                ))}
              </div>
            </div>

            {projects.length === 0 && <p className="pub-empty">No projects match your search.</p>}

            <div className="pub-projects-grid">
              {projects.map((p) => (
                <div className="pub-project-card" key={p._id}>
                  {p.image && <div className="pub-project-img"><img src={p.image} alt={p.title} /></div>}
                  <div className="pub-project-body">
                    <div className="pub-project-header">
                      <span className="pub-project-type">{p.type || p.category}</span>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="pub-project-link"><GitHubIcon /></a>
                      )}
                    </div>
                    <h3 className="pub-project-title">{p.title}</h3>
                    <p className="pub-project-desc">{p.description}</p>
                    <div className="pub-project-tech">
                      {p.tech?.map((t, i) => <span key={i} className="pub-tech-tag">{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pub-section pub-section-alt" id="contact">
          <p className="pub-section-label">Let's Talk</p>
          <h2 className="pub-section-title">Get In <span>Touch</span></h2>
          <div className="pub-divider" />

          <div className="pub-contact-grid">
            <div className="pub-contact-info">
              <p>I'm actively looking for a Software Engineering Internship and open to freelance collaborations. Whether you have a project in mind, a role to discuss, or just want to connect — my inbox is always open.</p>
              <div className="pub-contact-links">
                {contactLinks.map((item, i) => (
                  <a key={i} className="pub-contact-link-item" href={item.href} target={item.href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer">
                    <span className="pub-contact-icon">{item.icon}</span>
                    <div>
                      <div className="pub-contact-label">{item.label}</div>
                      <div className="pub-contact-value">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <form className="pub-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="pub-form-row">
                <div className="pub-form-group">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={formErrors.name ? "field-error" : ""} />
                  {formErrors.name && <p className="pub-field-error">{formErrors.name}</p>}
                </div>
                <div className="pub-form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={formErrors.email ? "field-error" : ""} />
                  {formErrors.email && <p className="pub-field-error">{formErrors.email}</p>}
                </div>
              </div>
              <div className="pub-form-group">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className={formErrors.subject ? "field-error" : ""} />
                {formErrors.subject && <p className="pub-field-error">{formErrors.subject}</p>}
              </div>
              <div className="pub-form-group">
                <label>Message</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project or opportunity..." className={formErrors.message ? "field-error" : ""} />
                {formErrors.message && <p className="pub-field-error">{formErrors.message}</p>}
              </div>
              {sendError && <p className="pub-send-error">{sendError}</p>}
              {submitted ? (
                <div className="pub-form-success">✅ Message sent! I'll get back to you soon.</div>
              ) : (
                <button type="submit" className="pub-btn-primary pub-submit" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                  {!sending && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>}
                </button>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="pub-footer">
        <p>Designed & built by <span>{profile.name}</span> · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}