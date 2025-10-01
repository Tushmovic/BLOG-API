const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Example protected user route
router.get('/profile', auth, (req, res) => {
  res.status(200).json({
    status: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router;