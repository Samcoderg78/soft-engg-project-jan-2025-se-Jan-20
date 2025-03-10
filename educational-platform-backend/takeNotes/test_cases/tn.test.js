// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require("supertest");
const { app } = require("../../app");
const mongoose = require("mongoose");
const Notes = require("../model/tn");

describe("Notes API", () => {
  let noteData;

  beforeAll(() => {
    noteData = {
      user_id: new mongoose.Types.ObjectId(),
      lecture_id: new mongoose.Types.ObjectId(),
      course_id: new mongoose.Types.ObjectId(),
      note: "This is a note for lecture1 in course1",
    };
  });

  it("should add a new note", async () => {
    const response = await request(app)
      .post("/api/tn/take_note")
      .send(noteData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Note added successfully!");
    expect(response.body.note).toHaveProperty("user_id", noteData.user_id.toString());
    expect(response.body.note).toHaveProperty("lecture_id", noteData.lecture_id.toString());
    expect(response.body.note).toHaveProperty("course_id", noteData.course_id.toString());
    expect(response.body.note).toHaveProperty("note", noteData.note);
  });

  it("should return 400 if required fields are missing", async () => {
    const invalidData = { ...noteData, note: undefined };
    const response = await request(app)
      .post("/api/tn/take_note")
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "User ID, Lecture ID, Course ID, and Note are required");
  });

  it("should fetch notes for a specific lecture", async () => {
    const response = await request(app)
      .get(`/api/tn/lecture/${noteData.lecture_id}`)
      .expect(200);

    expect(response.body).toHaveProperty("notes");
    expect(response.body.notes).toBeInstanceOf(Array);
  });

  it("should fetch notes for a specific course", async () => {
    const response = await request(app)
      .get(`/api/tn/course/${noteData.course_id}`)
      .expect(200);

    expect(response.body).toHaveProperty("notes");
    expect(response.body.notes).toBeInstanceOf(Array);
  });

  it("should fetch notes for a specific user", async () => {
    const response = await request(app)
      .get(`/api/tn/user/${noteData.user_id}`)
      .expect(200);

    expect(response.body).toHaveProperty("notes");
    expect(response.body.notes).toBeInstanceOf(Array);
  });

  it("should return an empty array if no notes found for the lecture", async () => {
    const response = await request(app)
      .get(`/api/tn/lecture/${new mongoose.Types.ObjectId()}`)
      .expect(200);

    expect(response.body.notes).toEqual([]);
  });

  it("should return an empty array if no notes found for the course", async () => {
    const response = await request(app)
      .get(`/api/tn/course/${new mongoose.Types.ObjectId()}`)
      .expect(200);

    expect(response.body.notes).toEqual([]);
  });

  it("should return an empty array if no notes found for the user", async () => {
    const response = await request(app)
      .get(`/api/tn/user/${new mongoose.Types.ObjectId()}`)
      .expect(200);

    expect(response.body.notes).toEqual([]);
  });

  // Mocking invalid ObjectId format handling
  it("should return 400 if lecture_id format is invalid", async () => {
    const invalidLectureId = "invalidLectureIdFormat";
    const response = await request(app)
      .get(`/api/tn/lecture/${invalidLectureId}`)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid Lecture ID format");
  });

  it("should return 400 if course_id format is invalid", async () => {
    const invalidCourseId = "invalidCourseIdFormat";
    const response = await request(app)
      .get(`/api/tn/course/${invalidCourseId}`)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid Course ID format");
  });

  it("should return 400 if user_id format is invalid", async () => {
    const invalidUserId = "invalidUserIdFormat";
    const response = await request(app)
      .get(`/api/tn/user/${invalidUserId}`)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid User ID format");
  });

  // Mocking a database error
  it("should handle errors gracefully and return a 500 status on failure", async () => {
    // Mock console.error to suppress the error log
    const originalConsoleError = console.error;
    console.error = jest.fn();

    jest.spyOn(Notes, 'find').mockImplementationOnce(new Error("Database error"));

    const response = await request(app)
      .get(`/api/tn/user/${noteData.user_id}`)
      .expect(500);

    expect(response.body).toHaveProperty("message", "Internal Server Error");

    // Restore console.error
    console.error = originalConsoleError;
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
