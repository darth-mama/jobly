const request = require("supertest");
const jwt = require("jsonwebtoken");
const express = require("express");
const { SECRET_KEY } = require("../config");
const jobRoutes = require("../routes/jobs"); // Adjust the path to your job routes
const { BadRequestError } = require("../expressError"); // Adjust the path to your custom error

// Mock token payload for an admin user
const adminUser = { username: "admin", isAdmin: true };

// Create an Express app and use the job routes
const app = express();
app.use(express.json());

// Mock authenticateJWT middleware
app.use((req, res, next) => {
  try {
    res.locals.user = adminUser; // Simulate a logged-in admin user
    return next();
  } catch (err) {
    return next();
  }
});

// Mock ensureAdmin middleware
app.use((req, res, next) => {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// Use the job routes
app.use("/jobs", jobRoutes);

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof BadRequestError) {
    return res
      .status(err.status)
      .json({ error: { message: err.message, status: err.status } });
  }
  return res
    .status(err.status || 500)
    .json({ error: { message: err.message, status: err.status || 500 } });
});

describe("POST /jobs", () => {
  test("should return 400 for invalid job data with authorized admin", async () => {
    const invalidJobData = {
      // Missing required 'title' and 'companyHandle'
      invalidField: "This should fail",
    };

    // Simulate an authorized admin user by providing a valid token
    const token = jwt.sign(adminUser, SECRET_KEY);

    const response = await request(app)
      .post("/jobs")
      .send(invalidJobData)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.error).toBeTruthy();
    expect(response.body.error.message).toContain(
      'instance requires property "title"'
    );
  });
});
