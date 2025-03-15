const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    query: { type: String, required: true }, // Instructor's query
    response: { type: String, required: true }, // AI's response
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now } // Timestamp
});

// Index for faster retrieval
instructorSchema.index({ query: 1 });
instructorSchema.index({ embedding: 1 });

module.exports = mongoose.model('Instructor', instructorSchema);