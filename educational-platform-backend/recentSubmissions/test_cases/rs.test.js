// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require("supertest");
const { app } = require("../../app");  // Assuming app.js is your entry point
const mongoose = require("mongoose");
const { AssignmentResponse, ProgAssignmentResponse } = require("../model/rs");

describe("Recent Submissions API", () => {
  let assignmentResponseData;

  // Setup mock data before tests
  beforeAll(() => {
    assignmentResponseData = {
      user_id: "user123",
      assignment_id: new mongoose.Types.ObjectId(),  // Use 'new' here
      course_id: "course1",
      response: "Code Response",
      actual_output: "Output",
    };
  });

  it("should fetch the recent submissions for a user", async () => {
    const response = await request(app)
      .get(`/api/rs/recent_submissions/${assignmentResponseData.user_id}`)
      .expect(200);  

    expect(response.body).toHaveProperty("assignmentSubmissions");
    expect(response.body.assignmentSubmissions).toBeInstanceOf(Array);
  });

  it("should return 404 if user_id is not provided", async () => {
    const response = await request(app)
      .get("/api/rs/recent_submissions") 
      .expect(404);  

    expect(response.body).toEqual({});  
  });

  it("should return an empty array if no submissions found for the user", async () => {
    const response = await request(app)
      .get(`/api/rs/recent_submissions/user999`)  // Using a non-existent user_id   
      .expect(200);

    expect(response.body.assignmentSubmissions).toEqual([]);
  });

  
  it("should handle errors gracefully and return a 500 status on failure", async () => {
    
    const originalConsoleError = console.error;
    console.error = jest.fn();

    jest.spyOn(AssignmentResponse, 'find').mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get(`/api/rs/recent_submissions/${assignmentResponseData.user_id}`)
      .expect(500);  

    expect(response.body.message).toBe("Internal Server Error");

    console.error = originalConsoleError;
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  // No need to call app.close() for supertest.
});
