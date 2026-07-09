const skillService = require("../services/skill.service");
const projectService = require("../services/project.service");
const contactService = require("../services/contact.service");
const activityService = require("../services/activity.service");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [skillStats, projectStats, contactStats, recentActivities] = await Promise.all([
    skillService.getSkillStats(),
    projectService.getProjectStats(),
    contactService.getContactStats(),
    activityService.getRecent(8),
  ]);

  const allCategories = new Set([
    ...skillStats.categories,
    ...projectStats.categories,
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalSkills: skillStats.total,
      totalProjects: projectStats.total,
      totalCategories: allCategories.size,
      totalMessages: contactStats.total,
      unreadMessages: contactStats.unread,
    },
    recentActivities,
  });
});

module.exports = { getDashboardStats };