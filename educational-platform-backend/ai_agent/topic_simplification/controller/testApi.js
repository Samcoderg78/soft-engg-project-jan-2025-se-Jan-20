process.env.HUGGINGFACE_API_KEY="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"

const query = 'Recursion';
const context = 'Recursion is when a function calls itself to solve smaller parts of a problem.';


const fetch = require('node-fetch');

const simplifyTopic = async (query, context) => {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: `Explain ${query} in simple terms: ${context}` })
    });

    const data = await response.json();
    console.log('Raw HuggingFace Response:', data);

    if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
    } else {
        throw new Error('Invalid response format from HuggingFace API');
    }
};

simplifyTopic('Recursion', 'Recursion is when a function calls itself to solve smaller parts of a problem.')
    .then(result => console.log('Simplified Explanation:', result))
    .catch(error => console.error('HuggingFace API Error:', error));