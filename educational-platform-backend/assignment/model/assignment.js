const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  course_id: { type: String, required: true },
  week: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["practice", "graded"], required: true },
  due_date: { type: Date, required: true },
  total_marks: { type: Number, required: true }
});

module.exports = mongoose.model("Assignment", assignmentSchema);