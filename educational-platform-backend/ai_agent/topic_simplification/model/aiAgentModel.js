const mongoose = require('mongoose');

// Schema for general AI responses
const aiAgentSchema = new mongoose.Schema({
    userQuery: { type: String, required: true },
    response: { type: String, required: true },
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now }
});

// Schema for assignment-related hints
const assignmentHintSchema = new mongoose.Schema({
    userQuery: { type: String, required: true }, // The question asked by the student
    hints: { type: [String], required: true }, // Array of hints for the question
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now }
});

// Schema for resource-related data
const resourceSchema = new mongoose.Schema({
    userQuery: { type: String, required: true }, // The query for which resources are stored
    resources: { type: [{
        type: { type: String, required: true }, // Type of resource (e.g., documentation, video)
        url: { type: String, required: true }, // URL of the resource
        description: { type: String, required: true } // Description of the resource
    }], required: true },
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now }
});

// Indexes for faster retrieval
aiAgentSchema.index({ userQuery: 1 });
aiAgentSchema.index({ embedding: 1 });

assignmentHintSchema.index({ userQuery: 1 });
assignmentHintSchema.index({ embedding: 1 });

resourceSchema.index({ userQuery: 1 });
resourceSchema.index({ embedding: 1 });

// Export all models
module.exports = {
    AIAgent: mongoose.model('AIAgent', aiAgentSchema),
    AssignmentHint: mongoose.model('AssignmentHint', assignmentHintSchema),
    Resource: mongoose.model('Resource', resourceSchema) // Export the new Resource model
};