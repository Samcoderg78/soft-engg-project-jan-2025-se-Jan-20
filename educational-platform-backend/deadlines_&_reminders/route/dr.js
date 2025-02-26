const express = require('express');
const router = express.Router();
const taskController = require('../controller/dr');


router.post('/add', taskController.addTask);
router.get('/', taskController.getAllTasks);

module.exports = router;
