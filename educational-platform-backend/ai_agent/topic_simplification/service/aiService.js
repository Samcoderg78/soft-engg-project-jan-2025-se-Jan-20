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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pipeline } = require('@xenova/transformers'); // Import Hugging Face pipeline
require('dotenv').config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Hugging Face embedding model
let embeddingPipeline;
const initializeEmbeddingModel = async () => {
    try {
        embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('✅ Hugging Face embedding model loaded');
    } catch (error) {
        console.error('Error loading Hugging Face embedding model:', error.message);
    }
};

// Function to generate embeddings using Hugging Face
const generateEmbedding = async (text) => {
    try {
        if (!embeddingPipeline) {
            await initializeEmbeddingModel(); // Ensure the model is loaded
        }

        const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
        console.log('🔍 Generated Embedding for:', text);
        return Array.from(output.data); // Convert Float32Array to a regular array of numbers
    } catch (error) {
        console.error('Error generating embedding:', error.message);
        return null;
    }
};

// Function to generate AI response using Google Generative AI
const generateResponse = async (query) => {
    try {
        // First check if the exact query exists in the database
        const existingDocument = await AIAgent.findOne({ userQuery: query });
        if (existingDocument) {
            console.log('✅ Exact match found in database for query:', query);
            return existingDocument.response;
        }

        const documents = await retrieveDocuments(query, 0.5); // Similarity threshold is 0.5

        if (documents.length > 0) {
            console.log('✅ Found relevant documents in database for query:', query);
            return documents[0].response;
        }

        console.log('❌ No documents found for query:', query);
        console.log('Generating with Gemini...');

        const inputText = `Question: ${query}\nAnswer:`;
        const result = await model.generateContent(inputText);

        if (result && result.response) {
            const generatedResponse = result.response.text();
            await createDocument(query, generatedResponse);
            console.log('✅ Successfully stored new response in database');
            return generatedResponse;
        }

        return "No response generated.";
    } catch (error) {
        console.error('Error generating response:', error.message);
        return 'Error generating response. Please try again later.';
    }
};

// Function to retrieve documents using MongoDB Atlas Vector Search with a similarity threshold
const retrieveDocuments = async (query, similarityThreshold = 0.5) => {
    try {
        const queryEmbedding = await generateEmbedding(query);

        if (!queryEmbedding) {
            return [];
        }

        const documents = await AIAgent.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 5,
                    index: "aiAgent_vectorSearch"
                }
            }
        ]);

        // Filter documents by similarity threshold
        const relevantDocs = documents.filter(doc => doc.similarity >= similarityThreshold);
        console.log('📂 Retrieved Documents:', relevantDocs.map(doc => ({response: doc.response, similarity: doc.similarity})));
        return relevantDocs;
    } catch (error) {
        console.error('Error retrieving documents:', error.message);
        return [];
    }
};

// Function to store document with embeddings
const createDocument = async (query, response) => {
    try {
        const embedding = await generateEmbedding(query);
        return await AIAgent.create({
            userQuery: query,
            response: response,
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
