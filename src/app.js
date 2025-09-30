// src/app.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

module.exports = app; // ✅ Export app for tests
