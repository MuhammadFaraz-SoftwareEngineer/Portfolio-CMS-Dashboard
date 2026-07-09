import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import dashboardService from "../../services/dashboard.service";
import "./DashboardHome.css";

const SkillsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);
const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const CategoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const MessagesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const activityIcon = (type) => {
  if (type === "skill") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    </svg>
  );
  if (type === "project") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data.stats);
        setActivities(data.recentActivities || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dash-home">
      <p className="dash-home-welcome">Here's what's in your portfolio right now.</p>

      <div className="dash-home-stats-grid">
        <StatCard icon={<SkillsIcon />} label="Total Skills" value={stats?.totalSkills ?? 0} loading={loading} />
        <StatCard icon={<ProjectsIcon />} label="Total Projects" value={stats?.totalProjects ?? 0} loading={loading} />
        <StatCard icon={<CategoryIcon />} label="Categories" value={stats?.totalCategories ?? 0} loading={loading} />
        <StatCard icon={<MessagesIcon />} label="Messages" value={stats?.totalMessages ?? 0} loading={loading} />
      </div>

      {error && <p className="dash-home-error">{error}</p>}

      <div className="dash-home-bottom">
        <div className="dash-home-quick-links">
          <Link to="/dashboard/profile" className="dash-home-quick-card">
            <h3>Edit Profile</h3>
            <p>Update your name, title, location, and photo.</p>
          </Link>
          <Link to="/dashboard/about" className="dash-home-quick-card">
            <h3>Edit About</h3>
            <p>Write your bio, paragraphs, and fact cards.</p>
          </Link>
          <Link to="/dashboard/skills" className="dash-home-quick-card">
            <h3>Manage Skills</h3>
            <p>Add, edit, or remove skills by category.</p>
          </Link>
          <Link to="/dashboard/projects" className="dash-home-quick-card">
            <h3>Manage Projects</h3>
            <p>Showcase your latest work with full control.</p>
          </Link>
        </div>

        <div className="dash-activities">
          <p className="dash-activities-title">Recent Activity</p>
          {loading && <p className="dash-activities-empty">Loading...</p>}
          {!loading && activities.length === 0 && (
            <p className="dash-activities-empty">No activity yet. Start adding skills or projects.</p>
          )}
          <ul className="dash-activity-list">
            {activities.map((a) => (
              <li key={a._id} className="dash-activity-item">
                <span className={`dash-activity-icon dash-activity-icon--${a.type}`}>
                  {activityIcon(a.type)}
                </span>
                <div className="dash-activity-body">
                  <span className="dash-activity-action">{a.action}</span>
                  <span className="dash-activity-target"> — {a.target}</span>
                </div>
                <span className="dash-activity-time">{timeAgo(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}