// aiAgentController.js
const { retrieveDocuments, generateResponse } = require('../service/aiService');
const AIAgent = require('../model/aiAgentModel');

// Unified Handler for All AI Requests
const handleAIRequest = async (req, res) => {
    try {
        const { query, videoContext, type } = req.body;

        // Step 1: Retrieve relevant documents based on the context
        let documents = await retrieveDocuments(query, videoContext);

        // Step 2: If no documents are found, provide a default context
        if (documents.length === 0) {
            console.log('No documents found. Using default context.');
            documents = [{
                response: "Python is a high-level programming language known for its simplicity and readability.",
                resourceType: "Documentation",
                resourceUrl: "https://docs.python.org/3/",
                resourceDescription: "Official Python documentation."
            }];
        }

        // Step 3: Generate a response or return resources
        let response;
        if (type === 'resources') {
            // For /ask-resources, return resources
            response = documents.map(doc => ({
                type: doc.resourceType,
                url: doc.resourceUrl,
                description: doc.resourceDescription
            }));
        } else if (type === 'assignment') {
            // For /ask, return assignment help
            response = documents.map(doc => ({
                type: doc.assignmentType || 'General',
                response: doc.response,
                resourceType: doc.resourceType,
                resourceUrl: doc.resourceUrl,
                resourceDescription: doc.resourceDescription
            }));
        } else {
            // For /ask-ai, generate a response using the Hugging Face model
            response = await generateResponse(query, documents, type);
            await AIAgent.create({ userQuery: query, response, videoContext });
        }

        res.json(response);
    } catch (error) {
        console.error('Error handling AI request:', error.message);
        res.status(500).json({ message: 'Error processing AI request' });
    }
};

module.exports = { handleAIRequest };