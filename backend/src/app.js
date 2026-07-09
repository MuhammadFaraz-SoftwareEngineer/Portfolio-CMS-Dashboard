const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const skillRoutes = require("./routes/skill.routes");
const projectRoutes = require("./routes/project.routes");
const contactRoutes = require("./routes/contact.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const activityRoutes = require("./routes/activity.routes");

const { errorMiddleware, notFoundMiddleware } = require("./middleware/error.middleware");

const app = express();

connectDB();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
