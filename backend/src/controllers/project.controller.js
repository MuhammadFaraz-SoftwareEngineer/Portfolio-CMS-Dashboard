const projectService = require("../services/project.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllProjects = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const projects = await projectService.getAllProjects({ search, category });
  res.status(200).json({ success: true, count: projects.length, projects });
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  res.status(200).json({ success: true, project });
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json({
    success: true,
    message: "Project added successfully",
    project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await projectService.getProjectStats();
  res.status(200).json({ success: true, stats });
});

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
};
