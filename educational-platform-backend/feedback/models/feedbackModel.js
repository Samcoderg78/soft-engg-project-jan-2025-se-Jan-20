const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.UUID, required: true, ref: "User" },
  course_id: { type: mongoose.Schema.Types.UUID, required: true, ref: "Course" },
  feedback_string: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  created_at: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;