const mongoose = require('mongoose');

const programmingSchema = new mongoose.Schema({
    userQuery: { type: String, required: true }, // Student's query or code snippet
    response: { type: String, required: true }, // AI's response or feedback
    context: { type: String }, // Context of the query (e.g., assignment topic)
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now } // Timestamp
});

// Index for faster retrieval
programmingSchema.index({ userQuery: 1 });
programmingSchema.index({ embedding: 1 });

module.exports = mongoose.model('Programming', programmingSchema);