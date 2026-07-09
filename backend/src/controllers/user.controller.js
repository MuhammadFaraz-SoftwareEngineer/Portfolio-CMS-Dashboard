const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.status(200).json({ success: true, user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const user = await userService.updateProfileImage(req.user._id, req.body.profileImage);
  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    user,
  });
});

const removeProfileImage = asyncHandler(async (req, res) => {
  const user = await userService.removeProfileImage(req.user._id);
  res.status(200).json({
    success: true,
    message: "Profile image removed",
    user,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
};