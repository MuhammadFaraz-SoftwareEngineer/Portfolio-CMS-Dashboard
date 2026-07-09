import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";
import "./DashboardLayout.css";

const TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile",
  "/dashboard/about": "About",
  "/dashboard/skills": "Skills",
  "/dashboard/projects": "Projects",
  "/dashboard/messages": "Messages",
  "/dashboard/my-portfolio": "My Portfolio",
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const title = TITLES[location.pathname] || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dash-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="dash-main">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}