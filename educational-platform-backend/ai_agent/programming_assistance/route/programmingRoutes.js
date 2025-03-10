const express = require('express');
const router = express.Router();
const { handleProgrammingHint, handleCodeReview } = require('../controller/programmingController');

// Programming assistance endpoint
router.post('/programming-hint', handleProgrammingHint);

// Code review endpoint
router.post('/code-review', handleCodeReview);

module.exports = router;