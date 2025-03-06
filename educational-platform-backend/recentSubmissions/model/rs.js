const mongoose = require("mongoose");


const AssignmentResponse = mongoose.models.AssignmentResponse || mongoose.model("AssignmentResponse", new mongoose.Schema({
  user_id: { type: String, required: true },
  assignment_id: { type: String, required: true },
  responses: [
    {
      question_id: { type: String, required: true },
      response: { type: [String], required: true },
    }
  ],
  submitted_on: { type: Date, default: Date.now },
}));

const ProgAssignmentResponse = mongoose.models.ProgAssignmentResponse || mongoose.model("ProgAssignmentResponse", new mongoose.Schema({
  user_id: { type: String, required: true },
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProgAssignment", required: true },
  course_id: { type: String, required: true }, 
  response: { type: String, required: true },
  actual_output: { type: String, required: true },
  submitted_on: { type: Date, default: Date.now },
}));


module.exports = { AssignmentResponse, ProgAssignmentResponse };
