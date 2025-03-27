const express = require('express');
const router = express.Router();
const taskController = require('../controller/dr');

// Manage custom deadlines & reminders (Add Task)
router.post('/add', taskController.addTask);
router.get('/:userId', taskController.getUserTasks);
router.delete('/:userId/:taskId', taskController.deleteTask);


module.exports = router;
