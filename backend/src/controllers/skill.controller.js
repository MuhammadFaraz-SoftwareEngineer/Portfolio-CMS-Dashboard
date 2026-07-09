const skillService = require("../services/skill.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllSkills = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const skills = await skillService.getAllSkills({ category });
  res.status(200).json({ success: true, count: skills.length, skills });
});

const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  res.status(201).json({
    success: true,
    message: "Skill added successfully",
    skill,
  });
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});

const deleteSkill = asyncHandler(async (req, res) => {
  await skillService.deleteSkill(req.params.id);
  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});

const getSkillStats = asyncHandler(async (req, res) => {
  const stats = await skillService.getSkillStats();
  res.status(200).json({ success: true, stats });
});

module.exports = {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillStats,
};
