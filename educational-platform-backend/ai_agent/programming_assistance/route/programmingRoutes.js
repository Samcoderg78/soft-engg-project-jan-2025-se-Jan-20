// programming-assistance/routes/programmingRoutes.js
const express = require('express');
const router = express.Router();
const { handleProgrammingHint, handleCodeReview, handleResourceRequest } = require('../controller/programmingController');

// Programming assistance endpoint
router.post('/programming-hint', handleProgrammingHint);

// Code review endpoint
router.post('/code-review', handleCodeReview);

// Resource recommendation endpoint
router.post('/programming-resources', handleResourceRequest);

module.exports = router;