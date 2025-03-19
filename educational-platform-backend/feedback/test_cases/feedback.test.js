// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app"); // Ensure this points to your main Express app
const Feedback = require("../models/feedbackModel");

describe("Feedback API", () => {
  // ✅ Connect to test database before running tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  // ✅ Clean database before each test
  beforeEach(async () => {
    await Feedback.deleteMany({});
  });

  // ✅ Close database connection after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/feedback/submit", () => {
    it("should successfully submit feedback", async () => {
      const feedbackData = {
        user_id: new mongoose.Types.ObjectId().toString(),
        course_id: new mongoose.Types.ObjectId().toString(),
        feedback_string: "Great course!",
        rating: 5,
      };

      const response = await request(app).post("/api/feedback/submit").send(feedbackData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Feedback submitted successfully");
      expect(response.body.feedback).toHaveProperty("feedback_string", "Great course!");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/feedback/submit").send({
        user_id: new mongoose.Types.ObjectId().toString(),
        course_id: new mongoose.Types.ObjectId().toString(),
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "All fields are required");
    });

    it("should return 400 if rating is out of range", async () => {
      const feedbackData = {
        user_id: new mongoose.Types.ObjectId().toString(),
        course_id: new mongoose.Types.ObjectId().toString(),
        feedback_string: "Bad rating",
        rating: 10, // Invalid rating (out of range)
      };

      const response = await request(app).post("/api/feedback/submit").send(feedbackData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Rating is out of range");
    });
  });

  describe("GET /api/feedback/course/:course_id", () => {
    it("should fetch feedback for a valid course", async () => {
      const feedbackData = {
        user_id: new mongoose.Types.ObjectId().toString(),
        course_id: new mongoose.Types.ObjectId().toString(),
        feedback_string: "Informative course",
        rating: 4,
      };

      await new Feedback(feedbackData).save();

      const response = await request(app).get(`/api/feedback/course/${feedbackData.course_id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("feedbacks");
      expect(response.body.feedbacks.length).toBe(1);
      expect(response.body.feedbacks[0]).toHaveProperty("feedback_string", "Informative course");
    });

    it("should return 404 if no feedback found for the course", async () => {
      const response = await request(app).get(`/api/feedback/course/${new mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No feedback found for this course");
    });

    it("should return 400 if course_id format is invalid", async () => {
      const response = await request(app).get(`/api/feedback/course/invalidCourseId`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid course_id format");
    });
  });
});
