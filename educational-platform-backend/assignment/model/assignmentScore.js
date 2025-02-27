const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  response_id: { type: String, required: true },
  scores: [
    {
      question_id: { type: String, required: true },
      score: { type: Number, default: 0 }
    }
  ],
  total_score: { type: Number, default: 0 }
});

module.exports = mongoose.model("AssignmentScore", scoreSchema);
