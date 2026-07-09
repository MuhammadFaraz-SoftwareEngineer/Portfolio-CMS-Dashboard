const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const SALT_ROUNDS = 10;

const register = async ({ name, email, password, title, roles, bio, location }) => {
  const existingAdmin = await User.findOne({});
  if (existingAdmin) {
    throw new ApiError(
      409,
      "An admin account already exists. Please log in instead."
    );
  }

  const emailTaken = await User.findOne({ email });
  if (emailTaken) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    ...(title ? { title } : {}),
    ...(roles && roles.length ? { roles } : {}),
    ...(bio ? { bio } : {}),
    ...(location ? { location } : {}),
    facts: [
      ...(location ? [{ label: "Location", value: location }] : []),
      { label: "Email", value: email },
    ],
  });

  const token = generateToken(user._id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

module.exports = { register, login, sanitizeUser };
