import api from "./api";

const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return { stats: data.stats, recentActivities: data.recentActivities };
};

export default { getDashboardStats };
