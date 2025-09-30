const Article = require("../models/article.model");

// Create Article
exports.createArticle = async (req, res) => {
  try {
    const { title, body, description, tags } = req.body;
    const article = await Article.create({
      title,
      body,
      description,
      tags,
      author: req.user._id,
      state: "draft"
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all published articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ state: "published" });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author");
    if (!article) return res.status(404).json({ error: "Article not found" });
    article.read_count += 1;
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    if (!article.author.equals(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    Object.assign(article, req.body);
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Publish article
exports.publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    if (!article.author.equals(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    article.state = "published";
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    if (!article.author.equals(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    await article.deleteOne();
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List own articles
exports.getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
