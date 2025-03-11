const request = require('supertest');
const { app } = require('../../app');

describe('Programming Assignment API Tests', () => {
    describe('POST /prog-assignment/create', () => {
        it('should successfully create a programming assignment', async () => {
            const assignmentData = {
                title: 'Recursion Basics',
                description: 'Solve problems using recursion.',
                course_id: 'course123',
                due_date: '2025-04-01T12:00:00Z'
            };

            const response = await request(app)
                .post('/prog-assignment/create')
                .send(assignmentData)
                .expect(201);

            expect(response.body.message).toBe('Assignment created successfully!');
            expect(response.body.data).toHaveProperty('title', assignmentData.title);
        });
    });

    describe('GET /prog-assignment/all', () => {
        it('should retrieve all programming assignments', async () => {
            const response = await request(app)
                .get('/prog-assignment/all')
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /prog-assignment/course/:course_id', () => {
        it('should retrieve assignments for a specific course', async () => {
            const response = await request(app)
                .get('/prog-assignment/course/course123')
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /prog-assignment/:assignment_id', () => {
        it('should retrieve details of a specific assignment', async () => {
            const response = await request(app)
                .get('/prog-assignment/assignment123')
                .expect(200);

            expect(response.body.data).toHaveProperty('title');
        });
    });

    describe('POST /prog-assignment/submit', () => {
        it('should allow a student to submit an assignment', async () => {
            const submissionData = {
                assignment_id: 'assignment123',
                user_id: 'user123',
                solution_code: 'print("Hello World")'
            };

            const response = await request(app)
                .post('/prog-assignment/submit')
                .send(submissionData)
                .expect(201);

            expect(response.body.message).toBe('Assignment submitted successfully!');
        });
    });

    describe('GET /prog-assignment/responses/course/:course_id', () => {
        it('should retrieve all responses for assignments in a course', async () => {
            const response = await request(app)
                .get('/prog-assignment/responses/course/course123')
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /prog-assignment/score/:user_id/:assignment_id', () => {
        it('should retrieve the score of a student for an assignment', async () => {
            const response = await request(app)
                .get('/prog-assignment/score/user123/assignment123')
                .expect(200);

            expect(response.body.data).toHaveProperty('score');
        });
    });

    describe('POST /prog-assignment/score/update', () => {
        it('should update the score of an assignment submission', async () => {
            const scoreUpdateData = {
                user_id: 'user123',
                assignment_id: 'assignment123',
                new_score: 95
            };

            const response = await request(app)
                .post('/prog-assignment/score/update')
                .send(scoreUpdateData)
                .expect(200);

            expect(response.body.message).toBe('Score updated successfully!');
        });
    });
});
