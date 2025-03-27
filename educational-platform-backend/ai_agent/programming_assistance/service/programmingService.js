const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pipeline } = require('@xenova/transformers');
const Programming = require('../model/programmingModel');
require('dotenv').config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Hugging Face embedding model
let embeddingPipeline;

// Extract ONLY the text inside parentheses ()
const extractTextInParentheses = (text) => {
    if (!text) return text;

    // If it's an array, clean each URL inside it
    if (Array.isArray(text)) {
        return text.map(item => ({
            ...item,
            url: extractTextInParentheses(item.url) // Apply to each resource object
        }));
    }

    const match = text.match(/\(([^)]+)\)/); // Get text inside ()
    return match ? match[1] : text; // Return extracted text or original if no match
};

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
            await initializeEmbeddingModel();
        }
        const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error('Error generating embedding:', error.message);
        return null;
    }
};

// Provide hints for programming assignments using RAG
const provideProgrammingHint = async (query, context, resources = []) => {
    try {
        const queryEmbedding = await generateEmbedding(query);
        if (!queryEmbedding) {
            throw new Error('Failed to generate embedding');
        }

        // Safe database query with error handling
        let similarDocuments = [];
        try {
            similarDocuments = await Programming.aggregate([
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
        } catch (dbError) {
            console.error('Database search error:', dbError.message);
            // Continue to generate new hint if search fails
        }

        if (similarDocuments.length > 0) {
            return similarDocuments[0].response;
        }

        // Generate new hint if no similar documents found
        const prompt = `You are a programming tutor. A student is trying to ${query}. Provide a helpful hint without giving away the solution. Be concise and clear.`;
        const result = await model.generateContent(prompt);
        
        if (!result?.response) {
            throw new Error('No response from Gemini');
        }

        const generatedHint = result.response.text(); // Corrected variable usage

        // ✅ CLEAN THE RESPONSE & RESOURCES BEFORE STORING
        const cleanHint = extractTextInParentheses(generatedHint);
        const cleanResources = extractTextInParentheses(resources);

        // ✅ STORE ONLY CLEANED DATA
        try {
            await Programming.create({
                userQuery: query,
                response: cleanHint,  // Store only text inside ()
                context,
                resources: cleanResources, // Store only text inside ()
                embedding: queryEmbedding
            });
        } catch (storeError) {
            console.error('Error storing hint:', storeError.message);
        }

        return cleanHint;
    } catch (error) {
        console.error('Error in provideProgrammingHint:', error.message);
        return "I couldn't generate a hint right now. Please try again later.";
    }
};

// Review code and provide feedback using Gemini
const reviewCode = async (code, context) => {
    try {
        const prompt = `Review this code for quality, readability, and best practices:\n\n${code}\n\nContext: ${context}`;
        const result = await model.generateContent(prompt);
        return result?.response?.text() || "No feedback generated.";
    } catch (error) {
        console.error('Error in reviewCode:', error.message);
        return "Error reviewing code. Please try again.";
    }
};

module.exports = { provideProgrammingHint, reviewCode };
