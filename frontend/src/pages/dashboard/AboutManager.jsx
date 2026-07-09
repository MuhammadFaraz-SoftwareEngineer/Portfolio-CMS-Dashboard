import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profile.service";
import "./ProfileManagerAndAboutManager.css";
import "../../components/FormField.css";

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function AboutManager() {
  const { user, setUser } = useAuth();

  const [bio, setBio] = useState("");
  const [aboutParagraphs, setAboutParagraphs] = useState([""]);
  const [facts, setFacts] = useState([{ label: "", value: "" }]);

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!user) return;
    setBio(user.bio || "");
    setAboutParagraphs(user.aboutParagraphs?.length ? user.aboutParagraphs : [""]);
    setFacts(user.facts?.length ? user.facts : [{ label: "", value: "" }]);
  }, [user]);

  const handleParagraphChange = (i, value) => {
    const next = [...aboutParagraphs];
    next[i] = value;
    setAboutParagraphs(next);
  };
  const addParagraph = () => setAboutParagraphs([...aboutParagraphs, ""]);
  const removeParagraph = (i) =>
    aboutParagraphs.length > 1 && setAboutParagraphs(aboutParagraphs.filter((_, idx) => idx !== i));

  const handleFactChange = (i, key, value) => {
    const next = [...facts];
    next[i] = { ...next[i], [key]: value };
    setFacts(next);
  };
  const addFact = () => setFacts([...facts, { label: "", value: "" }]);
  const removeFact = (i) => facts.length > 1 && setFacts(facts.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedMessage("");
    setServerError("");

    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        bio: bio.trim(),
        aboutParagraphs: aboutParagraphs.map((p) => p.trim()).filter(Boolean),
        facts: facts.filter((f) => f.label.trim() && f.value.trim()),
      });
      setUser(updated);
      setSavedMessage("About section updated successfully.");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not update About section.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-manager">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Short Bio (shown on your homepage intro)</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A one or two sentence summary of who you are."
          />
        </div>

        <div className="form-group">
          <label>About Paragraphs</label>
          <div className="profile-dynamic-list">
            {aboutParagraphs.map((p, i) => (
              <div className="profile-dynamic-row" key={i}>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => handleParagraphChange(i, e.target.value)}
                  placeholder={`Paragraph ${i + 1}`}
                />
                <button type="button" className="profile-remove-row" onClick={() => removeParagraph(i)} disabled={aboutParagraphs.length <= 1}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="profile-add-row" onClick={addParagraph}><PlusIcon /> Add paragraph</button>
        </div>

        <div className="form-group">
          <label>Fact Cards (Education, Focus, Goal, etc.)</label>
          <div className="profile-dynamic-list">
            {facts.map((f, i) => (
              <div className="profile-dynamic-row profile-fact-row" key={i}>
                <input
                  value={f.label}
                  onChange={(e) => handleFactChange(i, "label", e.target.value)}
                  placeholder="Label, e.g. Education"
                />
                <input
                  value={f.value}
                  onChange={(e) => handleFactChange(i, "value", e.target.value)}
                  placeholder="Value"
                />
                <button type="button" className="profile-remove-row" onClick={() => removeFact(i)} disabled={facts.length <= 1}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="profile-add-row" onClick={addFact}><PlusIcon /> Add fact</button>
        </div>

        {serverError && <p className="auth-server-error">{serverError}</p>}
        {savedMessage && <p className="profile-saved-msg">{savedMessage}</p>}

        <button type="submit" className="form-submit profile-save-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}