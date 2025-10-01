// src/tests/article.test.js
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token;
let articleId;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user and get token
  const res = await request(app)
    .post("/api/auth/signup")
    .send({
      first_name: "Test",
      last_name: "User",
      email: "article@example.com",
      password: "password123"
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Article API", () => {
  // Create a draft article
  it("should create a draft article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Article",
        description: "This is a test article",
        body: "Lorem ipsum dolor sit amet.",
        tags: ["test", "api"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("state", "draft");
    articleId = res.body._id;
  });

  // Get own articles
  it("should get own articles", async () => {
    const res = await request(app)
      .get("/api/articles/me/list")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Publish article
  it("should publish the article", async () => {
    const res = await request(app)
      .patch(`/api/articles/${articleId}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("state", "published");
  });

  // Get all published articles
  it("should get published articles", async () => {
    const res = await request(app).get("/api/articles");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Get single article and increment read_count
  it("should get single article and increment read_count", async () => {
    const res = await request(app).get(`/api/articles/${articleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("read_count", 1);
    expect(res.body).toHaveProperty("author");
  });

  // Update article (owner only)
  it("should update the article", async () => {
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("description", "Updated description");
  });

  // Unauthorized update attempt
  it("should fail to update article without token", async () => {
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .send({ description: "Fail attempt" });

    expect(res.statusCode).toBe(401);
  });

  // Delete article
  it("should delete the article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Article deleted successfully");
  });

  // Pagination, search, and filter test
  it("should create multiple articles and test pagination & search", async () => {
    // Create 3 articles
    const createdArticles = [];
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post("/api/articles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: `Test Article ${i}`,
          description: `Description ${i}`,
          body: `Body ${i}`,
          tags: ["test"]
        });
      createdArticles.push(res.body);
    }

    // Publish one article to test published endpoint
    await request(app)
      .patch(`/api/articles/${createdArticles[0]._id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    // Fetch articles with pagination (page 1)
    const res = await request(app).get("/api/articles?page=1&limit=2");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(2);

    // Search by title
    const search = await request(app).get("/api/articles?search=Article 2");
    expect(Array.isArray(search.body)).toBe(true);
    expect(search.body[0]).toHaveProperty("title", "Test Article 2");

    // Filter by state (draft)
    const filter = await request(app).get("/api/articles?state=draft");
    expect(Array.isArray(filter.body)).toBe(true);
    expect(filter.body.every(a => a.state === "draft")).toBe(true);
  });
});
