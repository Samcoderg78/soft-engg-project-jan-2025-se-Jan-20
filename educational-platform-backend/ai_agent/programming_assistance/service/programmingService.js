const axios = require('axios');
const Programming = require('../model/programmingModel');
require('dotenv').config();

// Provide hints for programming assignments
const provideProgrammingHint = async (query, context) => {
    try {
        const prompt = `You are a programming tutor. A student is trying to ${query}. Provide a helpful hint without giving away the solution. Be concise and clear. Example: "You can use slicing to reverse a list."`;
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
        console.error('Error generating programming hint:', error.message);
        return "Error generating hint.";
    }
};

// Review code and provide feedback
const reviewCode = async (code, context) => {
    try {
        const prompt = `You are a code reviewer. Review the following code for quality, readability, and best practices. Provide constructive feedback without giving away the solution. Be concise and clear. Do not provide code.\n\nCode: ${code}\n\nContext: ${context}`;
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        // Check if the response is valid
        const generatedText = response.data[0]?.generated_text || '';
        if (generatedText && !generatedText.includes('def') && !generatedText.includes('```')) {
            return generatedText;
        } else {
            console.error('Model provided code or invalid response. Using fallback.');
            return getFallbackFeedback(code);
        }
    } catch (error) {
        console.error('Error reviewing code:', error.message);
        return getFallbackFeedback(code);
    }
};

// Fallback hint for programming help
const getFallbackHint = (query) => {
    if (query.toLowerCase().includes('reverse a list')) {
        return "Hint: You can use slicing to reverse a list. Try using [::-1].";
    } else if (query.toLowerCase().includes('sort a list')) {
        return "Hint: You can use the built-in `sorted()` function or the `list.sort()` method.";
    } else {
        return "Hint: Break the problem into smaller steps and solve each step individually.";
    }
};

// Fallback feedback for code review
const getFallbackFeedback = (code) => {
    if (code.includes('for') || code.includes('while')) {
        return "Feedback: Ensure your loop is properly indented and uses meaningful variable names.";
    } else if (code.includes('if') || code.includes('else')) {
        return "Feedback: Ensure your conditional statements are clear and cover all edge cases.";
    } else {
        return "Feedback: Ensure your code is readable, uses meaningful variable names, and follows best practices.";
    }
};

// Retrieve relevant resources for programming queries
const retrieveProgrammingResources = async (query, context) => {
    try {
        const resources = await Programming.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(5);

        if (resources.length === 0) {
            return [{
                resourceType: "Documentation",
                resourceUrl: "https://docs.python.org/3/",
                resourceDescription: "Official Python documentation."
            }];
        }

        return resources.map(resource => ({
            resourceType: resource.resourceType,
            resourceUrl: resource.resourceUrl,
            resourceDescription: resource.resourceDescription
        }));
    } catch (error) {
        console.error('Error retrieving resources:', error.message);
        return [{
            resourceType: "Documentation",
            resourceUrl: "https://docs.python.org/3/",
            resourceDescription: "Official Python documentation."
        }];
    }
};

module.exports = { provideProgrammingHint, reviewCode, retrieveProgrammingResources };