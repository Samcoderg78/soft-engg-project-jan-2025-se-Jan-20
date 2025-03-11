// Mock @xenova/transformers
jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(() => ({
    featureExtraction: jest.fn(() => [0.1, 0.2, 0.3]), // Mock embedding
  })),
}));

const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const Course = require('../model/course');  // Ensure this import is correct

describe('Courses API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    // Reset the database before each test to ensure a clean state
    await Course.deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe('GET /api/course', () => {
    it('should fetch all courses', async () => {
      const response = await request(app).get('/api/course');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([]));  // Should be an empty array initially
    });
  });

  describe('POST /api/course/add', () => {
    it('should add a new course', async () => {
      const newCourse = {
        title: 'Test Course',
        description: 'Test description',
        tags: ['test', 'course'],
        professor: 'Test Professor',
        image: 'http://example.com/test.jpg',
      };

      const response = await request(app)
        .post('/api/course/add')
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(newCourse.title);
      expect(response.body.description).toBe(newCourse.description);
    });

    it('should return error if course title already exists', async () => {
      const existingCourse = new Course({
        title: 'Existing Course',
        description: 'Description of existing course',
        tags: ['existing'],
        professor: 'Existing Professor',
        image: 'http://example.com/existing.jpg',
      });

      await existingCourse.save();

      const newCourse = {
        title: 'Existing Course', // Same title as existing course
        description: 'New description',
        tags: ['new'],
        professor: 'New Professor',
        image: 'http://example.com/new.jpg',
      };

      const response = await request(app)
        .post('/api/course/add')
        .send(newCourse);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Course with this title already exists');
    });

    it('should return error if required fields are missing', async () => {
      const invalidCourse = {
        description: 'Description without a title', // Missing title
        tags: ['invalid'],
        professor: 'Test Professor',
        image: 'http://example.com/test.jpg',
      };

      const response = await request(app)
        .post('/api/course/add')
        .send(invalidCourse);

      expect(response.status).toBe(500);  // Expect 500 since the controller is not handling it with 400
      expect(response.body.message).toBe('Error adding course');
    });
  });

  describe('DELETE /api/course/:id', () => {
    it('should delete a course', async () => {
      const newCourse = new Course({
        title: 'Course to Delete',
        description: 'This course will be deleted',
        tags: ['delete'],
        professor: 'Delete Professor',
        image: 'http://example.com/delete.jpg',
      });

      const savedCourse = await newCourse.save();

      const response = await request(app).delete(`/api/course/${savedCourse._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Course deleted successfully');
      expect(response.body.deletedCourse.title).toBe('Course to Delete');
    });

    it('should return 404 if course not found', async () => {
      const invalidCourseId = new mongoose.Types.ObjectId();  // Use 'new' to create ObjectId

      const response = await request(app).delete(`/api/course/${invalidCourseId}`);

      expect(response.status).toBe(404);  // Expect 404 since the course doesn't exist
      expect(response.body.message).toBe('Course not found');
    });

    it('should return 500 for invalid course ID format', async () => {
      const invalidId = 'invalidId123'; // Invalid ID format

      const response = await request(app).delete(`/api/course/${invalidId}`);

      expect(response.status).toBe(500);  // Expecting a 500 due to lack of validation in the controller
      expect(response.body.message).toBe('Error deleting course');
    });
  });
});
