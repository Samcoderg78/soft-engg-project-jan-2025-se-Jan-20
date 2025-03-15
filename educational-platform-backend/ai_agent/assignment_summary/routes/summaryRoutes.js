// assignmentSummaryRoutes.js
const express = require('express');
const assignmentSummaryController = require('../controllers/summaryController');

const router = express.Router();

router.get('/:assignmentId', assignmentSummaryController.getAssignmentSummary);

module.exports = router;