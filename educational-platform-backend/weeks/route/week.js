const express = require('express');
const router = express.Router();
const weekController = require('../controller/week');  

router.post('/add', weekController.addWeek);
router.get('/course/:courseId', weekController.getWeeksForCourse);
router.get('/:id', weekController.getWeekById);

module.exports = router;
