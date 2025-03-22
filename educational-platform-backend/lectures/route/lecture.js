const express = require('express');
const router = express.Router();
const lectureController = require('../controller/lecture');


router.post('/add', lectureController.addLecture);
router.get('/:course/:week', lectureController.getLecturesByCourseAndWeek);
router.get('/:lectureId', lectureController.getLectureById);

module.exports = router;
