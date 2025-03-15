const Task = require('../model/dr');

exports.addTask = async (req, res) => {
  try {
    const { name, subject, deadline, priority } = req.body;

    const existingTask = await Task.findOne({ name, subject });
    if (existingTask) {
      return res.status(400).json({ message: 'Task with the same name and subject already exists' });
    }

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



exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;  

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
