const Assignment = require("../model/assignment");
const AssignmentResponse = require("../model/assignmentResponse");
const AssignmentQuestion = require("../model/assignmentQuestion");

// Get all assignments for a given course
exports.getAllAssignments = async (req, res) => {
  try {
    const { course_id } = req.params;
    const assignments = await Assignment.find({ course_id });

    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found for this course" });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

// Get an assignment by assignment_id
exports.getAssignmentQuestions = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const questions = await AssignmentQuestion.find({ assignment_id });

    res.status(200).json({ assignment, questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignment details", error });
  }
};

// Submit assignment response
exports.submitAssignment = async (req, res) => {
    try {
      const { user_id, assignment_id, responses } = req.body;
  
      let existingResponse = await AssignmentResponse.findOne({ user_id, assignment_id });
  
      if (existingResponse) {
        existingResponse.responses = responses;
        existingResponse.submitted_on = new Date();
        await existingResponse.save();
  
        return res.status(200).json({ message: "Assignment response updated successfully", response: existingResponse });
      }
  
      const newResponse = new AssignmentResponse({
        user_id,
        assignment_id,
        responses,
        submitted_on: new Date(),
      });
  
      await newResponse.save();
  
      res.status(201).json({ message: "Assignment submitted successfully", response: newResponse });
    } catch (error) {
      res.status(500).json({ message: "Error submitting assignment", error });
    }
  };