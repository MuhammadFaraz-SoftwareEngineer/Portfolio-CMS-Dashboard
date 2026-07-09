import { useEffect, useState } from "react";
import skillService from "../../services/skill.service";
import "./SkillsManager.css";
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
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const EMPTY_NEW = { name: "", category: "" };

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newSkill, setNewSkill] = useState(EMPTY_NEW);
  const [newSkillError, setNewSkillError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", category: "" });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await skillService.getSkills();
      setSkills(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const handleAdd = async (e) => {
    e.preventDefault();
    setNewSkillError("");

    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      setNewSkillError("Please fill in this field");
      return;
    }

    setAdding(true);
    try {
      await skillService.createSkill({ name: newSkill.name.trim(), category: newSkill.category.trim() });
      setNewSkill(EMPTY_NEW);
      await loadSkills();
    } catch (err) {
      setNewSkillError(err.response?.data?.message || "Could not add skill.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill._id);
    setEditForm({ name: skill.name, category: skill.category });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", category: "" });
  };

  const saveEdit = async (id) => {
    if (!editForm.name.trim() || !editForm.category.trim()) return;
    setSavingId(id);
    try {
      await skillService.updateSkill(id, { name: editForm.name.trim(), category: editForm.category.trim() });
      setEditingId(null);
      await loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update skill.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await skillService.deleteSkill(id);
      await loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete skill.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="skills-manager">
      <form className="skills-add-form" onSubmit={handleAdd}>
        <div className="skills-add-row">
          <input
            placeholder="Skill name, e.g. Docker"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className={newSkillError ? "field-error" : ""}
          />
          <input
            placeholder="Category, e.g. Developer Tools"
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className={newSkillError ? "field-error" : ""}
            list="existing-categories"
          />
          <datalist id="existing-categories">
            {Object.keys(grouped).map((cat) => <option key={cat} value={cat} />)}
          </datalist>
          <button type="submit" className="skills-add-btn" disabled={adding}>
            <PlusIcon /> {adding ? "Adding..." : "Add Skill"}
          </button>
        </div>
        <FieldError message={newSkillError} />
      </form>

      {error && <p className="skills-error">{error}</p>}

      {loading ? (
        <p className="skills-empty">Loading skills...</p>
      ) : skills.length === 0 ? (
        <p className="skills-empty">No skills yet. Add your first one above.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div className="skills-category-block" key={category}>
            <p className="skills-category-title">{category}</p>
            <table className="skills-table">
              <tbody>
                {items.map((skill) => (
                  <tr key={skill._id}>
                    {editingId === skill._id ? (
                      <>
                        <td>
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="skills-inline-input"
                          />
                        </td>
                        <td>
                          <input
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="skills-inline-input"
                          />
                        </td>
                        <td className="skills-actions">
                          <button
                            className="skills-icon-btn skills-icon-confirm"
                            onClick={() => saveEdit(skill._id)}
                            disabled={savingId === skill._id}
                            aria-label="Save"
                          >
                            <CheckIcon />
                          </button>
                          <button className="skills-icon-btn" onClick={cancelEdit} aria-label="Cancel">
                            <XIcon />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="skills-name-cell">{skill.name}</td>
                        <td className="skills-category-cell">{skill.category}</td>
                        <td className="skills-actions">
                          <button className="skills-icon-btn" onClick={() => startEdit(skill)} aria-label="Edit">
                            <EditIcon />
                          </button>
                          <button
                            className="skills-icon-btn skills-icon-danger"
                            onClick={() => handleDelete(skill._id)}
                            disabled={deletingId === skill._id}
                            aria-label="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
