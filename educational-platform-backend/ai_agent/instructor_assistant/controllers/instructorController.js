// instructor-assistant/controllers/instructorController.js
const { generateSupplementaryContent, handleInstructorQuery } = require('../services/instructorService');
const Instructor = require('../models/instructorModel');

// Handle supplementary content requests
const handleSupplementaryContent = async (req, res) => {
    try {
        const { topic, context } = req.body;
        const content = await generateSupplementaryContent(topic, context);

        // Save interaction to MongoDB
        await Instructor.create({ query: topic, response: content, context });

        res.json({ content });
    } catch (error) {
        console.error('Error handling supplementary content request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

// Handle general instructor queries
const handleInstructorQueryRequest = async (req, res) => {
    try {
        const { query, context } = req.body;
        const response = await handleInstructorQuery(query, context);

        // Save interaction to MongoDB
        await Instructor.create({ query, response, context });

        res.json({ response });
    } catch (error) {
        console.error('Error handling instructor query request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

module.exports = { handleSupplementaryContent, handleInstructorQueryRequest };