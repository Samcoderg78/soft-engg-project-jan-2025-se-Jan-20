const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: "User" },
  lecture_id: { type: String, required: true, ref: "Lecture" },
  course_id: { type: String, required: true, ref: "Course" },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { versionKey: false }); // Prevents adding __v field automatically

const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);
module.exports = Notes;
