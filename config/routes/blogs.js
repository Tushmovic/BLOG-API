const express = require('express');
const router = express.Router();

console.log('✅ Blog routes loaded successfully!');

// GET /api/blogs
router.get('/', (req, res) => {
  res.json({
    status: true,
    message: '📚 Blogs retrieved successfully',
    data: {
      blogs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalBlogs: 0,
        blogsPerPage: 20,
        message: 'No blogs yet. Create the first one! ✨'
      }
    }
  });
});

// GET /api/blogs/:id
router.get('/:id', (req, res) => {
  res.json({
    status: true,
    message: '📖 Blog details',
    data: {
      blog: {
        id: req.params.id,
        title: 'Sample Blog',
        message: 'Blog details endpoint - ready for implementation'
      }
    }
  });
});

// POST /api/blogs
router.post('/', (req, res) => {
  res.json({
    status: true,
    message: '📝 Blog created successfully!',
    data: {
      blog: {
        title: req.body.title,
        description: req.body.description,
        body_preview: req.body.body ? req.body.body.substring(0, 100) + '...' : '',
        tags: req.body.tags || [],
        state: 'draft',
        read_count: 0,
        reading_time: req.body.body ? Math.ceil(req.body.body.split(' ').length / 200) : 0,
        message: 'Blog created in draft state - update to "published" to make it public'
      },
      next_steps: [
        'Update blog state to "published" to make it public',
        'Add engaging content to attract readers',
        'Share your blog with the community'
      ]
    }
  });
});

module.exports = router;