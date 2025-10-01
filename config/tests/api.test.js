const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const Blog = require('../models/Blog');

let authToken;
let userId;
let blogId;

describe('Blog API Tests', () => {
  beforeAll(async () => {
    // Clear database before tests
    await User.deleteMany({});
    await Blog.deleteMany({});
  });

  describe('Authentication Endpoints', () => {
    test('Should sign up a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('token');
    });

    test('Should sign in existing user', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      
      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });
  });

  describe('Blog Endpoints', () => {
    test('Should create a new blog', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Blog Post',
          description: 'This is a test blog post',
          body: 'This is the body content of the test blog post. It should be long enough to calculate reading time properly.',
          tags: ['test', 'programming', 'nodejs']
        })
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.data.blog.title).toBe('Test Blog Post');
      expect(response.body.data.blog.state).toBe('draft');
      
      blogId = response.body.data.blog._id;
    });

    test('Should get published blogs', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(Array.isArray(response.body.data.blogs)).toBe(true);
    });

    test('Should update blog state to published', async () => {
      const response = await request(app)
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          state: 'published'
        })
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data.blog.state).toBe('published');
    });

    test('Should get single blog and increment read count', async () => {
      const response = await request(app)
        .get(`/api/blogs/${blogId}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data.blog.read_count).toBe(1);
    });

    test('Should get user blogs', async () => {
      const response = await request(app)
        .get('/api/blogs/my/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(Array.isArray(response.body.data.blogs)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('Should not create blog without authentication', async () => {
      await request(app)
        .post('/api/blogs')
        .send({
          title: 'Unauthorized Blog',
          body: 'This should fail'
        })
        .expect(401);
    });

    test('Should not update other users blog', async () => {
      // Create another user
      const user2 = await request(app)
        .post('/api/auth/signup')
        .send({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          password: 'password123'
        });

      // Try to update first user's blog with second user's token
      await request(app)
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${user2.body.data.token}`)
        .send({
          title: 'Unauthorized Update'
        })
        .expect(403);
    });
  });
});