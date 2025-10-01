const express = require('express');
const { 
  createBlog, 
  getPublishedBlogs, 
  getBlog, 
  getMyBlogs, 
  updateBlog, 
  deleteBlog 
} = require('../controllers/blogController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getPublishedBlogs);
router.get('/:id', getBlog);

// Protected routes
router.use(auth); // All routes below require authentication
router.post('/', createBlog);
router.get('/my/blogs', getMyBlogs);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;