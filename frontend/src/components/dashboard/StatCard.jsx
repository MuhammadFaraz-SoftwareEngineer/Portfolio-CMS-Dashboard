import "./StatCard.css";

export default function StatCard({ icon, label, value, loading }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <p className="stat-card-value">{loading ? "—" : value}</p>
        <p className="stat-card-label">{label}</p>
      </div>
    </div>
  );
}
