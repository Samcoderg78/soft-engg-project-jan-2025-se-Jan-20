const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, 
  lecture_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Lecture" },
  course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Course" },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Notes = mongoose.models.Notes || mongoose.model("Notes", NotesSchema);
module.exports = Notes;
