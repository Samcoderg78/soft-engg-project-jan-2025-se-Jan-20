const mongoose = require("mongoose");

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", new mongoose.Schema({
  course_id: { type: String, required: true },
  week: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["practice", "graded"], required: true },
  due_date: { type: Date, required: true },
  total_marks: { type: Number, required: true }
}));

const ProgAssignment = mongoose.models.ProgAssignment || mongoose.model("ProgAssignment", new mongoose.Schema({
  course_id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["practice", "graded"], required: true },
  question: { type: String, required: true },
  due_date: { type: Date, required: true },
  total_marks: { type: Number, required: true }
}));

module.exports = { Assignment, ProgAssignment };
