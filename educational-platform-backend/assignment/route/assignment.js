const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignment");

router.get("/:course_id", assignmentController.getAllAssignments);
router.get("/questions/:assignment_id", assignmentController.getAssignmentQuestions);
router.post("/submit", assignmentController.submitAssignment);
router.post("/create", assignmentController.createAssignment);
router.post("/questions/add", assignmentController.createAssignmentQuestion);
router.get("/response/:user_id/:assignment_id", assignmentController.getAssignmentResponse);


module.exports = router;