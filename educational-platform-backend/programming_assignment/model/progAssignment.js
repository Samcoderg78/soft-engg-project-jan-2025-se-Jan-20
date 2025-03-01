const mongoose = require("mongoose");

const progAssignmentSchema = new mongoose.Schema({
  course_id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["practice", "graded"], required: true },
  question: { type: String, required: true },
  due_date: { type: Date, required: true },
  total_marks: { type: Number, required: true }
});

module.exports = mongoose.model("ProgAssignment", progAssignmentSchema);
