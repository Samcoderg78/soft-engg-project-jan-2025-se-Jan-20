const mongoose = require("mongoose");

const assignmentQuestionSchema = new mongoose.Schema({
  assignment_id: { type: String, required: true },
  question: { type: String, required: true },
  type: { type: String, enum: ["single", "multi"], required: true },
  options: { type: [String], required: true },
  category: { type: String, enum: ["easy", "medium", "hard"], required: true },
  full_marks: { type: Number, required: true },
  correct_options: { type: [String], required: true }
});

module.exports = mongoose.model("AssignmentQuestion", assignmentQuestionSchema);