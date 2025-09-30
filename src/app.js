const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Blog API is running');
});

module.exports = app;
