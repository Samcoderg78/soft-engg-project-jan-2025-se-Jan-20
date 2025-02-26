const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  course: { type: String, required: true }, 
  week: { type: Number, required: true }, 
  lectureNumber: { type: Number, required: true }, 
  title: { type: String, required: true }, 
  description: { type: String, required: true },
  videoUrl: { type: String }, 
}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;
