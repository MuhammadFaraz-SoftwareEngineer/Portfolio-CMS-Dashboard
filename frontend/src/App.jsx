import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfileManager from "./pages/dashboard/ProfileManager";
import AboutManager from "./pages/dashboard/AboutManager";
import SkillsManager from "./pages/dashboard/SkillsManager";
import ProjectsManager from "./pages/dashboard/ProjectsManager";
import Messages from "./pages/dashboard/Messages";
import MyPortfolio from "./pages/dashboard/MyPortfolio";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", background: "var(--bg-primary)" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfileManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="messages" element={<Messages />} />
        <Route path="my-portfolio" element={<MyPortfolio />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
