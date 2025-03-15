const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },  
  weekNumber: { type: Number, required: true },  
  title: { type: String, required: true },  
  description: { type: String },  
  lecture: [{ type: String }],  
}, { timestamps: true });  

const Week = mongoose.model('Week', weekSchema);
module.exports = Week;
