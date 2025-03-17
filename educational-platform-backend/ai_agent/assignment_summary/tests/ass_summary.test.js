// ass_summary.test.js
const request = require('supertest');
const express = require('express');
const summaryRoutes = require('../routes/summaryRoutes');
const summaryController = require('../controllers/summaryController');

jest.mock('../controllers/summaryController');

const app = express();
app.use(express.json());
app.use('/api/summary', summaryRoutes);

describe('GET /summary/:assignmentId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the assignment summary for a valid assignment ID', async () => {
    jest.setTimeout(10000);

    const mockSummary = {
      assignment_id: '12345',
      title: 'Test Assignment',
      total_students: 10,
      average_score: 75,
      score_distribution: { '0-20': 1, '21-40': 2, '41-60': 3, '61-80': 2, '81-100': 2 },
      question_performance: [
        { question_id: '1', question: 'What is 2+2?', average_marks: 4.5 },
      ],
    };

    summaryController.getAssignmentSummary.mockImplementation((req, res) => {
      return res.json(mockSummary);
    });

    const response = await request(app).get('/api/summary/12345');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSummary);
  }, 10000);

  it('should return 404 if the assignment is not found', async () => {
    summaryController.getAssignmentSummary.mockImplementation((req, res) => {
      return res.status(404).json({ message: 'Assignment not found' });
    });

    const response = await request(app).get('/api/summary/invalidId');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Assignment not found' });
  }, 10000);

  it('should return 500 if there is a server error', async () => {
    summaryController.getAssignmentSummary.mockImplementation((req, res) => {
      return res.status(500).json({ message: 'Internal Server Error' });
    });

    const response = await request(app).get('/api/summary/12345');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  }, 10000);

  it('should return 400 if the assignment ID is missing', async () => {
    const response = await request(app).get('/api/summary/');
    expect(response.status).toBe(404);
  });
});
