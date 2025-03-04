const AIAgent = require('../model/aiAgentModel');
const aiService = require('../service/aiService');

exports.getSimplifiedResponse = async (req, res) => {
    try {
        const { query, videoContext } = req.body;
        const response = await aiService.getResponse(query, videoContext);
        if (!response) {
            return res.status(500).json({ message: 'Failed to generate a response from AI.' });
        }
        const savedResponse = await AIAgent.create({ userQuery: query, response, videoContext });
        res.json(savedResponse);
    } catch (error) {
        console.error('Error in getSimplifiedResponse:', error.message);
        res.status(500).json({ message: 'Error processing AI response', error });
    }
};
