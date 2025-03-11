const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pipeline } = require('@xenova/transformers'); // For embeddings
const Programming = require('../model/programmingModel');
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

// Provide hints for programming assignments using RAG
const provideProgrammingHint = async (query, context) => {
    try {
        // First, check if a similar query exists in the database
        const queryEmbedding = await generateEmbedding(query);
        const documents = await Programming.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 5,
                    index: "programming_vectorSearch"
                }
            }
        ]);

        if (documents.length > 0) {
            console.log('✅ Found relevant documents in database for query:', query);
            return documents[0].response;
        }

        console.log('❌ No documents found for query:', query);
        console.log('Generating with Gemini...');

        // Generate hint with Gemini
        const prompt = `You are a programming tutor. A student is trying to ${query}. Provide a helpful hint without giving away the solution. Be concise and clear. Example: "You can use slicing to reverse a list."`;
        const result = await model.generateContent(prompt);

        if (result && result.response) {
            const generatedHint = result.response.text();
            await Programming.create({ userQuery: query, response: generatedHint, context, embedding: queryEmbedding });
            console.log('✅ Successfully stored new hint in database');
            return generatedHint;
        }

        return "No hint generated.";
    } catch (error) {
        console.error('Error generating programming hint:', error.message);
        return "Error generating hint.";
    }
};

// Review code and provide feedback using Gemini
const reviewCode = async (code, context) => {
    try {
        // Generate feedback with Gemini
        const prompt = `You are a code reviewer. Review the following code for quality, readability, and best practices. If the code is incorrect, provide the complete solution. Be concise and clear.\n\nCode: ${code}\n\nContext: ${context}`;
        const result = await model.generateContent(prompt);

        if (result && result.response) {
            const generatedFeedback = result.response.text();
            return generatedFeedback;
        }

        return "No feedback generated.";
    } catch (error) {
        console.error('Error reviewing code:', error.message);
        return "Error reviewing code.";
    }
};

module.exports = { provideProgrammingHint, reviewCode };