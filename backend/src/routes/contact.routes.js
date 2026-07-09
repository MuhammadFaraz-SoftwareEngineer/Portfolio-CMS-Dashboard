const express = require("express");
const router = express.Router();

const {
  sendContact,
  getAllContacts,
  getContactStats,
} = require("../controllers/contact.controller");
const { contactValidation } = require("../validations/contact.validation");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

router.post("/", contactValidation, validate, sendContact);

router.get("/", protect, getAllContacts);
router.get("/stats", protect, getContactStats);

module.exports = router;
