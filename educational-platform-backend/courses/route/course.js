const express = require('express');
const router = express.Router();
const courseController = require('../controller/course');


router.get('/', courseController.getAllCourses);  
router.get('/single/:id', courseController.getCourseById); 
router.get('/:userId', courseController.getEnrolledCourses);  
router.post('/add', courseController.addCourse);  
router.delete('/:id', courseController.deleteCourse);

module.exports = router;


