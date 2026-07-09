import api from "./api";

const getProjects = async ({ search, category } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== "All") params.category = category;
  const { data } = await api.get("/projects", { params });
  return data.projects;
};

const createProject = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data.project;
};

const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data.project;
};

const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};

export default {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};