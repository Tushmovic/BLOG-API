const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  read_count: { type: Number, default: 0 },
  reading_time: { type: String }, // I’ll calculate this later
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
