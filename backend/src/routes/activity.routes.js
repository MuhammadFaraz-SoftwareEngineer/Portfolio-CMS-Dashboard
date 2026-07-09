const express = require("express");
const router = express.Router();
const { getRecentActivities } = require("../controllers/activity.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getRecentActivities);

module.exports = router;