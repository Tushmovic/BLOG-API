const Article = require('../models/article.model');
const User = require('../models/user.model');

// Utility to estimate reading time
function calculateReadingTime(text) {
  const wordsPerMinute = 200; // average reading speed
  const words = text.split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
}

// Create article (draft by default)
exports.createArticle = async (req, res) => {
  try {
    const { title, description, body, tags } = req.body;
    const reading_time = calculateReadingTime(body);
    const article = await Article.create({
      title, description, body, tags, author: req.user.id, reading_time
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List published articles with pagination, search, filter, order
exports.listArticles = async (req, res) => {
  try {
    let { page = 1, limit = 20, author, title, tags, state, sortBy } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (state) filter.state = state;
    else filter.state = 'published'; // default to published
    if (author) filter.author = author;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (tags) filter.tags = { $in: tags.split(',') };

    let query = Article.find(filter).populate('author', 'first_name last_name email');

    // Sorting
    if (sortBy) {
      const sortFields = sortBy.split(',').join(' ');
      query = query.sort(sortFields);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const articles = await query.skip((page - 1) * limit).limit(limit);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single article & increment read_count
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.read_count += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update article (owner only)
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { title, description, body, tags } = req.body;
    if (title) article.title = title;
    if (description) article.description = description;
    if (body) {
      article.body = body;
      article.reading_time = calculateReadingTime(body);
    }
    if (tags) article.tags = tags;

    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Publish article (owner only)
exports.publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    article.state = 'published';
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete article (owner only)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await article.remove();
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List articles of logged-in user
exports.listMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id }).sort('-createdAt');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
