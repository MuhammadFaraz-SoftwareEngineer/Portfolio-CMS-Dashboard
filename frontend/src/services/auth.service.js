import api from "./api";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const persistSession = (token) => {
  const expiry = Date.now() + SEVEN_DAYS_MS;
  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpiry", String(expiry));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
};

const hasValidSession = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token || !expiry) return false;
  if (Date.now() > Number(expiry)) {
    clearSession();
    return false;
  }
  return true;
};

const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  persistSession(data.token);
  return data.user;
};

const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  persistSession(data.token);
  return data.user;
};

const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

const logout = () => {
  clearSession();
};

export default {
  register,
  login,
  fetchMe,
  logout,
  hasValidSession,
  persistSession,
  clearSession,
};
