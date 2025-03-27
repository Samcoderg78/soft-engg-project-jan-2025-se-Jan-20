const Task = require('../model/dr');

exports.addTask = async (req, res) => {
  try {
    const { userId, name, subject, deadline, priority } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // ✅ Check if the task already exists
    const existingTask = await Task.findOne({ userId, name, subject, deadline });

    if (existingTask) {
      return res.status(400).json({ message: 'Task already exists' });
    }

    // If no duplicate, add the new task
    const newTask = new Task({ userId, name, subject, deadline, priority });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding task', error });
  }
};


exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId }).sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

const Task = require("../models/Task");

exports.deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    if (!userId || !taskId) {
      return res.status(400).json({ message: "User ID and Task ID are required" });
    }

    // Ensure the task belongs to the user before deleting
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error });
  }
};

