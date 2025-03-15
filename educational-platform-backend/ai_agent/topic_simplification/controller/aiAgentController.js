const { retrieveDocuments, generateResponse, createDocument, generateHint, retrieveResources } = require('../service/aiService');

const handleAIRequest = async (req, res) => {
    try {
        const { query, videoContext } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // First search in the database using vector search
        let documents = await retrieveDocuments(query);
        let response;

        if (!documents || documents.length === 0) {
            console.log('❌ No documents found for query:', query);
            console.log('Generating with LLM...');
            
            // Generate response with LLM
            const generatedResponse = await generateResponse(query, videoContext || '');
            
            // Store the new response in the database with vector embedding
            try {
                await createDocument(query, generatedResponse, videoContext);
                console.log('✅ Successfully stored new response in database');
            } catch (storageError) {
                console.log('⚠️ Failed to store response, but continuing:', storageError.message);
            }
            
            // Return the generated response
            response = generatedResponse;
        } else {
            console.log('✅ Found relevant documents in database for query:', query);
            
            // Return the most relevant document's response
            response = documents[0].response;
        }

        res.json(response);
    } catch (error) {
        console.error('🚨 Error handling AI request:', error.message);
        res.status(500).json({ message: 'Error processing AI request' });
    }
};

const handleAssignmentRequest = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Generate hints for the assignment question
        const hints = await generateHint(query);

        // Return the hints
        res.json({ hints });
    } catch (error) {
        console.error('🚨 Error handling assignment request:', error.message);
        res.status(500).json({ message: 'Error processing assignment request' });
    }
};

const handleResourceRequest = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Retrieve resources related to the query
        const resources = await retrieveResources(query);

        // Return the resources
        res.json(resources);
    } catch (error) {
        console.error('🚨 Error handling resource request:', error.message);
        res.status(500).json({ message: 'Error processing resource request' });
    }
};

module.exports = { 
    handleAIRequest,
    handleAssignmentRequest,
    handleResourceRequest // Export the new function
};