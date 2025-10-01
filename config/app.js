const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Blog API is running!',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin'
      },
      blogs: {
        getBlogs: 'GET /api/blogs',
        getBlog: 'GET /api/blogs/:id',
        createBlog: 'POST /api/blogs (auth required)',
        getMyBlogs: 'GET /api/blogs/my/blogs (auth required)',
        updateBlog: 'PATCH /api/blogs/:id (auth required)',
        deleteBlog: 'DELETE /api/blogs/:id (auth required)'
      }
    }
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: false,
    message: err.message
  });
});

module.exports = app;