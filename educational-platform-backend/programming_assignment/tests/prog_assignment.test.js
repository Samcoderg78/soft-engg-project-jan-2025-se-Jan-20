jest.mock("@xenova/transformers", () => ({
    pipeline: jest.fn(() => ({
      featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
    })),
  }));

const request = require("supertest");
const { app } = require("../../app");
const mongoose = require("mongoose");

describe('Programming Assignment API Tests', () => {
    describe('POST /api/prog-assignment/create', () => {
        it('should create a new programming assignment with valid fields', async () => {
            const newAssignment = {
                course_id: 'course123',
                title: 'New Assignment',
                type: 'graded',
                question: 'Solve this problem',
                due_date: '2025-12-31T23:59:59Z',
                total_marks: 100
            };

            const response = await request(app)
                .post('/api/prog-assignment/create')
                .send(newAssignment)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'Programming assignment created successfully');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/prog-assignment/create')
                .send({})
                .expect(400);

            expect(response.body.message).toBe('All fields are required');
        });
    });

    describe('POST /api/prog-assignment/submit', () => {
        it('should submit an assignment response successfully', async () => {
            const submission = {
                user_id: 'user001',
                assignment_id: '65d9e1234f5a6b7890c12345',
                course_id: 'abc123',
                response: "print('Hello, World!')",
                actual_output: 'Hello, World!'
            };

            const response = await request(app)
                .post('/api/prog-assignment/submit')
                .send(submission)
                .expect(201);

            console.log(response.body);  // Debugging: Check API response
            expect(response.body).toHaveProperty('message', 'Response submitted successfully');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/prog-assignment/submit')
                .send({})
                .expect(400);

            expect(response.body.message).toBe('All fields are required');
        });
    });

    describe('GET /api/prog-assignment/score/:user_id/:assignment_id', () => {
        it('should return the score of a given user for a specific assignment', async () => {
            const response = await request(app)
                .get('/api/prog-assignment/score/user123/assignment123')
                .expect(200);

            expect(response.body).toHaveProperty('score');
        });

        it('should return 404 if the score is not found', async () => {
            const response = await request(app)
                .get('/api/prog-assignment/score/nonexistent_user/nonexistent_assignment')
                .expect(404);

            expect(response.body.message).toBe('No score found for this assignment');
        });
    });

    describe('POST /api/prog-assignment/score/update', () => {
        it("should update a user\'s assignment score", async () => {
            const scoreUpdate = {
                user_id: 'user123',
                assignment_id: 'assignment123',
                score: 90
            };

            const response = await request(app)
                .post('/api/prog-assignment/score/update')
                .send(scoreUpdate)
                .expect(200);

            expect(response.body.message).toBe('Score updated successfully');
        });
    });
});


  afterAll(async () => {
    await mongoose.connection.close();
  });