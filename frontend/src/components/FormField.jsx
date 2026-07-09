import { useState, useEffect } from "react";
import FieldError from "./FieldError";
import "./FormField.css";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  attempt = 0,
  required = true,
  as = "input",
  rows,
}) {
  const Tag = as;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [attempt]);

  const showError = error && !dismissed;

  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <Tag
        id={name}
        name={name}
        type={as === "input" ? type : undefined}
        rows={as === "textarea" ? rows || 4 : undefined}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setDismissed(true)}
        className={showError ? "field-error" : ""}
      />
      <FieldError message={showError ? error : null} />
    </div>
  );
}