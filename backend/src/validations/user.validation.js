const { body } = require("express-validator");

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("title").optional().trim(),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bio must be under 1000 characters"),

  body("location").optional().trim(),

  body("roles")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one role is required"),

  body("aboutParagraphs")
    .optional()
    .isArray()
    .withMessage("About paragraphs must be a list"),

  body("facts").optional().isArray().withMessage("Facts must be a list"),

  body("socials.github").optional().trim().isURL().withMessage("GitHub must be a valid URL"),
  body("socials.linkedin").optional().trim().isURL().withMessage("LinkedIn must be a valid URL"),
];

const updateImageValidation = [
  body("profileImage")
    .notEmpty()
    .withMessage("Image data is required")
    .custom((value) => value.startsWith("data:image/"))
    .withMessage("Invalid image format"),
];

module.exports = { updateProfileValidation, updateImageValidation };
