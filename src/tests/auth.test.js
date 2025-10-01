const request = require("supertest"); // <<--- THIS IS REQUIRED
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Auth API", () => {
  it("should signup a user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should signin a user", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail signin with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid password");
  });

  it("should fail signup with duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Test",
        last_name: "User2",
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(500); // or 400 if you handle duplicate email differently
    expect(res.body).toHaveProperty("error");
  });
});
