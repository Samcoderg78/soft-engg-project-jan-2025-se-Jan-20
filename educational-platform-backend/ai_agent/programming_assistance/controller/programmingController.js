// programming-assistance/controllers/programmingController.js
const { provideProgrammingHint, reviewCode, retrieveProgrammingResources } = require('../service/programmingService');
const Programming = require('../model/programmingModel');

// Handle programming assistance requests
const handleProgrammingHint = async (req, res) => {
    try {
        const { query, context } = req.body;
        const hint = await provideProgrammingHint(query, context);

        // Save interaction to MongoDB
        await Programming.create({ userQuery: query, response: hint, context });

        res.json({ hint });
    } catch (error) {
        console.error('Error handling programming hint request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

// Handle code review requests
const handleCodeReview = async (req, res) => {
    try {
        const { code, context } = req.body;
        const feedback = await reviewCode(code, context);

        // Save interaction to MongoDB
        await Programming.create({ userQuery: code, response: feedback, context });

        res.json({ feedback });
    } catch (error) {
        console.error('Error handling code review request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

// Handle resource requests
const handleResourceRequest = async (req, res) => {
    try {
        const { query, context } = req.body;
        const resources = await retrieveProgrammingResources(query, context);

        res.json(resources);
    } catch (error) {
        console.error('Error handling resource request:', error.message);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

module.exports = { handleProgrammingHint, handleCodeReview, handleResourceRequest };