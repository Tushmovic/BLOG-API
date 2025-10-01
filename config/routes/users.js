const express = require('express');
const router = express.Router();

console.log('✅ User routes loaded successfully!');

router.get('/profile', (req, res) => {
  res.json({
    status: true,
    message: '👤 User profile endpoint',
    data: {
      message: 'User profile - authentication required',
      note: 'This endpoint requires JWT authentication'
    }
  });
});

module.exports = router;