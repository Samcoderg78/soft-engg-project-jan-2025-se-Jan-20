const express = require('express');
const router = express.Router();
const { handleInstructorQueryRequest } = require('../controllers/instructorController');

// Instructor query endpoint
router.post('/instructor-query', handleInstructorQueryRequest);

module.exports = router;