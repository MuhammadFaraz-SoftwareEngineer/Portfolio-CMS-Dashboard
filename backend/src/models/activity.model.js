const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["skill", "project", "profile", "contact"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);