const express = require("express");
const router = express.Router();
const progAssignmentController = require("../controller/progAssignmentController");

// Create a new programming assignment
router.post("/create", progAssignmentController.createProgAssignment);

// Get all programming assignments
router.get("/all", progAssignmentController.getAllProgAssignments);

// Get programming assignments for a specific course
router.get("/course/:course_id", progAssignmentController.getProgAssignmentsByCourse);

// Get a specific programming assignment by ID
router.get("/:assignment_id", progAssignmentController.getProgAssignmentById);

// Submit a programming assignment response
router.post("/submit", progAssignmentController.submitProgAssignment);

// Get a programming assignment score
router.get("/score/:user_id/:assignment_id", progAssignmentController.getProgAssignmentScore);

// Update a programming assignment score
router.post("/score/update", progAssignmentController.updateProgAssignmentScore);

// Route to get all responses for a course
router.get("/responses/course/:course_id", progAssignmentController.getAllResponsesForCourse);

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const progAssignmentController = require("../controller/progAssignmentController");


// // Create a new programming assignment
// router.post("/create", progAssignmentController.createProgAssignment);

// // Get all programming assignments
// router.get("/all", progAssignmentController.getAllProgAssignments);

// // Get a specific programming assignment by ID
// router.get("/:id", progAssignmentController.getProgAssignmentById);


// // Get all programming assignments for a given course
// router.get("/:course_id", progAssignmentController.getAllProgAssignments);

// // Get a specific programming assignment by ID
// router.get("/assignment/:assignment_id", progAssignmentController.getProgAssignment);

// // Submit a programming assignment response
// router.post("/submit", progAssignmentController.submitProgAssignment);

// // Get programming assignment score
// router.get("/score/:user_id/:assignment_id", progAssignmentController.getProgAssignmentScore);

// // Update programming assignment score
// router.post("/score/update", progAssignmentController.updateProgAssignmentScore);

// module.exports = router;
