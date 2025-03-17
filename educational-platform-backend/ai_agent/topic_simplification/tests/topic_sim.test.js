// aiAgentRoutes.test.js
const request = require('supertest');
const express = require('express');
const aiAgentRoutes = require('../route/aiAgentRoutes');
const { handleAIRequest, handleAssignmentRequest, handleResourceRequest } = require('../controller/aiAgentController');

jest.mock("@xenova/transformers", () => ({
    pipeline: jest.fn(() => ({
      featureExtraction: jest.fn(() => Promise.resolve(new Float32Array([0.1, 0.2, 0.3]))), // Mock embedding
    })),
  }));

jest.mock('../controller/aiAgentController');

const app = express();
app.use(express.json());
app.use('/api/ai', aiAgentRoutes);

describe('AI Agent Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return AI-generated response for valid query', async () => {
    const mockResponse = { response: 'Mock AI Response' };
    handleAIRequest.mockImplementation((req, res) => res.json(mockResponse));

    const response = await request(app)
      .post('/api/ai/ask-ai')
      .send({ query: 'What is AI?' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return hints for an assignment query', async () => {
    const mockHints = { hints: ['Hint 1', 'Hint 2'] };
    handleAssignmentRequest.mockImplementation((req, res) => res.json(mockHints));

    const response = await request(app)
      .post('/api/ai/ask')
      .send({ query: 'Solve this equation' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockHints);
  });

  it('should return resources for a valid query', async () => {
    const mockResources = { resources: [{ type: 'Video', url: 'https://example.com', description: 'AI Tutorial' }] };
    handleResourceRequest.mockImplementation((req, res) => res.json(mockResources));

    const response = await request(app)
      .post('/api/ai/ask-resources')
      .send({ query: 'AI tutorials' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResources);
  });

  it('should return 400 if query is missing', async () => {
    handleAIRequest.mockImplementation((req, res) => {
        res.status(400).json({ message: 'Query is required' });
    });

    const response = await request(app).post('/api/ai/ask-ai').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Query is required' });
});

});
