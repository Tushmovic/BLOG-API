const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = require('./app');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('❌ MongoDB Connection Error:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. Your MongoDB Atlas connection string is correct');
    console.log('   2. Your IP is whitelisted in MongoDB Atlas');
    console.log('   3. Your username/password are correct');
    return false;
  }
};

// Basic routes
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Blog API is running! 🚀',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (temporary)
app.post('/api/auth/signup', (req, res) => {
  res.json({ 
    status: true,
    message: 'Signup endpoint - ready for implementation',
    data: req.body 
  });
});

app.post('/api/auth/signin', (req, res) => {
  res.json({ 
    status: true,
    message: 'Signin endpoint - ready for implementation',
    data: req.body 
  });
});

// Blog routes (temporary)
app.get('/api/blogs', (req, res) => {
  res.json({ 
    status: true,
    message: 'Get all blogs endpoint - ready for implementation',
    query: req.query 
  });
});

app.get('/api/blogs/:id', (req, res) => {
  res.json({ 
    status: true,
    message: 'Get single blog endpoint',
    id: req.params.id 
  });
});

app.post('/api/blogs', (req, res) => {
  res.json({ 
    status: true,
    message: 'Create blog endpoint - auth required',
    data: req.body 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  console.log('🚀 Starting Blog API Server...');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  
  // Connect to database
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('⚠️  Starting server without database connection...');
  }
  
  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('\n📚 Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
    console.log(`   POST http://localhost:${PORT}/api/auth/signin`);
    console.log(`   GET  http://localhost:${PORT}/api/blogs`);
    console.log(`   GET  http://localhost:${PORT}/api/blogs/:id`);
    console.log(`   POST http://localhost:${PORT}/api/blogs`);
    console.log('\n🔧 Database status:', dbConnected ? 'Connected ✅' : 'Disconnected ⚠️');
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`❌ Port ${PORT} is already in use!`);
      console.log(`💡 Try: PORT=3001 npm run dev`);
    } else {
      console.log('❌ Server error:', error.message);
    }
    process.exit(1);
  });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

// Start the application
startServer();