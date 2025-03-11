const request = require('supertest');
const {app} = require('../../app');

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


});

