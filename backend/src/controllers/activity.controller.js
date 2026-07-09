const activityService = require("../services/activity.service");
const asyncHandler = require("../utils/asyncHandler");

const getRecentActivities = asyncHandler(async (req, res) => {
  const activities = await activityService.getRecent(10);
  res.status(200).json({ success: true, activities });
});

module.exports = { getRecentActivities };