// assignment-summary/routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { handleSummaryReport } = require('../controllers/summaryController');

// Summary report endpoint
router.post('/summary-report', handleSummaryReport);

module.exports = router;