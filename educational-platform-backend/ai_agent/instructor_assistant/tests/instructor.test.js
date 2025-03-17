const request = require("supertest");
const { app } = require("../../../app"); // Adjust the path to your app entry point
const mongoose = require("mongoose");
const Instructor = require("../models/instructorModel"); // Adjust the path to your model

// Mock the @xenova/transformers library
jest.mock("@xenova/transformers", () => ({
    pipeline: jest.fn(() => async () => [0.1, 0.2, 0.3]) // Return a plain array
}));

// Mock the Instructor model
jest.mock("../models/instructorModel", () => ({
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  create: jest.fn(),
}));

describe("Instructor API Tests", () => {
  // Test data
  const instructorQueryData = {
    query: "How to teach Python effectively?",
  };

  // Clean up the database after all tests
  afterAll(async () => {
    await mongoose.connection.close(); // Close the database connection

    // Close the server instance
    if (app && app.close) {
      await new Promise((resolve) => app.close(resolve));
    }
  });

  // Test /instructor-query endpoint
  describe("POST /instructor-query", () => {
    it("should provide a response for a valid query", async () => {
      // Mock the service response
      Instructor.findOne.mockResolvedValue(null); // No exact match
      Instructor.countDocuments.mockResolvedValue(0); // No documents in the collection
      Instructor.create.mockResolvedValue({}); // Mock database save

      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send(instructorQueryData)
        .expect(200);

      expect(response.body).toHaveProperty("response");
      expect(response.body.response).toBeTruthy(); // Ensure a response is provided
    });

    it("should fail when the query is missing", async () => {
      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send({}) // Missing query
        .expect(500); // Expecting a 500 error due to invalid query

      expect(response.body.message).toBe("Error processing request.");
    });

    it("should return an exact match if found in the database", async () => {
      // Mock an exact match in the database
      Instructor.findOne.mockResolvedValue({
        query: "How to teach Python effectively?",
        response: "Use interactive coding exercises and real-world examples.",
      });

      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send(instructorQueryData)
        .expect(200);

      expect(response.body.response).toBe(
        "Use interactive coding exercises and real-world examples."
      );
    });

    it("should perform semantic search if no exact match is found", async () => {
      // Mock no exact match but similar documents via vector search
      Instructor.findOne.mockResolvedValue(null); // No exact match
      Instructor.countDocuments.mockResolvedValue(1); // Documents exist
      Instructor.aggregate.mockResolvedValue([
        {
          query: "Teaching Python to beginners",
          response: "Start with basic syntax and gradually introduce concepts.",
        },
      ]);

      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send(instructorQueryData)
        .expect(200);

      expect(response.body.response).toBeTruthy(); // Ensure a response is provided
    });
  });

  // Test the handleInstructorQuery function
  describe("handleInstructorQuery", () => {
    it("should generate a new response if no match is found", async () => {
      // Mock no exact match and no similar documents
      Instructor.findOne.mockResolvedValue(null); // No exact match
      Instructor.countDocuments.mockResolvedValue(0); // No documents in the collection
      Instructor.create.mockResolvedValue({}); // Mock database save

      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send(instructorQueryData)
        .expect(200);

      expect(response.body.response).toBeTruthy(); // Ensure a response is generated
    });

    it("should throw an error for an invalid query", async () => {
      const response = await request(app)
        .post("/api/instructor/instructor-query")
        .send({ query: "" }) // Empty query
        .expect(500);

      expect(response.body.message).toBe("Error processing request.");
    });
  });

  // Test the generateEmbedding function
  describe("generateEmbedding", () => {
    it("should return null for empty text", async () => {
      const embedding = await require("../services/instructorService").generateEmbedding(
        ""
      );

      expect(embedding).toBeNull(); // Ensure null is returned for empty text
    });
  });
});