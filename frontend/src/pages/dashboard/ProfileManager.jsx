import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profile.service";
import FieldError from "../../components/FieldError";
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
const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const MAX_IMAGE_MB = 2;

export default function ProfileManager() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    github: "",
    linkedin: "",
  });
  const [roles, setRoles] = useState([""]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      title: user.title || "",
      location: user.location || "",
      github: user.socials?.github || "",
      linkedin: user.socials?.linkedin || "",
    });
    setRoles(user.roles?.length ? user.roles : [""]);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleFocus = (e) => {
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleRoleChange = (i, value) => {
    const next = [...roles];
    next[i] = value;
    setRoles(next);
  };
  const addRole = () => setRoles([...roles, ""]);
  const removeRole = (i) => roles.length > 1 && setRoles(roles.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please fill in this field";
    if (roles.filter((r) => r.trim()).length === 0) errs.roles = "Add at least one role";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedMessage("");
    setServerError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        name: form.name.trim(),
        title: form.title.trim(),
        location: form.location.trim(),
        roles: roles.map((r) => r.trim()).filter(Boolean),
        socials: { github: form.github.trim(), linkedin: form.linkedin.trim() },
      });
      setUser(updated);
      setSavedMessage("Profile updated successfully.");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        const mapped = {};
        apiErrors.forEach((e) => (mapped[e.field] = e.message));
        setErrors(mapped);
      } else {
        setServerError(err.response?.data?.message || "Could not update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUploading(true);
      try {
        const updated = await profileService.updateProfileImage(reader.result);
        setUser(updated);
      } catch (err) {
        setImageError(err.response?.data?.message || "Could not upload image.");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    setImageUploading(true);
    setImageError("");
    try {
      const updated = await profileService.removeProfileImage();
      setUser(updated);
    } catch (err) {
      setImageError(err.response?.data?.message || "Could not remove image.");
    } finally {
      setImageUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-manager">
      <div className="profile-image-block">
        <div className="profile-avatar-large">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} />
          ) : (
            <span>{user.name?.charAt(0)?.toUpperCase() || "A"}</span>
          )}
        </div>
        <div className="profile-image-actions">
          <button
            type="button"
            className="profile-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
          >
            <CameraIcon /> {imageUploading ? "Uploading..." : "Upload Photo"}
          </button>
          {user.profileImage && (
            <button type="button" className="profile-remove-btn" onClick={handleRemoveImage} disabled={imageUploading}>
              Remove
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
        </div>
        <FieldError message={imageError} />
      </div>

      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.name ? "field-error" : ""}
            />
            <FieldError message={errors.name} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineering Student" />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Karachi, Pakistan" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>GitHub URL <span className="profile-optional-note">(only shows on Contact if filled)</span></label>
            <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label>LinkedIn URL <span className="profile-optional-note">(only shows on Contact if filled)</span></label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        <div className="form-group">
          <label>Rotating Roles (shown in the homepage typing animation)<span className="required-mark">*</span></label>
          <div className="profile-dynamic-list">
            {roles.map((role, i) => (
              <div className="profile-dynamic-row" key={i}>
                <input value={role} onChange={(e) => handleRoleChange(i, e.target.value)} placeholder={`Role ${i + 1}`} />
                <button type="button" className="profile-remove-row" onClick={() => removeRole(i)} disabled={roles.length <= 1}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <FieldError message={errors.roles} />
          <button type="button" className="profile-add-row" onClick={addRole}><PlusIcon /> Add role</button>
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