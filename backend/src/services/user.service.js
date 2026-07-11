const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { sanitizeUser } = require("./auth.service");

const getPublicProfile = async () => {
  const user = await User.findOne({}).select("-password");
  if (!user) throw new ApiError(404, "Profile not found");
  return user;
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return sanitizeUser(user);
};

const ALLOWED_FIELDS = [
  "name",
  "title",
  "roles",
  "bio",
  "aboutParagraphs",
  "facts",
  "location",
  "socials",
];

const updateProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  for (const field of ALLOWED_FIELDS) {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  }

  await user.save();
  await require("./activity.service").log("Updated profile", user.name, "profile");
  return sanitizeUser(user);
};

const updateProfileImage = async (userId, profileImage) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.profileImage = profileImage;
  await user.save();
  return sanitizeUser(user);
};

const removeProfileImage = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.profileImage = "";
  await user.save();
  return sanitizeUser(user);
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
  getPublicProfile,
};