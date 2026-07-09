const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../validations/auth.validation");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", protect, getMe);

module.exports = router;
