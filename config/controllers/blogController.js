const Blog = require('../models/Blog');
const User = require('../models/User');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, body, tags } = req.body;

    const blog = await Blog.create({
      title,
      description,
      body,
      tags,
      author: req.user._id
    });

    res.status(201).json({
      status: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: 'Blog title already exists'
      });
    }
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { state, search, orderBy, order = 'desc' } = req.query;
    
    let query = { state: 'published' };
    
    // Filter by state (though for published blogs only)
    if (state) {
      query.state = state;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Sorting
    let sort = { createdAt: -1 };
    if (orderBy) {
      sort = { [orderBy]: order === 'asc' ? 1 : -1 };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      status: true,
      message: 'Blogs retrieved successfully',
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          blogsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'first_name last_name email');
    
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: 'Blog not found'
      });
    }

    // Increment read count
    blog.read_count += 1;
    await blog.save();

    res.status(200).json({
      status: true,
      message: 'Blog retrieved successfully',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { state } = req.query;
    
    let query = { author: req.user._id };
    if (state) {
      query.state = state;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      status: true,
      message: 'Your blogs retrieved successfully',
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          blogsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: 'You can only update your own blogs'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'first_name last_name email');

    res.status(200).json({
      status: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: 'You can only delete your own blogs'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};