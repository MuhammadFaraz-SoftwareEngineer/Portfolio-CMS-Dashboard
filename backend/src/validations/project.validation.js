const { body, param } = require("express-validator");

const createProjectValidation = [
  body("title").trim().notEmpty().withMessage("Project title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("tech")
    .optional()
    .isArray()
    .withMessage("Tech stack must be a list"),
  body("github")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("GitHub link must be a valid URL"),
  body("liveDemo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Live demo link must be a valid URL"),
];

const updateProjectValidation = [
  param("id").isMongoId().withMessage("Invalid project id"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("tech").optional().isArray().withMessage("Tech stack must be a list"),
  body("github")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("GitHub link must be a valid URL"),
  body("liveDemo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Live demo link must be a valid URL"),
];

const idParamValidation = [param("id").isMongoId().withMessage("Invalid project id")];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  idParamValidation,
};
