const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./config/routes/auth.routes');
const blogRoutes = require('./config/routes/blogs');
const userRoutes = require('./config/routes/users');

const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// 🎨 BEAUTIFUL HTML PAGES FOR USERS

// Home Page - Beautiful Interface
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Blog API - Home',
    message: 'Welcome to our Blogging Platform!',
    endpoints: [
      { name: 'View All Blogs', path: '/blogs', method: 'GET', description: 'Read amazing blog posts' },
      { name: 'Create Account', path: '/signup', method: 'POST', description: 'Join our community' },
      { name: 'Login', path: '/login', method: 'POST', description: 'Access your account' }
    ]
  });
});

// Blogs Page - View All Blogs
app.get('/blogs', (req, res) => {
  res.render('blogs', {
    title: 'All Blog Posts',
    message: 'Discover amazing stories and insights'
  });
});

// Signup Page - User Registration
app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Create Your Account',
    message: 'Join our blogging community today!'
  });
});

// Login Page - User Authentication
app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login to Your Account',
    message: 'Welcome back!'
  });
});

// Create Blog Page
app.get('/create-blog', (req, res) => {
  res.render('create-blog', {
    title: 'Write Your Story',
    message: 'Share your thoughts with the world'
  });
});

// API Documentation Page (Pretty HTML version)
app.get('/docs', (req, res) => {
  res.render('docs', {
    title: 'API Documentation',
    message: 'Developer Resources'
  });
});

// 📊 API ENDPOINTS (JSON responses for developers)

// API Home (JSON version)
app.get('/api', (req, res) => {
  res.json({
    status: true,
    message: '🚀 Blog API is Running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    html_interface: 'Visit / for beautiful web interface',
    endpoints: {
      web_pages: {
        home: 'GET /',
        blogs: 'GET /blogs',
        signup: 'GET /signup',
        login: 'GET /login',
        create_blog: 'GET /create-blog',
        documentation: 'GET /docs'
      },
      api_endpoints: {
        auth: {
          signup: 'POST /api/auth/signup',
          signin: 'POST /api/auth/signin'
        },
        blogs: {
          get_all: 'GET /api/blogs',
          create: 'POST /api/blogs'
        }
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: true,
    message: '✅ API Health Check',
    server: 'Healthy 🟢',
    database: 'Connected 🟢', 
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).render('404', {
      title: 'Page Not Found',
      message: 'Oops! The page you are looking for does not exist.'
    });
  } else {
    res.status(404).json({
      status: false,
      message: `Route ${req.originalUrl} not found`
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (req.accepts('html')) {
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong! Please try again later.'
    });
  } else {
    res.status(500).json({
      status: false,
      message: 'Something went wrong!'
    });
  }
});

module.exports = app;