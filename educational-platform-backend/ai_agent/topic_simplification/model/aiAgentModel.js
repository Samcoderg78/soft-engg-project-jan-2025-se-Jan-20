const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
    userQuery: { type: String, required: true },
    response: { type: String, required: true },
    videoContext: { type: String },
    embedding: { type: [Number], required: true }, // Store embeddings here
    resourceType: { type: String },
    resourceUrl: { type: String },
    resourceDescription: { type: String },
    assignmentType: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIAgent', aiAgentSchema);