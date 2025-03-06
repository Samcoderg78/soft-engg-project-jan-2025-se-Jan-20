// assignment-summary/controllers/summaryController.js
const { generateSummaryReport } = require('../services/summaryService');

// Handle summary report requests
const handleSummaryReport = async (req, res) => {
    try {
        const { assignmentId } = req.body;

        if (!assignmentId) {
            return res.status(400).json({ message: 'Assignment ID is required.' });
        }

        const summaryReport = await generateSummaryReport(assignmentId);

        res.json({ summaryReport });
    } catch (error) {
        console.error('Error handling summary report request:', error.message);
        res.status(500).json({ message: 'Error generating summary report.' });
    }
};

module.exports = { handleSummaryReport };