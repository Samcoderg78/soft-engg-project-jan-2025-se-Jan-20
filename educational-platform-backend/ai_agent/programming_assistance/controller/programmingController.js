const { provideProgrammingHint, reviewCode } = require("../service/programmingService");
const Programming = require("../model/programmingModel");

// Extract ONLY the URL inside parentheses
// Extract ONLY the text inside parentheses ()
const extractTextInParentheses = (text) => {
  if (!text) return text;

  if (Array.isArray(text)) {
      return text.map(item => ({
          ...item,
          url: extractTextInParentheses(item.url) // Apply to each resource object
      }));
  }

  const match = text.match(/\(([^)]+)\)/); // Get text inside ()
  return match ? match[1] : text; // Return extracted text or original if no match
};

const extractPureUrl = (text) => {
  if (!text) return text;
  
  // If text is an array (like resources), process each item
  if (Array.isArray(text)) {
    return text.map(item => ({
      ...item,
      url: extractPureUrl(item.url) // Extract clean URL for each resource
    }));
  }

  // Extract URL from markdown-like format
  const urlMatch = text.match(/\((https?:\/\/[^)]+)\)/);
  return urlMatch ? urlMatch[1] : text;
};

// Handle programming assistance requests
const handleProgrammingHint = async (req, res) => {
  try {
    const { query, context, resources } = req.body;

    if (!query || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hint = await provideProgrammingHint(query, context);
    
    // Store only clean URL in response and resources
    await Programming.create({ 
      userQuery: query, 
      response: extractPureUrl(hint), // Clean hint response
      context, 
      resources: extractPureUrl(resources) // Clean URLs in resources array
    });

    res.json({ hint }); 
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error processing request" });
  }
};

// Handle code review requests
const handleCodeReview = async (req, res) => {
  try {
    const { code, context, resources } = req.body;

    if (!code || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const feedback = await reviewCode(code, context);
    
    // Store only clean URL in response and resources
    await Programming.create({ 
      userQuery: code, 
      response: extractPureUrl(feedback), // Clean feedback response
      context,
      resources: extractPureUrl(resources) // Clean URLs in resources array
    });

    res.json({ feedback });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error processing request" });
  }
};

module.exports = { handleProgrammingHint, handleCodeReview };
