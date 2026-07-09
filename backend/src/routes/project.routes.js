const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/project.controller");
const {
  createProjectValidation,
  updateProjectValidation,
  idParamValidation,
} = require("../validations/project.validation");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getAllProjects);
router.get("/stats", protect, getProjectStats);
router.get("/:id", protect, idParamValidation, validate, getProject);
router.post("/", protect, createProjectValidation, validate, createProject);
router.put("/:id", protect, updateProjectValidation, validate, updateProject);
router.delete("/:id", protect, idParamValidation, validate, deleteProject);

module.exports = router;
