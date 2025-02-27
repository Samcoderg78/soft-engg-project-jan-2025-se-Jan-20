const mongoose = require("mongoose");

const difficultQuestionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  assignment_id: { type: String, required: true },
  question: { type: String, ref: "AssignmentQuestion", required: true },
  marked_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DifficultQuestion", difficultQuestionSchema);