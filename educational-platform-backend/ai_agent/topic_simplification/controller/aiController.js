const AIKnowledgeBase = require('../model/aiModel');
const { generateEmbedding, simplifyTopic } = require('../utils/aiUtils');

// Simplify a topic
const simplifyTopicHandler = async (req, res) => {
    const { query } = req.body;

    try {
        // Step 1: Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        // Step 2: Fetch all documents from the knowledge base
        const documents = await AIKnowledgeBase.find({});

        // Step 3: Calculate similarity in JavaScript
        const relevantDocuments = documents.map(doc => {
            const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
            return { ...doc.toObject(), similarity };
        }).sort((a, b) => b.similarity - a.similarity).slice(0, 3);

        // Step 4: Generate a simplified explanation
        const context = relevantDocuments.map(doc => doc.content).join(' ');
        const response = await simplifyTopic(query, context);

        // Step 5: Send the response
        res.json({ response });
    } catch (error) {
        console.error('Error in simplifyTopicHandler:', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
};

// Helper function to calculate cosine similarity
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = { simplifyTopicHandler };