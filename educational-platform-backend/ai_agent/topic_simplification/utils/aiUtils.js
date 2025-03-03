const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { HfInference } = require('@huggingface/inference');

// Initialize HuggingFace Inference (requires API key)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Generate embeddings for a text
const generateEmbedding = async (text) => {
    console.time('Embedding Generation');
    const model = await use.load();
    const embeddings = await model.embed([text]);
    console.timeEnd('Embedding Generation');
    return embeddings.arraySync()[0];
};

// Simplify a topic using HuggingFace
const simplifyTopic = async (query, context) => {
    try {
        const response = await Promise.race([
            hf.textGeneration({
                model: 'facebook/bart-large-cnn',
                inputs: `Explain ${query} in simple terms: ${context}`,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('API Timeout')), 10000)), // 10-second timeout
        ]);
        return response.generated_text;
    } catch (error) {
        console.error('HuggingFace API Error:', error);
        throw new Error('Failed to generate response from HuggingFace API');
    }
};

module.exports = { generateEmbedding, simplifyTopic };