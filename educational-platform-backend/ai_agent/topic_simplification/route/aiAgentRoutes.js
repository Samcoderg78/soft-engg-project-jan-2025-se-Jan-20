const express = require('express');
const router = express.Router();
const { getSimplifiedResponse } = require('../controller/aiAgentController');

router.post('/ask-ai', getSimplifiedResponse);

module.exports = router;