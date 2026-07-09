const contactService = require("../services/contact.service");
const asyncHandler = require("../utils/asyncHandler");

const sendContact = asyncHandler(async (req, res) => {
  await contactService.submitContact(req.body);
  res.status(201).json({
    success: true,
    message: "Message sent successfully! I'll get back to you soon.",
  });
});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await contactService.getAllContacts();
  res.status(200).json({ success: true, count: contacts.length, contacts });
});

const getContactStats = asyncHandler(async (req, res) => {
  const stats = await contactService.getContactStats();
  res.status(200).json({ success: true, stats });
});

module.exports = { sendContact, getAllContacts, getContactStats };
