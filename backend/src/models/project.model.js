const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: "",
    },
    tech: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    liveDemo: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", description: "text", tech: "text" });
projectSchema.index({ category: 1 });

module.exports = mongoose.model("Project", projectSchema);
