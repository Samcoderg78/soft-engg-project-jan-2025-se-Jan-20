const request = require('supertest');
const { app } = require('../../app');  // Adjust the path as necessary
const mongoose = require('mongoose');
const Task = require('../model/dr');  // Ensure this import is correct

describe('Deadlines & Reminders API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    // Reset the database before each test to ensure a clean state
    await Task.deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe('POST /api/dr/add', () => {
    it('should add a new task', async () => {
      const newTask = {
        name: 'Task 1',
        subject: 'Math',
        deadline: '2025-03-10T10:00:00Z',
        priority: 'High'
      };

      const response = await request(app)
        .post('/api/dr/add')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(newTask.name);
      expect(response.body.subject).toBe(newTask.subject);
    });

    it('should return error if task with the same name and subject already exists', async () => {
      const existingTask = new Task({
        name: 'Task 1',
        subject: 'Math',
        deadline: '2025-03-10T10:00:00Z',
        priority: 'High'
      });

      await existingTask.save();

      const newTask = {
        name: 'Task 1',  // Same name and subject as existing task
        subject: 'Math',
        deadline: '2025-03-12T10:00:00Z',
        priority: 'Low'
      };

      const response = await request(app)
        .post('/api/dr/add')
        .send(newTask);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Task with the same name and subject already exists');
    });
  });

  describe('GET /api/dr/', () => {
    it('should fetch all tasks', async () => {
      const task1 = new Task({
        name: 'Task 1',
        subject: 'Math',
        deadline: '2025-03-10T10:00:00Z',
        priority: 'High'
      });
      const task2 = new Task({
        name: 'Task 2',
        subject: 'Science',
        deadline: '2025-03-12T10:00:00Z',
        priority: 'Medium'
      });

      await task1.save();
      await task2.save();

      const response = await request(app).get('/api/dr/');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);  // There should be two tasks in the DB
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0].name).toBe('Task 1');
      expect(response.body[1].name).toBe('Task 2');
    });
  });

  describe('DELETE /api/dr/:id', () => {
    it('should delete a task', async () => {
      const newTask = new Task({
        name: 'Task 1',
        subject: 'Math',
        deadline: '2025-03-10T10:00:00Z',
        priority: 'High'
      });

      const savedTask = await newTask.save();

      const response = await request(app).delete(`/api/dr/${savedTask._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(response.body.deletedTask.name).toBe('Task 1');
    });

    it('should return 404 if task not found', async () => {
      const invalidTaskId = new mongoose.Types.ObjectId();  // Generate an invalid ID

      const response = await request(app).delete(`/api/dr/${invalidTaskId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 500 for invalid task ID format', async () => {
      const invalidId = 'invalidId123'; // Invalid ID format

      const response = await request(app).delete(`/api/dr/${invalidId}`);

      expect(response.status).toBe(500);  // Expecting a 500 due to lack of validation in the controller
      expect(response.body.message).toBe('Error deleting task');
    });
  });
});
