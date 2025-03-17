const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pipeline } = require('@xenova/transformers'); // For embeddings
const Instructor = require('../models/instructorModel');
require('dotenv').config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Hugging Face embedding model
let embeddingPipeline;
const initializeEmbeddingModel = async () => {
    try {
        const pipelineFunction = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        embeddingPipeline = async (text) => {
            const tensor = await pipelineFunction(text, { pooling: 'mean', normalize: true });
            return Array.from(tensor.data); // Convert tensor to plain array
        };
        console.log('✅ Hugging Face embedding model loaded');
    } catch (error) {
        console.error('Error loading Hugging Face embedding model:', error.message);
    }
};

// Call this during server startup
initializeEmbeddingModel();

// Function to generate embeddings using Hugging Face
const generateEmbedding = async (text) => {
    try {
        if (!text) {
            console.error('Empty text provided for embedding generation');
            return null;
        }

        if (!embeddingPipeline) {
            await initializeEmbeddingModel();
        }

        if (!embeddingPipeline) {
            console.error('⚠️ Embedding model failed to initialize.');
            return null;
        }

        const output = await embeddingPipeline(text);
        console.log('🔍 Generated Embedding for:', text);
        return output; // This is already a plain array
    } catch (error) {
        console.error('Error generating embedding:', error.message);
        return null;
    }
};

// Function to find an exact match for a query
const findExactMatch = async (query) => {
    try {
        const exactMatch = await Instructor.findOne({ query: query });
        if (exactMatch) {
            console.log('✅ Found exact match in database for query:', query);
            return exactMatch.response;
        }
        return null;
    } catch (error) {
        console.error('Error finding exact match:', error.message);
        return null;
    }
};

// Function to handle general instructor queries using Gemini
const handleInstructorQuery = async (query) => {
    try {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error('Invalid query provided');
        }

        console.log('📝 Processing query:', query);
        
        // Step 1: Try to find an exact match first (faster)
        const exactMatchResponse = await findExactMatch(query);
        if (exactMatchResponse) {
            console.log('🎯 Using exact match from database');
            return exactMatchResponse;
        }
        
        // Step 2: Try semantic search with vector embeddings
        const queryEmbedding = await generateEmbedding(query);
        
        if (queryEmbedding) {
            try {
                console.log('🔍 Performing vector search...');
                const count = await Instructor.countDocuments();
                console.log(`📊 Total documents in collection: ${count}`);
                
                if (count > 0) {
                    try {
                        const documents = await Instructor.aggregate([
                            {
                                $vectorSearch: {
                                    queryVector: queryEmbedding,
                                    path: "embedding",
                                    numCandidates: 100,
                                    limit: 5,
                                    index: "instructor_vectorSearch"
                                }
                            }
                        ]);

                        if (documents && documents.length > 0) {
                            console.log('✅ Found similar documents via vector search:', documents.length);
                            return documents[0].response;
                        } else {
                            console.log('❌ No similar documents found via vector search');
                        }
                    } catch (vectorSearchError) {
                        console.error('Vector search error:', vectorSearchError.message);
                    }
                } else {
                    console.log('⚠️ No documents in collection to search');
                }
            } catch (searchError) {
                console.error('Error during search:', searchError.message);
            }
        } else {
            console.log('⚠️ Could not generate embedding for search');
        }

        console.log('🤖 Generating new response with Gemini...');
        const prompt = `You are an AI assistant for instructors. Answer the following query. Be concise and clear.\n\nQuery: ${query}`;
        const result = await model.generateContent(prompt);

        if (result && result.response) {
            const generatedText = result.response.text();
            
            try {
                await Instructor.create({ 
                    query: query, 
                    response: generatedText,
                    embedding: queryEmbedding || [] // Ensure this is a plain array
                });
                console.log('✅ Successfully stored new response in database');
            } catch (dbError) {
                console.error('Error storing in database:', dbError.message);
            }
            
            return generatedText;
        }

        return "No response generated.";
    } catch (error) {
        console.error('Error handling instructor query:', error.message);
        throw new Error('Error handling instructor query: ' + error.message);
    }
};

module.exports = { handleInstructorQuery, generateEmbedding };