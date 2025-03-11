const express = require('express');
const router = express.Router();
const { handleAIRequest, handleAssignmentRequest, handleResourceRequest } = require('../controller/aiAgentController');

// Route for /ask-ai
router.post('/ask-ai', (req, res) => {
    handleAIRequest(req, res);
});

// Route for /ask (assignment-related queries)
router.post('/ask', (req, res) => {
    handleAssignmentRequest(req, res);
});

// Route for /ask-resources (resource-related queries)
router.post('/ask-resources', (req, res) => {
    handleResourceRequest(req, res);
});

module.exports = router;