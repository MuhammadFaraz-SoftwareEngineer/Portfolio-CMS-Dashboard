const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model("Skill", skillSchema);
