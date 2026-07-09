const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    title: {
      type: String,
      default: "Software Engineering Student",
      trim: true,
    },
    roles: {
      type: [String],
      default: [
        "MERN Stack Developer",
        "Flutter Developer",
        "Java Developer",
        "Python Developer",
        "Software Engineer",
      ],
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    aboutParagraphs: {
      type: [String],
      default: [],
    },
    facts: {
      type: [
        {
          label: { type: String, trim: true },
          value: { type: String, trim: true },
        },
      ],
      default: [],
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
