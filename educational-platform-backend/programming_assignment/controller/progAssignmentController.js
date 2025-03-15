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
    const { assignment_id } = req.params;
    const assignment = await ProgAssignment.findById(assignment_id);

    if (!assignment) {
      return res.status(404).json({ message: "Programming assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programming assignment", error });
  }
};

// Submit a programming assignment response
exports.submitProgAssignment = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { user_id, assignment_id, course_id, response, actual_output } = req.body;

    // Check if all required fields are provided
    if (!user_id || !assignment_id || !course_id || !response || !actual_output) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingResponse = await ProgAssignmentResponse.findOne({ user_id, assignment_id });

    if (existingResponse) {
      existingResponse.response = response;
      existingResponse.actual_output = actual_output;
      existingResponse.submitted_on = new Date();
      await existingResponse.save();

      return res.status(200).json({ message: "Programming assignment response updated successfully", response: existingResponse });
    }

    const newResponse = new ProgAssignmentResponse({
      user_id,
      assignment_id,
      course_id,
      response,
      actual_output,
      submitted_on: new Date(),
    });

    await newResponse.save();

    res.status(201).json({ message: "Response submitted successfully", response: newResponse });
  } catch (error) {
    res.status(500).json({ message: "Error submitting programming assignment", error });
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

    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this course" });
    }

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error });
  }
};

