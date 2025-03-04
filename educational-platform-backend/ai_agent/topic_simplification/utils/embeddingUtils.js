require('dotenv').config();
const { OpenAI } = require('openai');
const AIAgent = require('../model/aiAgentModel');

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY); // Check if API key is loaded

// Initialize OpenAI with API Key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Get Embeddings using OpenAI
exports.getEmbeddings = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error fetching embeddings:', error.message);
    }
};

// Retrieve documents from MongoDB based on embeddings
exports.retrieveDocuments = async (embeddings, context) => {
    try {
        const documents = await AIAgent.find({
            videoContext: { $regex: context, $options: 'i' }
        }).limit(5);
        return documents.map(doc => doc.response);
    } catch (error) {
        console.error('Error retrieving documents:', error.message);
    }
};

// Generate response using a generative AI model
exports.generateResponse = async (query, documents) => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: `You are an assistant simplifying topics.` },
                { role: 'user', content: `${query}\n\nContext: ${documents.join('\n')}` }
            ]
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating response:', error.message);
    }
};
