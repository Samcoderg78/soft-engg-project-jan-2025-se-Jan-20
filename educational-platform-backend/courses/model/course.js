const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],  
  professor: { type: String, required: true },
  image: { type: String, required: true },  
}, { timestamps: true }); 


const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
