const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, title, roles, bio, location } = req.body;
  const { token, user } = await authService.register({
    name,
    email,
    password,
    title,
    roles,
    bio,
    location,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    user,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = { register, login, getMe };
