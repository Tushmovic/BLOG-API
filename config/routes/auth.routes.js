const express = require('express');
const router = express.Router();

console.log('✅ Auth routes loaded successfully!');

// Simple working signup
router.post('/signup', (req, res) => {
  console.log('📝 Signup called with:', req.body);
  
  res.json({
    status: true,
    message: '✅ Signup successful!',
    data: {
      user: {
        first_name: req.body.first_name,
        last_name: req.body.last_name, 
        email: req.body.email
      },
      token: 'demo-jwt-token-123',
      welcome_message: `Welcome to Blog API, ${req.body.first_name}! 🎉`,
      next_steps: [
        'Use this token in Authorization header for protected routes',
        'Visit /api/docs for complete API documentation',
        'Create your first blog post!'
      ]
    }
  });
});

// Simple working signin
router.post('/signin', (req, res) => {
  console.log('🔐 Signin called with:', req.body);
  
  res.json({
    status: true,
    message: '✅ Login successful!',
    data: {
      user: {
        email: req.body.email
      },
      token: 'demo-jwt-token-123',
      session: {
        expires_in: '1 hour',
        token_type: 'JWT'
      }
    }
  });
});

module.exports = router;