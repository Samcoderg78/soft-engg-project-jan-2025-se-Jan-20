// aiService.js
const AIAgent = require('../model/aiAgentModel');
const axios = require('axios');
require('dotenv').config();

// Get Embeddings using Hugging Face API
const getEmbeddings = async (text) => {
    try {
        if (!text || typeof text !== 'string' || text.trim() === '') {
            console.error('Invalid input text for embeddings.');
            return [];
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        return response.data || [];
    } catch (error) {
        console.error('Error fetching embeddings:', error.response?.data || error.message);
        return [];
    }
};

// Retrieve documents from MongoDB based on embeddings
const retrieveDocuments = async (query, context) => {
    try {
        const queryEmbeddings = await getEmbeddings(query);
        if (queryEmbeddings.length === 0) return [];

        const documents = await AIAgent.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbeddings,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 5,
                    index: "vector_index",
                },
            },
        ]);

        return documents;
    } catch (error) {
        console.error('Error retrieving documents:', error.message);
        return [];
    }
};

// Generate response using a generative model from Hugging Face
const generateResponse = async (query, documents = [], type) => {
    try {
        let inputText = `Question: ${query}\n`;
        if (documents.length > 0) {
            inputText += `Context: ${documents.map(doc => doc.response).join('\n')}\n`;
        }

        if (type === 'assignment') {
            inputText += "Provide a hint to guide the student without revealing the answer. Focus on concepts.";
        } else if (type === 'simplification') {
            inputText += "Consider yourself an expert teacher who is known for his easy way of explanining topics and concepts to students. Now, clear this concept or doubt of the student so that he understands it fully and easily.";
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/google/flan-t5-large',
            // 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
            { inputs: inputText },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        return response.data[0]?.generated_text || 'No response generated.';
    } catch (error) {
        console.error('Error generating response:', error.message);
        return 'Error generating response.';
    }
};

// Export the functions
module.exports = { retrieveDocuments, generateResponse, getEmbeddings };