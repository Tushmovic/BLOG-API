const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Blog API is running! 🚀',
    timestamp: new Date().toISOString(),
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

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    status: false,
    message: 'Something went wrong!'
  });
});

module.exports = app;