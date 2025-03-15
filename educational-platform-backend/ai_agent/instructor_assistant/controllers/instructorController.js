const { handleInstructorQuery } = require('../services/instructorService');

// Handle general instructor queries
const handleInstructorQueryRequest = async (req, res) => {
    try {
        const { query } = req.body;
        const response = await handleInstructorQuery(query);
        res.json({ response });
    } catch (error) {
        console.error('Error handling instructor query request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

module.exports = { handleInstructorQueryRequest };