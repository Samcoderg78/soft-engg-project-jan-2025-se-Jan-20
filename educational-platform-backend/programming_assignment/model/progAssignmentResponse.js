const mongoose = require("mongoose");

const progAssignmentResponseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProgAssignment", required: true },
  course_id: { type: String, required: true },  // ✅ Change this from ObjectId to String
  response: { type: String, required: true },
  actual_output: { type: String, required: true },
  submitted_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProgAssignmentResponse", progAssignmentResponseSchema);
