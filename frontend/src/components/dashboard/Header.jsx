import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Header({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <button className="dash-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <MenuIcon />
        </button>
        <h1 className="dash-header-title">{title}</h1>
      </div>

      <div className="dash-header-right">
        <div className="dash-user-chip">
          <div className="dash-user-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            )}
          </div>
          <span className="dash-user-name">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}