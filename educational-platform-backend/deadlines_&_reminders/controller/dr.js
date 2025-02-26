const Task = require('../model/dr');

// Create a new task
exports.addTask = async (req, res) => {
  try {
    const { name, subject, deadline, priority } = req.body;

    const newTask = new Task({
      name,
      subject,
      deadline,
      priority
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding task', error });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};