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

// All handlers must be functions
router.post("/", authenticate, createArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.put("/:id", authenticate, updateArticle);
router.patch("/:id/publish", authenticate, publishArticle);
router.delete("/:id", authenticate, deleteArticle);
router.get("/me/list", authenticate, getMyArticles);

module.exports = router;
