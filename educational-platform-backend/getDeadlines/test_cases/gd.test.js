// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require("supertest");
const { app } = require("../../app");  // Adjust path as necessary
const mongoose = require("mongoose");
const { Assignment, ProgAssignment } = require("../model/gd");

describe("Get Deadlines API", () => {
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
    await Assignment.deleteMany({});
    await ProgAssignment.deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe("GET /api/gd/deadlines", () => {
    it("should fetch all deadlines", async () => {
      // Create some test assignments and progAssignments
      const assignment1 = new Assignment({
        course_id: "Math101",
        week: 1,
        title: "Assignment 1",
        type: "graded",
        due_date: new Date("2025-03-10T10:00:00Z"),
        total_marks: 100,
      });

      const assignment2 = new Assignment({
        course_id: "Math101",
        week: 2,
        title: "Assignment 2",
        type: "practice",
        due_date: new Date("2025-03-12T10:00:00Z"),
        total_marks: 50,
      });

      const progAssignment1 = new ProgAssignment({
        course_id: "Math101",
        title: "ProgAssignment 1",
        type: "graded",
        question: "What is 2 + 2?",
        due_date: new Date("2025-03-14T10:00:00Z"),
        total_marks: 150,
      });

      await assignment1.save();
      await assignment2.save();
      await progAssignment1.save();

      const response = await request(app).get("/api/gd/deadlines");

      expect(response.status).toBe(200);
      expect(response.body.assignments.length).toBe(2);  // Two assignments in the DB
      expect(response.body.progAssignments.length).toBe(1);  // One progAssignment in the DB
      expect(response.body.assignments[0].title).toBe("Assignment 1");
      expect(response.body.progAssignments[0].title).toBe("ProgAssignment 1");
    });

    it("should fetch deadlines for a specific course_id", async () => {
      const assignment1 = new Assignment({
        course_id: "Math101",
        week: 1,
        title: "Assignment 1",
        type: "graded",
        due_date: new Date("2025-03-10T10:00:00Z"),
        total_marks: 100,
      });

      const assignment2 = new Assignment({
        course_id: "Science101",
        week: 2,
        title: "Assignment 2",
        type: "practice",
        due_date: new Date("2025-03-12T10:00:00Z"),
        total_marks: 50,
      });

      await assignment1.save();
      await assignment2.save();

      const response = await request(app).get("/api/gd/deadlines?course_id=Math101");

      expect(response.status).toBe(200);
      expect(response.body.assignments.length).toBe(1);  // Only Math101 assignments should be fetched
      expect(response.body.progAssignments.length).toBe(0);  // No progAssignments should be fetched
      expect(response.body.assignments[0].title).toBe("Assignment 1");
    });

    it("should return an empty array if no assignments match the course_id", async () => {
      const response = await request(app).get("/api/gd/deadlines?course_id=NonExistingCourse");

      expect(response.status).toBe(200);
      expect(response.body.assignments).toEqual([]);
      expect(response.body.progAssignments).toEqual([]);
    });

    it("should return a 500 error if there is an internal server error", async () => {
      
      const originalConsoleError = console.error;
      console.error = jest.fn();

      await mongoose.connection.close();

      const response = await request(app).get("/api/gd/deadlines");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");

      console.error = originalConsoleError;
    });
  });
});
