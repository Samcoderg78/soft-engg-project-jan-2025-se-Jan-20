const mongoose = require('mongoose');

// Define the schema for a task
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
}, { timestamps: true });

// Create and export the model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
