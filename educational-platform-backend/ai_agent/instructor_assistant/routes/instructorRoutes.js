// instructor-assistant/routes/instructorRoutes.js
const express = require('express');
const router = express.Router();
const { handleSupplementaryContent, handleInstructorQueryRequest } = require('../controllers/instructorController');

// Supplementary content endpoint
router.post('/supplementary-content', handleSupplementaryContent);

// Instructor query endpoint
router.post('/instructor-query', handleInstructorQueryRequest);

module.exports = router;