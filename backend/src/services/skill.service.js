const Skill = require("../models/skill.model");
const ApiError = require("../utils/ApiError");
const { log } = require("./activity.service");

const getAllSkills = async ({ category } = {}) => {
  const filter = {};
  if (category) filter.category = category;
  return Skill.find(filter).sort({ category: 1, order: 1, createdAt: 1 });
};

const createSkill = async (data) => {
  const skill = await Skill.create(data);
  await log("Added skill", skill.name, "skill");
  return skill;
};

const updateSkill = async (id, updates) => {
  const skill = await Skill.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!skill) throw new ApiError(404, "Skill not found");
  await log("Updated skill", skill.name, "skill");
  return skill;
};

const deleteSkill = async (id) => {
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) throw new ApiError(404, "Skill not found");
  await log("Deleted skill", skill.name, "skill");
  return skill;
};

const getSkillStats = async () => {
  const total = await Skill.countDocuments();
  const categories = await Skill.distinct("category");
  return { total, totalCategories: categories.length, categories };
};

module.exports = {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillStats,
};