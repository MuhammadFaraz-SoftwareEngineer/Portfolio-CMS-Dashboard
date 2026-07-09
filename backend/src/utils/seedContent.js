require("dotenv").config();
const mongoose = require("mongoose");
const env = require("../config/env");
const Skill = require("../models/skill.model");
const Project = require("../models/project.model");

const skillGroups = [
  { category: "Programming Languages", skills: ["Java", "Python", "C", "C#", "Dart", "JavaScript"] },
  { category: "Web Development", skills: ["React", "Node.js", "Express.js", "HTML5", "CSS3", "REST APIs", "ASP.NET MVC"] },
  { category: "Mobile Development", skills: ["Flutter", "Dart", "Android Studio", "Node.js", "Express.js", "REST APIs"] },
  { category: "Database Management", skills: ["MongoDB", "MySQL", "XAMPP", "Mongoose", "CRUD Operations"] },
  { category: "Testing & QA", skills: ["Postman", "Selenium (Basic)", "Playwright (Basic)"] },
  { category: "Developer Tools", skills: ["Git", "GitHub", "VS Code", "Visual Studio", "Android Studio"] },
];

const projects = [
  {
    type: "Java · Console Apps",
    category: "Java Console Apps",
    title: "Java Console Applications Portfolio",
    description:
      "A collection of Java console applications — including Inventory Management, Library Management, Quiz System, and Tic-Tac-Toe — built to demonstrate core OOP principles and the Java Collections Framework. Each app features custom backend logic, data handling pipelines, game loop mechanics, and result evaluation systems.",
    tech: ["Java", "OOP", "Collections Framework", "Data Structures"],
    github: "https://github.com/MuhammadFaraz-SoftwareEngineer",
  },
  {
    type: "Mobile · Flutter",
    category: "Mobile",
    title: "Shop Smart",
    description:
      "A cross-platform e-commerce mobile application built with Flutter and Dart. Features JWT-based user authentication with bcrypt password hashing, product browsing, and a functional shopping cart. Focused on reusable widget architecture and optimized navigation flow for improved app performance and long-term maintainability.",
    tech: ["Flutter", "Dart", "Android Studio", "Node.js", "Express.js", "JWT", "bcrypt", "Authentication"],
    github: "https://github.com/MuhammadFaraz-SoftwareEngineer",
  },
  {
    type: "Full Stack · MERN",
    category: "Full Stack",
    title: "Quirky Fruity",
    description:
      "A responsive e-commerce juice shop website with an interactive React frontend and a Node.js/Express backend. Built RESTful APIs for product and integrated frontend-backend communication through Express, and ensured consistent rendering across devices through responsive CSS design.",
    tech: ["React", "Node.js", "Express.js", "REST APIs", "JavaScript", "CSS"],
    github: "https://github.com/MuhammadFaraz-SoftwareEngineer",
  },
];

const run = async () => {
  await mongoose.connect(env.MONGO_URI);

  await Skill.deleteMany({});
  await Project.deleteMany({});

  const skillDocs = [];
  skillGroups.forEach((group, groupIndex) => {
    group.skills.forEach((name, i) => {
      skillDocs.push({ name, category: group.category, order: i, proficiency: 80 });
    });
  });
  await Skill.insertMany(skillDocs);

  await Project.insertMany(projects);

  console.log(`Seeded ${skillDocs.length} skills and ${projects.length} projects.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
