// instructor-assistant/services/instructorService.js
const axios = require('axios');
const Instructor = require('../models/instructorModel');
require('dotenv').config();

// Generate supplementary content for a given topic
const generateSupplementaryContent = async (topic, context) => {
    try {
        const prompt = `You are an AI assistant for instructors. Generate supplementary content for the following topic. Be concise and clear.\n\nTopic: ${topic}\n\nContext: ${context}`;
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        // Return the model's raw response
        const generatedText = response.data[0]?.generated_text || 'No response generated.';
        return generatedText;
    } catch (error) {
        console.error('Error generating supplementary content:', error.message);
        return "Error generating supplementary content.";
    }
};

// Handle general queries from the instructor
const handleInstructorQuery = async (query, context) => {
    try {
        const prompt = `You are an AI assistant for instructors. Answer the following query. Be concise and clear.\n\nQuery: ${query}\n\nContext: ${context}`;
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        // Return the model's raw response
        const generatedText = response.data[0]?.generated_text || 'No response generated.';
        return generatedText;
    } catch (error) {
        console.error('Error handling instructor query:', error.message);
        return "Error handling query.";
    }
};

module.exports = { generateSupplementaryContent, handleInstructorQuery };