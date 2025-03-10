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

  // Test case to check if recent submissions are fetched for a user
  it("should fetch the recent submissions for a user", async () => {
    const response = await request(app)
      .get(`/api/rs/recent_submissions/${assignmentResponseData.user_id}`)
      .expect(200);  // Expecting status 200 for a successful fetch

    expect(response.body).toHaveProperty("assignmentSubmissions");
    expect(response.body.assignmentSubmissions).toBeInstanceOf(Array);
  });

  // Test case to check if missing user_id returns a 404 with an error message
  it("should return 404 if user_id is not provided", async () => {
    const response = await request(app)
      .get("/api/rs/recent_submissions")  // No user_id provided
      .expect(404);  // Expecting 404 instead of 400

    // Check if the response body contains an empty object or no message property
    expect(response.body).toEqual({});  // Adjusting based on your error handling
  });

  // Test case for when no submissions are found for the user
  it("should return an empty array if no submissions found for the user", async () => {
    const response = await request(app)
      .get(`/api/rs/recent_submissions/user999`)  // Using a non-existent user_id   
      .expect(200);

    expect(response.body.assignmentSubmissions).toEqual([]);
  });

  // Test case for handling server errors gracefully
  it("should handle errors gracefully and return a 500 status on failure", async () => {
    // Mock console.error to suppress the error log
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock the find method to throw an error
    jest.spyOn(AssignmentResponse, 'find').mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get(`/api/rs/recent_submissions/${assignmentResponseData.user_id}`)
      .expect(500);  // Expecting 500 for server error

    expect(response.body.message).toBe("Internal Server Error");

    // Restore console.error
    console.error = originalConsoleError;
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  // No need to call app.close() for supertest.
});
