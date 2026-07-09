const Project = require("../models/project.model");
const ApiError = require("../utils/ApiError");
const { log } = require("./activity.service");

const getAllProjects = async ({ search, category } = {}) => {
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (search && search.trim()) {
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { tech: { $regex: search.trim(), $options: "i" } },
    ];
  }
  return Project.find(filter).sort({ order: 1, createdAt: -1 });
};

const getProjectById = async (id) => {
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

const createProject = async (data) => {
  const project = await Project.create(data);
  await log("Added project", project.title, "project");
  return project;
};

const updateProject = async (id, updates) => {
  const project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!project) throw new ApiError(404, "Project not found");
  await log("Updated project", project.title, "project");
  return project;
};

const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw new ApiError(404, "Project not found");
  await log("Deleted project", project.title, "project");
  return project;
};

const getProjectStats = async () => {
  const total = await Project.countDocuments();
  const categories = await Project.distinct("category");
  return { total, totalCategories: categories.length, categories };
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
};