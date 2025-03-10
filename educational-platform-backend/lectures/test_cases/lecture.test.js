// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require("supertest");
const { app } = require("../../app");  // Adjust the path to your app.js
const mongoose = require("mongoose");
const Lecture = require("../model/lecture");

describe("Lectures API", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  beforeEach(async () => {
    // Reset the database before each test to ensure a clean state
    await Lecture.deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe("POST /api/lecture/add", () => {
    it("should add a new lecture", async () => {
      const newLecture = {
        course: "Math101",
        week: 1,
        lectureNumber: 1,
        title: "Lecture 1: Introduction",
        description: "This is an introductory lecture to Math101",
        videoUrl: "http://example.com/video1",
      };

      const response = await request(app).post("/api/lecture/add").send(newLecture);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.course).toBe(newLecture.course);
      expect(response.body.week).toBe(newLecture.week);
      expect(response.body.lectureNumber).toBe(newLecture.lectureNumber);
      expect(response.body.title).toBe(newLecture.title);
      expect(response.body.description).toBe(newLecture.description);
      expect(response.body.videoUrl).toBe(newLecture.videoUrl);
    });

    it("should return error if the lecture already exists", async () => {
      const existingLecture = new Lecture({
        course: "Math101",
        week: 1,
        lectureNumber: 1,
        title: "Lecture 1: Introduction",
        description: "This is an introductory lecture to Math101",
        videoUrl: "http://example.com/video1",
      });

      await existingLecture.save();

      const newLecture = {
        course: "Math101",
        week: 1,
        lectureNumber: 1,
        title: "Lecture 1: Introduction",
        description: "This is an introductory lecture to Math101",
        videoUrl: "http://example.com/video1",
      };

      const response = await request(app).post("/api/lecture/add").send(newLecture);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Lecture already exists for this course, week, and lecture number");
    });
  });

  describe("GET /api/lecture/:course/:week", () => {
    it("should fetch lectures for a specific course and week", async () => {
      const lecture1 = new Lecture({
        course: "Math101",
        week: 1,
        lectureNumber: 1,
        title: "Lecture 1: Introduction",
        description: "This is an introductory lecture to Math101",
        videoUrl: "http://example.com/video1",
      });

      const lecture2 = new Lecture({
        course: "Math101",
        week: 1,
        lectureNumber: 2,
        title: "Lecture 2: Advanced Topics",
        description: "This lecture covers advanced topics in Math101",
        videoUrl: "http://example.com/video2",
      });

      await lecture1.save();
      await lecture2.save();

      const response = await request(app).get("/api/lecture/Math101/1");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2); // Two lectures for the course Math101 and week 1
      expect(response.body[0].title).toBe("Lecture 1: Introduction");
      expect(response.body[1].title).toBe("Lecture 2: Advanced Topics");
    });

    it("should return a 404 if no lectures are found for the given course and week", async () => {
      const response = await request(app).get("/api/lecture/Math101/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No lectures found for course Math101 in week 999");
    });
  });
});
