const { body, param } = require("express-validator");

const createSkillValidation = [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("proficiency")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Proficiency must be between 0 and 100"),
];

const updateSkillValidation = [
  param("id").isMongoId().withMessage("Invalid skill id"),
  body("name").optional().trim().notEmpty().withMessage("Skill name cannot be empty"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("proficiency")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Proficiency must be between 0 and 100"),
];

const idParamValidation = [param("id").isMongoId().withMessage("Invalid skill id")];

module.exports = {
  createSkillValidation,
  updateSkillValidation,
  idParamValidation,
};
