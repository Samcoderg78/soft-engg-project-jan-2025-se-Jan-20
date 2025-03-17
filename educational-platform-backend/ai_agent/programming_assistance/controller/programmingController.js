const { provideProgrammingHint, reviewCode } = require("../service/programmingService");
const Programming = require("../model/programmingModel");

// Handle programming assistance requests
const handleProgrammingHint = async (req, res) => {
  try {
    const { query, context } = req.body;

    // Validate required fields
    if (!query || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hint = await provideProgrammingHint(query, context);

    // Save interaction to MongoDB
    await Programming.create({ userQuery: query, response: hint, context });

    res.json({ hint });
  } catch (error) {
    console.error("Error handling programming hint request:", error.message);
    res.status(500).json({ message: "Error processing request." });
  }
};

// Handle code review requests
const handleCodeReview = async (req, res) => {
  try {
    const { code, context } = req.body;

    // Validate required fields
    if (!code || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const feedback = await reviewCode(code, context);

    // Save interaction to MongoDB
    await Programming.create({ userQuery: code, response: feedback, context });

    res.json({ feedback });
  } catch (error) {
    console.error("Error handling code review request:", error.message);
    res.status(500).json({ message: "Error processing request." });
  }
};

module.exports = { handleProgrammingHint, handleCodeReview };