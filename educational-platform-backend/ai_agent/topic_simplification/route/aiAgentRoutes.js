const express = require('express');
const router = express.Router();
const { handleAIRequest } = require('../controller/aiAgentController');

// Simplify lecture topics
router.post('/ask-ai', (req, res) => {
    req.body.type = 'simplification';
    handleAIRequest(req, res);
});

router.post('/ask-resources', (req, res) => {
    req.body.type = 'resources';
    handleAIRequest(req, res);
});

router.post('/ask', (req, res) => {
    req.body.type = 'assignment';
    handleAIRequest(req, res);
});

module.exports = router;