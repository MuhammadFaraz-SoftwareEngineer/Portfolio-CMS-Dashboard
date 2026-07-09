require("dotenv").config();

const required = ["MONGO_URI", "JWT_SECRET", "EMAIL_USER", "EMAIL_PASS"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(
    `Missing environment variables: ${missing.join(", ")}. Check your .env file.`
  );
}

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  ADMIN_NAME: process.env.ADMIN_NAME || "Muhammad Faraz Khan",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

module.exports = env;
