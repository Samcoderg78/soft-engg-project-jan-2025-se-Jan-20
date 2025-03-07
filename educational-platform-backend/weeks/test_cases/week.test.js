const request = require("supertest");
const { app } = require("../../app");
const mongoose = require("mongoose");
const Week = require("../model/week");

describe("Week API", () => {
    let weekData;

    beforeAll(async () => {

        // Sample week data for testing
        weekData = {
            courseId: new mongoose.Types.ObjectId(),
            weekNumber: 1,
            title: "Introduction to Programming",
            description: "This week covers the basics of programming.",
            lecture: ["Lecture 1", "Lecture 2"],
        };
    });

    afterEach(async () => {
        // Clean up the database after each test
        await Week.deleteMany({});
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    it("should add a new week", async () => {
        const response = await request(app)
            .post("/api/week/add") // Updated route to match the mounted route
            .send(weekData)
            .expect(201);

        expect(response.body).toHaveProperty("_id");
        expect(response.body.courseId).toBe(weekData.courseId.toString());
        expect(response.body.weekNumber).toBe(weekData.weekNumber);
        expect(response.body.title).toBe(weekData.title);
        expect(response.body.description).toBe(weekData.description);
        expect(response.body.lecture).toEqual(weekData.lecture);
    });

    it("should return 400 if week already exists for the course", async () => {
        // Add the same week first
        await request(app).post("/api/week/add").send(weekData).expect(201);

        // Try to add the same week again
        const response = await request(app)
            .post("/api/week/add")
            .send(weekData)
            .expect(400);

        expect(response.body).toHaveProperty("message", "Week already exists for this course");
    });

    it("should fetch weeks for a specific course", async () => {
        // Add a week first
        await request(app).post("/api/week/add").send(weekData).expect(201);

        // Fetch weeks for the course
        const response = await request(app)
            .get(`/api/week/course/${weekData.courseId}`) // Updated route to match the mounted route
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].courseId).toBe(weekData.courseId.toString());
    });

    it("should fetch a specific week by ID", async () => {
        // First, add a week to get its ID
        const addResponse = await request(app)
            .post("/api/week/add")
            .send(weekData)
            .expect(201);

        const weekId = addResponse.body._id;

        // Fetch the week by ID
        const response = await request(app)
            .get(`/api/week/${weekId}`) // Updated route to match the mounted route
            .expect(200);

        expect(response.body).toHaveProperty("_id", weekId);
        expect(response.body.courseId).toBe(weekData.courseId.toString());
        expect(response.body.weekNumber).toBe(weekData.weekNumber);
        expect(response.body.title).toBe(weekData.title);
        expect(response.body.description).toBe(weekData.description);
        expect(response.body.lecture).toEqual(weekData.lecture);
    });

    it("should return 404 if week is not found by ID", async () => {
        const invalidWeekId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/api/week/${invalidWeekId}`) // Updated route to match the mounted route
            .expect(404);

        expect(response.body).toHaveProperty("message", "Week not found");
    });

    it("should return 500 if there is a server error", async () => {
        // Mock the Week.find method to throw an error
        jest.spyOn(Week, 'find').mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await request(app)
            .get(`/api/week/course/${weekData.courseId}`) // Updated route to match the mounted route
            .expect(500);

        expect(response.body).toHaveProperty("message", "Error fetching weeks for the course");
    });
});