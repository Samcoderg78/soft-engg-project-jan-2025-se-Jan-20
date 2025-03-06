const express = require("express");
const router = express.Router();
const { takeNote, getNotesByLecture, getNotesByCourse, getNotesByUser } = require("../controller/tn");

router.post("/take_note", takeNote);
router.get("/lecture/:lecture_id", getNotesByLecture);
router.get("/course/:course_id", getNotesByCourse); 
router.get("/user/:user_id", getNotesByUser);

module.exports = router;
