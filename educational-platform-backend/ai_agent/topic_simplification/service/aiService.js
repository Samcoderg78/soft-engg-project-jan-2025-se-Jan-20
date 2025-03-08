// // aiService.js - Robust solution for all queries
// const AIAgent = require('../model/aiAgentModel');
// const axios = require('axios');
// require('dotenv').config();

// // Function to generate AI response without depending on embeddings
// const generateResponse = async (query, context = '') => {
//     try {
//         let inputText = context 
//             ? `Question: ${query}\nContext: ${context}\nAnswer:`
//             : `Question: ${query}\nAnswer:`;

//         const response = await axios.post(
//             // 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
//             // "https://api-inference.huggingface.co/models/microsoft/phi-2",
//             // "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
//             // 'https://api-inference.huggingface.co/models/t-bank-ai/ruDialoGPT-small',
//             // 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
//             'https://api-inference.huggingface.co/models/facebook/blenderbot-3B',
//             { inputs: inputText },
//             {
//                 headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
//                 // timeout: 30000
//             }
//         );

//         if (response.data) {
//             if (response.data.generated_text) {
//                 return response.data.generated_text;
//             } else if (Array.isArray(response.data) && response.data.length > 0) {
//                 return response.data[0]?.generated_text || "No response generated.";
//             }
//         }
        
//         return "No response generated.";
//     } catch (error) {
//         console.error('Error generating response:', error.response?.data || error.message);
//         return 'Error generating response. Please try again later.';
//     }
// };

// // Simple text-based document retrieval
// // This avoids all the embedding issues completely
// const retrieveDocuments = async (query) => {
//     try {
//         // Clean the query for searching
//         const searchTerms = query.replace(/[?.,!]/g, '')
//                                .split(' ')
//                                .filter(term => term.length > 2);
        
//         if (searchTerms.length === 0) {
//             return [];
//         }
        
//         // Create regex patterns for each term
//         const regexPatterns = searchTerms.map(term => 
//             new RegExp(term, 'i')
//         );
        
//         // Search for documents that match any of the terms
//         const documents = await AIAgent.find({
//             $or: [
//                 { userQuery: { $in: regexPatterns } },
//                 { response: { $in: regexPatterns } }
//             ]
//         }).limit(5);
        
//         return documents;
//     } catch (error) {
//         console.error('Error retrieving documents:', error.message);
//         return [];
//     }
// };

// // Store document without attempting to get embeddings
// const createDocument = async (query, response, videoContext = 'General', type = 'General') => {
//     try {
//         // Create document without embeddings
//         return await AIAgent.create({
//             userQuery: query,
//             response: response,
//             videoContext: videoContext || 'General',
//             resourceType: type || 'General'
//         });
//     } catch (error) {
//         console.error('Error creating document:', error.message);
//         return null;
//     }
// };

// module.exports = { 
//     retrieveDocuments, 
//     generateResponse,
//     createDocument
// };

const AIAgent = require('../model/aiAgentModel');
const axios = require('axios');
const { encode } = require('gpt-3-encoder'); // For encoding text to vectors
require('dotenv').config();

// Function to convert text to vector (using a simple encoding for demonstration)
const convertToVector = async (text) => {
    // In a real-world scenario, you would use a pre-trained model like OpenAI's embeddings
    const encoded = encode(text);
    return encoded.slice(0, 512); // Limit to 512 dimensions for simplicity
};

// Function to generate AI response using a language model
const generateResponse = async (query, context = '') => {
    try {
        let inputText = context 
            ? `Question: ${query}\nContext: ${context}\nAnswer:`
            : `Question: ${query}\nAnswer:`;

        const response = await axios.post(
            // 'https://api-inference.huggingface.co/models/facebook/blenderbot-3B',
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
            { inputs: inputText },
            {
                headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
            }
        );

        if (response.data) {
            if (response.data.generated_text) {
                return response.data.generated_text;
            } else if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0]?.generated_text || "No response generated.";
            }
        }
        
        return "No response generated.";
    } catch (error) {
        console.error('Error generating response:', error.response?.data || error.message);
        return 'Error generating response. Please try again later.';
    }
};

// Function to retrieve documents using vector search
const retrieveDocuments = async (query) => {
    try {
        // Convert query to vector
        const queryVector = await convertToVector(query);

        // Perform vector search
        const documents = await AIAgent.find({
            embedding: { $near: queryVector }
        }).limit(5);

        return documents;
    } catch (error) {
        console.error('Error retrieving documents:', error.message);
        return [];
    }
};

// Function to store document with vector embedding
const createDocument = async (query, response, videoContext = 'General') => {
    try {
        // Convert query to vector
        const embedding = await convertToVector(query);

        // Create document with embedding
        return await AIAgent.create({
            userQuery: query,
            response: response,
            videoContext: videoContext,
            embedding: embedding
        });
    } catch (error) {
        console.error('Error creating document:', error.message);
        return null;
    }
};

module.exports = { 
    retrieveDocuments, 
    generateResponse,
    createDocument
};