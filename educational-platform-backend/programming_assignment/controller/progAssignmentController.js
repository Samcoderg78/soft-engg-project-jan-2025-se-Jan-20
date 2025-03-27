const ProgAssignment = require("../model/progAssignment");
const ProgAssignmentResponse = require("../model/progAssignmentResponse");
const ProgAssignmentScore = require("../model/progAssignmentScore");

// Create a programming assignment
exports.createProgAssignment = async (req, res) => {
  try {
    const { course_id, title, type, question, due_date, total_marks } = req.body;

    if (!course_id || !title || !type || !question || !due_date || !total_marks) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAssignment = new ProgAssignment({
      course_id,
      title,
      type,
      question,
      due_date,
      total_marks,
    });

    await newAssignment.save();
    res.status(201).json({ message: "Programming assignment created successfully", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: "Error creating assignment", error });
  }
};

// Get all programming assignments
exports.getAllProgAssignments = async (req, res) => {
  try {
    const assignments = await ProgAssignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programming assignments", error });
  }
};

// Get all programming assignments for a given course
exports.getProgAssignmentsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const assignments = await ProgAssignment.find({ course_id });

    if (!assignments.length) {
      return res.status(404).json({ message: "No programming assignments found for this course" });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programming assignments", error });
  }
};

// Get a specific programming assignment by ID
exports.getProgAssignmentById = async (req, res) => {
  try {
    // console.log("I am here");
    const { assignment_id } = req.params;
    const assignment = await ProgAssignment.findById(assignment_id);

    if (!assignment) {
      return res.status(404).json({ message: "Programming assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programming assignment Satyam", error });
  }
};

exports.submitProgAssignment = async (req, res) => {
  try {
    const { user_id, assignment_id, course_id, response, actual_solution } = req.body;
    // Validation
    // console.log("I am here also");
    if (!user_id || !assignment_id || !course_id || !response) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing response
    let existingResponse = await ProgAssignmentResponse.findOne({ user_id, assignment_id });

    if (existingResponse) {
      // Update existing
      existingResponse.response = response;
      // existingResponse.actual_solution = actual_solution;
      existingResponse.submitted_on = new Date(); // Update submission time
      await existingResponse.save();
      return res.status(200).json({ 
        message: "Response updated successfully",
        response: existingResponse
      });
    }

    // Create new (submitted_on will be auto-set by schema)
    const newResponse = new ProgAssignmentResponse({
      user_id,
      assignment_id,
      course_id,
      response,
      actual_solution
    });

    await newResponse.save();
    res.status(201).json({ 
      message: "Response submitted successfully",
      response: newResponse
    });

  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ 
      message: "Error submitting assignment",
      error: error.message 
    });
  }
};

// Get programming assignment score
exports.getProgAssignmentScore = async (req, res) => {
  try {
    const { user_id, assignment_id } = req.params;

    const score = await ProgAssignmentScore.findOne({ user_id, assignment_id });
    if (!score) {
      return res.status(404).json({ message: "No score found for this assignment" });
    }

    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programming assignment score", error });
  }
};

// Update programming assignment score
exports.updateProgAssignmentScore = async (req, res) => {
  try {
    const { user_id, assignment_id, score } = req.body;

    let existingScore = await ProgAssignmentScore.findOne({ user_id, assignment_id });

    if (existingScore) {
      existingScore.score = score;
      await existingScore.save();
      return res.status(200).json({ message: "Score updated successfully", score: existingScore });
    }

    const newScore = new ProgAssignmentScore({
      user_id,
      assignment_id,
      score,
    });

    await newScore.save();
    res.status(201).json({ message: "Score recorded successfully", score: newScore });
  } catch (error) {
    res.status(500).json({ message: "Error updating score", error });
  }
};

// Get all responses for a given course
exports.getAllResponsesForCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    // ✅ Ensure we're querying by string
    const responses = await ProgAssignmentResponse.find({ course_id: course_id });

    console.log(responses);
    // console.log(course_id);

    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this course" });
    }

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error });
  }
};

