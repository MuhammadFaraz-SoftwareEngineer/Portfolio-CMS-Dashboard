import "./FieldError.css";

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#f97316" />
    <rect x="11" y="6" width="2" height="7" fill="#ffffff" />
    <circle cx="12" cy="16" r="1.2" fill="#ffffff" />
  </svg>
);

export default function FieldError({ message }) {
  if (!message) return null;

  return (
    <div className="field-error-tooltip">
      <span className="field-error-tooltip-icon">
        <AlertIcon />
      </span>
      <span>{message}</span>
    </div>
  );
}