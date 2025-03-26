const express = require('express');
const { getCourseIdsByUserId } = require('../controller/enrollmentController');

const router = express.Router();

// Route to get enrollments by user_id
router.get('/user/:userId/courses', getCourseIdsByUserId);

module.exports = router;
