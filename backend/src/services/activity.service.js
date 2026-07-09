const Activity = require("../models/activity.model");

const log = async (action, target, type) => {
  try {
    await Activity.create({ action, target, type });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

const getRecent = async (limit = 10) => {
  return Activity.find().sort({ createdAt: -1 }).limit(limit);
};

module.exports = { log, getRecent };