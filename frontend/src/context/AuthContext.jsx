import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const restoreSession = async () => {
      if (!authService.hasValidSession()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.fetchMe();
        setUser(me);
      } catch {
        authService.clearSession();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (payload) => {
    setAuthError("");
    const me = await authService.login(payload);
    setUser(me);
    return me;
  };

  const register = async (payload) => {
    setAuthError("");
    const me = await authService.register(payload);
    setUser(me);
    return me;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, authError, setAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
