const express = require('express');
const router = express.Router();
const { simplifyTopicHandler } = require('../controller/aiController');

// POST /api/ai/simplify - Simplify a topic
router.post('/simplify', simplifyTopicHandler);

module.exports = router;