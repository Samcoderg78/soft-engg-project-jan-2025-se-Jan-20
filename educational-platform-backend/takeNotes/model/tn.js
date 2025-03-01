const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // ✅ Changed to ObjectId
  lecture_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Lecture" }, // ✅ Changed to ObjectId
  course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Course" }, // ✅ Changed to ObjectId
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Notes = mongoose.models.Notes || mongoose.model("Notes", NotesSchema);
module.exports = Notes;
