const mongoose = require("mongoose");

const assignmentResponseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  assignment_id: { type: String, required: true },
  responses: [
    {
      question_id: { type: String, required: true },
      response: { type: [String], required: true },
    }
  ],
  submitted_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssignmentResponse", assignmentResponseSchema);
