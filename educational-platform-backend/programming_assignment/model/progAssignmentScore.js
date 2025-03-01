const mongoose = require("mongoose");

const progAssignmentScoreSchema = new mongoose.Schema({
   assignment_id: { type: String, required: true },
   user_id: { type: String, required: true },
   score: { type: Number, required: true }
 });
 
 module.exports = mongoose.model("ProgAssignmentScore", progAssignmentScoreSchema);
 