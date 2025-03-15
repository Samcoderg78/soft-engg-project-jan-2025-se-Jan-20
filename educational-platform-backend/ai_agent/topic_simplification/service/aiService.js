const { AIAgent, AssignmentHint, Resource } = require('../model/aiAgentModel'); // Import all models
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
        const existingDocument = await AIAgent.findOne({ userQuery: query });
        if (existingDocument) {
            console.log('✅ Exact match found in database for query:', query);
            return existingDocument.response;
        }

        const documents = await retrieveDocuments(query, 0.5);

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

// Function to retrieve documents using MongoDB Atlas Vector Search
const retrieveDocuments = async (query, similarityThreshold = 0.8) => {
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

// Function to generate hints for assignment-related queries
const generateHint = async (query) => {
    try {
        const existingAssignment = await AssignmentHint.findOne({ userQuery: query });
        if (existingAssignment) {
            console.log('✅ Exact match found in database for assignment query:', query);
            return existingAssignment.hints;
        }

        const queryEmbedding = await generateEmbedding(query);
        const assignments = await AssignmentHint.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 5,
                    index: "assignmentHint_vectorSearch"
                }
            }
        ]);

        const relevantAssignments = assignments.filter(doc => doc.similarity >= 0.8);
        if (relevantAssignments.length > 0) {
            console.log('✅ Found relevant assignment hints for query:', query);
            return relevantAssignments[0].hints;
        }

        console.log('❌ No relevant hints found. Generating with Gemini...');
        const inputText = `Question: ${query}\nProvide hints to solve this problem without revealing the answer:`;
        const result = await model.generateContent(inputText);

        if (result && result.response) {
            const generatedHints = result.response.text().split('\n').filter(hint => hint.trim() !== '');
            await AssignmentHint.create({
                userQuery: query,
                hints: generatedHints,
                embedding: queryEmbedding
            });
            console.log('✅ Successfully stored new hints in database');
            return generatedHints;
        }

        return ["No hints generated."];
    } catch (error) {
        console.error('Error generating hints:', error.message);
        return ['Error generating hints. Please try again later.'];
    }
};

// Function to retrieve resources related to a query
const retrieveResources = async (query, similarityThreshold = 0.8) => {
    try {
        const existingResource = await Resource.findOne({ userQuery: query });
        if (existingResource) {
            console.log('✅ Exact match found in database for resource query:', query);
            return existingResource.resources;
        }

        const queryEmbedding = await generateEmbedding(query);
        const resources = await Resource.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 5,
                    index: "resource_vectorSearch"
                }
            }
        ]);

        const relevantResources = resources.filter(doc => doc.similarity >= similarityThreshold);
        if (relevantResources.length > 0) {
            console.log('✅ Found relevant resources in database for query:', query);
            return relevantResources[0].resources;
        }

        console.log('❌ No relevant resources found. Generating with Gemini...');
        const inputText = `Question: ${query}\nProvide relevant resources (documentation, videos, etc.) for this topic:`;
        const result = await model.generateContent(inputText);

        if (result && result.response) {
            const generatedText = result.response.text();
            const resources = generatedText.split('\n').map(line => {
                const url = line.match(/https?:\/\/[\S]+/)?.[0] || '';
                const description = line.replace(/https?:\/\/[\S]+/, '').trim() || 'No description available.';
                if (url) {
                    return { type: 'General', url, description };
                }
                return null; // Filter out invalid resources
            }).filter(resource => resource !== null);

            if (resources.length > 0) {
                await Resource.create({
                    userQuery: query,
                    resources: resources,
                    embedding: queryEmbedding
                });
                console.log('✅ Successfully stored new resources in database');
                return resources;
            }
        }

        return [{ type: "General", url: "", description: "No resources generated." }];
    } catch (error) {
        console.error('Error retrieving resources:', error.message);
        return [{ type: "General", url: "", description: "Error retrieving resources. Please try again later." }];
    }
};

module.exports = { 
    retrieveDocuments, 
    generateResponse,
    createDocument,
    generateHint,
    retrieveResources // Export the new function
};
