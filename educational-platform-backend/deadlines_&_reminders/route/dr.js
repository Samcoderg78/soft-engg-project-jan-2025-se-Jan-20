const express = require('express');
const router = express.Router();
const taskController = require('../controller/dr');

// Manage custom deadlines & reminders (Add Task)
router.post('/add', taskController.addTask);
router.get('/', taskController.getAllTasks);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
