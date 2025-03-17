jest.mock("@xenova/transformers", () => ({
    pipeline: jest.fn(() => ({
      featureExtraction: jest.fn(() => Promise.resolve(new Float32Array([0.1, 0.2, 0.3]))), // Mock embedding
    })),
  }));
  
  const request = require("supertest");
  const { app } = require("../../../app"); 
  const mongoose = require("mongoose");
  const Programming = require("../model/programmingModel"); 
  
  // Mock the Programming model
  jest.mock("../model/programmingModel", () => ({
    create: jest.fn().mockResolvedValue({}),
    aggregate: jest.fn().mockResolvedValue([]),
    deleteMany: jest.fn().mockResolvedValue({}),
  }));
  
  describe("Programming API Tests", () => {
    // Test data
    const programmingHintData = {
      query: "reverse a list in Python",
      context: "Python programming basics",
    };
  
    const codeReviewData = {
      code: "def add(a, b):\n    return a - b",
      context: "Python function to add two numbers",
    };
  
    // Clean up the database after all tests
    afterAll(async () => {
      await Programming.deleteMany({}); // Clean up test data
      await mongoose.connection.close(); // Close the database connection
  
      // Close the server instance
      if (app && app.close) {
        await new Promise((resolve) => app.close(resolve));
      }
    });
  
    // Test /programming-hint endpoint
    describe("POST /programming-hint", () => {
      it("should provide a hint for a programming query", async () => {
        const response = await request(app)
          .post("/api/programming/programming-hint")
          .send(programmingHintData)
          .expect(200);
  
        expect(response.body).toHaveProperty("hint");
        expect(response.body.hint).toBeTruthy(); // Ensure a hint is provided
      });
  
      it("should fail when required fields are missing", async () => {
        const incompleteData = {
          query: "reverse a list in Python", // Missing context
        };
  
        const response = await request(app)
          .post("/api/programming/programming-hint")
          .send(incompleteData)
          .expect(400);
  
        expect(response.body.message).toBe("Missing required fields");
      });
    });
  
    // Test /code-review endpoint
    describe("POST /code-review", () => {
      it("should review code and provide feedback", async () => {
        const response = await request(app)
          .post("/api/programming/code-review")
          .send(codeReviewData)
          .expect(200);
  
        expect(response.body).toHaveProperty("feedback");
        expect(response.body.feedback).toBeTruthy(); // Ensure feedback is provided
      });
  
      it("should provide the complete solution if the code is incorrect", async () => {
        const response = await request(app)
          .post("/api/programming/code-review")
          .send(codeReviewData)
          .expect(200);
  
        expect(response.body.feedback).toContain("Corrected code"); // Match the actual feedback format
      });
  
      it("should fail when required fields are missing", async () => {
        const incompleteData = {
          code: "def add(a, b):\n    return a - b", // Missing context
        };
  
        const response = await request(app)
          .post("/api/programming/code-review")
          .send(incompleteData)
          .expect(400);
  
        expect(response.body.message).toBe("Missing required fields");
      });
    });
  });