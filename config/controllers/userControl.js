const Article = require("../models/Blog");

// Helper: calculate reading time in minutes
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(" ").length;
  return Math.ceil(words / wordsPerMinute);
}

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
      state: "draft",
      reading_time: calculateReadingTime(body),
      timestamp: Date.now()
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List published articles with pagination, filter, search, and sort
exports.getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      state,
      search,
      sortBy,
      order
    } = req.query;

    const query = { state: "published" }; // Default to published

    if (state) query.state = state;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { tags: { $in: [regex] } }
      ];
    }

    let sortOptions = {};
    if (sortBy) {
      const sortField = sortBy;
      const sortOrder = order === "desc" ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions.timestamp = -1; // Default: newest first
    }

    const articles = await Article.find(query)
      .populate("author", "first_name last_name email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalArticles: total,
      articles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single article by ID & increment read_count
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

    if (req.body.body) {
      article.reading_time = calculateReadingTime(req.body.body);
    }

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
