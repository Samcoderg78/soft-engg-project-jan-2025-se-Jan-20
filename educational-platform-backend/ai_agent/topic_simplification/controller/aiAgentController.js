// const { retrieveDocuments, generateResponse, createDocument } = require('../service/aiService');

// const handleAIRequest = async (req, res) => {
//     try {
//         const { query, videoContext, type } = req.body;
//         if (!query) {
//             return res.status(400).json({ message: 'Query is required' });
//         }

//         // First search in the database
//         let documents = await retrieveDocuments(query);
//         let response;

//         if (!documents || documents.length === 0) {
//             console.log('❌ No documents found for query:', query);
//             console.log('Generating with LLM...');
            
//             // Generate response with LLM
//             const generatedResponse = await generateResponse(query, videoContext || '');
            
//             // Store the new response in the database
//             try {
//                 await createDocument(query, generatedResponse, videoContext, type);
//                 console.log('✅ Successfully stored new response in database');
//             } catch (storageError) {
//                 console.log('⚠️ Failed to store response, but continuing:', storageError.message);
//             }
            
//             // Format response based on type
//             if (type === 'resources') {
//                 response = [{
//                     type: 'General',
//                     url: '',
//                     description: generatedResponse
//                 }];
//             } else if (type === 'assignment') {
//                 response = [{
//                     type: 'General',
//                     response: generatedResponse,
//                     resourceType: '',
//                     resourceUrl: '',
//                     resourceDescription: ''
//                 }];
//             } else {
//                 response = generatedResponse;
//             }
//         } else {
//             console.log('✅ Found relevant documents in database for query:', query);
            
//             // Format response based on type
//             if (type === 'resources') {
//                 response = documents.map(doc => ({
//                     type: doc.resourceType || 'General',
//                     url: doc.resourceUrl || '',
//                     description: doc.resourceDescription || ''
//                 }));
//             } else if (type === 'assignment') {
//                 response = documents.map(doc => ({
//                     type: doc.assignmentType || 'General',
//                     response: doc.response || 'No response available.',
//                     resourceType: doc.resourceType || '',
//                     resourceUrl: doc.resourceUrl || '',
//                     resourceDescription: doc.resourceDescription || ''
//                 }));
//             } else {
//                 // For simplification type, just return the first response
//                 response = documents[0].response;
//             }
//         }

//         res.json(response);
//     } catch (error) {
//         console.error('🚨 Error handling AI request:', error.message);
//         res.status(500).json({ message: 'Error processing AI request' });
//     }
// };

// module.exports = { handleAIRequest };


const { retrieveDocuments, generateResponse, createDocument } = require('../service/aiService');

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

module.exports = { handleAIRequest };