const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
} = require("../controllers/user.controller");
const {
  updateProfileValidation,
  updateImageValidation,
} = require("../validations/user.validation");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidation, validate, updateProfile);
router.put("/profile/image", protect, updateImageValidation, validate, updateProfileImage);
router.delete("/profile/image", protect, removeProfileImage);

module.exports = router;
