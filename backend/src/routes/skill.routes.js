const express = require("express");
const router = express.Router();

const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillStats,
} = require("../controllers/skill.controller");
const {
  createSkillValidation,
  updateSkillValidation,
  idParamValidation,
} = require("../validations/skill.validation");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getAllSkills);
router.get("/stats", protect, getSkillStats);
router.post("/", protect, createSkillValidation, validate, createSkill);
router.put("/:id", protect, updateSkillValidation, validate, updateSkill);
router.delete("/:id", protect, idParamValidation, validate, deleteSkill);

module.exports = router;