const express = require('express');
const router = express.Router();
const userController = require('../controller/user'); // Adjust path as needed

router.post('/add-user', userController.addUser);
router.post('/login', userController.loginUser);
router.put('/update/:id', userController.updateUser);

module.exports = router;