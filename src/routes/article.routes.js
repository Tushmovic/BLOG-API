const express = require("express");
const router = express.Router();
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  publishArticle,
  deleteArticle,
  getMyArticles
} = require("../controllers/article.controller");

const { authenticate } = require("../middlewares/auth.middleware");

// Create article (draft)
router.post("/", authenticate, createArticle);

// List own articles
router.get("/me/list", authenticate, getMyArticles);

// List published articles with pagination, search, filter, sort
router.get("/", getArticles);

// Get single article by ID
router.get("/:id", getArticleById);

// Update article
router.put("/:id", authenticate, updateArticle);

// Publish article
router.patch("/:id/publish", authenticate, publishArticle);

// Delete article
router.delete("/:id", authenticate, deleteArticle);

module.exports = router;
