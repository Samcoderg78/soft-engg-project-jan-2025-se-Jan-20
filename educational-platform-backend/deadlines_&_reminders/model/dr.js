const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
}, { timestamps: true });


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
