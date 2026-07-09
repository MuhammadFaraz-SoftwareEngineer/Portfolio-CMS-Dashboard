import api from "./api";

const getSkills = async (category) => {
  const { data } = await api.get("/skills", { params: category ? { category } : {} });
  return data.skills;
};

const createSkill = async (payload) => {
  const { data } = await api.post("/skills", payload);
  return data.skill;
};

const updateSkill = async (id, payload) => {
  const { data } = await api.put(`/skills/${id}`, payload);
  return data.skill;
};

const deleteSkill = async (id) => {
  await api.delete(`/skills/${id}`);
};

export default { getSkills, createSkill, updateSkill, deleteSkill };
