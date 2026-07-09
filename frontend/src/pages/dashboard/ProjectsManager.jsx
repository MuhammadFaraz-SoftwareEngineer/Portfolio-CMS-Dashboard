import { useEffect, useState } from "react";
import projectService from "../../services/project.service";
import "./ProjectsManager.css";
import "../../components/FormField.css";
import FieldError from "../../components/FieldError";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  type: "",
  tech: "",
  github: "",
  liveDemo: "",
  image: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadProjects = async (opts = {}) => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(opts);
      setProjects(data);
      if (!opts.search && (!opts.category || opts.category === "All")) {
        setCategories([...new Set(data.map((p) => p.category))]);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProjects({ search, category: filterCategory });
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, filterCategory]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      type: project.type || "",
      tech: (project.tech || []).join(", "),
      github: project.github || "",
      liveDemo: project.liveDemo || "",
      image: project.image || "",
    });
    setEditingId(project._id);
    setShowForm(true);
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Please fill in this field";
    if (!form.description.trim()) errs.description = "Please fill in this field";
    if (!form.category.trim()) errs.category = "Please fill in this field";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      type: form.type.trim(),
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      github: form.github.trim(),
      liveDemo: form.liveDemo.trim(),
      image: form.image,
    };

    setSaving(true);
    try {
      if (editingId) {
        await projectService.updateProject(editingId, payload);
      } else {
        await projectService.createProject(payload);
      }
      resetForm();
      await loadProjects({ search, category: filterCategory });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        const mapped = {};
        apiErrors.forEach((e) => (mapped[e.field] = e.message));
        setFormErrors(mapped);
      } else {
        setError(err.response?.data?.message || "Could not save project.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await projectService.deleteProject(id);
      await loadProjects({ search, category: filterCategory });
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="projects-manager">
      <div className="pm-toolbar">
        <div className="pm-search">
          <SearchIcon />
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pm-filters">
          <button
            className={`filter-chip ${filterCategory === "All" ? "active" : ""}`}
            onClick={() => setFilterCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${filterCategory === cat ? "active" : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button className="pm-add-btn" onClick={openAddForm}>
          <PlusIcon /> Add Project
        </button>
      </div>

      {showForm && (
        <form className="pm-form" onSubmit={handleSubmit} noValidate>
          <p className="pm-form-title">{editingId ? "Edit Project" : "Add New Project"}</p>

          <div className="form-row">
            <div className="form-group">
              <label>Title<span className="required-mark">*</span></label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={formErrors.title ? "field-error" : ""}
                placeholder="e.g. Shop Smart"
              />
              <FieldError message={formErrors.title} />
            </div>
            <div className="form-group">
              <label>Category<span className="required-mark">*</span></label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={formErrors.category ? "field-error" : ""}
                placeholder="e.g. Mobile, Full Stack"
                list="pm-existing-categories"
              />
              <datalist id="pm-existing-categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
              <FieldError message={formErrors.category} />
            </div>
          </div>

          <div className="form-group">
            <label>Description<span className="required-mark">*</span></label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={formErrors.description ? "field-error" : ""}
              placeholder="What does this project do, and what did you build it with?"
            />
            <FieldError message={formErrors.description} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type label</label>
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="e.g. Full Stack · MERN"
              />
            </div>
            <div className="form-group">
              <label>Tech stack (comma separated)</label>
              <input
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub link</label>
              <input
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                placeholder="https://github.com/..."
                className={formErrors.github ? "field-error" : ""}
              />
              <FieldError message={formErrors.github} />
            </div>
            <div className="form-group">
              <label>Live demo link</label>
              <input
                value={form.liveDemo}
                onChange={(e) => setForm({ ...form, liveDemo: e.target.value })}
                placeholder="https://..."
                className={formErrors.liveDemo ? "field-error" : ""}
              />
              <FieldError message={formErrors.liveDemo} />
            </div>
          </div>
          <div className="form-group">
            <label>Project Image (optional)</label>
              {form.image && (
                <div className="pm-image-preview">
                  <img src={form.image} alt="Project preview" />
                    <button
                      type="button"
                      className="pm-image-remove"
                      onClick={() => setForm({ ...form, image: "" })}
                    >
                      Remove
                    </button>
                </div>
              )}
              {!form.image && (
                <label className="pm-image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) {
                      alert("Image must be under 2MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setForm({ ...form, image: reader.result });
                    reader.readAsDataURL(file);
                    }}
                  />
                  Click to upload image (max 2MB)
                </label>
              )}
          </div>
          <div className="pm-form-actions">
            <button type="button" className="pm-cancel-btn" onClick={resetForm}>Cancel</button>
            <button type="submit" className="form-submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="pm-error">{error}</p>}

      {loading ? (
        <p className="pm-empty">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="pm-empty">No projects match. Try a different search or add a new one.</p>
      ) : (
        <div className="pm-grid">
          {projects.map((project) => (
            <div className="pm-card" key={project._id}>
              <div className="pm-card-header">
                <span className="pm-card-category">{project.category}</span>
                <div className="pm-card-actions">
                  <button className="pm-icon-btn" onClick={() => openEditForm(project)} aria-label="Edit">
                    <EditIcon />
                  </button>
                  <button
                    className="pm-icon-btn pm-icon-danger"
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    aria-label="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
              <h3 className="pm-card-title">{project.title}</h3>
              <p className="pm-card-desc">{project.description}</p>
              <div className="pm-card-tech">
                {project.tech?.map((t, i) => <span key={i} className="tech-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}