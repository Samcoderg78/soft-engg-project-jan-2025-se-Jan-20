const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// POST: Submit feedback
router.post("/submit", feedbackController.postFeedback);

// GET: Get all feedback for a course
router.get("/course/:course_id", feedbackController.getFeedback);

module.exports = router;