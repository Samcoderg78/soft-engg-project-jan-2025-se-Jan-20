const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignment");

router.get("/:course_id", assignmentController.getAllAssignments);
router.get("/questions/:assignment_id", assignmentController.getAssignmentQuestions);
router.post("/submit", assignmentController.submitAssignment);

module.exports = router;
